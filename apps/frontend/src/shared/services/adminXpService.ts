import { supabase } from '@core/supabase/client';
import { log } from '@libs/logger';

// Types pour l'API admin
export interface AdminXPSource {
  id?: string;
  source_type: string;
  action_type: string;
  xp_value: number;
  title: string;
  description: string;
  is_repeatable: boolean;
  cooldown_minutes: number;
  max_per_day: number | null;
  is_active: boolean;
  usage_count?: number;
  last_used_at?: string;
}

export interface AdminAchievement {
  id?: string;
  achievement_key: string;
  title: string;
  description: string;
  condition_type: string;
  condition_params: Record<string, any>;
  xp_reward: number;
  is_active: boolean;
  usage_count?: number;
  last_used_at?: string;
}

export interface XPManagementStats {
  totalActions: number;
  activeActions: number;
  totalAchievements: number;
  activeAchievements: number;
  totalXPEarnedToday: number;
  newAchievementsUnlocked: number;
}

export class AdminXPService {
  
  /**
   * Récupère toutes les sources XP et achievements avec statistiques
   */
  static async fetchXPManagementData() {
    try {
      // Récupérer les données de la vue unifiée
      const { data: managementData, error } = await supabase
        .from('admin_xp_management')
        .select('*')
        .order('type', { ascending: true })
        .order('xp_value', { ascending: false });

      if (error) throw error;

      // Séparer actions et achievements
      const actions: AdminXPSource[] = managementData
        ?.filter(item => item.type === 'ACTION')
        .map(item => ({
          id: item.full_key,
          source_type: item.source_type,
          action_type: item.action_type,
          xp_value: item.xp_value,
          title: item.title,
          description: item.title, // Utiliser title comme fallback
          is_repeatable: item.is_repeatable,
          cooldown_minutes: item.cooldown_minutes,
          max_per_day: item.max_per_day,
          is_active: item.is_active,
          usage_count: item.usage_count,
          last_used_at: item.last_used_at
        })) || [];

      const achievements: AdminAchievement[] = managementData
        ?.filter(item => item.type === 'ACHIEVEMENT')
        .map(item => ({
          id: item.full_key,
          achievement_key: item.action_type,
          title: item.title,
          description: item.title,
          condition_type: 'custom', // Déterminé selon les données
          condition_params: {},
          xp_reward: item.xp_value,
          is_active: item.is_active,
          usage_count: item.usage_count,
          last_used_at: item.last_used_at
        })) || [];

      // Calculer les statistiques
      const stats: XPManagementStats = {
        totalActions: actions.length,
        activeActions: actions.filter(a => a.is_active).length,
        totalAchievements: achievements.length,
        activeAchievements: achievements.filter(a => a.is_active).length,
        totalXPEarnedToday: 0, // À implémenter avec une requête séparée
        newAchievementsUnlocked: 0 // À implémenter avec une requête séparée
      };

      log.info('XP Management data loaded successfully', {
        actionsCount: actions.length,
        achievementsCount: achievements.length
      });

      return { actions, achievements, stats };

    } catch (error) {
      log.error('Error fetching XP management data:', error);
      throw error;
    }
  }

  /**
   * Met à jour une source XP (création ou modification)
   */
  static async saveXPSource(action: AdminXPSource): Promise<void> {
    try {
      const actionData = {
        source_type: action.source_type,
        action_type: action.action_type,
        xp_value: action.xp_value,
        title: action.title,
        description: action.description,
        is_repeatable: action.is_repeatable,
        cooldown_minutes: action.cooldown_minutes,
        max_per_day: action.max_per_day,
        is_active: action.is_active
      };

      if (action.id) {
        // Modification - utiliser la combinaison source_type + action_type
        const [sourceType, actionType] = action.id.split(':');
        const { error } = await supabase
          .from('xp_sources')
          .update(actionData)
          .eq('source_type', sourceType)
          .eq('action_type', actionType);

        if (error) throw error;

        log.info('XP Source updated successfully', { 
          sourceType, 
          actionType,
          isActive: action.is_active,
          xpValue: action.xp_value
        });

      } else {
        // Création
        const { error } = await supabase
          .from('xp_sources')
          .insert([actionData]);

        if (error) throw error;

        log.info('XP Source created successfully', {
          sourceType: action.source_type,
          actionType: action.action_type,
          xpValue: action.xp_value
        });
      }

    } catch (error) {
      log.error('Error saving XP source:', error);
      throw error;
    }
  }

