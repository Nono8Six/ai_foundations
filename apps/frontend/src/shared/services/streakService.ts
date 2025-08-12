/**
 * STREAK SERVICE - Gestion des connexions quotidiennes
 * ===================================================
 * Service pour tracker les connexions quotidiennes et mettre à jour les streaks
 */

import { supabase } from '@core/supabase/client';
import { log } from '@libs/logger';

export interface StreakInfo {
  current_streak: number;
  last_completed_at: string | null;
  is_streak_maintained: boolean;
  days_since_last_activity: number;
}

export class StreakService {
  /**
   * Met à jour le streak d'un utilisateur lors d'une connexion
   */
  static async updateUserStreak(userId: string): Promise<StreakInfo | null> {
    try {
      log.debug('🔥 Updating user streak for:', userId);

      // Récupérer les données actuelles de l'utilisateur
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('current_streak, last_completed_at')
        .eq('id', userId)
        .single();

      if (profileError) {
        log.error('Error fetching user profile for streak:', profileError);
        return null;
      }

      const now = new Date();
      const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const lastCompletedAt = profile.last_completed_at;
      let newStreak = profile.current_streak || 0;
      let shouldUpdate = false;

      // Si pas de dernière activité, c'est le premier jour
      if (!lastCompletedAt) {
        newStreak = 1;
        shouldUpdate = true;
        log.debug('🎉 First day streak for user:', userId);
      } else {
        const lastActivityDate = new Date(lastCompletedAt).toISOString().split('T')[0];
        const daysDiff = this.getDaysDifference(lastActivityDate, today);

        if (daysDiff === 0) {
          // Même jour, pas de mise à jour nécessaire
          log.debug('⏸️ Same day activity, no streak update needed');
        } else if (daysDiff === 1) {
          // Jour consécutif, augmenter le streak
          newStreak = newStreak + 1;
          shouldUpdate = true;
          log.debug('🔥 Streak continued! New streak:', newStreak);
        } else {
          // Plus d'un jour, reset du streak
          newStreak = 1;
          shouldUpdate = true;
          log.debug('💔 Streak broken, reset to 1. Days missed:', daysDiff - 1);
        }
      }

      // Mettre à jour la base de données si nécessaire
      if (shouldUpdate) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            current_streak: newStreak,
            last_completed_at: now.toISOString()
          })
          .eq('id', userId);

        if (updateError) {
          log.error('Error updating user streak:', updateError);
          return null;
        }

        // Déclencher des événements XP si nécessaire
        await this.triggerStreakXP(userId, newStreak);
      }

      const daysSinceLastActivity = lastCompletedAt 
        ? this.getDaysDifference(new Date(lastCompletedAt).toISOString().split('T')[0], today)
        : 0;

      return {
        current_streak: newStreak,
        last_completed_at: shouldUpdate ? now.toISOString() : lastCompletedAt,
        is_streak_maintained: daysDiff <= 1,
        days_since_last_activity: daysSinceLastActivity
      };

    } catch (error) {
      log.error('Error in updateUserStreak:', error);
      return null;
    }
  }

  /**
   * Déclenche les événements XP liés aux streaks
   */
  private static async triggerStreakXP(userId: string, newStreak: number): Promise<void> {
    try {
      // Événement quotidien (chaque jour)
      await this.addXPEvent(userId, 'streak', 'daily_milestone', 5, {
        streak_day: newStreak,
        milestone_type: 'daily'
      });

      // Événement spécial à 7 jours
      if (newStreak === 7) {
        await this.addXPEvent(userId, 'streak', '7day_milestone', 30, {
          streak_day: newStreak,
          milestone_type: '7day_special',
          achievement: 'Série de 7 jours'
        });
      }

      // Événement hebdomadaire (multiples de 7)
      if (newStreak > 0 && newStreak % 7 === 0) {
        await this.addXPEvent(userId, 'streak', 'weekly_milestone', 25, {
          streak_day: newStreak,
          milestone_type: 'weekly',
          week_number: Math.floor(newStreak / 7)
        });
      }

    } catch (error) {
      log.error('Error triggering streak XP:', error);
    }
  }

  /**
   * Ajoute un événement XP
   */
  private static async addXPEvent(
    userId: string, 
    sourceType: string, 
    actionType: string, 
    xpValue: number,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      // Récupérer l'XP actuel depuis profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp, level')
        .eq('id', userId)
        .single();

      const currentXP = profile?.xp || 0;
      const currentLevel = profile?.level || 1;
      const newXP = currentXP + xpValue;

      // Calculer le nouveau niveau depuis level_definitions
      const { data: levelData } = await supabase
        .from('level_definitions')
        .select('level')
        .lte('xp_required', newXP)
        .order('level', { ascending: false })
        .limit(1)
        .single();
      
      const newLevel = levelData?.level || 1;

      // Ajouter l'événement XP
      const { error: xpEventError } = await supabase
        .from('xp_events')
        .insert({
          user_id: userId,
          source_type: sourceType,
          action_type: actionType,
          xp_delta: xpValue,
          xp_before: currentXP,
          xp_after: newXP,
          level_before: currentLevel,
          level_after: newLevel,
          metadata: {
            source: `${sourceType}:${actionType}`,
            ...metadata
          }
        });

      if (xpEventError) {
        log.error('Error adding XP event:', xpEventError);
        return;
      }

      // Mettre à jour le profil avec le nouveau XP et niveau
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          xp: newXP,
          level: newLevel,
          last_xp_event_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (profileUpdateError) {
        log.error('Error updating profile XP:', profileUpdateError);
      } else {
        log.debug(`💎 Added XP event: +${xpValue} XP for ${sourceType}:${actionType} (Total: ${newXP} XP, Level: ${newLevel})`);
      }

    } catch (error) {
      log.error('Error in addXPEvent:', error);
    }
  }

  /**
   * Calcule la différence en jours entre deux dates
   */
  private static getDaysDifference(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const timeDiff = d2.getTime() - d1.getTime();
    return Math.floor(timeDiff / (1000 * 3600 * 24));
  }

  /**
   * Récupère les informations de streak d'un utilisateur
   */
  static async getStreakInfo(userId: string): Promise<StreakInfo | null> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_streak, last_completed_at')
        .eq('id', userId)
        .single();

      if (!profile) return null;

      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const lastCompletedAt = profile.last_completed_at;
      
      const daysSinceLastActivity = lastCompletedAt 
        ? this.getDaysDifference(new Date(lastCompletedAt).toISOString().split('T')[0], today)
        : 0;

      return {
        current_streak: profile.current_streak || 0,
        last_completed_at: lastCompletedAt,
        is_streak_maintained: daysSinceLastActivity <= 1,
        days_since_last_activity: daysSinceLastActivity
      };

    } catch (error) {
      log.error('Error getting streak info:', error);
      return null;
    }
  }
}