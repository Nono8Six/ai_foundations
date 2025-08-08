/**
 * XP Service - Système complet de gestion XP et gamification
 * 
 * Service pour l'écosystème XP avec :
 * - Timeline des événements XP (gains/pertes) 
 * - Agrégations par période et source
 * - Gestion des niveaux et achievements
 * - API pour gamification future
 * - AUCUNE données simulées, que du réel depuis la DB
 */

import { supabase } from '@core/supabase/client';
import type { Database } from '@types/database.types';

// Types pour les événements XP
export interface XPEvent {
  id: string;
  user_id: string;
  type: string;
  action: string;
  xp_delta: number;
  xp_before: number;
  xp_after: number;
  level_before?: number;
  level_after?: number;
  source: string;
  reference_id?: string;
  backfilled?: boolean;
  created_at: string;
  details: Record<string, any>;
}

// Types pour les sources XP (règles)
export interface XPSource {
  id: string;
  source_type: string;
  action_type: string;
  xp_value: number;
  is_repeatable: boolean;
  cooldown_minutes: number;
  max_per_day?: number;
  description: string;
  is_active: boolean;
}

// Types pour les achievements
export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_name: string;
  xp_reward: number;
  unlocked_at: string;
  details: Record<string, any>;
}

// Types pour balance XP
export interface UserXPBalance {
  id: string;
  user_id: string;
  total_xp: number;
  current_level: number;
  xp_for_next_level: number;
  last_xp_event_at?: string;
  created_at: string;
  updated_at: string;
}

// Types pour filtres et pagination
export interface XPFilters {
  period: 'all' | '30d' | '90d' | '12m';
  source?: string[];
  sortBy: 'recent' | 'oldest';
}

export interface XPPaginationParams {
  page: number;
  pageSize: number;
}

// Types pour agrégations
export interface XPAggregates {
  totalXpOnPeriod: number;
  totalEvents: number;
  topSources: Array<{
    source: string;
    count: number;
    totalXp: number;
  }>;
  eventsByDay: Array<{
    date: string;
    totalXp: number;
    eventCount: number;
  }>;
}

// Types pour groupements temporels
export interface XPTimelineGroup {
  period: string; // "2025-01-15" pour jour, "2025-W03" pour semaine, "2025-01" pour mois
  label: string; // "15 janvier 2025", "Semaine du 13 janvier", "Janvier 2025"
  totalXp: number;
  eventCount: number;
  events: XPEvent[];
}

export type XPTimelineResponse = {
  groups: XPTimelineGroup[];
  totalCount: number;
  hasMore: boolean;
};

/**
 * Convertit les filtres de période en timestamp de début
 */
function getPeriodStartDate(period: XPFilters['period']): Date | null {
  const now = new Date();
  switch (period) {
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case '12m':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    case 'all':
      return null;
    default:
      return null;
  }
}

/**
 * Détermine le niveau de groupement selon la période sélectionnée
 */
function getGroupingLevel(period: XPFilters['period']): 'day' | 'week' | 'month' {
  switch (period) {
    case '30d':
      return 'day';
    case '90d':
      return 'week';
    case '12m':
    case 'all':
      return 'month';
    default:
      return 'day';
  }
}

/**
 * Formate une clé de groupe selon le niveau
 */