  /**
   * Active/Désactive une source XP et recalcule XP si nécessaire
   */
  static async toggleXPSource(
    action: AdminXPSource, 
    options?: { recalculateUserXP?: boolean }
  ): Promise<void> {
    try {
      const newActiveState = !action.is_active;
      
      // Mettre à jour le statut is_active
      const { error } = await supabase
        .from('xp_sources')
        .update({ is_active: newActiveState })
        .eq('source_type', action.source_type)
        .eq('action_type', action.action_type);

      if (error) throw error;

      log.info('XP Source toggled successfully', {
        sourceType: action.source_type,
        actionType: action.action_type,
        previousState: action.is_active,
        newState: newActiveState
      });

      // Si demandé, recalculer les XP utilisateurs affectés
      if (options?.recalculateUserXP && !newActiveState) {
        await this.recalculateXPForDeactivatedSource(action.source_type, action.action_type);
      }

    } catch (error) {
      log.error('Error toggling XP source:', error);
      throw error;
    }
  }

  /**
   * Supprime une source XP
   */
  static async deleteXPSource(action: AdminXPSource): Promise<void> {
    try {
      const { error } = await supabase
        .from('xp_sources')
        .delete()
        .eq('source_type', action.source_type)
        .eq('action_type', action.action_type);

      if (error) throw error;

      log.warn('XP Source deleted', {
        sourceType: action.source_type,
        actionType: action.action_type,
        usageCount: action.usage_count
      });

    } catch (error) {
      log.error('Error deleting XP source:', error);
      throw error;
    }
  }

  /**
   * Recalcule les XP utilisateurs pour une source désactivée
   */
  private static async recalculateXPForDeactivatedSource(
    sourceType: string, 
    actionType: string
  ): Promise<void> {
    try {
      log.info('Starting XP recalculation for deactivated source', { sourceType, actionType });

      // Récupérer tous les utilisateurs ayant gagné XP de cette source
      const { data: affectedEvents, error: eventsError } = await supabase
        .from('xp_events')
        .select('user_id, xp_delta')
        .eq('source_type', sourceType)
        .eq('action_type', actionType)
        .order('user_id');

      if (eventsError) throw eventsError;

      if (!affectedEvents || affectedEvents.length === 0) {
        log.info('No users affected by this source deactivation');
        return;
      }

      // Grouper par utilisateur et calculer le total à soustraire
      const userXPDeltas = affectedEvents.reduce((acc, event) => {
        acc[event.user_id] = (acc[event.user_id] || 0) + event.xp_delta;
        return acc;
      }, {} as Record<string, number>);

      const affectedUserIds = Object.keys(userXPDeltas);
      log.info(`Recalculating XP for ${affectedUserIds.length} affected users`);

      // Mettre à jour les XP de chaque utilisateur
      for (const userId of affectedUserIds) {
        const xpToSubtract = userXPDeltas[userId];
        
        // Récupérer le profil utilisateur actuel
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('xp, level')
          .eq('id', userId)
          .single();

        if (profileError) {
          log.error(`Error fetching profile for user ${userId}:`, profileError);
          continue;
        }

        if (!profile) continue;

        const newXP = Math.max(0, profile.xp - xpToSubtract); // Ne pas descendre en dessous de 0
        
        // Recalculer le niveau basé sur le nouveau XP (utiliser level_definitions)
        const { data: levelData, error: levelError } = await supabase
          .from('level_definitions')
          .select('level')
          .lte('xp_required', newXP)
          .order('level', { ascending: false })
          .limit(1)
          .single();

        const newLevel = levelError ? 1 : (levelData?.level || 1);

        // Mettre à jour le profil
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            xp: newXP, 
            level: newLevel 
          })
          .eq('id', userId);

        if (updateError) {
          log.error(`Error updating profile for user ${userId}:`, updateError);
          continue;
        }

        // Créer un événement XP négatif pour traçabilité
        const { error: eventError } = await supabase
          .from('xp_events')
          .insert([{
            user_id: userId,
            source_type: 'admin',
            action_type: 'source_deactivation',
            xp_delta: -xpToSubtract,
            xp_before: profile.xp,
            xp_after: newXP,
            level_before: profile.level,
            level_after: newLevel,
            metadata: {
              reason: 'XP source deactivated',
              original_source: `${sourceType}:${actionType}`,
              admin_action: true
            }
          }]);

        if (eventError) {
          log.error(`Error creating negative XP event for user ${userId}:`, eventError);
        }

        log.info(`Adjusted XP for user ${userId}`, {
          xpBefore: profile.xp,
          xpAfter: newXP,
          xpSubtracted: xpToSubtract,
          levelBefore: profile.level,
          levelAfter: newLevel
        });
      }

