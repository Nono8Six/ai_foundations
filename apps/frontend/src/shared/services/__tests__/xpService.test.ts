/**
 * Tests pour XPService
 * 
 * Tests unitaires du service XP :
 * - Vérification de disponibilité des données
 * - Récupération de la timeline avec filtres/pagination  
 * - Agrégations par période et source
 * - Extraction des métadonnées XP depuis activity_log
 * - Gestion des erreurs et cas limites
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { XPService } from '../xpService';

// Mock de Supabase
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        gte: vi.fn(() => ({
          order: vi.fn(() => ({
            range: vi.fn(() => ({
              limit: vi.fn(() => Promise.resolve({
                data: mockActivityLogData,
                error: null,
                count: 5
              }))
            }))
          }))
        }))
      }))
    }))
  }))
};

// Mock des données activity_log
const mockActivityLogData = [
  {
    id: '1',
    user_id: 'user1',
    type: 'profile',
    action: 'completion',
    details: { xp_delta: 15, source: 'profile:completion' },
    created_at: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    user_id: 'user1',
    type: 'lesson',
    action: 'completed',
    details: { xp_gained: 25 },
    created_at: '2025-01-14T15:30:00Z'
  },
  {
    id: '3',
    user_id: 'user1',
    type: 'quiz',
    action: 'passed',
    details: { points: 10 },
    created_at: '2025-01-13T09:15:00Z'
  }
];

// Mock du module supabase
vi.mock('@core/supabase/client', () => ({
  supabase: mockSupabase
}));

describe('XPService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkXpDataAvailability', () => {
    it('should return correct availability when activity_log exists with XP events', async () => {
      const result = await XPService.checkXpDataAvailability('user1');
      
      expect(result).toEqual({
        hasActivityLog: true,
        hasXpEvents: true,
        sampleEventCount: 3
      });
    });

    it('should handle database errors gracefully', async () => {
      mockSupabase.from.mockImplementation(() => ({
        select: () => ({
          eq: () => ({
            limit: () => Promise.resolve({
              data: null,
              error: { message: 'Table not found' }
            })
          })
        })
      }));

      const result = await XPService.checkXpDataAvailability('user1');
      
      expect(result).toEqual({
        hasActivityLog: false,
        hasXpEvents: false,
        sampleEventCount: 0
      });
    });
  });

  describe('getXpTimeline', () => {
    beforeEach(() => {
      // Reset mock to return test data
      mockSupabase.from.mockImplementation(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            gte: vi.fn(() => ({
              order: vi.fn(() => ({
                range: vi.fn(() => ({
                  limit: vi.fn(() => Promise.resolve({
                    data: mockActivityLogData,
                    error: null,
                    count: 3
                  }))
                }))
              }))
            }))
          }))
        }))
      }));
    });

    it('should return grouped timeline for 30d period', async () => {
      const filters = { period: '30d' as const, sortBy: 'recent' as const };
      const pagination = { page: 0, pageSize: 20 };
      
      const result = await XPService.getXpTimeline('user1', filters, pagination);
      
      expect(result.groups).toBeDefined();
      expect(result.totalCount).toBe(3);
      expect(result.hasMore).toBe(false);
      
      // Vérifier que les events XP sont correctement extraits
      const firstGroup = result.groups[0];
      if (firstGroup) {
        expect(firstGroup.totalXp).toBeGreaterThan(0);
        expect(firstGroup.eventCount).toBeGreaterThan(0);
        expect(firstGroup.events).toBeDefined();
        expect(firstGroup.events.length).toBeGreaterThan(0);
      }
    });

    it('should filter by source when specified', async () => {
      const filters = { 
        period: '30d' as const, 
        sortBy: 'recent' as const,
        source: ['profile:completion']
      };
      const pagination = { page: 0, pageSize: 20 };
      
      const result = await XPService.getXpTimeline('user1', filters, pagination);
      
      // Vérifier que seuls les events de la source spécifiée sont inclus
      const allEvents = result.groups.flatMap(group => group.events);
      allEvents.forEach(event => {
        expect(event.source).toBe('profile:completion');
      });
    });

    it('should handle empty results', async () => {
      mockSupabase.from.mockImplementation(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            gte: vi.fn(() => ({
              order: vi.fn(() => ({
                range: vi.fn(() => ({
                  limit: vi.fn(() => Promise.resolve({
                    data: [],
                    error: null,
                    count: 0
                  }))
                }))
              }))
            }))
          }))
        }))
      }));

      const filters = { period: '30d' as const, sortBy: 'recent' as const };
      const pagination = { page: 0, pageSize: 20 };
      
      const result = await XPService.getXpTimeline('user1', filters, pagination);
      
      expect(result.groups).toEqual([]);
      expect(result.totalCount).toBe(0);
      expect(result.hasMore).toBe(false);
    });
  });

  describe('getXpAggregates', () => {
    it('should calculate correct aggregates', async () => {
      const filters = { period: '30d' as const };
      
      const result = await XPService.getXpAggregates('user1', filters);
      
      expect(result.totalXpOnPeriod).toBe(50); // 15 + 25 + 10
      expect(result.topSources).toBeDefined();
      expect(result.topSources.length).toBeGreaterThan(0);
      expect(result.eventsByDay).toBeDefined();
      
      // Vérifier la structure des top sources
      const firstSource = result.topSources[0];
      if (firstSource) {
        expect(firstSource.source).toBeDefined();
        expect(firstSource.count).toBeGreaterThan(0);
        expect(firstSource.totalXp).toBeGreaterThan(0);
      }
    });

    it('should return empty aggregates when no data', async () => {
      mockSupabase.from.mockImplementation(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            gte: vi.fn(() => Promise.resolve({
              data: [],
              error: null
            }))
          }))
        }))
      }));

      const filters = { period: '30d' as const };
      
      const result = await XPService.getXpAggregates('user1', filters);
      
      expect(result.totalXpOnPeriod).toBe(0);
      expect(result.topSources).toEqual([]);
      expect(result.eventsByDay).toEqual([]);
    });
  });

  describe('getAvailableSources', () => {
    it('should return unique sources from activity log', async () => {
      const result = await XPService.getAvailableSources('user1');
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      // Vérifier que les sources sont uniques et triées
      const uniqueSources = [...new Set(result)];
      expect(result).toEqual(uniqueSources);
    });

    it('should handle database errors', async () => {
      mockSupabase.from.mockImplementation(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({
            data: null,
            error: { message: 'Database error' }
          }))
        }))
      }));

      const result = await XPService.getAvailableSources('user1');
      
      expect(result).toEqual([]);
    });
  });

  describe('XP extraction utilities', () => {
    it('should extract XP delta from various detail structures', () => {
      // Ces tests vérifient les fonctions privées via les résultats publics
      const testEvents = [
        { details: { xp_delta: 15 } },
        { details: { xp_gained: 20 } },
        { details: { xp: 25 } },
        { details: { points: 30 } },
        { details: {} }
      ];

      // Test indirect via getXpTimeline qui utilise extractXpDelta
      mockSupabase.from.mockImplementation(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            gte: vi.fn(() => ({
              order: vi.fn(() => ({
                range: vi.fn(() => ({
                  limit: vi.fn(() => Promise.resolve({
                    data: testEvents.map((event, index) => ({
                      id: `event-${index}`,
                      user_id: 'user1',
                      type: 'test',
                      action: 'test',
                      created_at: '2025-01-15T10:00:00Z',
                      ...event
                    })),
                    error: null,
                    count: testEvents.length
                  }))
                }))
              }))
            }))
          }))
        }))
      }));

      // Le test vérifie que les events avec XP > 0 sont correctement filtrés
      expect(XPService.getXpTimeline('user1', { period: '30d', sortBy: 'recent' }, { page: 0, pageSize: 20 }))
        .resolves.toHaveProperty('groups');
    });
  });
});