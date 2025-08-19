/**
 * XP Adapter - Interface unifiée pour les services XP
 * 
 * Fournit une API cohérente pour les composants UI en adaptant
 * les données XPRpc vers les formats attendus par l'interface.
 * Évite la duplication de code et centralise la logique d'adaptation.
 */

import { XPRpc, type XPSource, type LevelInfo as XPRpcLevelInfo } from './xp-rpc';

// Types d'interface UI standardisés
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
  category: 'action' | 'achievement';
  isUnlocked?: boolean;
  progress?: number;
}

export interface UILevelInfo {
  currentLevel: number;
  levelTitle: string;
  xpInCurrentLevel: number; // XP dans le niveau actuel (relatif)
  xpForNextLevel: number;   // XP manquant pour niveau suivant
  xpRequired: number;       // XP total requis pour niveau actuel
  xpRequiredNext: number;   // XP total requis pour niveau suivant
  totalXP: number;          // XP total cumulé de l'utilisateur
  progressPercent: number;
  badgeIcon?: string;
  badgeColor?: string;
  isMaxLevel: boolean;
}

// Mapping des icônes pour les types de sources XP
const SOURCE_ICON_MAP: Record<string, string> = {
  lesson: 'BookOpen',
  course: 'GraduationCap',
  quiz: 'HelpCircle',
  profile: 'User',
  module: 'Folder',
  engagement: 'Zap',
  p10_lesson: 'BookOpen',
  p10_quiz: 'HelpCircle',
  p10_profile: 'User',
  // Ajouter d'autres mappings au besoin
};

// Mapping des actions pour les textes de boutons
const ACTION_TEXT_MAP: Record<string, string> = {
  completion: 'Commencer',
  start: 'Démarrer',
  perfect_score: 'Exceller',
  attempt: 'Essayer',
  enrollment: 'S\'inscrire',
  milestone_25: 'Progresser',
  daily_login: 'Se connecter',
  session_30min: 'Étudier',
  video_watched: 'Regarder',
  // Ajouter d'autres mappings au besoin
};

/**
 * Adapte une XPSource (backend) vers XPOpportunity (UI)
 */
export const adaptXPSourceToOpportunity = (source: XPSource): XPOpportunity => {
  return {
    id: source.source_id,
    title: source.title,
    description: source.description,
    xpValue: source.xp_value,
    icon: SOURCE_ICON_MAP[source.source_type] || 'Star',
    actionText: ACTION_TEXT_MAP[source.action_type] || 'Découvrir',
    available: true,
    sourceType: source.source_type,
    actionType: source.action_type,
    isRepeatable: source.is_repeatable,
    cooldownMinutes: source.cooldown_minutes,
    maxPerDay: source.max_per_day,
    category: 'action'
  };
};

/**
 * Adapte les informations de niveau XPRpc vers le format UI
 */
export const adaptLevelInfo = (rpcLevelInfo: XPRpcLevelInfo, totalXP: number): UILevelInfo => {
  const xpInCurrentLevel = totalXP - rpcLevelInfo.xp_threshold;
  const xpForNextLevel = rpcLevelInfo.xp_to_next || 0;
  const nextThreshold = totalXP + xpForNextLevel; // Total XP required for next level
  const levelRange = nextThreshold - rpcLevelInfo.xp_threshold;
  const progressPercent = levelRange > 0 ? 
    Math.round((xpInCurrentLevel / levelRange) * 100) : 100;

  // Mapping des titres de niveau (peut être étendu)
  const levelTitles: Record<number, string> = {
    1: 'Apprenti Débutant',
    2: 'Novice Prometteur', 
    3: 'Étudiant Rare',
    4: 'Apprenant Épique',
    5: 'Expert Légendaire',
    6: 'Maître Mythique'
  };

  return {
    currentLevel: rpcLevelInfo.level,
    levelTitle: levelTitles[rpcLevelInfo.level] || `Niveau ${rpcLevelInfo.level}`,
    xpInCurrentLevel,
    xpForNextLevel,
    xpRequired: rpcLevelInfo.xp_threshold,
    xpRequiredNext: nextThreshold,
    totalXP,
    progressPercent,
    isMaxLevel: !rpcLevelInfo.xp_to_next
  };
};

/**
 * Service XP unifié - API simplifiée pour les composants UI
 */
export class XPAdapter {
  /**
   * Récupère les opportunités XP top 3 pour l'affichage
   */
  static async getTopXPOpportunities(userId?: string, limit: number = 3): Promise<XPOpportunity[]> {
    try {
      const sources = await XPRpc.getActiveXPSources();
      
      return sources
        .filter(source => ['lesson', 'course', 'quiz', 'profile', 'module', 'engagement'].includes(source.source_type))
        .map(adaptXPSourceToOpportunity)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching XP opportunities:', error);
      return [];
    }
  }

  /**
   * Récupère toutes les sources XP actives
   */
  static async getAllXPOpportunities(): Promise<XPOpportunity[]> {
    try {
      const sources = await XPRpc.getActiveXPSources();
      return sources.map(adaptXPSourceToOpportunity);
    } catch (error) {
      console.error('Error fetching all XP opportunities:', error);
      return [];
    }
  }

  /**
   * Calcule les informations de niveau pour un utilisateur
   */
  static async getLevelInfo(totalXP: number): Promise<UILevelInfo> {
    try {
      const rpcLevelInfo = await XPRpc.computeLevelInfo(totalXP);
      return adaptLevelInfo(rpcLevelInfo, totalXP);
    } catch (error) {
      console.error('Error computing level info:', error);
      // Fallback sécurisé
      return {
        currentLevel: 1,
        levelTitle: 'Apprenti Débutant',
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
   * Crédite de l'XP à un utilisateur (wrapper simplifié)
   */
  static async creditXP(params: {
    userId: string;
    sourceRef: string;
    xpDelta: number;
    idempotencyKey: string;
    referenceId?: string;
    metadata?: Record<string, any>;
  }) {
    return XPRpc.creditXp(params);
  }

  /**
   * Débloque un achievement (wrapper simplifié)
   */
  static async unlockAchievement(params: {
    userId: string;
    code: string;
    version: number;
    scope?: string;
    referenceId?: string;
  }) {
    return XPRpc.unlockAchievement(params);
  }
}

// Export des types pour usage externe
export type { XPSource } from './xp-rpc';

// Re-export de XPRpc pour accès direct si nécessaire
export { XPRpc };