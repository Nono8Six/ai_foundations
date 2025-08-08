/**
 * Tests pour StatsPage
 * 
 * Tests de rendu et d'intégration pour la nouvelle page des statistiques :
 * - États de chargement et vides
 * - Gestion des erreurs 
 * - Interactions utilisateur (filtres)
 * - Affichage conditionnel des composants
 * - Integration avec TanStack Query
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StatsPage from '../StatsPage';

// Mock des contextes
const mockUser = {
  id: 'user-1',
  email: 'test@example.com'
};

const mockUserProfile = {
  id: 'user-1',
  xp: 75,
  level: 1,
  current_streak: 3,
  last_completed_at: '2025-01-15T10:00:00Z'
};

const mockUseAuth = vi.fn(() => ({
  user: mockUser,
  userProfile: mockUserProfile
}));

// Mock du service XP
const mockXPService = {
  checkXpDataAvailability: vi.fn(),
  getXpTimeline: vi.fn(),
  getXpAggregates: vi.fn(),
  getAvailableSources: vi.fn()
};

// Mock des composants
vi.mock('@features/auth/contexts/AuthContext', () => ({
  useAuth: mockUseAuth
}));

vi.mock('@shared/services/xpService', () => ({
  XPService: mockXPService
}));

vi.mock('@shared/components/xp/FiltersBar', () => ({
  default: ({ onFiltersChange }: any) => (
    <div data-testid="filters-bar">
      <button onClick={() => onFiltersChange({ period: '30d', sortBy: 'recent' })}>
        Change Filters
      </button>
    </div>
  )
}));

vi.mock('@shared/components/xp/Timeline', () => ({
  default: ({ groups, isLoading, hasMore }: any) => (
    <div data-testid="timeline">
      <div>Groups: {groups.length}</div>
      <div>Loading: {String(isLoading)}</div>
      <div>Has More: {String(hasMore)}</div>
    </div>
  )
}));

vi.mock('@shared/components/xp/MicroInsights', () => ({
  default: ({ aggregates }: any) => (
    <div data-testid="micro-insights">
      <div>Total XP: {aggregates?.totalXpOnPeriod || 0}</div>
    </div>
  )
}));

vi.mock('@shared/components/xp/EmptyState', () => ({
  default: ({ variant, title }: any) => (
    <div data-testid="empty-state">
      <div>Variant: {variant}</div>
      <div>Title: {title}</div>
    </div>
  )
}));

vi.mock('@shared/components/AppIcon', () => ({
  default: ({ name }: { name: string }) => <div data-testid={`icon-${name}`}>{name}</div>
}));

// Helper pour créer un wrapper avec QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0
      }
    }
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('StatsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading States', () => {
    it('should show loading state when checking data availability', async () => {
      mockXPService.checkXpDataAvailability.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          hasActivityLog: true,
          hasXpEvents: true,
          sampleEventCount: 5
        }), 100))
      );

      const Wrapper = createWrapper();
      render(<StatsPage />, { wrapper: Wrapper });

      expect(screen.getByText('Vérification des données XP...')).toBeInTheDocument();
      expect(screen.getByTestId('icon-Loader')).toBeInTheDocument();
    });

    it('should show main interface after loading', async () => {
      mockXPService.checkXpDataAvailability.mockResolvedValue({
        hasActivityLog: true,
        hasXpEvents: true,
        sampleEventCount: 5
      });

      mockXPService.getXpTimeline.mockResolvedValue({
        pages: [{
          groups: [
            {
              period: '2025-01-15',
              label: '15 janvier 2025',
              totalXp: 25,
              eventCount: 2,
              events: []
            }
          ],
          totalCount: 2,
          hasMore: false
        }]
      });

      mockXPService.getXpAggregates.mockResolvedValue({
        totalXpOnPeriod: 50,
        topSources: [],
        eventsByDay: []
      });

      mockXPService.getAvailableSources.mockResolvedValue([]);

      const Wrapper = createWrapper();
      render(<StatsPage />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(screen.getByText('Statistiques d\'apprentissage')).toBeInTheDocument();
        expect(screen.getByTestId('filters-bar')).toBeInTheDocument();
        expect(screen.getByTestId('timeline')).toBeInTheDocument();
      });
    });
  });

  describe('Empty States', () => {
    it('should show "no activity log" state when activity_log is not available', async () => {
      mockXPService.checkXpDataAvailability.mockResolvedValue({
        hasActivityLog: false,
        hasXpEvents: false,
        sampleEventCount: 0
      });

      const Wrapper = createWrapper();
      render(<StatsPage />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(screen.getByTestId('empty-state')).toBeInTheDocument();
        expect(screen.getByText('Variant: no-data')).toBeInTheDocument();
        expect(screen.getByText('Title: Système de statistiques en préparation')).toBeInTheDocument();
      });
    });

    it('should show "first time" state when no XP events exist', async () => {
      mockXPService.checkXpDataAvailability.mockResolvedValue({
        hasActivityLog: true,
        hasXpEvents: false,
        sampleEventCount: 0
      });

      const Wrapper = createWrapper();
      render(<StatsPage />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(screen.getByTestId('empty-state')).toBeInTheDocument();
        expect(screen.getByText('Variant: first-time')).toBeInTheDocument();
      });
    });
  });

  describe('Data Display', () => {
    it('should display timeline with correct data', async () => {
      mockXPService.checkXpDataAvailability.mockResolvedValue({
        hasActivityLog: true,
        hasXpEvents: true,
        sampleEventCount: 3
      });

      const mockTimelineData = {
        pages: [{
          groups: [
            {
              period: '2025-01-15',
              label: '15 janvier 2025',
              totalXp: 25,
              eventCount: 2,
              events: []
            }
          ],
          totalCount: 2,
          hasMore: true
        }]
      };

      mockXPService.getXpTimeline.mockResolvedValue(mockTimelineData);
      mockXPService.getXpAggregates.mockResolvedValue({
        totalXpOnPeriod: 25,
        topSources: [{ source: 'profile:completion', count: 1, totalXp: 25 }],
        eventsByDay: []
      });
      mockXPService.getAvailableSources.mockResolvedValue(['profile:completion']);

      const Wrapper = createWrapper();
      render(<StatsPage />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(screen.getByText('Groups: 1')).toBeInTheDocument();
        expect(screen.getByText('Has More: true')).toBeInTheDocument();
        expect(screen.getByText('Total XP: 25')).toBeInTheDocument();
      });
    });

    it('should display profile stats in sidebar', async () => {
      mockXPService.checkXpDataAvailability.mockResolvedValue({
        hasActivityLog: true,
        hasXpEvents: true,
        sampleEventCount: 1
      });

      mockXPService.getXpTimeline.mockResolvedValue({
        pages: [{ groups: [], totalCount: 0, hasMore: false }]
      });
      mockXPService.getXpAggregates.mockResolvedValue({
        totalXpOnPeriod: 0,
        topSources: [],
        eventsByDay: []
      });
      mockXPService.getAvailableSources.mockResolvedValue([]);

      const Wrapper = createWrapper();
      render(<StatsPage />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(screen.getByText('Progression')).toBeInTheDocument();
        expect(screen.getByText('3 jours')).toBeInTheDocument(); // current_streak
        expect(screen.getByText('15 janv.')).toBeInTheDocument(); // formatted date
      });
    });
  });

  describe('User Interactions', () => {
    it('should handle filter changes', async () => {
      mockXPService.checkXpDataAvailability.mockResolvedValue({
        hasActivityLog: true,
        hasXpEvents: true,
        sampleEventCount: 1
      });

      mockXPService.getXpTimeline.mockResolvedValue({
        pages: [{ groups: [], totalCount: 0, hasMore: false }]
      });
      mockXPService.getXpAggregates.mockResolvedValue({
        totalXpOnPeriod: 0,
        topSources: [],
        eventsByDay: []
      });
      mockXPService.getAvailableSources.mockResolvedValue([]);

      const Wrapper = createWrapper();
      render(<StatsPage />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(screen.getByTestId('filters-bar')).toBeInTheDocument();
      });

      // Test de changement de filtre (via le mock du FiltersBar)
      const changeButton = screen.getByText('Change Filters');
      changeButton.click();

      // Vérifier que les nouvelles requêtes sont déclenchées
      await waitFor(() => {
        expect(mockXPService.getXpTimeline).toHaveBeenCalledWith(
          'user-1',
          expect.objectContaining({ period: '30d', sortBy: 'recent' }),
          expect.any(Object)
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle service errors gracefully', async () => {
      mockXPService.checkXpDataAvailability.mockRejectedValue(
        new Error('Database connection failed')
      );

      const Wrapper = createWrapper();
      render(<StatsPage />, { wrapper: Wrapper });

      await waitFor(() => {
        // En cas d'erreur, doit afficher un état de fallback
        expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      });
    });
  });

  describe('No User Context', () => {
    it('should handle missing user context', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        userProfile: null
      });

      const Wrapper = createWrapper();
      render(<StatsPage />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(screen.getByText('Vérification des données XP...')).toBeInTheDocument();
      });
    });
  });
});