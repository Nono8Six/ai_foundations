/**
 * Achievement Service - Gestion automatique des achievements
 * 
 * Système pour :
 * - Vérifier les conditions d'achievement
 * - Débloquer automatiquement les achievements
 * - Synchroniser XP lors des déverrouillages
 * - Maintenir cohérence entre toutes les tables
 */

import { supabase } from '@core/supabase/client';
import type { Database } from '@types/database.types';

export interface AchievementDefinition {
  id: string;
  achievement_key: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  xp_reward: number;
  condition_type: string;
  condition_params: {
    field: string;
    value: number;
  };
  is_repeatable: boolean;
  is_active: boolean;
}

export interface UserStats {
  total_xp: number;
  current_level: number;
  current_streak: number;
  profile_completion: number;
  member_rank: number;
}

/**
 * Service principal pour les achievements
 */
export class AchievementService {
  /**
   * Vérifie et débloque automatiquement les achievements pour un utilisateur
   */
  static async checkAndUnlockAchievements(userId: string): Promise<{
    newAchievements: string[];
    totalXpEarned: number;
  }> {
    try {
      // 1. Récupérer toutes les définitions d'achievements actives
      const { data: definitions, error: defError } = await supabase
        .from('achievement_definitions')
        .select('*')
        .eq('is_active', true);

      if (defError) throw defError;

      // 2. Récupérer les achievements déjà débloqués
      const { data: unlockedAchievements, error: unlockedError } = await supabase
        .from('user_achievements')
        .select('achievement_type')
        .eq('user_id', userId);

      if (unlockedError) throw unlockedError;

      const alreadyUnlocked = new Set(
        unlockedAchievements?.map(a => a.achievement_type) || []
      );

      // 3. Récupérer les stats actuelles de l'utilisateur
      const userStats = await this.getUserStats(userId);

      // 4. Vérifier chaque achievement
      const newUnlocks: string[] = [];
      let totalXpEarned = 0;

      for (const definition of definitions || []) {
        if (alreadyUnlocked.has(definition.achievement_key)) {
          continue; // Déjà débloqué
        }

        if (this.checkAchievementCondition(definition, userStats)) {
          // Conditions remplies - débloquer l'achievement
          const success = await this.unlockAchievement(userId, definition, userStats);
          if (success) {
            newUnlocks.push(definition.achievement_key);
            totalXpEarned += definition.xp_reward;
          }
        }
      }

      return {
        newAchievements: newUnlocks,
        totalXpEarned
      };

    } catch (error) {
      console.error('Error in checkAndUnlockAchievements:', error);
      return { newAchievements: [], totalXpEarned: 0 };
    }
  }

