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

// Types pour level definitions
export interface LevelDefinition {
  level: number;
  xp_required: number;
  xp_for_next: number;
  title: string;
  description?: string;
  badge_icon?: string;
  badge_color?: string;
  rewards: Record<string, any>;
}

// Type pour informations niveau utilisateur
export interface LevelInfo {
  currentLevel: number;
  levelTitle: string;
  xpInCurrentLevel: number; // XP dans le niveau actuel (relatif)
  xpForNextLevel: number; // XP manquant pour niveau suivant
  xpRequired: number; // XP total requis pour niveau actuel
  xpRequiredNext: number; // XP total requis pour niveau suivant
  totalXP: number; // XP total cumulé de l'utilisateur
  progressPercent: number;
  badgeIcon?: string;
  badgeColor?: string;
  isMaxLevel: boolean;
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

// Types pour opportunités XP unifiées (actions + achievements)
export interface XPOpportunity {
  id: string;
  title: string;
  description: string;
  xpValue: number;
  icon: string;
  actionText: string;
  available: boolean;
  sourceType: string;
  actionType: string;
  isRepeatable: boolean;
  cooldownMinutes: number;
  maxPerDay?: number;
  // Nouveaux champs pour différencier
  category: 'action' | 'achievement'; // Type d'opportunité
  conditionType?: string; // Pour achievements
  conditionParams?: Record<string, any>; // Pour achievements
  progress?: number; // Progression actuelle (0-100%)
  isUnlocked?: boolean; // Pour achievements seulement
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
    'streak:7day_milestone': 'Série de 7 jours',
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
      // Construire la requête de base sur la table xp_events
      let query = supabase
        .from('xp_events')
        .select('id, user_id, source_type, action_type, xp_delta, xp_before, xp_after, level_before, level_after, reference_id, metadata, created_at')
        .eq('user_id', userId);

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
      const xpEvents: XPEvent[] = events.map(event => {
        const metadata = event.metadata || {};
        return {
          id: event.id,
          user_id: event.user_id,
          type: event.source_type,
          action: event.action_type,
          xp_delta: event.xp_delta || 0,
          xp_before: event.xp_before || 0,
          xp_after: event.xp_after || 0,
          level_before: event.level_before,
          level_after: event.level_after,
          source: metadata.source || `${event.source_type}:${event.action_type}`,
          reference_id: event.reference_id,
          backfilled: metadata.backfilled || false,
          created_at: event.created_at!,
          details: metadata
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
        .from('xp_events')
        .select('source_type, action_type, xp_delta, metadata, created_at')
        .eq('user_id', userId);

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
      const xpEvents = events.map(event => {
        const metadata = event.metadata || {};
        return {
          ...event,
          xp_delta: event.xp_delta || 0,
          source: metadata.source || `${event.source_type}:${event.action_type}`
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
        .from('xp_events')
        .select('source_type, action_type, metadata')
        .eq('user_id', userId);

      if (error || !events) {
        console.error('Error fetching available sources:', error);
        return [];
      }

      const sourcesSet = new Set<string>();
      events.forEach(event => {
        const metadata = event.metadata || {};
        const source = metadata.source || `${event.source_type}:${event.action_type}`;
        sourcesSet.add(source);
      });

      return Array.from(sourcesSet).sort();

    } catch (error) {
      console.error('Error in getAvailableSources:', error);
      return [];
    }
  }

  /**
   * 🎯 CALCUL CORRECT DES INFORMATIONS DE NIVEAU
   * Logique NON-RESET : l'XP ne repart jamais à 0 !
   */
  static async calculateLevelInfo(totalXP: number): Promise<LevelInfo> {
    try {
      // Récupérer toutes les définitions de niveau
      const { data: levelDefinitions, error } = await supabase
        .from('level_definitions')
        .select('*')
        .order('level', { ascending: true });

      if (error || !levelDefinitions) {
        console.error('Error fetching level definitions:', error);
        // Fallback vers niveau 1 si erreur
        return {
          currentLevel: 1,
          levelTitle: 'Débutant',
          xpInCurrentLevel: totalXP,
          xpForNextLevel: Math.max(100 - totalXP, 0),
          xpRequired: 0,
          xpRequiredNext: 100,
          totalXP,
          progressPercent: Math.min((totalXP / 100) * 100, 100),
          isMaxLevel: false
        };
      }

      // 🔍 TROUVER LE NIVEAU ACTUEL CORRECT
      // Trouve le niveau le plus élevé dont le seuil est <= totalXP
      const currentLevelDef = levelDefinitions
        .filter(def => def.xp_required <= totalXP)
        .sort((a, b) => b.level - a.level)[0] || levelDefinitions[0];

      const currentLevel = currentLevelDef.level;
      const nextLevelDef = levelDefinitions.find(def => def.level === currentLevel + 1);
      
      // 📊 CALCULS DE PROGRESSION CORRECTS
      const xpRequired = currentLevelDef.xp_required; // XP total requis pour niveau actuel
      const xpRequiredNext = nextLevelDef?.xp_required || (xpRequired + 1000); // XP total requis pour niveau suivant
      
      // XP DANS le niveau actuel (progression relative)
      const xpInCurrentLevel = totalXP - xpRequired;
      
      // XP manquant pour niveau suivant  
      const xpForNextLevel = nextLevelDef ? Math.max(xpRequiredNext - totalXP, 0) : 0;
      
      // Taille du niveau actuel en XP
      const levelSize = xpRequiredNext - xpRequired;
      
      // Pourcentage de progression dans le niveau actuel
      const progressPercent = nextLevelDef 
        ? Math.min((xpInCurrentLevel / levelSize) * 100, 100)
        : 100;

      log.debug(`📈 Level calculation: ${totalXP} XP → Level ${currentLevel} (${xpInCurrentLevel}/${levelSize} XP = ${progressPercent.toFixed(1)}%)`);

      return {
        currentLevel,
        levelTitle: currentLevelDef.title,
        xpInCurrentLevel, // Ex: 25 XP dans le niveau 2
        xpForNextLevel, // Ex: 125 XP manquants pour niveau 3
        xpRequired, // Ex: 100 XP requis pour niveau 2
        xpRequiredNext, // Ex: 250 XP requis pour niveau 3
        totalXP, // Ex: 125 XP total
        progressPercent: Math.min(progressPercent, 100),
        badgeIcon: currentLevelDef.badge_icon,
        badgeColor: currentLevelDef.badge_color,
        isMaxLevel: !nextLevelDef
      };

    } catch (error) {
      console.error('Error calculating level info:', error);
      return {
        currentLevel: 1,
        levelTitle: 'Débutant',
        xpInCurrentLevel: totalXP,
        xpForNextLevel: Math.max(100 - totalXP, 0),
        xpRequired: 0,
        xpRequiredNext: 100,
        totalXP,
        progressPercent: Math.min((totalXP / 100) * 100, 100),
        isMaxLevel: false
      };
    }
  }

  /**
   * Récupère les définitions de niveau depuis level_definitions
   */
  static async getLevelDefinitions(): Promise<LevelDefinition[]> {
    try {
      const { data, error } = await supabase
        .from('level_definitions')
        .select('*')
        .order('level', { ascending: true });

      if (error) {
        console.error('Error fetching level definitions:', error);
        return [];
      }

      return data || [];

    } catch (error) {
      console.error('Error in getLevelDefinitions:', error);
      return [];
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
   * Récupère TOUTES les opportunités XP unifiées (actions + achievements)
   * API unifiée pour le bloc "Achievements disponibles"
   */
  static async getAllXPOpportunities(userId?: string): Promise<XPOpportunity[]> {
    try {
      // 1. Récupérer les actions immédiates (xp_sources)
      const { data: sources, error: sourcesError } = await supabase
        .from('xp_sources')
        .select('*')
        .eq('is_active', true);

      // 2. Récupérer les achievements (achievement_definitions)
      const { data: achievements, error: achievementsError } = await supabase
        .from('achievement_definitions')
        .select('*')
        .eq('is_active', true);

      if (sourcesError) console.error('Error fetching XP sources:', sourcesError);
      if (achievementsError) console.error('Error fetching achievements:', achievementsError);

      const allOpportunities: XPOpportunity[] = [];

      // 3. Transformer xp_sources en opportunités "action"
      if (sources && userId) {
        // Récupérer les événements XP déjà gagnés pour vérifier les actions accomplies
        const { data: completedActions } = await supabase
          .from('xp_events')
          .select('source_type, action_type')
          .eq('user_id', userId);
        
        const completedSet = new Set(
          completedActions?.map(event => `${event.source_type}:${event.action_type}`) || []
        );

        const actionOpportunities = sources.map(source => {
          const actionKey = `${source.source_type}:${source.action_type}`;
          const isCompleted = completedSet.has(actionKey);
          
          return {
            id: `action:${source.source_type}:${source.action_type}`,
            title: source.title || `${source.action_type} ${source.source_type}`,
            description: source.description || this.generateDynamicDescription(source.action_type, source.source_type),
            xpValue: source.xp_value,
            icon: this.getDynamicIcon(source.source_type),
            actionText: this.getDynamicActionText(source.source_type),
            available: source.is_repeatable || !isCompleted, // Disponible si répétable OU pas encore fait
            sourceType: source.source_type,
            actionType: source.action_type,
            isRepeatable: source.is_repeatable || false,
            cooldownMinutes: source.cooldown_minutes || 0,
            maxPerDay: source.max_per_day,
            category: 'action' as const,
            progress: isCompleted ? 100 : 0, // 100% si déjà accompli
            isUnlocked: isCompleted // Marqué comme débloqué si déjà fait
          };
        });
        allOpportunities.push(...actionOpportunities);
      }

      // 4. Transformer achievement_definitions en opportunités "achievement"
      if (achievements && userId) {
        // Vérifier quels achievements sont déjà débloqués
        const { data: unlockedAchievements } = await supabase
          .from('user_achievements')
          .select('achievement_type')
          .eq('user_id', userId);
        
        const unlockedSet = new Set(unlockedAchievements?.map(a => a.achievement_type) || []);
        
        const achievementOpportunities = achievements.map(achievement => ({
          id: `achievement:${achievement.achievement_key}`,
          title: achievement.title,
          description: achievement.description,
          xpValue: achievement.xp_reward,
          icon: this.getDynamicIcon(achievement.category),
          actionText: 'Voir progression',
          available: !unlockedSet.has(achievement.achievement_key),
          sourceType: achievement.category,
          actionType: achievement.achievement_key,
          isRepeatable: achievement.is_repeatable || false,
          cooldownMinutes: achievement.cooldown_hours ? achievement.cooldown_hours * 60 : 0,
          maxPerDay: undefined,
          category: 'achievement' as const,
          conditionType: achievement.condition_type,
          conditionParams: achievement.condition_params,
          progress: 0, // TODO: Calculate actual progress
          isUnlocked: unlockedSet.has(achievement.achievement_key)
        }));
        allOpportunities.push(...achievementOpportunities);
      }

      // 5. Trier par XP desc et catégorie (actions d'abord, puis achievements)
      return allOpportunities
        .sort((a, b) => {
          if (a.category !== b.category) {
            return a.category === 'action' ? -1 : 1;
          }
          return b.xpValue - a.xpValue;
        });

    } catch (error) {
      console.error('Error in getAllXPOpportunities:', error);
      return [];
    }
  }

  /**
   * Version simplifiée pour le bloc "Comment gagner plus d'XP" (top 3 actions)
   */
  static async getAvailableXPOpportunities(userId?: string): Promise<XPOpportunity[]> {
    try {
      const allOpportunities = await this.getAllXPOpportunities(userId);
      
      // Filtrer seulement les actions (pas les achievements) et limiter à 3
      return allOpportunities
        .filter(opp => opp.category === 'action')
        .filter(opp => ['lesson', 'course', 'quiz', 'profile', 'module'].includes(opp.sourceType))
        .slice(0, 3);

    } catch (error) {
      console.error('Error in getAvailableXPOpportunities:', error);
      return [];
    }
  }

  /**
   * Helpers DYNAMIQUES - génèrent descriptions/actions depuis les données DB
   * TITRES maintenant 100% depuis Supabase !
   */

  private static generateDynamicDescription(actionType: string, sourceType: string): string {
    // Description générique basée sur l'action
    if (actionType.includes('perfect')) {
      return `Excellez dans ${sourceType === 'lesson' ? 'une leçon' : sourceType === 'quiz' ? 'un quiz' : sourceType === 'course' ? 'un cours' : 'cette activité'} pour un bonus XP`;
    }
    if (actionType.includes('completion')) {
      return `Terminez ${sourceType === 'lesson' ? 'une leçon' : sourceType === 'course' ? 'un cours' : sourceType === 'module' ? 'un module' : 'cette activité'} pour gagner de l'XP`;
    }
    if (actionType.includes('start')) {
      return `Commencez ${sourceType === 'lesson' ? 'une nouvelle leçon' : sourceType === 'course' ? 'un nouveau cours' : 'cette activité'} et gagnez de l'XP`;
    }
    if (actionType.includes('streak')) {
      return `Maintenez votre série quotidienne pour des bonus XP`;
    }
    if (sourceType === 'profile') {
      return `Améliorez votre profil pour gagner de l'expérience`;
    }
    return `Complétez cette action pour gagner de l'XP`;
  }

  private static getDynamicIcon(sourceType: string): string {
    const iconMap: Record<string, string> = {
      'lesson': 'BookOpen',
      'course': 'GraduationCap', 
      'quiz': 'Trophy',
      'profile': 'User',
      'streak': 'Calendar',
      'module': 'Layers',
      'achievement': 'Award',
      'engagement': 'Zap',
      // Achievement categories
      'level': 'TrendingUp',
      'xp': 'Star',
      'special': 'Shield'
    };
    
    return iconMap[sourceType] || 'Star';
  }

  private static getDynamicActionText(sourceType: string): string {
    const actionMap: Record<string, string> = {
      'lesson': 'Voir les leçons',
      'course': 'Voir les cours',
      'quiz': 'Faire un quiz',
      'profile': 'Aller au profil',
      'streak': 'Continuer',
      'module': 'Voir les modules',
      'achievement': 'Voir achievements'
    };
    
    return actionMap[sourceType] || 'Commencer';
  }

  /**
   * Utilitaire pour formatter les sources pour l'affichage
   */
  static formatSourceDisplay = formatSourceDisplay;

  /**
   * ⚠️ LOGIQUE DE PERTE D'XP ROBUSTE
   * Gère la perte d'XP avec recalcul automatique du niveau
   */
  static async handleXPLoss(
    userId: string, 
    lossType: 'profile_incomplete' | 'achievement_revoked' | 'penalty',
    lossAmount: number,
    reason: string
  ): Promise<{
    success: boolean;
    previousXP: number;
    newXP: number;
    previousLevel: number;
    newLevel: number;
    achievementsRevoked: string[];
  }> {
    try {
      log.debug(`🔻 Processing XP loss for user ${userId}: -${lossAmount} XP (${lossType})`);

      // 1. Récupérer l'état actuel
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('xp, level')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        log.error('Error fetching user profile for XP loss:', profileError);
        throw new Error('User profile not found');
      }

      const previousXP = profile.xp || 0;
      const previousLevel = profile.level || 1;
      const newXP = Math.max(0, previousXP - lossAmount); // Ne peut pas descendre sous 0

      // 2. Calculer le nouveau niveau
      const { data: levelData, error: levelError } = await supabase
        .from('level_definitions')
        .select('level')
        .lte('xp_required', newXP)
        .order('level', { ascending: false })
        .limit(1)
        .single();
      
      const newLevel = levelData?.level || 1;

      // 3. Créer l'événement de perte XP
      const { error: xpEventError } = await supabase
        .from('xp_events')
        .insert({
          user_id: userId,
          source_type: 'system',
          action_type: 'xp_loss',
          xp_delta: -lossAmount,
          xp_before: previousXP,
          xp_after: newXP,
          level_before: previousLevel,
          level_after: newLevel,
          metadata: {
            source: 'system:xp_loss',
            loss_type: lossType,
            reason,
            automatic_recalculation: true
          }
        });

      if (xpEventError) {
        log.error('Error creating XP loss event:', xpEventError);
        throw xpEventError;
      }

      // 4. Révoquer les achievements devenus invalides
      const achievementsRevoked: string[] = [];
      
      if (lossType === 'profile_incomplete') {
        // Supprimer l'achievement "Profil complet" s'il existe
        const { data: deletedAchievements, error: deleteError } = await supabase
          .from('user_achievements')
          .delete()
          .eq('user_id', userId)
          .eq('achievement_type', 'profile_complete')
          .select('achievement_name');

        if (deletedAchievements && deletedAchievements.length > 0) {
          achievementsRevoked.push(...deletedAchievements.map(a => a.achievement_name));
        }
      }

      // TODO: Ajouter d'autres logiques de révocation d'achievements si nécessaire

      // 5. Mettre à jour le profil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          xp: newXP,
          level: newLevel,
          last_xp_event_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        log.error('Error updating profile after XP loss:', updateError);
        throw updateError;
      }

      log.info(`✅ XP loss processed: ${previousXP} → ${newXP} XP, Level ${previousLevel} → ${newLevel}`);
      
      return {
        success: true,
        previousXP,
        newXP,
        previousLevel,
        newLevel,
        achievementsRevoked
      };

    } catch (error) {
      log.error('Error in handleXPLoss:', error);
      return {
        success: false,
        previousXP: 0,
        newXP: 0,
        previousLevel: 1,
        newLevel: 1,
        achievementsRevoked: []
      };
    }
  }

  /**
   * 🔄 RECALCUL AUTOMATIQUE NIVEAU
   * Recalcule le niveau correct basé sur l'XP actuel
   */
  static async recalculateUserLevel(userId: string): Promise<boolean> {
    try {
      // Récupérer l'XP actuel
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('xp, level')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        log.error('Error fetching profile for level recalculation:', profileError);
        return false;
      }

      const currentXP = profile.xp || 0;
      const currentLevel = profile.level || 1;

      // Calculer le niveau correct
      const { data: correctLevelData, error: levelError } = await supabase
        .from('level_definitions')
        .select('level')
        .lte('xp_required', currentXP)
        .order('level', { ascending: false })
        .limit(1)
        .single();
      
      const correctLevel = correctLevelData?.level || 1;

      // Mettre à jour si différent
      if (correctLevel !== currentLevel) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            level: correctLevel,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (updateError) {
          log.error('Error updating level:', updateError);
          return false;
        }

        log.info(`📈 Level recalculated: ${currentLevel} → ${correctLevel} (${currentXP} XP)`);
      }

      return true;

    } catch (error) {
      log.error('Error in recalculateUserLevel:', error);
      return false;
    }
  }
}