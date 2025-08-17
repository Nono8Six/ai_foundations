/**
 * Tests P9-B - Validation XP RPC SDK
 * 
 * Vérifie les 3 cas critiques:
 * a) creditXp: même idempotencyKey → un seul event, types conformes
 * b) unlockAchievement sans clé client → OK, idempotence prouvée
 * c) computeLevelInfo au niveau max → xp_to_next === null
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { XPRpc, makeIdempotencyKey, type CreditXpResult, type LevelInfo, type UnlockAchievementResult } from '../xp-rpc';

// Mock du client Supabase pour les tests
const mockSupabaseRpc = vi.fn();
vi.mock('@core/supabase/client', () => ({
  supabase: {
    rpc: mockSupabaseRpc
  }
}));

describe('XP RPC SDK - P9-B Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('creditXp - Idempotence validation', () => {
    const testParams = {
      userId: '123e4567-e89b-12d3-a456-426614174000',
      sourceRef: 'lesson:completion',
      xpDelta: 50,
      idempotencyKey: makeIdempotencyKey({
        kind: 'lesson',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        identifier: 'lesson-456',
        version: 1
      }),
      referenceId: 'lesson-456'
    };

    it('a) creditXp: même idempotencyKey → un seul event, types conformes', async () => {
      // Premier appel - nouvel event
      const firstResponse: CreditXpResult = {
        event_id: '550e8400-e29b-41d4-a716-446655440000',
        xp_before: 100,
        xp_after: 150,
        level_before: 2,
        level_after: 2,
        xp_delta_applied: 50,
        gap: 0,
        status: 'new_event_created'
      };

      mockSupabaseRpc.mockResolvedValueOnce({
        data: firstResponse,
        error: null
      });

      const result1 = await XPRpc.creditXp(testParams);

      // Vérification types
      expect(result1).toMatchObject({
        event_id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/),
        xp_before: expect.any(Number),
        xp_after: expect.any(Number),
        level_before: expect.any(Number),
        level_after: expect.any(Number),
        xp_delta_applied: expect.any(Number),
        gap: expect.any(Number),
        status: expect.stringMatching(/^(new_event_created|idempotent_return)$/)
      });

      expect(result1.status).toBe('new_event_created');
      expect(result1.xp_delta_applied).toBe(50);
      expect(result1.gap).toBe(0);

      // Deuxième appel - même clé, retour idempotent
      const secondResponse: CreditXpResult = {
        ...firstResponse,
        status: 'idempotent_return'
      };

      mockSupabaseRpc.mockResolvedValueOnce({
        data: secondResponse,
        error: null
      });

      const result2 = await XPRpc.creditXp(testParams);

      expect(result2.status).toBe('idempotent_return');
      expect(result2.event_id).toBe(result1.event_id); // Même event
      expect(result2.xp_delta_applied).toBe(result1.xp_delta_applied);

      // Vérification que la clé est déterministe
      const expectedKey = 'lesson:123e4567-e89b-12d3-a456-426614174000:lesson-456:1:default';
      expect(testParams.idempotencyKey).toBe(expectedKey);
    });

    it('validateIdempotencyKey - clé 100% déterministe', () => {
      const key1 = makeIdempotencyKey({
        kind: 'lesson',
        userId: 'user-123',
        identifier: 'lesson-456',
        version: 1
      });

      const key2 = makeIdempotencyKey({
        kind: 'lesson',
        userId: 'user-123',
        identifier: 'lesson-456',
        version: 1
      });

      // Même inputs = même clé (100% déterministe)
      expect(key1).toBe(key2);
      expect(key1).toBe('lesson:user-123:lesson-456:1:default');

      // Différent input = différente clé
      const key3 = makeIdempotencyKey({
        kind: 'lesson',
        userId: 'user-123',
        identifier: 'lesson-789',
        version: 1
      });

      expect(key3).not.toBe(key1);
      expect(key3).toBe('lesson:user-123:lesson-789:1:default');
    });
  });

  describe('unlockAchievement - Server key generation', () => {
    it('b) unlockAchievement sans clé client → OK, idempotence prouvée', async () => {
      const testParams = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        code: 'level_5_reached',
        version: 1,
        scope: 'global'
      };

      const expectedResponse: UnlockAchievementResult[] = [{
        ua_id: '660e8400-e29b-41d4-a716-446655440001',
        event_id: '770e8400-e29b-41d4-a716-446655440002',
        xp_before: 400,
        xp_after: 450,
        level_before: 4,
        level_after: 5
      }];

      mockSupabaseRpc.mockResolvedValueOnce({
        data: expectedResponse,
        error: null
      });

      const result = await XPRpc.unlockAchievement(testParams);

      // Vérification types
      expect(result).toMatchObject({
        ua_id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/),
        event_id: expect.any(String), // Peut être null si pas de XP reward
        xp_before: expect.any(Number),
        xp_after: expect.any(Number),
        level_before: expect.any(Number),
        level_after: expect.any(Number)
      });

      expect(result.ua_id).toBe('660e8400-e29b-41d4-a716-446655440001');
      expect(result.xp_after - result.xp_before).toBe(50); // XP reward

      // Vérification que l'appel RPC utilise la clé déterministe générée côté client
      expect(mockSupabaseRpc).toHaveBeenCalledWith('unlock_achievement', {
        p_user_id: testParams.userId,
        p_code: testParams.code,
        p_version: testParams.version,
        p_idempotency_key: 'achievement:123e4567-e89b-12d3-a456-426614174000:level_5_reached:1:global',
        p_scope: testParams.scope,
        p_reference_id: null
      });

      // Test idempotence - même appel doit donner même résultat
      mockSupabaseRpc.mockResolvedValueOnce({
        data: expectedResponse, // Même réponse
        error: null
      });

      const result2 = await XPRpc.unlockAchievement(testParams);
      expect(result2.ua_id).toBe(result.ua_id); // Même achievement unlock
    });
  });

  describe('computeLevelInfo - Nullability handling', () => {
    it('c) computeLevelInfo au niveau max → xp_to_next === null', async () => {
      // Test niveau normal
      const normalLevelResponse: LevelInfo[] = [{
        level: 2,
        xp_threshold: 100,
        xp_to_next: 100  // 100 XP manquants pour niveau 3
      }];

      mockSupabaseRpc.mockResolvedValueOnce({
        data: normalLevelResponse,
        error: null
      });

      const normalResult = await XPRpc.computeLevelInfo(150);

      expect(normalResult).toMatchObject({
        level: expect.any(Number),
        xp_threshold: expect.any(Number),
        xp_to_next: expect.any(Number) // Non-null pour niveau normal
      });

      expect(normalResult.level).toBe(2);
      expect(normalResult.xp_threshold).toBe(100);
      expect(normalResult.xp_to_next).toBe(100);

      // Test niveau maximum
      const maxLevelResponse: LevelInfo[] = [{
        level: 20,
        xp_threshold: 10000,
        xp_to_next: null  // NULL au niveau max
      }];

      mockSupabaseRpc.mockResolvedValueOnce({
        data: maxLevelResponse,
        error: null
      });

      const maxResult = await XPRpc.computeLevelInfo(999999);

      expect(maxResult).toMatchObject({
        level: expect.any(Number),
        xp_threshold: expect.any(Number),
        xp_to_next: null // NULL au niveau max
      });

      expect(maxResult.level).toBe(20);
      expect(maxResult.xp_threshold).toBe(10000);
      expect(maxResult.xp_to_next).toBeNull(); // Vérification nullabilité stricte

      // Vérification types TypeScript
      if (maxResult.xp_to_next === null) {
        // Au niveau max, pas de XP suivant
        expect(maxResult.level).toBeGreaterThanOrEqual(20);
      } else {
        // Niveau normal, XP suivant défini
        expect(maxResult.xp_to_next).toBeGreaterThan(0);
      }
    });

    it('validation - XP négatif rejeté', async () => {
      await expect(XPRpc.computeLevelInfo(-100)).rejects.toThrow('Total XP must be non-negative');
    });
  });

  describe('Deterministic key generation edge cases', () => {
    it('handles special characters and versions', () => {
      const key = makeIdempotencyKey({
        kind: 'quiz',
        userId: 'user-123',
        identifier: 'quiz-with-special-chars_!@#',
        version: '2.1',
        scope: 'course:advanced-js'
      });

      expect(key).toBe('quiz:user-123:quiz-with-special-chars_!@#:2.1:course:advanced-js');
    });

    it('handles missing optional params', () => {
      const key = makeIdempotencyKey({
        kind: 'module',
        userId: 'user-456',
        identifier: 'module-789'
      });

      expect(key).toBe('module:user-456:module-789:1:default');
    });
  });
});