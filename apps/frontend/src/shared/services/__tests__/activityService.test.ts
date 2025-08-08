/**
 * Tests pour ActivityService
 * 
 * Mock des appels Supabase et vérification des requêtes,
 * filtres, pagination et agrégations.
 */

import { ActivityService } from '../activityService';

// Mock Supabase client
const mockSupabaseQuery = {
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  gte: jest.fn().mockReturnThis(),
  in: jest.fn().mockReturnThis(),
  not: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  range: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis()
};

const mockSupabase = {
  from: jest.fn(() => mockSupabaseQuery)
};

// Mock du module supabase
jest.mock('@core/supabase/client', () => ({
  supabase: mockSupabase
}));

describe('ActivityService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserActivities', () => {
    const mockActivities = [
      {
        id: 'activity-1',
        user_id: 'user-123',
        type: 'profile',
        action: 'full_completion',
        details: { xp_delta: 60 },
        created_at: '2025-01-08T10:00:00Z'
      },
      {
        id: 'activity-2',
        user_id: 'user-123',
        type: 'lesson',
        action: 'completed',
        details: { xp_delta: 20 },
        created_at: '2025-01-07T15:30:00Z'
      }
    ];

    it('récupère les activités avec filtres par défaut', async () => {
      mockSupabaseQuery.range = jest.fn().mockResolvedValue({
        data: mockActivities,
        error: null,
        count: 2
      });

      const result = await ActivityService.getUserActivities('user-123');

      expect(mockSupabase.from).toHaveBeenCalledWith('activity_log');
      expect(mockSupabaseQuery.eq).toHaveBeenCalledWith('user_id', 'user-123');
      expect(mockSupabaseQuery.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result.activities).toHaveLength(2);
      expect(result.totalCount).toBe(2);
    });

    it('applique les filtres de période', async () => {
      mockSupabaseQuery.range = jest.fn().mockResolvedValue({
        data: mockActivities,
        error: null,
        count: 2
      });

      await ActivityService.getUserActivities('user-123', { period: '30d' });

      expect(mockSupabaseQuery.gte).toHaveBeenCalledWith('created_at', expect.any(String));
    });

    it('filtre par types d\'activité', async () => {
      mockSupabaseQuery.range = jest.fn().mockResolvedValue({
        data: mockActivities,
        error: null,
        count: 2
      });

      await ActivityService.getUserActivities('user-123', { types: ['profile', 'lesson'] });

      expect(mockSupabaseQuery.in).toHaveBeenCalledWith('type', ['profile', 'lesson']);
    });

    it('filtre les activités avec XP seulement', async () => {
      mockSupabaseQuery.range = jest.fn().mockResolvedValue({
        data: mockActivities,
        error: null,
        count: 2
      });

      await ActivityService.getUserActivities('user-123', { hasXP: true });

      expect(mockSupabaseQuery.not).toHaveBeenCalledWith('details->xp_delta', 'is', null);
    });

    it('gère les erreurs Supabase', async () => {
      mockSupabaseQuery.range = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
        count: null
      });

      const result = await ActivityService.getUserActivities('user-123');

      expect(result.activities).toEqual([]);
      expect(result.totalCount).toBe(0);
      expect(result.hasMore).toBe(false);
    });

    it('applique la pagination correctement', async () => {
      mockSupabaseQuery.range = jest.fn().mockResolvedValue({
        data: mockActivities,
        error: null,
        count: 100
      });

      await ActivityService.getUserActivities(
        'user-123',
        {},
        { page: 2, pageSize: 10 }
      );

      expect(mockSupabaseQuery.range).toHaveBeenCalledWith(20, 29); // page 2, size 10
    });
  });

  describe('getRecentActivities', () => {
    it('récupère les activités récentes avec limite', async () => {
      const mockData = [mockActivities[0]];
      
      mockSupabaseQuery.limit = jest.fn().mockResolvedValue({
        data: mockData,
        error: null
      });

      const result = await ActivityService.getRecentActivities('user-123', 5);

      expect(mockSupabaseQuery.limit).toHaveBeenCalledWith(5);
      expect(result).toHaveLength(1);
    });

    it('gère les erreurs de récupération', async () => {
      mockSupabaseQuery.limit = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Error' }
      });

      const result = await ActivityService.getRecentActivities('user-123');

      expect(result).toEqual([]);
    });
  });

  describe('getActivityAggregates', () => {
    const mockAggregateData = [
      {
        type: 'profile',
        action: 'completed',
        details: { xp_delta: 60 },
        created_at: '2025-01-08T10:00:00Z'
      },
      {
        type: 'lesson',
        action: 'completed', 
        details: { xp_delta: 20 },
        created_at: '2025-01-07T15:30:00Z'
      },
      {
        type: 'lesson',
        action: 'completed',
        details: { xp_delta: 25 },
        created_at: '2025-01-06T12:00:00Z'
      }
    ];

    it('calcule les agrégations correctement', async () => {
      mockSupabaseQuery.select = jest.fn().mockResolvedValue({
        data: mockAggregateData,
        error: null
      });

      const result = await ActivityService.getActivityAggregates('user-123');

      expect(result.totalXP).toBe(105); // 60 + 20 + 25
      expect(result.totalEvents).toBe(3);
      expect(result.topTypes).toHaveLength(2); // profile et lesson
      expect(result.topTypes[0].type).toBe('lesson'); // Plus d'XP total (45 vs 60)
      expect(result.eventsByDay).toHaveLength(3); // 3 jours différents
    });

    it('gère les données vides', async () => {
      mockSupabaseQuery.select = jest.fn().mockResolvedValue({
        data: [],
        error: null
      });

      const result = await ActivityService.getActivityAggregates('user-123');

      expect(result.totalXP).toBe(0);
      expect(result.totalEvents).toBe(0);
      expect(result.topTypes).toEqual([]);
      expect(result.eventsByDay).toEqual([]);
    });

    it('filtre correctement par période', async () => {
      mockSupabaseQuery.select = jest.fn().mockResolvedValue({
        data: mockAggregateData,
        error: null
      });

      await ActivityService.getActivityAggregates('user-123', { period: '30d' });

      expect(mockSupabaseQuery.gte).toHaveBeenCalledWith('created_at', expect.any(String));
    });
  });

  describe('getAvailableTypes', () => {
    it('retourne les types uniques triés', async () => {
      mockSupabaseQuery.order = jest.fn().mockResolvedValue({
        data: [
          { type: 'lesson' },
          { type: 'profile' },
          { type: 'lesson' }, // Doublon
          { type: 'quiz' }
        ],
        error: null
      });

      const result = await ActivityService.getAvailableTypes('user-123');

      expect(result).toEqual(['lesson', 'profile', 'quiz']);
    });
  });

  describe('hasXPActivities', () => {
    it('retourne true si activités XP trouvées', async () => {
      mockSupabaseQuery.limit = jest.fn().mockResolvedValue({
        data: [{ id: 'activity-1' }],
        error: null
      });

      const result = await ActivityService.hasXPActivities('user-123');

      expect(result).toBe(true);
      expect(mockSupabaseQuery.not).toHaveBeenCalledWith('details->xp_delta', 'is', null);
    });

    it('retourne false si pas d\'activités XP', async () => {
      mockSupabaseQuery.limit = jest.fn().mockResolvedValue({
        data: [],
        error: null
      });

      const result = await ActivityService.hasXPActivities('user-123');

      expect(result).toBe(false);
    });
  });

  describe('Gestion des erreurs', () => {
    it('gère les exceptions JavaScript', async () => {
      mockSupabase.from.mockImplementation(() => {
        throw new Error('Network error');
      });

      const result = await ActivityService.getUserActivities('user-123');

      expect(result.activities).toEqual([]);
      expect(result.totalCount).toBe(0);
    });
  });

  describe('Filtres de période', () => {
    beforeEach(() => {
      // Mock Date.now() pour tests consistants
      const mockDate = new Date('2025-01-08T12:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calcule correctement la date de début pour 30d', async () => {
      mockSupabaseQuery.range = jest.fn().mockResolvedValue({
        data: [],
        error: null,
        count: 0
      });

      await ActivityService.getUserActivities('user-123', { period: '30d' });

      expect(mockSupabaseQuery.gte).toHaveBeenCalledWith(
        'created_at',
        expect.stringMatching(/2024-12-09/)
      );
    });

    it('ne filtre pas pour période "all"', async () => {
      mockSupabaseQuery.range = jest.fn().mockResolvedValue({
        data: [],
        error: null,
        count: 0
      });

      await ActivityService.getUserActivities('user-123', { period: 'all' });

      expect(mockSupabaseQuery.gte).not.toHaveBeenCalled();
    });
  });
});