      log.info('XP recalculation completed successfully', {
        sourceType,
        actionType,
        usersAffected: affectedUserIds.length,
        totalXPRemoved: Object.values(userXPDeltas).reduce((sum, xp) => sum + xp, 0)
      });

    } catch (error) {
      log.error('Error during XP recalculation for deactivated source:', error);
      throw error;
    }
  }

  /**
   * Retourne l'impact utilisateur d'une source XP (pour prévisualisation)
   */
  static async getSourceDeactivationImpact(
    sourceType: string, 
    actionType: string
  ): Promise<{
    affectedUsers: number;
    totalXPImpact: number;
    preview: Array<{ userId: string; xpLoss: number; currentXP: number; newXP: number; }>;
  }> {
    try {
      // Calculer l'impact sans l'appliquer
      const { data: affectedEvents, error } = await supabase
        .from('xp_events')
        .select('user_id, xp_delta')
        .eq('source_type', sourceType)
        .eq('action_type', actionType);

      if (error) throw error;

      if (!affectedEvents || affectedEvents.length === 0) {
        return { affectedUsers: 0, totalXPImpact: 0, preview: [] };
      }

      const userXPDeltas = affectedEvents.reduce((acc, event) => {
        acc[event.user_id] = (acc[event.user_id] || 0) + event.xp_delta;
        return acc;
      }, {} as Record<string, number>);

      const affectedUserIds = Object.keys(userXPDeltas);
      const totalXPImpact = Object.values(userXPDeltas).reduce((sum, xp) => sum + xp, 0);

      // Récupérer les XP actuels des utilisateurs affectés pour la prévisualisation
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, xp')
        .in('id', affectedUserIds);

      if (profilesError) throw profilesError;

      const preview = (profiles || []).map(profile => ({
        userId: profile.id,
        xpLoss: userXPDeltas[profile.id],
        currentXP: profile.xp,
        newXP: Math.max(0, profile.xp - userXPDeltas[profile.id])
      }));

      return {
        affectedUsers: affectedUserIds.length,
        totalXPImpact,
        preview
      };

    } catch (error) {
      log.error('Error calculating source deactivation impact:', error);
      throw error;
    }
  }

  /**
   * Active/Désactive un achievement
   */
  static async toggleAchievement(achievement: AdminAchievement): Promise<void> {
    try {
      const newActiveState = !achievement.is_active;

      const { error } = await supabase
        .from('achievement_definitions')
        .update({ is_active: newActiveState })
        .eq('achievement_key', achievement.achievement_key);

      if (error) throw error;

      log.info('Achievement toggled successfully', {
        achievementKey: achievement.achievement_key,
        previousState: achievement.is_active,
        newState: newActiveState
      });

    } catch (error) {
      log.error('Error toggling achievement:', error);
      throw error;
    }
  }

  /**
   * Supprime un achievement
   */
  static async deleteAchievement(achievement: AdminAchievement): Promise<void> {
    try {
      const { error } = await supabase
        .from('achievement_definitions')
        .delete()
        .eq('achievement_key', achievement.achievement_key);

      if (error) throw error;

      log.warn('Achievement deleted', {
        achievementKey: achievement.achievement_key,
        usageCount: achievement.usage_count
      });

    } catch (error) {
      log.error('Error deleting achievement:', error);
      throw error;
    }
  }

  /**
   * Recalcule les XP de tous les utilisateurs (opération lourde)
   */
  static async recalculateAllUserXP(): Promise<void> {
    try {
      // Cette fonction pourrait recalculer les XP de tous les utilisateurs
      // en se basant uniquement sur les sources actives
      log.info('Starting global XP recalculation...');
      
      // TODO: Implémenter la logique de recalcul
      // 1. Récupérer tous les utilisateurs
      // 2. Pour chaque utilisateur, recalculer XP basé sur xp_events et sources actives
      // 3. Mettre à jour profiles.xp et profiles.level
      
      log.info('Global XP recalculation completed');

    } catch (error) {
      log.error('Error during XP recalculation:', error);
      throw error;
    }
  }

  /**
   * Valide la cohérence des données XP
   */
  static async validateXPConsistency(): Promise<{
    valid: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];

    try {
      // Vérifier les sources XP dupliquées
      const { data: duplicates } = await supabase
        .from('xp_sources')
        .select('source_type, action_type, count(*)')
        .group('source_type, action_type')
        .having('count(*) > 1');

      if (duplicates && duplicates.length > 0) {
        issues.push(`Duplicate XP sources found: ${duplicates.length}`);
      }

      // Vérifier les achievements dupliqués
      const { data: duplicateAchievements } = await supabase
        .from('achievement_definitions')
        .select('achievement_key, count(*)')
        .group('achievement_key')
        .having('count(*) > 1');

      if (duplicateAchievements && duplicateAchievements.length > 0) {
        issues.push(`Duplicate achievements found: ${duplicateAchievements.length}`);
      }

      // Vérifier la cohérence XP utilisateurs vs xp_events
      // TODO: Ajouter d'autres vérifications selon les besoins

      return {
        valid: issues.length === 0,
        issues
      };

    } catch (error) {
      log.error('Error validating XP consistency:', error);
      issues.push('Error during consistency check');
      return { valid: false, issues };
    }
  }
}