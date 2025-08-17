/**
 * Idempotency Key Generation - Déterministe et Normalisé
 * 
 * Génère des clés d'idempotence 100% reproductibles avec:
 * - Normalisation (trim/lower/slug)
 * - Ordre stable des paramètres
 * - Aucun composant aléatoire (timestamp/UUID)
 * - Gestion des collisions par scope
 */

/**
 * Normalise une chaîne pour inclusion dans une clé d'idempotence
 * Applique trim, lowercase, et slug transformation
 */
function normalizeKeyComponent(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')  // Remplace caractères spéciaux par tirets
    .replace(/-+/g, '-')         // Consolide tirets multiples
    .replace(/^-|-$/g, '');      // Supprime tirets début/fin
}

/**
 * Interface pour les paramètres de génération de clé
 */
export interface IdempotencyKeyParams {
  /** Type d'action (lesson, course, quiz, achievement, profile, etc.) */
  kind: string;
  
  /** ID utilisateur (toujours requis) */
  userId: string;
  
  /** Identifiant unique de l'entité (lesson-id, course-id, etc.) */
  identifier: string;
  
  /** Version de l'action ou de la règle (optionnel, défaut: 1) */
  version?: number | string;
  
  /** Scope pour différencier les contextes (optionnel, défaut: 'default') */
  scope?: string;
  
  /** Métadonnées additionnelles pour différenciation (optionnel) */
  metadata?: Record<string, string | number>;
}

/**
 * Génère une clé d'idempotence 100% déterministe
 * 
 * Format: kind:userId:identifier:version:scope[:metadata-keys]
 * 
 * Caractéristiques:
 * - Reproductible: mêmes inputs = même clé
 * - Normalisé: trim/lower/slug sur tous les composants
 * - Ordre stable: métadonnées triées par clé
 * - Pas de randomness: aucun timestamp ou UUID
 * 
 * @param params - Paramètres de génération
 * @returns Clé d'idempotence normalisée
 * 
 * @example
 * ```typescript
 * // Clé de base
 * makeIdempotencyKey({
 *   kind: 'lesson',
 *   userId: 'user-123',
 *   identifier: 'lesson-456'
 * });
 * // → "lesson:user-123:lesson-456:1:default"
 * 
 * // Avec scope pour éviter collisions
 * makeIdempotencyKey({
 *   kind: 'lesson',
 *   userId: 'user-123', 
 *   identifier: 'lesson-456',
 *   scope: 'course-789'
 * });
 * // → "lesson:user-123:lesson-456:1:course-789"
 * 
 * // Avec métadonnées pour différenciation fine
 * makeIdempotencyKey({
 *   kind: 'quiz',
 *   userId: 'user-123',
 *   identifier: 'quiz-456',
 *   metadata: { attempt: 2, mode: 'practice' }
 * });
 * // → "quiz:user-123:quiz-456:1:default:attempt-2:mode-practice"
 * ```
 */
export function makeIdempotencyKey(params: IdempotencyKeyParams): string {
  // Validation des paramètres requis
  if (!params.kind?.trim()) {
    throw new Error('IdempotencyKey: kind is required and cannot be empty');
  }
  if (!params.userId?.trim()) {
    throw new Error('IdempotencyKey: userId is required and cannot be empty');
  }
  if (!params.identifier?.trim()) {
    throw new Error('IdempotencyKey: identifier is required and cannot be empty');
  }

  // Normalisation des composants principaux
  const normalizedKind = normalizeKeyComponent(params.kind);
  const normalizedUserId = normalizeKeyComponent(params.userId);
  const normalizedIdentifier = normalizeKeyComponent(params.identifier);
  const normalizedVersion = normalizeKeyComponent(String(params.version || 1));
  const normalizedScope = normalizeKeyComponent(params.scope || 'default');

  // Construction des parties principales (ordre fixe)
  const mainParts = [
    normalizedKind,
    normalizedUserId,
    normalizedIdentifier,
    normalizedVersion,
    normalizedScope
  ];

  // Traitement des métadonnées (ordre stable)
  const metadataParts: string[] = [];
  if (params.metadata && Object.keys(params.metadata).length > 0) {
    // Tri par clé pour ordre stable
    const sortedKeys = Object.keys(params.metadata).sort();
    
    for (const key of sortedKeys) {
      const value = params.metadata[key];
      if (value !== undefined && value !== null && value !== '') {
        const normalizedKey = normalizeKeyComponent(key);
        const normalizedValue = normalizeKeyComponent(String(value));
        metadataParts.push(`${normalizedKey}-${normalizedValue}`);
      }
    }
  }

  // Assemblage final
  const allParts = [...mainParts, ...metadataParts];
  const result = allParts.join(':');

  // Validation longueur finale (PostgreSQL a des limites sur les index)
  if (result.length > 255) {
    throw new Error(`IdempotencyKey too long: ${result.length} chars (max 255)`);
  }

  return result;
}