  /**
   * Récupère les statistiques actuelles de l'utilisateur
   */
  private static async getUserStats(userId: string): Promise<UserStats> {
    try {
      // Récupérer le profil consolidé avec XP
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('current_streak, full_name, phone, profession, company, avatar_url, created_at, xp, level')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Calculer la complétion du profil
      const fields = ['full_name', 'phone', 'profession', 'company', 'avatar_url'];
      const completedFields = fields.filter(field => profile[field as keyof typeof profile]);
      const profileCompletion = Math.round((completedFields.length / fields.length) * 100);

      // Calculer le rang du membre (simple: basé sur la date de création)
      const { data: memberCountData } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .lte('created_at', profile.created_at);

      const memberRank = memberCountData?.length || 1;

      return {
        total_xp: profile?.xp || 0,
        current_level: profile?.level || 1,
        current_streak: profile?.current_streak || 0,
        profile_completion: profileCompletion,
        member_rank: memberRank
      };

    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        total_xp: 0,
        current_level: 1,
        current_streak: 0,
        profile_completion: 0,
        member_rank: 999
      };
    }
  }

  /**
   * Vérifie si les conditions d'un achievement sont remplies
   */
  private static checkAchievementCondition(
    definition: AchievementDefinition,
    userStats: UserStats
  ): boolean {
    const { condition_type, condition_params } = definition;
    
    if (condition_type !== 'threshold') {
      console.warn(`Unsupported condition type: ${condition_type}`);
      return false;
    }

    const { field, value } = condition_params;
    const currentValue = userStats[field as keyof UserStats] || 0;

    // Pour member_rank, condition inversée (rang <= valeur)
    if (field === 'member_rank') {
      return currentValue <= value;
    }

    // Pour les autres, condition normale (valeur >= seuil)
    return currentValue >= value;
  }

  /**
   * Débloque un achievement et met à jour toutes les tables
   */
  private static async unlockAchievement(
    userId: string,
    definition: AchievementDefinition,
    userStats: UserStats
  ): Promise<boolean> {
    try {
      const now = new Date().toISOString();
      
      // Transaction pour garantir la cohérence
      const { error } = await supabase.rpc('unlock_achievement', {
        p_user_id: userId,
        p_achievement_key: definition.achievement_key,
        p_achievement_name: definition.title,
        p_xp_reward: definition.xp_reward,
        p_current_stats: userStats
      });

      if (error) {
        // Si la fonction RPC n'existe pas, faire manuellement
        console.warn('RPC function not available, doing manual unlock');
        return await this.manualUnlockAchievement(userId, definition, userStats);
      }

      return true;

    } catch (error) {
      console.error('Error unlocking achievement:', error);
      return false;
    }
  }

  /**
   * Déverrouillage manuel d'achievement (fallback)
   */
  private static async manualUnlockAchievement(
    userId: string,
    definition: AchievementDefinition,
    userStats: UserStats
  ): Promise<boolean> {
    try {
      const now = new Date().toISOString();

      // 1. Insérer dans user_achievements
      const { error: achievementError } = await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_type: definition.achievement_key,
          achievement_name: definition.title,
          xp_reward: definition.xp_reward,
          unlocked_at: now,
          details: {
            description: definition.description,
            unlocked_at: now,
            auto_unlocked: true,
            condition_met: userStats[definition.condition_params.field as keyof UserStats],
            condition_required: definition.condition_params.value
          }
        });

      if (achievementError) throw achievementError;

      // 2. Insérer l'événement XP
      const { error: xpEventError } = await supabase
        .from('xp_events')
        .insert({
          user_id: userId,
          source_type: 'achievement',
          action_type: 'unlock',
          xp_delta: definition.xp_reward,
          xp_before: userStats.total_xp,
          xp_after: userStats.total_xp + definition.xp_reward,
          metadata: {
            source: 'achievement:unlock',
            achievement_key: definition.achievement_key,
            achievement_name: definition.title
          }
        });

      if (xpEventError) throw xpEventError;

      // 3. Mettre à jour profiles avec XP et niveau calculé dynamiquement
      const newTotalXp = userStats.total_xp + definition.xp_reward;
      
      // Calculer nouveau niveau depuis level_definitions
      const { data: levelData, error: levelError } = await supabase
        .from('level_definitions')
        .select('level')
        .lte('xp_required', newTotalXp)
        .order('level', { ascending: false })
        .limit(1)
        .single();
      
      const newLevel = levelData?.level || 1;
      
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          xp: newTotalXp,
          level: newLevel,
          last_xp_event_at: now,
          updated_at: now
        })
        .eq('id', userId);

      if (profileUpdateError) throw profileUpdateError;

      return true;

    } catch (error) {
      console.error('Error in manual achievement unlock:', error);
      return false;
    }
  }

  /**
   * Utilitaire pour déclencher la vérification des achievements après une action
   */
  static async triggerAchievementCheck(userId: string): Promise<void> {
    // Vérification asynchrone pour ne pas bloquer l'UI
    setTimeout(async () => {
      try {
        await this.checkAndUnlockAchievements(userId);
      } catch (error) {
        console.error('Background achievement check failed:', error);
      }
    }, 1000);
  }
}