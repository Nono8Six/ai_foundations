/**
 * XP RPC SDK - Wrappers typés pour toutes les fonctions RPC XP
 * 
 * SDK centralisé avec types stricts basés sur les signatures PostgreSQL réelles
 * Validation Zod, gestion d'erreurs normalisées, cache intégré
 * ZÉRO accès table-level - RPC-only
 */

import { z } from 'zod';
import { supabase } from '@core/supabase/client';
import { log } from '@libs/logger';
import { wrapXPOperation, assertValid, XPError } from './xp-errors';
import { makeIdempotencyKey, IdempotencyKeys } from './idempotency';

// ========================================
// TYPES BASÉS SUR LES SIGNATURES DB RÉELLES
// ========================================

/**
 * Type de retour de credit_xp RPC
 * Basé sur la signature: RETURNS json (pas TABLE)
 * Structure exacte du json_build_object dans la fonction PostgreSQL
 */
export interface CreditXpResult {
  event_id: string;
  xp_before: number;
  xp_after: number;
  level_before: number;
  level_after: number;
  xp_delta_applied: number;
  gap: number;
  status: 'new_event_created' | 'idempotent_return';
}

/**
 * Type de retour de compute_level_info RPC
 * Basé sur: TABLE(level integer, xp_threshold integer, xp_to_next integer)
 */
export interface LevelInfo {
  level: number;
  xp_threshold: number;
  xp_to_next: number | null; // NULL si niveau max atteint
}

/**
 * Type de retour de get_active_xp_sources RPC
 * Basé sur: TABLE(source_id uuid, source_type text, action_type text, version integer, ...)
 */
export interface XPSource {
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
  effective_from: string; // timestamp with time zone
  effective_to: string | null; // timestamp with time zone
}

/**
 * Type de retour de unlock_achievement RPC
 * Basé sur: TABLE(ua_id uuid, event_id uuid, xp_before integer, xp_after integer, level_before integer, level_after integer)
 */
export interface UnlockAchievementResult {
  ua_id: string;
  event_id: string | null; // NULL si pas de XP reward
  xp_before: number;
  xp_after: number;
  level_before: number;
  level_after: number;
}

// ========================================
// SCHÉMAS ZOD POUR VALIDATION
// ========================================

const UuidSchema = z.string().uuid();
const PositiveIntSchema = z.number().int().positive();
const NonEmptyStringSchema = z.string().min(1);

