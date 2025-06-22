import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from './index';
import { supabase } from '../../lib/supabase';

// Mock Supabase client
vi.mock('../../lib/supabase');

// Mock child components that might make their own Supabase calls or are complex
vi.mock('./components/RecentActivity', () => ({ default: () => <div>RecentActivityMock</div> }));
vi.mock('./components/UserEngagementChart', () => ({ default: () => <div>UserEngagementChartMock</div> }));
vi.mock('./components/PopularCoursesChart', () => ({ default: () => <div>PopularCoursesChartMock</div> }));
vi.mock('./components/GeographicDistribution', () => ({ default: () => <div>GeographicDistributionMock</div> }));
vi.mock('./components/PerformanceMetrics', () => ({ default: ({ metrics }) => <div>PerformanceMetricsMock ({metrics.activeUsers} active users, {metrics.systemUptime} uptime)</div> }));



describe('AdminDashboard', () => {
  const createBuilder = (result) => ({
    select: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    then: vi.fn((cb) => Promise.resolve(result).then(cb)),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially and then displays fetched data', async () => {
    supabase.from
      .mockReturnValueOnce(createBuilder({ count: 100, error: null }))
      .mockReturnValueOnce(createBuilder({ data: [{ user_id: '1' }, { user_id: '2' }], error: null }))
      .mockReturnValueOnce(createBuilder({ count: 5, error: null }))
      .mockReturnValueOnce(createBuilder({ data: [{ duration_minutes: 10 }, { duration_minutes: 20 }], error: null }));

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText('Chargement des données...')).toBeInTheDocument();

    await waitFor(() => expect(screen.queryByText('Chargement des données...')).not.toBeInTheDocument());

    expect(screen.getByText('Utilisateurs totaux').closest('div').querySelector('p.text-2xl').textContent).toBe('100');
    expect(screen.getByText('Apprenants actifs').closest('div').querySelector('p.text-2xl').textContent).toBe('2');
    expect(screen.getByText('Revenus').closest('div').querySelector('p.text-2xl').textContent).toBe('N/A');

    await waitFor(() => {
      expect(screen.getByText(/PerformanceMetricsMock \(2 active users, N\/A uptime\)/)).toBeInTheDocument();
    });
  });

  test('handles errors from Supabase for some metrics', async () => {
    supabase.from
      .mockReturnValueOnce(createBuilder({ count: 0, error: { message: 'Failed to fetch total users' } }))
      .mockReturnValueOnce(createBuilder({ data: [{ user_id: '1' }], error: null }))
      .mockReturnValueOnce(createBuilder({ count: 0, error: null }))
      .mockReturnValueOnce(createBuilder({ data: null, error: { message: 'Failed to fetch sessions' } }));

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.queryByText('Chargement des données...')).not.toBeInTheDocument());

    expect(screen.getByText('Utilisateurs totaux').closest('div').querySelector('p.text-2xl').textContent).toBe('0');
    // When the first query fails, all metrics fall back to default values
    expect(screen.getByText('Apprenants actifs').closest('div').querySelector('p.text-2xl').textContent).toBe('0');

    await waitFor(() => {
      expect(screen.getByText(/PerformanceMetricsMock \(0 active users, N\/A uptime\)/)).toBeInTheDocument();
    });
  });

  test('handles empty data from Supabase', async () => {
    supabase.from
      .mockReturnValueOnce(createBuilder({ count: 0, error: null }))
      .mockReturnValueOnce(createBuilder({ data: [], error: null }))
      .mockReturnValueOnce(createBuilder({ count: 0, error: null }))
      .mockReturnValueOnce(createBuilder({ data: [], error: null }));

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.queryByText('Chargement des données...')).not.toBeInTheDocument());

    expect(screen.getByText('Utilisateurs totaux').closest('div').querySelector('p.text-2xl').textContent).toBe('0');
    expect(screen.getByText('Apprenants actifs').closest('div').querySelector('p.text-2xl').textContent).toBe('0');

    await waitFor(() => {
      expect(screen.getByText(/PerformanceMetricsMock \(0 active users, N\/A uptime\)/)).toBeInTheDocument();
    });
  });
});