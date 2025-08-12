import { supabase } from '@core/supabase/client';
import { log } from '@libs/logger';

/**
 * 🤖 SERVICE D'AUTO-VALIDATION DES ACHIEVEMENTS
 * 
 * Ce service vérifie automatiquement les conditions des achievements
 * et les débloque pour les utilisateurs éligibles.
 * 
 * ULTRATHINK++ : Architecture flexible pour tous types de conditions
 */

export interface AchievementCondition {
  achievement_key: string;
  title: string;
  description: string;
  condition_type: string;
  condition_params: Record<string, any>;
  xp_reward: number;
  is_active: boolean;
}

export interface UserStats {
  user_id: string;
  total_xp: number;
  current_level: number;
  current_streak: number;
  lessons_completed: number;
  courses_completed: number;
  perfect_scores: number;
  profile_completion_percent: number;
  last_login: string;
}

export class XPAutoValidator {
  /**
   * 🔄 VALIDATION AUTOMATIQUE POUR TOUS LES UTILISATEURS
   * Lance la validation pour tous les utilisateurs actifs
   */
  static async validateAllUsers(): Promise<{
    totalUsers: number;
    achievementsUnlocked: number;
    errors: string[];
  }> {
    try {
      log.info('🤖 Starting auto-validation for all users...');

      // 1. Récupérer tous les utilisateurs actifs
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('is_active', true);

      if (usersError) throw usersError;

      let totalUnlocked = 0;
      const errors: string[] = [];

      // 2. Valider chaque utilisateur
      for (const user of users || []) {
        try {
          const result = await this.validateUserAchievements(user.id);
          totalUnlocked += result.newAchievementsUnlocked;
        } catch (error) {
          errors.push(`Error validating user ${user.email}: ${error}`);
          log.error(`Error validating achievements for user ${user.id}:`, error);
        }
      }

      log.info(`✅ Auto-validation complete: ${totalUnlocked} achievements unlocked for ${users?.length || 0} users`);

      return {
        totalUsers: users?.length || 0,
        achievementsUnlocked: totalUnlocked,
        errors
      };

    } catch (error) {
      log.error('Error in validateAllUsers:', error);
      throw error;
    }
  }