// Validation params credit_xp
const CreditXpParamsSchema = z.object({
  userId: UuidSchema,
  sourceRef: NonEmptyStringSchema,
  xpDelta: z.number().int().refine(n => n !== 0, { message: "XP delta cannot be zero" }),
  idempotencyKey: z.string().min(8, "Idempotency key must be at least 8 characters"),
  referenceId: UuidSchema.optional(),
  sourceVersion: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

// Validation retour credit_xp (JSON direct, pas array)
const CreditXpResultSchema = z.object({
  event_id: UuidSchema,
  xp_before: z.number().int().min(0),
  xp_after: z.number().int().min(0),
  level_before: PositiveIntSchema,
  level_after: PositiveIntSchema,
  xp_delta_applied: z.number().int(),
  gap: z.number().int().min(0),
  status: z.enum(['new_event_created', 'idempotent_return'])
});

// Validation params unlock_achievement
const UnlockAchievementParamsSchema = z.object({
  userId: UuidSchema,
  code: NonEmptyStringSchema,
  version: PositiveIntSchema,
  scope: z.string().optional(),
  referenceId: UuidSchema.optional()
});

// Validation retour unlock_achievement
const UnlockAchievementResultSchema = z.object({
  ua_id: UuidSchema,
  event_id: UuidSchema.nullable(),
  xp_before: z.number().int().min(0),
  xp_after: z.number().int().min(0),
  level_before: PositiveIntSchema,
  level_after: PositiveIntSchema
});

// Validation retour get_active_xp_sources
const XPSourceSchema = z.object({
  source_id: UuidSchema,
  source_type: NonEmptyStringSchema,
  action_type: NonEmptyStringSchema,
  version: PositiveIntSchema,
  xp_value: z.number().int(),
  cooldown_minutes: z.number().int().min(0),
  max_per_day: z.number().int().nullable(),
  is_repeatable: z.boolean(),
  title: z.string(),
  description: z.string(),
  effective_from: z.string(),
  effective_to: z.string().nullable()
});

// Validation retour compute_level_info
const LevelInfoSchema = z.object({
  level: PositiveIntSchema,
  xp_threshold: z.number().int().min(0),
  xp_to_next: z.number().int().min(0).nullable()
});

// ========================================
// CACHE POUR get_active_xp_sources
// ========================================

interface CacheEntry {
  data: XPSource[];
  timestamp: number;
}

class XPSourcesCache {
  private static cache: CacheEntry | null = null;
  private static readonly CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

  static get(asOfTime?: Date): XPSource[] | null {
    if (!this.cache) return null;

    const now = Date.now();
    if (now - this.cache.timestamp > this.CACHE_DURATION_MS) {
      this.cache = null;
      return null;
    }

    // Si asOfTime est spécifié et différent, invalider le cache
    if (asOfTime && Math.abs(asOfTime.getTime() - this.cache.timestamp) > 1000) {
      return null;
    }

    return this.cache.data;
  }

  static set(data: XPSource[], asOfTime?: Date): void {
    this.cache = {
      data,
      timestamp: asOfTime ? asOfTime.getTime() : Date.now()
    };
  }

  static invalidate(): void {
    this.cache = null;
    log.debug('XP sources cache invalidated');
  }
}

// ========================================
// SDK PRINCIPAL
// ========================================

export class XPRpc {
  
  /**
   * Crédite de l'XP à un utilisateur
   * 
   * @param params - Paramètres validés pour credit_xp RPC
   * @returns Résultat avec détails de l'événement XP créé
   */
  static async creditXp(params: {
    userId: string;
    sourceRef: string;
    xpDelta: number;
    idempotencyKey: string;
    referenceId?: string;
    sourceVersion?: string;
    metadata?: Record<string, any>;
  }): Promise<CreditXpResult> {
    // Validation params
    const validatedParams = CreditXpParamsSchema.parse(params);
    
    log.debug('Calling credit_xp RPC:', {
      userId: validatedParams.userId,
      sourceRef: validatedParams.sourceRef,
      xpDelta: validatedParams.xpDelta,
      idempotencyKey: `${validatedParams.idempotencyKey.substring(0, 8)  }...`
    });

    const result = await wrapXPOperation(
      async () => {
        const { data, error } = await supabase.rpc('credit_xp' as any, {
          p_user_id: validatedParams.userId,
          p_source_ref: validatedParams.sourceRef,
          p_xp_delta: validatedParams.xpDelta,
          p_idempotency_key: validatedParams.idempotencyKey,
          p_reference_id: validatedParams.referenceId || null,
          p_source_version: validatedParams.sourceVersion || null,
          p_metadata: validatedParams.metadata || {}
        });
        return { data, error };
      },
      'creditXp'
    );

    // credit_xp retourne directement du JSON (pas un array)
    const validatedResult = CreditXpResultSchema.parse(result);
    
    log.info('XP credited successfully:', {
      eventId: validatedResult.event_id,
      xpDelta: validatedResult.xp_delta_applied,
      status: validatedResult.status
    });

    return validatedResult;
  }

  /**
   * Récupère les sources XP actives
   * 
   * @param asOfTime - Point dans le temps pour les règles (optionnel)
   * @returns Liste des sources XP actives avec cache 5min
   */
  static async getActiveXPSources(asOfTime?: Date): Promise<XPSource[]> {
    // Vérifier le cache d'abord
    const cached = XPSourcesCache.get(asOfTime);
    if (cached) {
      log.debug(`Returning ${cached.length} XP sources from cache`);
      return cached;
    }

    log.debug('Fetching XP sources from database:', { asOfTime });

    const result = await wrapXPOperation(
      async () => {
        const { data, error } = await supabase.rpc('get_active_xp_sources' as any, {
          p_at: asOfTime?.toISOString() || null
        });
        return { data, error };
      },
      'getActiveXPSources'
    );

    // Validation retour (array de sources)
    const validatedResult = z.array(XPSourceSchema).parse(result);
    
    // Mise à jour cache
    XPSourcesCache.set(validatedResult, asOfTime);
    
    log.info(`Loaded ${validatedResult.length} active XP sources`);
    return validatedResult;
  }

  /**
   * Calcule les informations de niveau pour un montant XP total
   * 
   * @param totalXp - XP total de l'utilisateur
   * @returns Informations de niveau avec seuils
   */
  static async computeLevelInfo(totalXp: number): Promise<LevelInfo> {
    assertValid(totalXp >= 0, 'invalid_delta', 'Total XP must be non-negative', { totalXp });

    log.debug('Computing level info:', { totalXp });

    const result = await wrapXPOperation(
      async () => {
        const { data, error } = await supabase.rpc('compute_level_info' as any, {
          p_xp_total: totalXp
        });
        return { data, error };
      },
      'computeLevelInfo'
    );

    // La fonction retourne un array avec un seul élément (TABLE result)
    if (!Array.isArray(result) || result.length === 0) {
      throw new XPError('level_compute_error', 'No level data returned', { totalXp });
    }

    const validatedResult = LevelInfoSchema.parse(result[0]);
    
    log.debug('Level computed:', validatedResult);
    return validatedResult;
  }

  /**
   * Débloque un achievement pour un utilisateur
   * 
   * @param params - Paramètres pour unlock_achievement RPC
   * @returns Résultat du déblocage avec détails XP
   */
  static async unlockAchievement(params: {
    userId: string;
    code: string;
    version: number;
    scope?: string;
    referenceId?: string;
  }): Promise<UnlockAchievementResult> {
    // Validation params
    const validatedParams = UnlockAchievementParamsSchema.parse(params);
    
    // Clé déterministe 100% reproductible (pas de timestamp aléatoire)
    const deterministicKey = IdempotencyKeys.unlockAchievement(
      validatedParams.userId,
      validatedParams.code,
      validatedParams.version,
      validatedParams.scope
    );

    log.debug('Unlocking achievement:', {
      userId: validatedParams.userId,
      code: validatedParams.code,
      version: validatedParams.version,
      idempotencyKey: deterministicKey
    });

    const result = await wrapXPOperation(
      async () => {
        const { data, error } = await supabase.rpc('unlock_achievement' as any, {
          p_user_id: validatedParams.userId,
          p_code: validatedParams.code,
          p_version: validatedParams.version,
          p_idempotency_key: deterministicKey,
          p_scope: validatedParams.scope || null,
          p_reference_id: validatedParams.referenceId || null
        });
        return { data, error };
      },
      'unlockAchievement'
    );

    // La fonction retourne un array avec un seul élément (TABLE result)
    if (!Array.isArray(result) || result.length === 0) {
      throw new XPError('achievement_not_found', 'No achievement unlock data returned', { params: validatedParams });
    }

    const validatedResult = UnlockAchievementResultSchema.parse(result[0]);
    
    log.info('Achievement unlocked:', {
      achievementCode: validatedParams.code,
      uaId: validatedResult.ua_id,
      xpAwarded: validatedResult.xp_after - validatedResult.xp_before
    });

    return validatedResult;
  }

  /**
   * Utilitaire: Invalide le cache des sources XP
   * Utile après modifications des règles XP
   */
  static invalidateXPSourcesCache(): void {
    XPSourcesCache.invalidate();
  }

  /**
   * Utilitaire: Opération credit_xp avec retry intelligent
   * 
   * Retry UNIQUEMENT sur 'lock_not_acquired' avec:
   * - Backoff exponentiel + jitter
   * - Cap à 2s max entre tentatives
   * - Maximum 5 essais
   * 
   * PAS de retry sur:
   * - conflict_mismatch (clé d'idempotence conflictuelle) 
   * - invalid_delta (erreur de paramètres)
   * - profile_not_found (erreur d'auth/permissions)
   */
  static async creditXpWithRetry(
    params: Parameters<typeof XPRpc.creditXp>[0],
    maxRetries: number = 5
  ): Promise<CreditXpResult> {
    let lastError: XPError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await XPRpc.creditXp(params);
      } catch (error) {
        lastError = error instanceof XPError ? error : new XPError('unknown_error', String(error));
        
        // Retry UNIQUEMENT sur lock_not_acquired
        if (!lastError.isCode('lock_not_acquired') || attempt === maxRetries) {
          throw lastError;
        }
        
        // Calcul du délai avec backoff exponentiel + jitter
        const baseDelay = Math.min(100 * Math.pow(2, attempt - 1), 2000); // Cap à 2s
        const jitter = Math.random() * 0.3 * baseDelay; // Jitter de ±30%
        const delayMs = Math.floor(baseDelay + jitter);
        
        log.warn(`[XPRpc] Lock acquisition failed (attempt ${attempt}/${maxRetries}), retrying in ${delayMs}ms`, {
          userId: params.userId,
          sourceRef: params.sourceRef,
          idempotencyKey: `${params.idempotencyKey.substring(0, 20)  }...`
        });
        
        await new Promise<void>(resolve => {
          setTimeout(resolve, delayMs);
        });
      }
    }
    
    throw lastError!;
  }

  /**
   * Utilitaire: Récupère une source XP spécifique par type/action
   */
  static async getXPSource(sourceType: string, actionType: string): Promise<XPSource | null> {
    const sources = await this.getActiveXPSources();
    return sources.find(s => s.source_type === sourceType && s.action_type === actionType) || null;
  }

  /**
   * Utilitaire: Récupère la valeur XP pour une action spécifique
   */
  static async getXPValue(sourceType: string, actionType: string): Promise<number> {
    const source = await this.getXPSource(sourceType, actionType);
    if (!source) {
      throw new XPError('xp_rule_missing', `XP rule not found for ${sourceType}:${actionType}`);
    }
    return source.xp_value;
  }

  /**
   * Utilitaire: Valide qu'une source XP est répétable et disponible
   */
  static async validateXPAction(sourceType: string, actionType: string): Promise<{
    valid: boolean;
    reason?: string;
    source?: XPSource;
  }> {
    try {
      const source = await this.getXPSource(sourceType, actionType);
      
      if (!source) {
        return {
          valid: false,
          reason: `XP rule not found for ${sourceType}:${actionType}`
        };
      }

      return {
        valid: true,
        source
      };
    } catch (error) {
      log.error('Error validating XP action:', error);
      return {
        valid: false,
        reason: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

// ========================================
// EXPORTS POUR COMPATIBILITÉ
// ========================================

export default XPRpc;

// Re-export des utilitaires d'idempotence
export { makeIdempotencyKey, IdempotencyKeys } from './idempotency';

// Re-export des types pour compatibility  
export type {
  CreditXpResult as CreditXpResultType,
  LevelInfo as LevelInfoType,
  XPSource as XPSourceType,
  UnlockAchievementResult as UnlockAchievementResultType
};

// Re-export des erreurs pour convenance
export { XPError, type XPErrorCode } from './xp-errors';