/**
 * Helpers pour cas d'usage courants
 */
export const IdempotencyKeys = {
  /**
   * Clé pour créditer de l'XP sur une action spécifique
   */
  creditXp(userId: string, sourceRef: string, referenceId?: string): string {
    const [sourceType, actionType] = sourceRef.split(':');
    return makeIdempotencyKey({
      kind: 'credit-xp',
      userId,
      identifier: sourceRef,
      scope: referenceId || 'global'
    });
  },

  /**
   * Clé pour débloquer un achievement
   */
  unlockAchievement(userId: string, code: string, version: number, scope?: string): string {
    return makeIdempotencyKey({
      kind: 'achievement',
      userId,
      identifier: code,
      version,
      scope: scope || 'global'
    });
  },

  /**
   * Clé pour marquer une progression de leçon
   */
  lessonProgress(userId: string, lessonId: string, status: string): string {
    return makeIdempotencyKey({
      kind: 'lesson-progress',
      userId,
      identifier: lessonId,
      metadata: { status }
    });
  },

  /**
   * Clé pour une action de profil
   */
  profileAction(userId: string, action: string, field?: string): string {
    return makeIdempotencyKey({
      kind: 'profile',
      userId,
      identifier: action,
      scope: field || 'general'
    });
  }
};

/**
 * Utilitaire pour détecter les collisions potentielles
 * Utilisé principalement dans les tests
 */
export function detectKeyCollision(keys: string[]): { 
  hasCollisions: boolean; 
  collisions: Array<{ key: string; count: number }> 
} {
  const keyCount = new Map<string, number>();
  
  for (const key of keys) {
    keyCount.set(key, (keyCount.get(key) || 0) + 1);
  }
  
  const collisions = Array.from(keyCount.entries())
    .filter(([_, count]) => count > 1)
    .map(([key, count]) => ({ key, count }));
  
  return {
    hasCollisions: collisions.length > 0,
    collisions
  };
}

/**
 * Validation qu'une clé est bien formée
 */
export function validateIdempotencyKey(key: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Vérifications de base
  if (!key || typeof key !== 'string') {
    errors.push('Key must be a non-empty string');
    return { valid: false, errors };
  }
  
  if (key.length < 8) {
    errors.push('Key must be at least 8 characters');
  }
  
  if (key.length > 255) {
    errors.push('Key must not exceed 255 characters');
  }
  
  // Structure attendue: au moins 5 parties (kind:userId:identifier:version:scope)
  const parts = key.split(':');
  if (parts.length < 5) {
    errors.push('Key must have at least 5 parts (kind:userId:identifier:version:scope)');
  }
  
  // Vérification caractères autorisés
  if (!/^[a-z0-9:-]+$/.test(key)) {
    errors.push('Key contains invalid characters (only a-z, 0-9, :, - allowed)');
  }
  
  // Pas de parties vides
  if (parts.some(part => part === '')) {
    errors.push('Key cannot contain empty parts');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}