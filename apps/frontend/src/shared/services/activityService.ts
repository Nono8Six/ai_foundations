/**
 * Activity Service - Gestion des événements d'activité depuis Supabase
 * 
 * Interface avec activity_log pour récupérer, filtrer et paginer
 * les événements d'activité utilisateur (XP, complétion, etc.)
 */

import { supabase } from '@core/supabase/client';
import { ActivityEvent } from '@shared/utils/activityFormatter';

export interface ActivityFilters {
  period?: '30d' | '90d' | '12m' | 'all';
  types?: string[];
  hasXP?: boolean;
  sortBy?: 'recent' | 'oldest';
}

export interface ActivityPagination {
  page: number;
  pageSize: number;
}

export interface ActivityResponse {
  activities: ActivityEvent[];
  totalCount: number;
  hasMore: boolean;
}

export interface ActivityAggregates {
  totalXP: number;
  totalEvents: number;
  topTypes: Array<{
    type: string;
    count: number;
    totalXP: number;
  }>;
  eventsByDay: Array<{
    date: string;
    count: number;
    totalXP: number;
  }>;
}

/**
 * Convertit les filtres de période en date de début
 */
function getPeriodStartDate(period: ActivityFilters['period']): Date | null {
  if (!period || period === 'all') return null;
  
  const now = new Date();
  switch (period) {
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case '12m':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    default:
      return null;
  }
}

export class ActivityService {
  /**
   * Récupère les activités d'un utilisateur avec filtres et pagination
   */
  static async getUserActivities(
    userId: string,
    filters: ActivityFilters = {},
    pagination: ActivityPagination = { page: 0, pageSize: 20 }
  ): Promise<ActivityResponse> {
    try {
      let query = supabase
        .from('activity_log')
        .select('id, user_id, type, action, details, created_at', { count: 'exact' })
        .eq('user_id', userId);

      // Filtre par période
      const startDate = getPeriodStartDate(filters.period);
      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }

      // Filtre par types
      if (filters.types && filters.types.length > 0) {
        query = query.in('type', filters.types);
      }

      // Filtre XP uniquement
      if (filters.hasXP) {
        query = query.not('details->xp_delta', 'is', null);
      }

      // Tri
      const ascending = filters.sortBy === 'oldest';
      query = query.order('created_at', { ascending });

      // Pagination
      const offset = pagination.page * pagination.pageSize;
      query = query.range(offset, offset + pagination.pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching user activities:', error);
        return { activities: [], totalCount: 0, hasMore: false };
      }

      const activities: ActivityEvent[] = (data || []).map(row => ({
        id: row.id,
        user_id: row.user_id,
        type: row.type,
        action: row.action,
        details: (row.details as Record<string, any>) || {},
        created_at: row.created_at
      }));

      return {
        activities,
        totalCount: count || 0,
        hasMore: data ? data.length === pagination.pageSize : false
      };

    } catch (error) {
      console.error('Error in getUserActivities:', error);
      return { activities: [], totalCount: 0, hasMore: false };
    }
  }

  /**
   * Récupère les activités récentes d'un utilisateur (pour widget)
   */
  static async getRecentActivities(
    userId: string,
    limit: number = 5
  ): Promise<ActivityEvent[]> {
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .select('id, user_id, type, action, details, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent activities:', error);
        return [];
      }

      return (data || []).map(row => ({
        id: row.id,
        user_id: row.user_id,
        type: row.type,
        action: row.action,
        details: (row.details as Record<string, any>) || {},
        created_at: row.created_at
      }));

    } catch (error) {
      console.error('Error in getRecentActivities:', error);
      return [];
    }
  }

  /**
   * Calcule les agrégations d'activité pour une période
   */
  static async getActivityAggregates(
    userId: string,
    filters: Pick<ActivityFilters, 'period' | 'types'> = {}
  ): Promise<ActivityAggregates> {
    try {
      let query = supabase
        .from('activity_log')
        .select('type, action, details, created_at')
        .eq('user_id', userId);

      // Filtre par période
      const startDate = getPeriodStartDate(filters.period);
      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }

      // Filtre par types
      if (filters.types && filters.types.length > 0) {
        query = query.in('type', filters.types);
      }

      const { data, error } = await query;

      if (error || !data) {
        console.error('Error fetching activity aggregates:', error);
        return { totalXP: 0, totalEvents: 0, topTypes: [], eventsByDay: [] };
      }

      // Calculs d'agrégation
      let totalXP = 0;
      const typesMap = new Map<string, { count: number; totalXP: number }>();
      const daysMap = new Map<string, { count: number; totalXP: number }>();

      data.forEach(activity => {
        const xpDelta = activity.details?.xp_delta;
        const xpValue = typeof xpDelta === 'number' ? xpDelta : 0;

        // XP total
        if (xpValue !== 0) {
          totalXP += xpValue;
        }

        // Top types
        if (!typesMap.has(activity.type)) {
          typesMap.set(activity.type, { count: 0, totalXP: 0 });
        }
        const typeStats = typesMap.get(activity.type)!;
        typeStats.count += 1;
        typeStats.totalXP += xpValue;

        // Par jour (30 derniers jours max)
        if (activity.created_at) {
          const dayKey = activity.created_at.split('T')[0];
          const activityDate = new Date(activity.created_at);
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

          if (activityDate >= thirtyDaysAgo) {
            if (!daysMap.has(dayKey)) {
              daysMap.set(dayKey, { count: 0, totalXP: 0 });
            }
            const dayStats = daysMap.get(dayKey)!;
            dayStats.count += 1;
            dayStats.totalXP += xpValue;
          }
        }
      });

      // Top 3 types
      const topTypes = Array.from(typesMap.entries())
        .map(([type, stats]) => ({ type, ...stats }))
        .sort((a, b) => b.totalXP - a.totalXP || b.count - a.count)
        .slice(0, 3);

      // Événements par jour (triés par date)
      const eventsByDay = Array.from(daysMap.entries())
        .map(([date, stats]) => ({ date, ...stats }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        totalXP,
        totalEvents: data.length,
        topTypes,
        eventsByDay
      };

    } catch (error) {
      console.error('Error in getActivityAggregates:', error);
      return { totalXP: 0, totalEvents: 0, topTypes: [], eventsByDay: [] };
    }
  }

  /**
   * Récupère les types d'activité disponibles pour les filtres
   */
  static async getAvailableTypes(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .select('type')
        .eq('user_id', userId)
        .order('type');

      if (error) {
        console.error('Error fetching available types:', error);
        return [];
      }

      const uniqueTypes = Array.from(
        new Set(data?.map(row => row.type) || [])
      ).sort();

      return uniqueTypes;

    } catch (error) {
      console.error('Error in getAvailableTypes:', error);
      return [];
    }
  }

  /**
   * Vérifie si un utilisateur a des activités avec XP
   */
  static async hasXPActivities(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .select('id')
        .eq('user_id', userId)
        .not('details->xp_delta', 'is', null)
        .limit(1);

      if (error) {
        console.error('Error checking XP activities:', error);
        return false;
      }

      return (data?.length || 0) > 0;

    } catch (error) {
      console.error('Error in hasXPActivities:', error);
      return false;
    }
  }
}