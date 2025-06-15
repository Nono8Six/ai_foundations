import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import UserEngagementChart from './UserEngagementChart';
import { supabase } from '../../../lib/supabase'; // Mocked

// Mock Recharts
vi.mock('recharts', () => {
  const ActualRecharts = vi.importActual('recharts');
  return {
    ...ActualRecharts,
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    AreaChart: ({ children, data }) => <div data-testid="area-chart" data-chartdata={JSON.stringify(data)}>{children}</div>,
    Area: ({ dataKey }) => <div data-testid={`area-${dataKey}`}></div>,
    XAxis: () => <div data-testid="x-axis"></div>,
    YAxis: () => <div data-testid="y-axis"></div>,
    CartesianGrid: () => <div data-testid="cartesian-grid"></div>,
    Tooltip: () => <div data-testid="tooltip"></div>,
    Defs: ({children}) => <defs>{children}</defs>,
    linearGradient: ({id, children}) => <linearGradient id={id}>{children}</linearGradient>,
    stop: () => <stop></stop>,
  };
});
vi.mock('../../../components/AppIcon', () => ({ default: ({ name }) => <svg data-testid={`icon-${name}`}></svg> }));
vi.mock('../../../lib/supabase');

describe('UserEngagementChart', () => {
  const setupSupabaseUserSessionsMock = (sessionsData = [], sessionsError = null) => {
    const builderInstance = {
        select: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        then: jest.fn(function(callback) {
            if (this.mockedResult) {
                return Promise.resolve(this.mockedResult).then(callback);
            }
            return Promise.resolve({ data: sessionsData, error: sessionsError }).then(callback);
        }),
        mockResolvedValueOnce: function(value) {
            this.mockedResult = value;
            return this;
        }
    };
    supabase.from.mockImplementation(tableName => {
        if (tableName === 'user_sessions') {
            // Return a new instance of the builder mock configuration for each call if needed,
            // or just this single instance if UserEngagementChart only makes one `from('user_sessions')` call.
            // For this component, it's one call per timeRange change.
            return builderInstance;
        }
        // Fallback for other tables if any were called unexpectedly
        const fallbackBuilder = vi.importActual('../../../lib/supabase').supabase.from(tableName);
        fallbackBuilder.mockResolvedValueOnce({data: [], error: 'Unexpected table call'});
        return fallbackBuilder;
    });
    return builderInstance; // Return the instance to allow setting mockResolvedValueOnce in the test
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers(); // Use fake timers for date consistency
  });

  afterEach(() => {
    jest.useRealTimers(); // Restore real timers
  });

  test('displays loading state and then renders chart for 24h range', async () => {
    const now = new Date(2023, 10, 20, 14, 0, 0); // Mon Nov 20 2023 14:00:00
    jest.setSystemTime(now);

    const sessions = [
      { user_id: 'u1', started_at: new Date(2023, 10, 20, 13, 5, 0).toISOString() }, // 13:00
      { user_id: 'u2', started_at: new Date(2023, 10, 20, 13, 10, 0).toISOString() },// 13:00
      { user_id: 'u1', started_at: new Date(2023, 10, 20, 10, 0, 0).toISOString() }, // 10:00
      { user_id: 'u3', started_at: new Date(2023, 10, 19, 14, 5, 0).toISOString() }, // Yesterday, should be included by 24h
    ];

    const sessionQueryBuilder = setupSupabaseUserSessionsMock();
    sessionQueryBuilder.mockResolvedValueOnce({ data: sessions, error: null });

    render(<UserEngagementChart timeRange="24h" />);

    expect(screen.getByText("Chargement des données d'engagement...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Chargement des données d'engagement...")).not.toBeInTheDocument();
    });

    const chartElement = screen.getByTestId('area-chart');
    const chartData = JSON.parse(chartElement.getAttribute('data-chartdata'));

    expect(chartData).toHaveLength(24);
    // Bucket for 13:00 (index 13)
    expect(chartData[13].time).toBe('13:00');
    expect(chartData[13].users).toBe(2); // u1, u2
    expect(chartData[13].sessions).toBe(2);
    // Bucket for 10:00 (index 10)
    expect(chartData[10].time).toBe('10:00');
    expect(chartData[10].users).toBe(1); // u1
    expect(chartData[10].sessions).toBe(1);
    // Bucket for 14:00 yesterday (index 14 today, but data is for yesterday at 14:00)
    // The current component logic for 24h creates buckets for current day's hours.
    // A session from "yesterday at 14:00" would fall into bucket 14 if 'now' is 14:00 today.
    // This means the date part is ignored in 24h bucketing in the component.
    expect(chartData[14].users).toBe(1); // u3 (from yesterday 14:05)
    expect(chartData[14].sessions).toBe(1);

    // Check summary
    expect(screen.getByText("Pic d'activité").closest('div').querySelector('p.text-lg').textContent).toBe('2'); // Peak was 2 users at 13:00
    // Total sessions = 4. Avg sessions = 4 / 24 buckets (many are 0) = 0 (rounded)
    // The component calculates avg over buckets with activity or all buckets?
    // It's totalSessions / finalData.length. So 4/24 = 0.
    expect(screen.getByText("Sessions moyennes").closest('div').querySelector('p.text-lg').textContent).toBe('0');
  });

  test('displays loading state and then renders chart for 7d range', async () => {
    const today = new Date(2023, 10, 20, 12, 0, 0); // Monday
    jest.setSystemTime(today);

    const sessions = [
      // Today (Mon)
      { user_id: 'u1', started_at: new Date(2023, 10, 20, 10, 0, 0).toISOString() },
      // Yesterday (Sun)
      { user_id: 'u2', started_at: new Date(2023, 10, 19, 10, 0, 0).toISOString() },
      { user_id: 'u3', started_at: new Date(2023, 10, 19, 11, 0, 0).toISOString() },
      // Two days ago (Sat)
      { user_id: 'u1', started_at: new Date(2023, 10, 18, 10, 0, 0).toISOString() },
      // Last Monday (7 days ago from today, should be in the first bucket)
      { user_id: 'u4', started_at: new Date(2023, 10, 13, 10, 0, 0).toISOString() },
    ];
    const sessionQueryBuilder = setupSupabaseUserSessionsMock();
    sessionQueryBuilder.mockResolvedValueOnce({ data: sessions, error: null });

    render(<UserEngagementChart timeRange="7d" />);

    await waitFor(() => screen.getByTestId('area-chart'));
    const chartData = JSON.parse(screen.getByTestId('area-chart').getAttribute('data-chartdata'));

    expect(chartData).toHaveLength(7);
    // Buckets are: Mon (13th), Tue (14th), Wed (15th), Thu (16th), Fri (17th), Sat (18th), Sun (19th), Mon (20th)
    // The component generates 7 buckets ending 'today'.
    // So, labels are: Tue, Wed, Thu, Fri, Sat, Sun, Mon
    expect(chartData[0].time).toBe('Mar'); // Tuesday, Nov 14th (empty)
    expect(chartData[1].time).toBe('Mer'); // Wednesday, Nov 15th (empty)
    expect(chartData[2].time).toBe('Jeu'); // Thursday, Nov 16th (empty)
    expect(chartData[3].time).toBe('Ven'); // Friday, Nov 17th (empty)

    const satData = chartData.find(d => d.time === 'Sam'); // Sat, Nov 18th
    expect(satData.users).toBe(1); // u1
    expect(satData.sessions).toBe(1);

    const sunData = chartData.find(d => d.time === 'Dim'); // Sun, Nov 19th
    expect(sunData.users).toBe(2); // u2, u3
    expect(sunData.sessions).toBe(2);

    const monData = chartData.find(d => d.time === 'Lun'); // Mon, Nov 20th (today)
    expect(monData.users).toBe(1); // u1
    expect(monData.sessions).toBe(1);

    // The session from Nov 13th (last Mon) is older than 7 days from Nov 20th if start date is exclusive or set to 00:00 of 7th day ago.
    // startDate for 7d is: now.getTime() - 7 * 24h. So it's Nov 13th 12:00:00. Data from Nov 13th 10:00:00 is *before* this.
    // The component code sets startDate.setHours(0,0,0,0) for 7d. So Nov 13th 00:00:00.
    // So the Nov 13th 10:00 session *should* be included.
    // The buckets are generated for the last 7 days ending 'now'.
    // If 'now' is Mon 20th, the 7 days are: Tue 14, Wed 15, Thu 16, Fri 17, Sat 18, Sun 19, Mon 20.
    // The session on Mon 13th would not be in these buckets. This seems correct.
  });

  test('displays "No data available" message when no session data is fetched', async () => {
    const sessionQueryBuilder = setupSupabaseUserSessionsMock();
    sessionQueryBuilder.mockResolvedValueOnce({ data: [], error: null });

    render(<UserEngagementChart timeRange="7d" />);

    await waitFor(() => {
      expect(screen.getByText('Aucune donnée d\'engagement disponible pour la période sélectionnée.')).toBeInTheDocument();
    });
  });

  test('handles error during Supabase fetch', async () => {
    const sessionQueryBuilder = setupSupabaseUserSessionsMock();
    sessionQueryBuilder.mockResolvedValueOnce({ data: null, error: { message: 'DB error' } });
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<UserEngagementChart timeRange="24h" />);

    await waitFor(() => {
      expect(screen.getByText('Aucune donnée d\'engagement disponible pour la période sélectionnée.')).toBeInTheDocument();
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching user_sessions for 24h:', { message: 'DB error' });
    consoleErrorSpy.mockRestore();
  });
});
