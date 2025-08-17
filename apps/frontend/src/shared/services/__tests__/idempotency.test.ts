/**
 * Tests Idempotency Service - P9-B Validation
 * 
 * Vérifie:
 * - Déterminisme (même input = même output)
 * - Pas de randomness (timestamp/UUID)
 * - Détection collisions (même user, scopes différents)
 * - Normalisation correcte
 * - Ordre stable des métadonnées
 */

import { describe, it, expect } from 'vitest';
import { 
  makeIdempotencyKey, 
  IdempotencyKeys,
  detectKeyCollision,
  validateIdempotencyKey,
  type IdempotencyKeyParams
} from '../idempotency';

describe('Idempotency Service', () => {
  
  describe('makeIdempotencyKey - Determinism', () => {
    it('génère des clés identiques pour des inputs identiques', () => {
      const params: IdempotencyKeyParams = {
        kind: 'lesson',
        userId: 'user-123',
        identifier: 'lesson-456',
        version: 1,
        scope: 'course-789'
      };

      const key1 = makeIdempotencyKey(params);
      const key2 = makeIdempotencyKey(params);
      const key3 = makeIdempotencyKey({ ...params }); // Spread object

      expect(key1).toBe(key2);
      expect(key2).toBe(key3);
      expect(key1).toBe('lesson:user-123:lesson-456:1:course-789');
    });

    it('génère des clés identiques même avec ordre différent des métadonnées', () => {
      const params1: IdempotencyKeyParams = {
        kind: 'quiz',
        userId: 'user-123',
        identifier: 'quiz-456',
        metadata: { attempt: 2, mode: 'practice', difficulty: 'hard' }
      };

      const params2: IdempotencyKeyParams = {
        kind: 'quiz',
        userId: 'user-123', 
        identifier: 'quiz-456',
        metadata: { difficulty: 'hard', mode: 'practice', attempt: 2 } // Ordre différent
      };

      const key1 = makeIdempotencyKey(params1);
      const key2 = makeIdempotencyKey(params2);

      expect(key1).toBe(key2);
      expect(key1).toBe('quiz:user-123:quiz-456:1:default:attempt-2:difficulty-hard:mode-practice');
    });

    it('pas de randomness - aucun timestamp ou UUID', () => {
      const params: IdempotencyKeyParams = {
        kind: 'achievement',
        userId: 'user-123',
        identifier: 'level-5'
      };

      // Générer 100 clés avec les mêmes paramètres
      const keys = Array.from({ length: 100 }, () => makeIdempotencyKey(params));
      
      // Toutes doivent être identiques
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(1);
      
      // Aucune ne doit contenir de timestamp/UUID pattern
      const key = keys[0];
      expect(key).not.toMatch(/\d{10,}/); // Pas de timestamp
      expect(key).not.toMatch(/[0-9a-f]{8}-[0-9a-f]{4}/); // Pas d'UUID pattern
      expect(key).toBe('achievement:user-123:level-5:1:default');
    });
  });

  describe('Collision Detection', () => {
    it('détecte les collisions attendues', () => {
      const keys = [
        'lesson:user-123:lesson-456:1:default',
        'lesson:user-123:lesson-456:1:default', // Duplicate volontaire
        'lesson:user-456:lesson-456:1:default'   // Différent
      ];

      const result = detectKeyCollision(keys);
      
      expect(result.hasCollisions).toBe(true);
      expect(result.collisions).toHaveLength(1);
      expect(result.collisions[0]).toEqual({
        key: 'lesson:user-123:lesson-456:1:default',
        count: 2
      });
    });

    it('même user, scopes différents → clés différentes', () => {
      const baseParams = {
        kind: 'lesson',
        userId: 'user-123',
        identifier: 'lesson-456',
        version: 1
      };

      const keys = [
        makeIdempotencyKey({ ...baseParams, scope: 'course-789' }),
        makeIdempotencyKey({ ...baseParams, scope: 'course-abc' }),
        makeIdempotencyKey({ ...baseParams, scope: 'practice' }),
        makeIdempotencyKey({ ...baseParams, scope: 'exam' })
      ];

      // Vérifier que toutes les clés sont différentes
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(4);

      // Vérifier le contenu des clés
      expect(keys[0]).toBe('lesson:user-123:lesson-456:1:course-789');
      expect(keys[1]).toBe('lesson:user-123:lesson-456:1:course-abc');
      expect(keys[2]).toBe('lesson:user-123:lesson-456:1:practice');
      expect(keys[3]).toBe('lesson:user-123:lesson-456:1:exam');

      // Aucune collision
      const collisionResult = detectKeyCollision(keys);
      expect(collisionResult.hasCollisions).toBe(false);
    });

    it('même identifiant, users différents → clés différentes', () => {
      const baseParams = {
        kind: 'achievement',
        identifier: 'level-10',
        version: 1
      };

      const keys = [
        makeIdempotencyKey({ ...baseParams, userId: 'user-123' }),
        makeIdempotencyKey({ ...baseParams, userId: 'user-456' }),
        makeIdempotencyKey({ ...baseParams, userId: 'user-789' }),
        makeIdempotencyKey({ ...baseParams, userId: 'user-abc' })
      ];

      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(4);

      const collisionResult = detectKeyCollision(keys);
      expect(collisionResult.hasCollisions).toBe(false);
    });
  });

  describe('Normalization', () => {
    it('normalise trim, lowercase, et caractères spéciaux', () => {
      const params: IdempotencyKeyParams = {
        kind: '  LESSON  ',
        userId: 'User-123@Domain.COM',
        identifier: 'Lesson_456#Special!Chars',
        version: '2.1-beta',
        scope: 'Course 789 (Advanced)'
      };

      const key = makeIdempotencyKey(params);
      
      // Tout doit être normalisé
      expect(key).toBe('lesson:user-123-domain-com:lesson-456-special-chars:2-1-beta:course-789-advanced');
      
      // Pas de caractères spéciaux restants
      expect(key).toMatch(/^[a-z0-9:-]+$/);
    });

    it('normalise les métadonnées avec caractères spéciaux', () => {
      const params: IdempotencyKeyParams = {
        kind: 'quiz',
        userId: 'user-123',
        identifier: 'quiz-456',
        metadata: {
          'User Input!': 'Value@123',
          'MODE_TYPE': 'PRACTICE-Session',
          '  difficulty  ': '  HARD  '
        }
      };

      const key = makeIdempotencyKey(params);
      
      // Métadonnées normalisées et triées
      expect(key).toBe('quiz:user-123:quiz-456:1:default:difficulty-hard:mode-type-practice-session:user-input-value-123');
    });

    it('ignore les métadonnées vides ou nulles', () => {
      const params: IdempotencyKeyParams = {
        kind: 'lesson',
        userId: 'user-123',
        identifier: 'lesson-456',
        metadata: {
          validKey: 'validValue',
          emptyKey: '',
          nullKey: null as any,
          undefinedKey: undefined as any,
          zeroValue: 0,
          falseValue: false as any
        }
      };

      const key = makeIdempotencyKey(params);
      
      // Seules les valeurs valides doivent être incluses (false is treated as valid)
      expect(key).toBe('lesson:user-123:lesson-456:1:default:falsevalue-false:validkey-validvalue:zerovalue-0');
    });
  });

  describe('Validation', () => {
    it('valide les paramètres requis', () => {
      expect(() => makeIdempotencyKey({} as any)).toThrow('kind is required');
      expect(() => makeIdempotencyKey({ kind: 'test' } as any)).toThrow('userId is required');
      expect(() => makeIdempotencyKey({ kind: 'test', userId: 'user' } as any)).toThrow('identifier is required');
      
      expect(() => makeIdempotencyKey({ 
        kind: '', 
        userId: 'user', 
        identifier: 'id' 
      })).toThrow('kind is required');
      
      expect(() => makeIdempotencyKey({ 
        kind: 'test', 
        userId: '   ', 
        identifier: 'id' 
      })).toThrow('userId is required');
    });

    it('valide la longueur maximale', () => {
      const longParams: IdempotencyKeyParams = {
        kind: 'a'.repeat(50),
        userId: 'b'.repeat(50),
        identifier: 'c'.repeat(50),
        version: 'd'.repeat(50),
        scope: 'e'.repeat(50),
        metadata: Object.fromEntries(
          Array.from({ length: 10 }, (_, i) => [`key${i}${'x'.repeat(20)}`, `value${i}${'y'.repeat(20)}`])
        )
      };

      expect(() => makeIdempotencyKey(longParams)).toThrow('too long');
    });

    it('validateIdempotencyKey fonctionne correctement', () => {
      // Clé valide
      const validKey = 'lesson:user-123:lesson-456:1:default';
      const validResult = validateIdempotencyKey(validKey);
      expect(validResult.valid).toBe(true);
      expect(validResult.errors).toHaveLength(0);

      // Clé trop courte
      const shortResult = validateIdempotencyKey('abc');
      expect(shortResult.valid).toBe(false);
      expect(shortResult.errors).toContain('Key must be at least 8 characters');

      // Clé avec structure invalide
      const invalidStructureResult = validateIdempotencyKey('only:three:parts');
      expect(invalidStructureResult.valid).toBe(false);
      expect(invalidStructureResult.errors).toContain('Key must have at least 5 parts (kind:userId:identifier:version:scope)');

      // Clé avec caractères invalides
      const invalidCharsResult = validateIdempotencyKey('test:user:id:1:scope:with spaces');
      expect(invalidCharsResult.valid).toBe(false);
      expect(invalidCharsResult.errors).toContain('Key contains invalid characters (only a-z, 0-9, :, - allowed)');
    });
  });

  describe('Helper Functions', () => {
    it('IdempotencyKeys.creditXp génère correctement', () => {
      const key = IdempotencyKeys.creditXp('user-123', 'lesson:completion', 'lesson-456');
      expect(key).toBe('credit-xp:user-123:lesson-completion:1:lesson-456');
    });

    it('IdempotencyKeys.unlockAchievement génère correctement', () => {
      const key = IdempotencyKeys.unlockAchievement('user-123', 'level-5', 2, 'course-789');
      expect(key).toBe('achievement:user-123:level-5:2:course-789');
    });

    it('IdempotencyKeys.lessonProgress génère correctement', () => {
      const key = IdempotencyKeys.lessonProgress('user-123', 'lesson-456', 'completed');
      expect(key).toBe('lesson-progress:user-123:lesson-456:1:default:status-completed');
    });

    it('IdempotencyKeys.profileAction génère correctement', () => {
      const key = IdempotencyKeys.profileAction('user-123', 'avatar-upload', 'avatar');
      expect(key).toBe('profile:user-123:avatar-upload:1:avatar');
    });
  });

  describe('Edge Cases', () => {
    it('gère les versions et scopes par défaut', () => {
      const key = makeIdempotencyKey({
        kind: 'test',
        userId: 'user-123',
        identifier: 'test-456'
      });
      
      expect(key).toBe('test:user-123:test-456:1:default');
    });

    it('gère les versions numériques et string', () => {
      const numKey = makeIdempotencyKey({
        kind: 'test',
        userId: 'user-123',
        identifier: 'test-456',
        version: 42
      });
      
      const strKey = makeIdempotencyKey({
        kind: 'test',
        userId: 'user-123',
        identifier: 'test-456',
        version: '42'
      });
      
      expect(numKey).toBe(strKey);
      expect(numKey).toBe('test:user-123:test-456:42:default');
    });

    it('consolide les tirets multiples', () => {
      const key = makeIdempotencyKey({
        kind: 'test---with---dashes',
        userId: 'user@@@123',
        identifier: 'test___456',
        scope: 'scope!!!with!!!special'
      });
      
      expect(key).toBe('test-with-dashes:user-123:test-456:1:scope-with-special');
    });
  });

  describe('Performance & Stress Tests', () => {
    it('génère 1000 clés rapidement', () => {
      const startTime = performance.now();
      
      const keys = Array.from({ length: 1000 }, (_, i) => 
        makeIdempotencyKey({
          kind: 'test',
          userId: `user-${i}`,
          identifier: `test-${i}`,
          version: i % 10,
          scope: `scope-${i % 5}`
        })
      );
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(keys).toHaveLength(1000);
      expect(duration).toBeLessThan(100); // Moins de 100ms
      
      // Vérifier qu'il n'y a pas de collisions inattendues
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(1000);
    });

    it('gère de nombreuses métadonnées sans problème', () => {
      const metadata = Object.fromEntries(
        Array.from({ length: 10 }, (_, i) => [`key${i}`, `value${i}`]) // Reduce to avoid length limit
      );
      
      const key = makeIdempotencyKey({
        kind: 'test',
        userId: 'user-123',
        identifier: 'test-456',
        metadata
      });
      
      expect(key).toContain('key0-value0');
      expect(key).toContain('key9-value9');
      expect(key.split(':').length).toBe(15); // 5 base + 10 metadata
    });
  });
});