function formatGroupKey(date: Date, level: 'day' | 'week' | 'month'): string {
  switch (level) {
    case 'day':
      return date.toISOString().split('T')[0]; // "2025-01-15"
    case 'week': {
      const year = date.getFullYear();
      const weekNumber = Math.ceil(((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + new Date(year, 0, 1).getDay() + 1) / 7);
      return `${year}-W${String(weekNumber).padStart(2, '0')}`; // "2025-W03"
    }
    case 'month':
      return date.toISOString().substring(0, 7); // "2025-01"
    default:
      return date.toISOString().split('T')[0];
  }
}

/**
 * Formate un label lisible pour une période
 */
function formatGroupLabel(groupKey: string, level: 'day' | 'week' | 'month'): string {
  if (level === 'day') {
    const date = new Date(groupKey);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  }
  
  if (level === 'week') {
    const [year, week] = groupKey.split('-W');
    const jan1 = new Date(parseInt(year), 0, 1);
    const weekStart = new Date(jan1.getTime() + (parseInt(week) - 1) * 7 * 24 * 60 * 60 * 1000);
    return `Semaine du ${weekStart.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`;
  }
  
  if (level === 'month') {
    const date = new Date(`${groupKey  }-01`);
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }
  
  return groupKey;
}

/**
 * Formate un nom de source pour l'affichage
 */
function formatSourceDisplay(source: string): string {
  const sourceMap: Record<string, string> = {
    'profile:full_completion': 'Profil complété',
    'profile:partial_completion': 'Profil partiel',
    'profile:field_removal': 'Champ retiré',
    'lesson:completion': 'Leçon terminée',
    'lesson:perfect_score': 'Leçon parfaite',
    'lesson:retry_completion': 'Leçon retry',
    'quiz:pass': 'Quiz réussi',
    'quiz:perfect': 'Quiz parfait',
    'streak:daily_milestone': 'Série quotidienne',
    'streak:weekly_milestone': 'Série hebdomadaire',
    'course:completion': 'Cours terminé',
    'achievement:unlock': 'Achievement débloqué'
  };
  
  return sourceMap[source] || source.split(':').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join(' - ');
}

/**
 * Service principal XP
 */
export class XPService {
  /**
   * Vérifier la disponibilité des données XP
   */
  static async checkXpDataAvailability(userId: string): Promise<{
    hasActivityLog: boolean;
    hasXpEvents: boolean;
    sampleEventCount: number;
  }> {
    try {
      const { data: events, error } = await supabase
        .from('activity_log')
        .select('id, details')
        .eq('user_id', userId)
        .not('details', 'is', null)
        .limit(10);

      if (error) {
        console.error('Error checking XP data availability:', error);
        return { hasActivityLog: false, hasXpEvents: false, sampleEventCount: 0 };
      }

      // Compter les événements avec XP
      const xpEvents = events?.filter(event => 
        event.details && typeof event.details === 'object' && 'xp_delta' in event.details
      ) || [];

      return {
        hasActivityLog: true,
        hasXpEvents: xpEvents.length > 0,
        sampleEventCount: xpEvents.length
      };

    } catch (error) {
      console.error('Error in checkXpDataAvailability:', error);
      return { hasActivityLog: false, hasXpEvents: false, sampleEventCount: 0 };
    }
  }

  /**
   * Récupère la timeline des événements XP avec groupement temporel et pagination
   */
  static async getXpTimeline(
    userId: string, 
    filters: XPFilters,
    pagination: XPPaginationParams
  ): Promise<XPTimelineResponse> {
    try {
      // Construire la requête de base
      let query = supabase
        .from('activity_log')
        .select('id, user_id, type, action, details, created_at')
        .eq('user_id', userId)
        .not('details', 'is', null);

      // Appliquer le filtre de période
      const startDate = getPeriodStartDate(filters.period);
      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }

      // Tri selon preference
      const ascending = filters.sortBy === 'oldest';
      query = query.order('created_at', { ascending });

      // Pagination
      const limit = pagination.pageSize * 2; // Buffer pour les groupements
      const offset = pagination.page * pagination.pageSize;
      
      const { data: events, error, count } = await query
        .range(offset, offset + limit - 1)
        .limit(limit);

      if (error) {
        console.error('Error fetching XP timeline:', error);
        return { groups: [], totalCount: 0, hasMore: false };
      }

      if (!events || events.length === 0) {
        return { groups: [], totalCount: count || 0, hasMore: false };
      }

      // Transformer en événements XP typés
      const xpEvents: XPEvent[] = events
        .filter(event => event.details && typeof event.details === 'object' && 'xp_delta' in event.details)
        .map(event => {
          const details = event.details as any;
          return {
            id: event.id,
            user_id: event.user_id,
            type: event.type,
            action: event.action,
            xp_delta: details.xp_delta || 0,
            xp_before: details.xp_before || 0,
            xp_after: details.xp_after || 0,
            level_before: details.level_before,
            level_after: details.level_after,
            source: details.source || `${event.type}:${event.action}`,
            reference_id: details.reference_id,
            backfilled: details.backfilled || false,
            created_at: event.created_at!,
            details
          };
        });

      // Appliquer le filtre par source si spécifié
      let filteredEvents = xpEvents;
      if (filters.source && filters.source.length > 0) {
        filteredEvents = xpEvents.filter(event => 
          filters.source!.includes(event.source)
        );
      }

      // Grouper par période
      const groupingLevel = getGroupingLevel(filters.period);
      const groupsMap = new Map<string, XPTimelineGroup>();

      filteredEvents.forEach(event => {
        const eventDate = new Date(event.created_at);
        const groupKey = formatGroupKey(eventDate, groupingLevel);
        
        if (!groupsMap.has(groupKey)) {
          groupsMap.set(groupKey, {
            period: groupKey,
            label: formatGroupLabel(groupKey, groupingLevel),
            totalXp: 0,
            eventCount: 0,
            events: []
          });
        }

        const group = groupsMap.get(groupKey)!;
        group.totalXp += event.xp_delta;
        group.eventCount += 1;
        group.events.push(event);
      });

      // Convertir en array et trier
      const groups = Array.from(groupsMap.values())
        .sort((a, b) => filters.sortBy === 'recent' 
          ? b.period.localeCompare(a.period)
          : a.period.localeCompare(b.period)
        );

      return {
        groups,
        totalCount: count || 0,
        hasMore: events.length === limit
      };

    } catch (error) {
      console.error('Error in getXpTimeline:', error);
      return { groups: [], totalCount: 0, hasMore: false };
    }
  }

  /**
   * Récupère les agrégations XP pour la période donnée
   */
  static async getXpAggregates(
    userId: string, 
    filters: Pick<XPFilters, 'period' | 'source'>
  ): Promise<XPAggregates> {
    try {
      let query = supabase
        .from('activity_log')
        .select('type, action, details, created_at')
        .eq('user_id', userId)
        .not('details', 'is', null);

      // Appliquer le filtre de période
      const startDate = getPeriodStartDate(filters.period);
      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data: events, error } = await query;

      if (error || !events) {
        console.error('Error fetching XP aggregates:', error);
        return { totalXpOnPeriod: 0, totalEvents: 0, topSources: [], eventsByDay: [] };
      }

      // Traiter les événements XP
      const xpEvents = events
        .filter(event => event.details && typeof event.details === 'object' && 'xp_delta' in event.details)
        .map(event => {
          const details = event.details as any;
          return {
            ...event,
            xp_delta: details.xp_delta || 0,
            source: details.source || `${event.type}:${event.action}`
          };
        });

      // Appliquer le filtre par source
      let filteredEvents = xpEvents;
      if (filters.source && filters.source.length > 0) {
        filteredEvents = xpEvents.filter(event => 
          filters.source!.includes(event.source)
        );
      }

      // Calculer le total XP sur la période
      const totalXpOnPeriod = filteredEvents.reduce((sum, event) => sum + event.xp_delta, 0);

      // Calculer les top sources
      const sourcesMap = new Map<string, { count: number; totalXp: number }>();
      filteredEvents.forEach(event => {
        if (!sourcesMap.has(event.source)) {
          sourcesMap.set(event.source, { count: 0, totalXp: 0 });
        }
        const sourceStats = sourcesMap.get(event.source)!;
        sourceStats.count += 1;
        sourceStats.totalXp += event.xp_delta;
      });

      const topSources = Array.from(sourcesMap.entries())
        .map(([source, stats]) => ({ source, ...stats }))
        .sort((a, b) => b.totalXp - a.totalXp)
        .slice(0, 3); // Top 3

      // Calculer les événements par jour (pour les 30 derniers jours max)
      const daysMap = new Map<string, { totalXp: number; eventCount: number }>();
      const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      filteredEvents
        .filter(event => new Date(event.created_at) >= last30Days)
        .forEach(event => {
          const day = event.created_at.split('T')[0]; // "2025-01-15"
          if (!daysMap.has(day)) {
            daysMap.set(day, { totalXp: 0, eventCount: 0 });
          }
          const dayStats = daysMap.get(day)!;
          dayStats.totalXp += event.xp_delta;
          dayStats.eventCount += 1;
        });

      const eventsByDay = Array.from(daysMap.entries())
        .map(([date, stats]) => ({ date, ...stats }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        totalXpOnPeriod,
        totalEvents: filteredEvents.length,
        topSources,
        eventsByDay
      };

    } catch (error) {
      console.error('Error in getXpAggregates:', error);
      return { totalXpOnPeriod: 0, totalEvents: 0, topSources: [], eventsByDay: [] };
    }
  }

  /**
   * Récupère la liste des sources disponibles pour les filtres
   */
  static async getAvailableSources(userId: string): Promise<string[]> {
    try {
      const { data: events, error } = await supabase
        .from('activity_log')
        .select('type, action, details')
        .eq('user_id', userId)
        .not('details', 'is', null);

      if (error || !events) {
        console.error('Error fetching available sources:', error);
        return [];
      }

      const sourcesSet = new Set<string>();
      events.forEach(event => {
        if (event.details && typeof event.details === 'object' && 'xp_delta' in event.details) {
          const details = event.details as any;
          const source = details.source || `${event.type}:${event.action}`;
          sourcesSet.add(source);
        }
      });

      return Array.from(sourcesSet).sort();

    } catch (error) {
      console.error('Error in getAvailableSources:', error);
      return [];
    }
  }

  /**
   * Récupère la balance XP de l'utilisateur
   */
  static async getUserXPBalance(userId: string): Promise<UserXPBalance | null> {
    try {
      const { data, error } = await supabase
        .from('user_xp_balance')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user XP balance:', error);
        return null;
      }

      return data;

    } catch (error) {
      console.error('Error in getUserXPBalance:', error);
      return null;
    }
  }

  /**
   * Récupère les achievements de l'utilisateur
   */
  static async getUserAchievements(userId: string): Promise<Achievement[]> {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false });

      if (error) {
        console.error('Error fetching user achievements:', error);
        return [];
      }

      return data || [];

    } catch (error) {
      console.error('Error in getUserAchievements:', error);
      return [];
    }
  }

  /**
   * Récupère les sources XP disponibles (règles)
   */
  static async getXPSources(): Promise<XPSource[]> {
    try {
      const { data, error } = await supabase
        .from('xp_sources')
        .select('*')
        .eq('is_active', true)
        .order('source_type', { ascending: true });

      if (error) {
        console.error('Error fetching XP sources:', error);
        return [];
      }

      return data || [];

    } catch (error) {
      console.error('Error in getXPSources:', error);
      return [];
    }
  }

  /**
   * Vérifie la complétion du profil utilisateur
   */
  static async checkProfileCompletion(userId: string): Promise<{
    isComplete: boolean;
    completedFields: string[];
    missingFields: string[];
    completionPercentage: number;
  }> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, phone, profession, company, avatar_url')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking profile completion:', error);
        return { 
          isComplete: false, 
          completedFields: [], 
          missingFields: [], 
          completionPercentage: 0 
        };
      }

      const fields = ['full_name', 'phone', 'profession', 'company', 'avatar_url'];
      const completedFields = fields.filter(field => profile[field as keyof typeof profile]);
      const missingFields = fields.filter(field => !profile[field as keyof typeof profile]);
      const completionPercentage = Math.round((completedFields.length / fields.length) * 100);

      return {
        isComplete: completedFields.length === fields.length,
        completedFields,
        missingFields,
        completionPercentage
      };

    } catch (error) {
      console.error('Error in checkProfileCompletion:', error);
      return { 
        isComplete: false, 
        completedFields: [], 
        missingFields: [], 
        completionPercentage: 0 
      };
    }
  }

  /**
   * Utilitaire pour formatter les sources pour l'affichage
   */
  static formatSourceDisplay = formatSourceDisplay;
}