/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import Icon from '@frontend/components/AppIcon';
import { supabase } from '@frontend/lib/supabase';
import { log } from '@/logger';

interface EngagementData {
  time: string;
  users: number;
  sessions: number;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-surface p-3 border border-border rounded-lg shadow-medium'>
        <p className='text-sm font-medium text-text-primary mb-2'>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className='text-sm' style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString('fr-FR')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Helper to get the start of the week (Monday)
const getStartOfWeek = date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
};

export interface UserEngagementChartProps {
  timeRange: string;
}

const UserEngagementChart: React.FC<UserEngagementChartProps> = ({ timeRange }) => {
  const [engagementData, setEngagementData] = useState<EngagementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [_summaryStats, setSummaryStats] = useState({ peakUsers: 0, averageSessions: 0 });

  useEffect(() => {
    const fetchEngagementData = async currentTimeRange => {
      setLoading(true);
      const now = new Date();
      let startDate;
      let endDate = new Date(now); // For some ranges, we might want to cap at 'now'

      switch (currentTimeRange) {
        case '24h':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          startDate.setHours(0, 0, 0, 0); // Start of the 7th day ago
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          startDate.setHours(0, 0, 0, 0);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          startDate.setHours(0, 0, 0, 0);
          break;
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Default to 7d
          startDate.setHours(0, 0, 0, 0);
      }

      try {
        const { data: sessions, error } = await supabase
          .from('user_sessions')
          .select('user_id, started_at')
          .gte('started_at', startDate.toISOString())
          .lte('started_at', endDate.toISOString()); // Ensure we don't get future data if clock is off

        if (error) {
          log.error(`Error fetching user_sessions for ${currentTimeRange}:`, error);
          setEngagementData([]);
          throw error;
        }

        if (!sessions || sessions.length === 0) {
          setEngagementData([]);
          setSummaryStats({ peakUsers: 0, averageSessions: 0 });
          return;
        }

        let processedData = [];
        // Initialize buckets
        if (currentTimeRange === '24h') {
          processedData = Array(24)
            .fill(null)
            .map((_, i) => ({
              time: `${String(i).padStart(2, '0')}:00`,
              usersSet: new Set(),
              sessions: 0,
            }));
          sessions.forEach(session => {
            const hour = new Date(session.started_at).getHours();
            processedData[hour].sessions++;
            processedData[hour].usersSet.add(session.user_id);
          });
        } else if (currentTimeRange === '7d') {
          const dayLabels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
          // Ensure buckets are for the past 7 days ending today
          processedData = Array(7)
            .fill(null)
            .map((_, i) => {
              const day = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
              return {
                time: dayLabels[day.getDay()],
                dateObj: day, // For sorting/matching
                usersSet: new Set(),
                sessions: 0,
              };
            });
          sessions.forEach(session => {
            const sessionDate = new Date(session.started_at);
            const sessionDayStr = sessionDate.toISOString().split('T')[0];
            const bucket = processedData.find(
              b => b.dateObj.toISOString().split('T')[0] === sessionDayStr
            );
            if (bucket) {
              bucket.sessions++;
              bucket.usersSet.add(session.user_id);
            }
          });
        } else if (currentTimeRange === '30d') {
          // Bucketing by day for 30 days
          processedData = Array(30)
            .fill(null)
            .map((_, i) => {
              const day = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
              return {
                time: `${day.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}`,
                dateObj: day,
                usersSet: new Set(),
                sessions: 0,
              };
            });
          sessions.forEach(session => {
            const sessionDate = new Date(session.started_at);
            const sessionDayStr = sessionDate.toISOString().split('T')[0];
            const bucket = processedData.find(
              b => b.dateObj.toISOString().split('T')[0] === sessionDayStr
            );
            if (bucket) {
              bucket.sessions++;
              bucket.usersSet.add(session.user_id);
            }
          });
        } else if (currentTimeRange === '90d') {
          // Bucketing by week for ~90 days
          const numWeeks = Math.ceil(90 / 7);
          processedData = Array(numWeeks)
            .fill(null)
            .map((_, i) => {
              // Label weeks from "Semaine X" relative to 'now'
              const weekStartDate = new Date(
                now.getTime() - (numWeeks - 1 - i) * 7 * 24 * 60 * 60 * 1000
              );
              getStartOfWeek(weekStartDate); // Align to Monday
              weekStartDate.setHours(0, 0, 0, 0);
              return {
                time: `Sem ${i + 1}`, // Simple week number
                weekStart: weekStartDate,
                usersSet: new Set(),
                sessions: 0,
              };
            });
          // Sort processedData by weekStart to ensure correct labeling if generation order isn't guaranteed
          processedData.sort((a, b) => a.weekStart - b.weekStart);
          processedData.forEach((bucket, index) => (bucket.time = `Sem ${index + 1}`));

          sessions.forEach(session => {
            const sessionDate = new Date(session.started_at);
            // Find the correct week bucket
            for (let i = processedData.length - 1; i >= 0; i--) {
              if (sessionDate >= processedData[i].weekStart) {
                processedData[i].sessions++;
                processedData[i].usersSet.add(session.user_id);
                break;
              }
            }
          });
        }

        const finalData = processedData.map(bucket => ({
          time: bucket.time,
          users: bucket.usersSet.size,
          sessions: bucket.sessions,
        }));

        setEngagementData(finalData);

        // Calculate summary stats
        if (finalData.length > 0) {
          const peakUsers = Math.max(...finalData.map(d => d.users), 0);
          const totalSessions = finalData.reduce((acc, d) => acc + d.sessions, 0);
          const averageSessions =
            finalData.length > 0 ? Math.round(totalSessions / finalData.length) : 0;
          setSummaryStats({ peakUsers, averageSessions });
        } else {
          setSummaryStats({ peakUsers: 0, averageSessions: 0 });
        }
      } catch (_e) {
        // Error already logged, state will be empty
        setEngagementData([]);
        setSummaryStats({ peakUsers: 0, averageSessions: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchEngagementData(timeRange);
  }, [timeRange]);

  if (loading) {
    return (
      <div className='bg-surface rounded-lg p-6 shadow-subtle border border-border h-[400px] flex items-center justify-center'>
        <p className='text-text-secondary'>Chargement des données d'engagement...</p>
      </div>
    );
  }

  if (engagementData.length === 0) {
    return (
      <div className='bg-surface rounded-lg p-6 shadow-subtle border border-border h-[400px] flex items-center justify-center'>
        <p className='text-text-secondary'>
          Aucune donnée d'engagement disponible pour la période sélectionnée.
        </p>
      </div>
    );
  }

  return (
    <div className='bg-surface rounded-lg p-6 shadow-subtle border border-border'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h3 className='text-lg font-semibold text-text-primary'>Engagement utilisateurs</h3>
          <p className='text-sm text-text-secondary'>Utilisateurs actifs et sessions</p>
        </div>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-2'>
            <div className='w-3 h-3 bg-primary rounded-full'></div>
            <span className='text-xs text-text-secondary'>Utilisateurs</span>
          </div>
          <div className='flex items-center space-x-2'>
            <div className='w-3 h-3 bg-accent rounded-full'></div>
            <span className='text-xs text-text-secondary'>Sessions</span>
          </div>
          <button className='p-1 rounded-md hover:bg-secondary-100 transition-colors'>
            <Icon aria-hidden='true' name='Download' size={16} className='text-text-secondary' />
          </button>
        </div>
      </div>

      <div className='h-64'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart<EngagementData> data={engagementData}>
            <defs>
              <linearGradient id='colorUsers' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='var(--color-primary)' stopOpacity={0.3} />
                <stop offset='95%' stopColor='var(--color-primary)' stopOpacity={0} />
              </linearGradient>
              <linearGradient id='colorSessions' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='var(--color-accent)' stopOpacity={0.3} />
                <stop offset='95%' stopColor='var(--color-accent)' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' stroke='var(--color-border)' />
            <XAxis dataKey='time' stroke='var(--color-text-secondary)' fontSize={12} />
            <YAxis
              stroke='var(--color-text-secondary)'
              fontSize={12}
              tickFormatter={value => value.toLocaleString('fr-FR')}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type='monotone'
              dataKey='users'
              stroke='var(--color-primary)'
              fillOpacity={1}
              fill='url(#colorUsers)'
              strokeWidth={2}
              name='Utilisateurs'
            />
            <Area
              type='monotone'
              dataKey='sessions'
              stroke='var(--color-accent)'
              fillOpacity={1}
              fill='url(#colorSessions)'
              strokeWidth={2}
              name='Sessions'
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className='mt-4 grid grid-cols-2 gap-4'>
        <div className='text-center p-3 bg-primary-50 rounded-lg'>
          <p className='text-sm text-text-secondary'>Pic d'activité</p>
          <p className='text-lg font-semibold text-primary'>
            {Math.max(...engagementData.map(d => d.users)).toLocaleString('fr-FR')}
          </p>
        </div>
        <div className='text-center p-3 bg-accent-50 rounded-lg'>
          <p className='text-sm text-text-secondary'>Sessions moyennes</p>
          <p className='text-lg font-semibold text-accent'>
            {Math.round(
              engagementData.reduce((acc, d) => acc + d.sessions, 0) / engagementData.length
            ).toLocaleString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserEngagementChart;
