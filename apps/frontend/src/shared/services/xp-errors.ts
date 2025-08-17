/**
 * XP Error Handling - Normalisation des erreurs RPC PostgreSQL
 * 
 * Mappe les erreurs Supabase/PostgreSQL vers des codes frontend cohérents
 * avec gestion des détails et helper functions pour validation
 */

import type { PostgrestError } from '@supabase/supabase-js';
import { log } from '@libs/logger';

// Codes d'erreur normalisés pour les opérations XP
export type XPErrorCode = 
  | 'lock_not_acquired'           // Verrou utilisateur non acquis
  | 'profile_not_found'           // Profil utilisateur inexistant
  | 'conflict_mismatch'           // Conflit d'idempotence (paramètres différents)
  | 'invalid_delta'               // Delta XP invalide (0 ou invalide)
  | 'invalid_idempotency_key'     // Clé d'idempotence malformée
  | 'level_compute_error'         // Erreur calcul niveau
  | 'invalid_status_transition'   // Transition de statut invalide
  | 'xp_rule_missing'             // Règle XP introuvable
  | 'achievement_not_found'       // Définition achievement introuvable
  | 'conditions_not_met'          // Conditions achievement non remplies
  | 'database_error'              // Erreur base de données générique
  | 'unknown_error';              // Erreur non identifiée

/**
 * Classe d'erreur spécialisée pour les opérations XP
 */
export class XPError extends Error {
  public readonly name = 'XPError';
  
  constructor(
    public readonly code: XPErrorCode,
    message: string,
    public readonly details?: Record<string, any>,
    public readonly originalError?: Error
  ) {
    super(message);
    
    // Préserver la stack trace si erreur originale
    if (originalError?.stack) {
      this.stack = originalError.stack;
    }
  }

  /**
   * Retourne une représentation JSON de l'erreur
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
      stack: this.stack
    };
  }

  /**
   * Vérifie si l'erreur correspond à un code spécifique
   */
  isCode(code: XPErrorCode): boolean {
    return this.code === code;
  }

  /**
   * Retourne true si l'erreur est récupérable (retry possible)
   */
  isRetryable(): boolean {
    const retryableCodes: XPErrorCode[] = [
      'lock_not_acquired',
      'database_error'
    ];
    return retryableCodes.includes(this.code);
  }
}

/**
 * Mappe les erreurs PostgreSQL vers des codes XP normalisés
 */
export function mapPostgrestError(error: PostgrestError | Error): XPError {
  // Log l'erreur originale pour debug
  log.error('Mapping Postgrest error:', {
    message: error.message,
    details: 'details' in error ? error.details : undefined,
    code: 'code' in error ? error.code : undefined
  });

  const errorMessage = error.message.toLowerCase();
  const errorDetails = 'details' in error ? error.details : undefined;
  const safeDetails = errorDetails && typeof errorDetails === 'object' ? errorDetails : undefined;

  // Mapping basé sur les exceptions RAISE dans les fonctions PostgreSQL
  if (errorMessage.includes('lock_not_acquired')) {
    return new XPError(
      'lock_not_acquired',
      'Verrou utilisateur non acquis. Opération concurrente en cours.',
      { retryAfterMs: 100 },
      error
    );
  }

  if (errorMessage.includes('profile_not_found')) {
    return new XPError(
      'profile_not_found',
      'Profil utilisateur introuvable',
      safeDetails,
      error
    );
  }

  if (errorMessage.includes('conflict_mismatch')) {
    return new XPError(
      'conflict_mismatch',
      'Conflit détecté: paramètres différents pour la même clé d\'idempotence',
      safeDetails,
      error
    );
  }

  if (errorMessage.includes('invalid_delta')) {
    return new XPError(
      'invalid_delta',
      'Delta XP invalide: doit être différent de zéro',
      safeDetails,
      error
    );
  }

  if (errorMessage.includes('invalid_idempotency_key')) {
    return new XPError(
      'invalid_idempotency_key',
      'Clé d\'idempotence invalide: doit contenir au moins 8 caractères',
      safeDetails,
      error
    );
  }

  if (errorMessage.includes('achievement non trouvé') || errorMessage.includes('achievement_not_found')) {
    return new XPError(
      'achievement_not_found',
      'Définition d\'achievement introuvable',
      safeDetails,
      error
    );
  }

  if (errorMessage.includes('conditions') && errorMessage.includes('non remplies')) {
    return new XPError(
      'conditions_not_met',
      'Conditions d\'achievement non remplies',
      safeDetails,
      error
    );
  }

  if (errorMessage.includes('xp rule not found') || errorMessage.includes('règle xp')) {
    return new XPError(
      'xp_rule_missing',
      'Règle XP introuvable pour cette action',
      safeDetails,
      error
    );
  }

  // Erreurs PostgreSQL génériques
  if ('code' in error) {
    const pgCode = error.code;
    
    // Codes PostgreSQL courants
    switch (pgCode) {
      case '23505': // unique_violation
        return new XPError(
          'conflict_mismatch',
          'Violation de contrainte d\'unicité',
          { pgCode, ...(safeDetails || {}) },
          error
        );
      
      case '23503': // foreign_key_violation
        return new XPError(
          'profile_not_found',
          'Référence invalide vers profil utilisateur',
          { pgCode, ...(safeDetails || {}) },
          error
        );
      
      case 'P0001': // raise_exception
        // Déjà géré ci-dessus par le message
        break;
    }
  }

  // Fallback: erreur générique
  return new XPError(
    'database_error',
    `Erreur base de données: ${error.message}`,
    {
      originalMessage: error.message,
      ...(safeDetails || {})
    },
    error
  );
}

/**
 * Helper: Lance une XPError si le résultat Supabase contient une erreur
 */
export function assertOk<T>(result: { data: T | null; error: PostgrestError | null }): T {
  if (result.error) {
    throw mapPostgrestError(result.error);
  }
  
  if (result.data === null) {
    throw new XPError(
      'database_error',
      'Aucune donnée retournée par la requête',
      { result }
    );
  }
  
  return result.data;
}

/**
 * Helper: Valide et lance une XPError si la condition échoue
 */
export function assertValid(condition: boolean, code: XPErrorCode, message: string, details?: Record<string, any>): void {
  if (!condition) {
    throw new XPError(code, message, details);
  }
}

/**
 * Helper: Wrapper pour les opérations async avec gestion d'erreur automatique
 */
export async function wrapXPOperation<T>(
  operation: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  operationName: string
): Promise<T> {
  try {
    const result = await operation();
    return assertOk(result);
  } catch (error) {
    // Si c'est déjà une XPError, la relancer directement
    if (error instanceof XPError) {
      throw error;
    }
    
    // Sinon, mapper l'erreur
    log.error(`Error in ${operationName}:`, error);
    throw mapPostgrestError(error as Error);
  }
}

/**
 * Helper: Retry automatique pour les erreurs récupérables
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 100
): Promise<T> {
  let lastError: XPError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof XPError) {
        lastError = error;
        
        // Ne retry que si l'erreur est récupérable
        if (!error.isRetryable() || attempt === maxRetries) {
          throw error;
        }
        
        // Délai exponentiel
        const delayMs = baseDelayMs * Math.pow(2, attempt - 1);
        log.warn(`XP operation failed (attempt ${attempt}/${maxRetries}), retrying in ${delayMs}ms:`, {
          code: error.code,
          message: error.message
        });
        
        await new Promise<void>(resolve => {
          setTimeout(resolve, delayMs);
        });
      } else {
        // Erreur inattendue, mapper et throw
        throw mapPostgrestError(error as Error);
      }
    }
  }
  
  throw lastError!;
}