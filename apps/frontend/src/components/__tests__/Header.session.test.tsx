import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import Header from '../Header';
import { SessionProvider } from '../../context/SessionContext';

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    userProfile: null,
    loading: false,
    profileError: null,
    authError: null,
    logout: vi.fn(),
    clearProfileError: vi.fn(),
  }),
}));

describe('Header session controls', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    ) as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('handles session lifecycle', async () => {
    render(
      <MemoryRouter>
        <SessionProvider>
          <Header />
        </SessionProvider>
      </MemoryRouter>
    );

    const startButton = screen.getByRole('button', { name: /start session/i });
    await act(async () => {
      fireEvent.click(startButton);
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText('00:02')).toBeInTheDocument();

    const pauseButton = screen.getByRole('button', { name: /pause session/i });
    await act(async () => {
      fireEvent.click(pauseButton);
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText('00:02')).toBeInTheDocument();

    const resumeButton = screen.getByRole('button', { name: /resume session/i });
    await act(async () => {
      fireEvent.click(resumeButton);
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('00:03')).toBeInTheDocument();

    const stopButton = screen.getByRole('button', { name: /stop session/i });
    await act(async () => {
      fireEvent.click(stopButton);
    });

    expect(screen.getByRole('button', { name: /start session/i })).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith('/planner', expect.any(Object));
    expect(fetch).toHaveBeenCalledWith('/analytics', expect.any(Object));
  });
});
