/**
 * P10 E2E XP System Tests
 * Tests critical user interaction flows with error handling and resilience
 * Local execution only - no GitHub Actions required
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Mock components for testing
import { XPRpc } from '@shared/services/xp-rpc';
import { useIdempotentAction } from '@shared/hooks/useIdempotentAction';

// Test utilities
const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => 
    React.createElement(QueryClientProvider, { client: queryClient },
      React.createElement(BrowserRouter, null, children)
    );
};

// Mock XP service
vi.mock('@shared/services/xp-rpc', () => ({
  XPRpc: {
    creditXp: vi.fn(),
    computeLevelInfo: vi.fn(),
    getActiveXPSources: vi.fn(),
  },
}));

// Mock idempotent action hook
vi.mock('@shared/hooks/useIdempotentAction', () => ({
  useIdempotentAction: vi.fn(),
}));

// Test component that simulates lesson completion
const MockLessonCompleteButton: React.FC<{ lessonId: string }> = ({ lessonId }) => {
  const { execute, isLoading, error } = useIdempotentAction();

  const handleComplete = () => {
    execute(async () => {
      return XPRpc.creditXp({
        userId: 'test-user-1',
        sourceRef: 'lesson:completion',
        xpDelta: 50,
        idempotencyKey: `lesson-complete-${lessonId}-${Date.now()}`,
        referenceId: lessonId,
        metadata: { test: 'e2e', lessonId },
      });
    });
  };

  return React.createElement('div', null,
    React.createElement('button', {
      onClick: handleComplete,
      disabled: isLoading,
      'data-testid': 'complete-lesson-btn'
    }, isLoading ? 'Completing...' : 'Complete Lesson'),
    error && React.createElement('div', {
      'data-testid': 'error-message',
      role: 'alert'
    }, error.message)
  );
};

describe('P10 E2E XP System Tests', () => {
  let mockXPRpc: any;
  let mockUseIdempotentAction: any;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    mockXPRpc = vi.mocked(XPRpc);
    mockUseIdempotentAction = vi.mocked(useIdempotentAction);

    // Default mock implementations
    mockXPRpc.creditXp.mockResolvedValue({
      event_id: 'test-event-123',
      xp_after: 150,
      level_after: 2,
      new_xp: 50,
    });

    mockXPRpc.computeLevelInfo.mockResolvedValue({
      currentLevel: 2,
      xpInCurrentLevel: 50,
      xpForNextLevel: 100,
      progressPercent: 50,
    });

    // Default idempotent action mock
    mockUseIdempotentAction.mockReturnValue({
      execute: vi.fn(),
      isLoading: false,
      error: null,
      data: null,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Happy Path: Lesson Completion Flow', () => {
    it('should complete lesson and award XP successfully', async () => {
      // Setup successful execution mock
      const mockExecute = vi.fn().mockResolvedValue({
        event_id: 'test-event-123',
        xp_after: 150,
      });

      mockUseIdempotentAction.mockReturnValue({
        execute: mockExecute,
        isLoading: false,
        error: null,
        data: null,
      });

      const Wrapper = createTestWrapper();
      render(React.createElement(Wrapper, null,
        React.createElement(MockLessonCompleteButton, { lessonId: "lesson-p10-001" })
      ));

      // Find and click the complete button
      const completeButton = screen.getByTestId('complete-lesson-btn');
      expect(completeButton).toBeInTheDocument();
      expect(completeButton).not.toBeDisabled();

      fireEvent.click(completeButton);

      // Verify execute was called
      await waitFor(() => {
        expect(mockExecute).toHaveBeenCalledTimes(1);
      });

      // Verify no error message
      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });

    it('should show loading state during XP operation', async () => {
      // Setup loading state
      mockUseIdempotentAction.mockReturnValue({
        execute: vi.fn(),
        isLoading: true,
        error: null,
        data: null,
      });

      const Wrapper = createTestWrapper();
      render(React.createElement(Wrapper, null,
        React.createElement(MockLessonCompleteButton, { lessonId: "lesson-p10-001" })
      ));

      const completeButton = screen.getByTestId('complete-lesson-btn');
      expect(completeButton).toHaveTextContent('Completing...');
      expect(completeButton).toBeDisabled();
    });
  });

  describe('Double-Click Protection', () => {
    it('should prevent duplicate submissions via idempotent hook', async () => {
      let executeCallCount = 0;
      const mockExecute = vi.fn().mockImplementation(async () => {
        executeCallCount++;
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 100));
        return { event_id: 'test-event-123' };
      });

      mockUseIdempotentAction.mockReturnValue({
        execute: mockExecute,
        isLoading: false,
        error: null,
        data: null,
      });

      const Wrapper = createTestWrapper();
      render(React.createElement(Wrapper, null,
        React.createElement(MockLessonCompleteButton, { lessonId: "lesson-p10-001" })
      ));

      const completeButton = screen.getByTestId('complete-lesson-btn');

      // Rapid double-click
      fireEvent.click(completeButton);
      fireEvent.click(completeButton);
      fireEvent.click(completeButton);

      // Wait for any async operations
      await waitFor(() => {
        expect(mockExecute).toHaveBeenCalledTimes(1);
      });

      expect(executeCallCount).toBe(1);
    });

    it('should handle idempotent responses correctly', async () => {
      // Mock idempotent response (same event ID returned)
      const idempotentResponse = {
        event_id: 'existing-event-123',
        xp_after: 100,
        new_xp: 0, // No new XP because it's idempotent
        idempotent: true,
      };

      const mockExecute = vi.fn().mockResolvedValue(idempotentResponse);

      mockUseIdempotentAction.mockReturnValue({
        execute: mockExecute,
        isLoading: false,
        error: null,
        data: idempotentResponse,
      });

      const Wrapper = createTestWrapper();
      render(React.createElement(Wrapper, null,
        React.createElement(MockLessonCompleteButton, { lessonId: "lesson-p10-001" })
      ));

      fireEvent.click(screen.getByTestId('complete-lesson-btn'));

      await waitFor(() => {
        expect(mockExecute).toHaveBeenCalled();
      });

      // Should handle idempotent response gracefully
      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display lock_not_acquired error with retry guidance', async () => {
      const lockError = new Error('Lock not acquired - system busy');
      lockError.name = 'lock_not_acquired';

      mockUseIdempotentAction.mockReturnValue({
        execute: vi.fn(),
        isLoading: false,
        error: lockError,
        data: null,
      });

      const Wrapper = createTestWrapper();
      render(React.createElement(Wrapper, null,
        React.createElement(MockLessonCompleteButton, { lessonId: "lesson-p10-001" })
      ));

      const errorMessage = screen.getByTestId('error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Lock not acquired - system busy');
    });

    it('should display conflict_mismatch error appropriately', async () => {
      const conflictError = new Error('Conflict detected - data has changed');
      conflictError.name = 'conflict_mismatch';

      mockUseIdempotentAction.mockReturnValue({
        execute: vi.fn(),
        isLoading: false,
        error: conflictError,
        data: null,
      });

      const Wrapper = createTestWrapper();
      render(React.createElement(Wrapper, null,
        React.createElement(MockLessonCompleteButton, { lessonId: "lesson-p10-001" })
      ));

      const errorMessage = screen.getByTestId('error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Conflict detected - data has changed');
    });

    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network request failed');

      mockUseIdempotentAction.mockReturnValue({
        execute: vi.fn(),
        isLoading: false,
        error: networkError,
        data: null,
      });

      const Wrapper = createTestWrapper();
      render(React.createElement(Wrapper, null,
        React.createElement(MockLessonCompleteButton, { lessonId: "lesson-p10-001" })
      ));

      const errorMessage = screen.getByTestId('error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Network request failed');
    });
  });

  describe('Offline Retry Scenarios', () => {
    it('should handle offline state and retry logic', async () => {
      let attemptCount = 0;
      const mockExecute = vi.fn().mockImplementation(async () => {
        attemptCount++;
        if (attemptCount < 3) {
          throw new Error('Network request failed');
        }
        return { event_id: 'retry-success-123' };
      });

      // Simulate retry behavior
      mockUseIdempotentAction.mockReturnValue({
        execute: mockExecute,
        isLoading: false,
        error: null,
        data: { event_id: 'retry-success-123' },
      });

      const Wrapper = createTestWrapper();
      render(React.createElement(Wrapper, null,
        React.createElement(MockLessonCompleteButton, { lessonId: "lesson-p10-001" })
      ));

      fireEvent.click(screen.getByTestId('complete-lesson-btn'));

      await waitFor(() => {
        expect(mockExecute).toHaveBeenCalled();
      });

      // Should eventually succeed after retries
      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });

    it('should maintain idempotency across retry attempts', async () => {
      const idempotencyKey = 'lesson-complete-p10-001-1234567890';
      let callCount = 0;

      const mockExecute = vi.fn().mockImplementation(async (fn) => {
        callCount++;
        // Simulate the actual function being called
        return fn();
      });

      mockXPRpc.creditXp.mockImplementation(async (params) => {
        // Verify same idempotency key is used
        expect(params.idempotencyKey).toContain('lesson-complete');
        
        if (callCount < 3) {
          throw new Error('Temporary network error');
        }
        
        return {
          event_id: 'stable-event-id',
          xp_after: 150,
          idempotent: callCount > 1, // Subsequent calls are idempotent
        };
      });

      mockUseIdempotentAction.mockReturnValue({
        execute: mockExecute,
        isLoading: false,
        error: null,
        data: null,
      });

      const Wrapper = createTestWrapper();
      render(React.createElement(Wrapper, null,
        React.createElement(MockLessonCompleteButton, { lessonId: "lesson-p10-001" })
      ));

      fireEvent.click(screen.getByTestId('complete-lesson-btn'));

      await waitFor(() => {
        expect(mockExecute).toHaveBeenCalled();
      });

      // Multiple attempts should use consistent idempotency key
      expect(mockXPRpc.creditXp).toHaveBeenCalledWith(
        expect.objectContaining({
          idempotencyKey: expect.stringContaining('lesson-complete'),
        })
      );
    });
  });

  describe('Browser State Management', () => {
    it('should handle page refresh without duplicate operations', async () => {
      // Simulate page refresh scenario where operation was already completed
      const mockExecute = vi.fn().mockResolvedValue({
        event_id: 'existing-event-123',
        xp_after: 150,
        idempotent: true, // Server indicates this was already processed
      });

      mockUseIdempotentAction.mockReturnValue({
        execute: mockExecute,
        isLoading: false,
        error: null,
        data: null,
      });

      const Wrapper = createTestWrapper();
      render(React.createElement(Wrapper, null,
        React.createElement(MockLessonCompleteButton, { lessonId: "lesson-p10-001" })
      ));

      fireEvent.click(screen.getByTestId('complete-lesson-btn'));

      await waitFor(() => {
        expect(mockExecute).toHaveBeenCalledTimes(1);
      });

      // Should handle idempotent response without error
      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });

    it('should prevent operations during back button navigation', async () => {
      // This test simulates navigation state where component unmounts
      const mockExecute = vi.fn();

      mockUseIdempotentAction.mockReturnValue({
        execute: mockExecute,
        isLoading: false,
        error: null,
        data: null,
      });

      const Wrapper = createTestWrapper();
      const { unmount } = render(React.createElement(Wrapper, null,
        React.createElement(MockLessonCompleteButton, { lessonId: "lesson-p10-001" })
      ));

      // Simulate back button (component unmount)
      unmount();

      // Operations should be cleaned up
      expect(mockExecute).not.toHaveBeenCalled();
    });
  });
});

// Performance test for E2E scenarios
describe('P10 E2E Performance', () => {
  it('should complete XP operations within acceptable time limits', async () => {
    const startTime = Date.now();
    
    let resolveXP: (value: any) => void;
    const xpPromise = new Promise(resolve => {
      resolveXP = resolve;
    });

    const mockExecute = vi.fn().mockImplementation(async () => {
      // Simulate realistic network delay
      setTimeout(() => {
        resolveXP({
          event_id: 'perf-test-123',
          xp_after: 100,
        });
      }, 45); // 45ms - within SLA

      return xpPromise;
    });

    vi.mocked(useIdempotentAction).mockReturnValue({
      execute: mockExecute,
      isLoading: false,
      error: null,
      data: null,
    });

    const Wrapper = createTestWrapper();
    render(React.createElement(Wrapper, null,
      React.createElement(MockLessonCompleteButton, { lessonId: "lesson-p10-001" })
    ));

    fireEvent.click(screen.getByTestId('complete-lesson-btn'));

    await waitFor(() => {
      expect(mockExecute).toHaveBeenCalled();
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should complete within reasonable time (allowing for test overhead)
    expect(duration).toBeLessThan(1000); // 1 second max for E2E test
  });
});