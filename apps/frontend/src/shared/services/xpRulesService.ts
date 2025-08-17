/**
 * XP Rules Service - Centralise l'accès aux règles XP depuis xp_sources
 * 
 * Remplace TOUT hardcoding de valeurs XP par des appels RPC vers get_active_xp_sources()
 * Source unique de vérité pour les règles XP versionnées et auditées.
 */

import { log } from '@libs/logger';
import { XPRpc } from './xp-rpc';

export interface XPRule {
  source_id: string;
  source_type: string;
  action_type: string;
  version: number;
  xp_value: number;
  cooldown_minutes: number;
  max_per_day: number | null;
  is_repeatable: boolean;
  title: string;
  description: string;
  effective_from: string;
  effective_to: string | null;
}

export interface XPActionRequest {
  userId: string;
  sourceType: string;
  actionType: string;
  referenceId?: string;
  metadata?: Record<string, any>;
  idempotencyKey?: string;
}

/**
 * Service centralisé pour les règles XP
 * ÉLIMINE tout hardcoding - source unique: xp_sources table
 */
export class XPRulesService {
  private static _cachedRules: XPRule[] | null = null;
  private static _cacheTimestamp: number = 0;
  private static readonly CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

  /**
   * Récupère TOUTES les règles XP actives via RPC
   * Utilise un cache court pour éviter les requêtes répétées
   */
  static async getActiveRules(forceRefresh = false): Promise<XPRule[]> {
    const now = Date.now();
    
    // Retourner le cache si valide
    if (!forceRefresh && this._cachedRules && (now - this._cacheTimestamp) < this.CACHE_DURATION_MS) {
      return this._cachedRules;
    }

    try {
      const data = await XPRpc.getActiveXPSources();

      if (!data || data.length === 0) {
        log.warn('No active XP rules found in database');
        return [];
      }

      // Transformer en format TypeScript typé
      const rules: XPRule[] = data.map(rule => ({
        source_id: rule.source_id,
        source_type: rule.source_type,
        action_type: rule.action_type,
        version: rule.version,
        xp_value: rule.xp_value || 0,
        cooldown_minutes: rule.cooldown_minutes || 0,
        max_per_day: rule.max_per_day,
        is_repeatable: rule.is_repeatable || false,
        title: rule.title || `${rule.action_type} ${rule.source_type}`,
        description: rule.description || '',
        effective_from: rule.effective_from,
        effective_to: rule.effective_to
      }));

      // Mise à jour cache
      this._cachedRules = rules;
      this._cacheTimestamp = now;

      log.debug(`✅ Loaded ${rules.length} active XP rules from database`);
      return rules;

    } catch (error) {
      log.error('Error in getActiveRules:', error);
      // En cas d'erreur, retourner le cache si disponible, sinon erreur
      if (this._cachedRules) {
        log.warn('Returning cached XP rules due to fetch error');
        return this._cachedRules;
      }
      throw error;
    }
  }

  /**
   * Récupère la valeur XP pour une action spécifique
   * REMPLACE tout hardcoding de valeurs XP
   */
  static async getXPValue(sourceType: string, actionType: string): Promise<number> {
    try {
      const rules = await this.getActiveRules();
      const rule = rules.find(r => r.source_type === sourceType && r.action_type === actionType);
      
      if (!rule) {
        const error = `XP rule not found for ${sourceType}:${actionType}`;
        log.error(error);
        throw new Error(error);
      }

      return rule.xp_value;
    } catch (error) {
      log.error(`Error getting XP value for ${sourceType}:${actionType}:`, error);
      throw error;
    }
  }

  /**
   * Récupère une règle XP complète
   */
  static async getRule(sourceType: string, actionType: string): Promise<XPRule | null> {
    try {
      const rules = await this.getActiveRules();
      return rules.find(r => r.source_type === sourceType && r.action_type === actionType) || null;
    } catch (error) {
      log.error(`Error getting XP rule for ${sourceType}:${actionType}:`, error);
      return null;
    }
  }

  /**
   * Appelle credit_xp avec les bonnes informations de source depuis la règle active
   * INTÈGRE automatiquement source_id et version depuis xp_sources
   */
  static async creditXPWithRule(request: XPActionRequest): Promise<any> {
    try {
      const rule = await this.getRule(request.sourceType, request.actionType);
      
      if (!rule) {
        const error = `Cannot credit XP: rule not found for ${request.sourceType}:${request.actionType}`;
        log.error(error);
        throw new Error(error);
      }

      // Générer clé d'idempotence si non fournie
      const idempotencyKey = request.idempotencyKey || 
        `${request.userId}:${request.sourceType}:${request.actionType}:${Date.now()}:${Math.random().toString(36).substring(2)}`;

      // Appeler credit_xp avec toutes les informations de la règle
      const data = await XPRpc.creditXp({
        userId: request.userId,
        sourceRef: `${rule.source_type}:${rule.action_type}`,
        xpDelta: rule.xp_value,
        idempotencyKey,
        referenceId: request.referenceId || null,
        sourceVersion: rule.version.toString(),
        metadata: {
          ...request.metadata,
          rule_source_id: rule.source_id,
          rule_version: rule.version,
          rule_title: rule.title,
          automatic_from_rule: true
        }
      });

      log.info(`✅ XP credited: ${rule.xp_value} XP for ${rule.source_type}:${rule.action_type} (rule v${rule.version})`);
      return data;

    } catch (error) {
      log.error('Error in creditXPWithRule:', error);
      throw error;
    }
  }

  /**
   * Valide qu'une action XP est disponible (cooldown, max_per_day, etc.)
   */
  static async validateXPAction(request: XPActionRequest): Promise<{
    valid: boolean;
    reason?: string;
    rule?: XPRule;
  }> {
    try {
      const rule = await this.getRule(request.sourceType, request.actionType);
      
      if (!rule) {
        return {
          valid: false,
          reason: `XP rule not found for ${request.sourceType}:${request.actionType}`
        };
      }

      // TODO: Implémenter validation cooldown/max_per_day
      // Nécessiterait requête vers xp_events pour vérifier dernières actions

      return {
        valid: true,
        rule
      };

    } catch (error) {
      log.error('Error validating XP action:', error);
      return {
        valid: false,
        reason: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Récupère les règles par type de source
   */
  static async getRulesBySourceType(sourceType: string): Promise<XPRule[]> {
    try {
      const rules = await this.getActiveRules();
      return rules.filter(r => r.source_type === sourceType);
    } catch (error) {
      log.error(`Error getting rules for source type ${sourceType}:`, error);
      return [];
    }
  }

  /**
   * Efface le cache (utile pour les tests ou changements de règles)
   */
  static clearCache(): void {
    this._cachedRules = null;
    this._cacheTimestamp = 0;
    log.debug('XP rules cache cleared');
  }
}