  /**
   * 🎯 VALIDATION POUR UN UTILISATEUR SPÉCIFIQUE
   * Vérifie et débloque les achievements pour un utilisateur
   */
  static async validateUserAchievements(userId: string): Promise<{
    newAchievementsUnlocked: number;
    achievementsUnlocked: string[];
  }> {
    try {
      // 1. Récupérer les achievements actifs non encore débloqués par l'utilisateur
      const { data: achievements, error: achievementsError } = await supabase
        .from('achievement_definitions')
        .select('*')
        .eq('is_active', true);

      if (achievementsError) throw achievementsError;

      // 2. Récupérer les achievements déjà débloqués par l'utilisateur
      const { data: unlockedAchievements, error: unlockedError } = await supabase
        .from('user_achievements')
        .select('achievement_type')
        .eq('user_id', userId);

      if (unlockedError) throw unlockedError;

      const alreadyUnlocked = new Set(
        unlockedAchievements?.map(ua => ua.achievement_type) || []
      );

      // 3. Filtrer les achievements non débloqués
      const pendingAchievements = achievements?.filter(
        achievement => !alreadyUnlocked.has(achievement.achievement_key)
      ) || [];

      if (pendingAchievements.length === 0) {
        return { newAchievementsUnlocked: 0, achievementsUnlocked: [] };
      }

      // 4. Récupérer les stats utilisateur
      const userStats = await this.getUserStats(userId);
      if (!userStats) {
        throw new Error('User stats not found');
      }

      // 5. Vérifier chaque achievement en attente
      const newlyUnlocked: string[] = [];

      for (const achievement of pendingAchievements) {
        const isEligible = await this.checkAchievementCondition(
          achievement,
          userStats
        );

        if (isEligible) {
          await this.unlockAchievement(userId, achievement);
          newlyUnlocked.push(achievement.achievement_key);
        }
      }

      log.info(`🎉 User ${userId}: ${newlyUnlocked.length} new achievements unlocked`);

      return {
        newAchievementsUnlocked: newlyUnlocked.length,
        achievementsUnlocked: newlyUnlocked
      };

    } catch (error) {
      log.error(`Error validating achievements for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * 📊 RÉCUPÉRATION DES STATISTIQUES UTILISATEUR
   * Collecte toutes les données nécessaires pour la validation
   */
  private static async getUserStats(userId: string): Promise<UserStats | null> {
    try {
      // Stats depuis profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('xp, level, current_streak, last_completed_at')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Stats depuis xp_events pour les compteurs
      const { data: xpEvents, error: xpError } = await supabase
        .from('xp_events')
        .select('source_type, action_type, metadata')
        .eq('user_id', userId);

      if (xpError) throw xpError;

      // Calculer les compteurs depuis les événements XP
      let lessonsCompleted = 0;
      let coursesCompleted = 0;
      let perfectScores = 0;

      xpEvents?.forEach(event => {
        if (event.source_type === 'lesson' && event.action_type === 'completion') {
          lessonsCompleted++;
        }
        if (event.source_type === 'course' && event.action_type === 'completion') {
          coursesCompleted++;
        }
        if (event.action_type === 'perfect' || event.action_type === 'perfect_score') {
          perfectScores++;
        }
      });

      // Calculer completeness du profil (simplifié)
      const profileCompletion = this.calculateProfileCompletion(profile);

      return {
        user_id: userId,
        total_xp: profile.xp || 0,
        current_level: profile.level || 1,
        current_streak: profile.current_streak || 0,
        lessons_completed: lessonsCompleted,
        courses_completed: coursesCompleted,
        perfect_scores: perfectScores,
        profile_completion_percent: profileCompletion,
        last_login: profile.last_completed_at || new Date().toISOString()
      };

    } catch (error) {
      log.error('Error getting user stats:', error);
      return null;
    }
  }

  /**
   * 🧮 VÉRIFICATION DES CONDITIONS D'ACHIEVEMENT
   * Logique flexible pour tous types de conditions
   */
  private static async checkAchievementCondition(
    achievement: AchievementCondition,
    userStats: UserStats
  ): Promise<boolean> {
    const { condition_type, condition_params } = achievement;

    switch (condition_type) {
      case 'xp_threshold':
        return userStats.total_xp >= (condition_params.threshold || 100);

      case 'level_reached':
        return userStats.current_level >= (condition_params.level || 2);

      case 'streak_milestone':
        return userStats.current_streak >= (condition_params.days || 7);

      case 'course_completion_count':
        return userStats.courses_completed >= (condition_params.count || 1);

      case 'lesson_completion_count':
        return userStats.lessons_completed >= (condition_params.count || 1);

      case 'perfect_scores_count':
        return userStats.perfect_scores >= (condition_params.count || 1);

      case 'profile_completion':
        return userStats.profile_completion_percent >= 100;

      case 'first_action':
        // Vérifier si l'utilisateur a effectué cette action au moins une fois
        return await this.checkFirstAction(userStats.user_id, condition_params.action_type);

      default:
        log.warn(`Unknown achievement condition type: ${condition_type}`);
        return false;
    }
  }

  /**
   * 🔍 VÉRIFICATION PREMIÈRE ACTION
   * Vérifie si l'utilisateur a effectué une action spécifique
   */
  private static async checkFirstAction(userId: string, actionType: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('xp_events')
        .select('id')
        .eq('user_id', userId)
        .eq('action_type', actionType)
        .limit(1);

      if (error) throw error;
      return (data?.length || 0) > 0;
    } catch (error) {
      log.error('Error checking first action:', error);
      return false;
    }
  }

  /**
   * 🏆 DÉBLOQUAGE D'ACHIEVEMENT
   * Débloque un achievement et ajoute l'XP reward
   */
  private static async unlockAchievement(
    userId: string,
    achievement: AchievementCondition
  ): Promise<void> {
    try {
      // 1. Créer l'entrée user_achievements
      const { error: unlockError } = await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_type: achievement.achievement_key,
          achievement_name: achievement.title,
          xp_reward: achievement.xp_reward,
          unlocked_at: new Date().toISOString(),
          details: {
            condition_type: achievement.condition_type,
            condition_params: achievement.condition_params,
            auto_unlocked: true
          }
        });

      if (unlockError) throw unlockError;

      // 2. Créer l'événement XP pour le reward
      const { error: xpError } = await supabase
        .from('xp_events')
        .insert({
          user_id: userId,
          source_type: 'achievement',
          action_type: 'unlocked',
          xp_delta: achievement.xp_reward,
          xp_before: 0, // À calculer si nécessaire
          xp_after: 0,  // À calculer si nécessaire
          metadata: {
            achievement_key: achievement.achievement_key,
            achievement_title: achievement.title,
            auto_unlocked: true,
            source: 'auto_validator'
          }
        });

      if (xpError) throw xpError;

      // 3. Mettre à jour l'XP total de l'utilisateur
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          xp: supabase.raw(`xp + ${achievement.xp_reward}`),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      log.info(`🎉 Achievement unlocked for user ${userId}: ${achievement.title} (+${achievement.xp_reward} XP)`);

    } catch (error) {
      log.error('Error unlocking achievement:', error);
      throw error;
    }
  }

  /**
   * 📝 CALCUL COMPLETION PROFIL (simplifié)
   */
  private static calculateProfileCompletion(profile: any): number {
    // Logique simplifiée - à adapter selon les champs du profil
    let completedFields = 0;
    const totalFields = 5; // Exemple: nom, email, bio, avatar, location

    if (profile.display_name) completedFields++;
    if (profile.bio) completedFields++;
    if (profile.avatar_url) completedFields++;
    if (profile.location) completedFields++;
    if (profile.website) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  }

  /**
   * 🔥 VALIDATION EN TEMPS RÉEL
   * À appeler après chaque action utilisateur importante
   */
  static async validateUserOnAction(
    userId: string,
    actionType: string,
    sourceType: string
  ): Promise<void> {
    try {
      // Validation rapide en arrière-plan
      setTimeout(async () => {
        await this.validateUserAchievements(userId);
      }, 1000); // Délai de 1 seconde pour éviter la surcharge
    } catch (error) {
      log.error('Error in real-time validation:', error);
    }
  }
}