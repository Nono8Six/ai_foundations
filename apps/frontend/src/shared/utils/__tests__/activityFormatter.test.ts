/**
 * Tests pour activityFormatter
 * 
 * Vérifie le mapping des codes techniques vers libellés humains,
 * le parsing des timestamps relatifs et la gestion des détails JSON.
 */

import { 
  formatActivity, 
  formatActivities, 
  isProfileComplete,
  prettifyDetails,
  type ActivityEvent 
} from '../activityFormatter';

// Mock d'activité typique depuis activity_log
const mockActivityEvent: ActivityEvent = {
  id: 'test-id-1',
  user_id: 'user-123',
  type: 'profile',
  action: 'full_completion',
  details: {
    source: 'profile:full_completion',
    xp_delta: 60,
    xp_before: 0,
    xp_after: 60,
    backfilled: true,
    fields: 5
  },
  created_at: new Date().toISOString()
};

describe('formatActivity', () => {
  it('formate correctement un événement de profil complété', () => {
    const formatted = formatActivity(mockActivityEvent);
    
    expect(formatted.label).toBe('Profil complété');
    expect(formatted.icon).toBe('User');
    expect(formatted.iconColor).toBe('text-green-600');
    expect(formatted.xpDelta).toBe(60);
    expect(formatted.isBackfilled).toBe(true);
    expect(formatted.meta).toContain('5 champ');
  });

  it('gère les sources depuis details.source', () => {
    const event = {
      ...mockActivityEvent,
      details: { source: 'lesson:completed', xp_delta: 20 }
    };
    
    const formatted = formatActivity(event);
    
    expect(formatted.label).toBe('Leçon terminée');
    expect(formatted.icon).toBe('BookOpen');
    expect(formatted.xpDelta).toBe(20);
  });

  it('utilise fallback pour codes inconnus', () => {
    const event = {
      ...mockActivityEvent,
      type: 'unknown',
      action: 'mystery',
      details: {}
    };
    
    const formatted = formatActivity(event);
    
    expect(formatted.label).toBe('unknown mystery');
    expect(formatted.icon).toBe('Activity');
    expect(formatted.iconColor).toBe('text-gray-600');
  });

  it('gère les XP négatifs', () => {
    const event = {
      ...mockActivityEvent,
      type: 'profile',
      action: 'field_removal',
      details: { xp_delta: -10, source: 'profile:field_removal' }
    };
    
    const formatted = formatActivity(event);
    
    expect(formatted.xpDelta).toBe(-10);
    // Le mapping n'existe pas pour field_removal, donc utilise le fallback
    expect(formatted.label).toBe('profile field_removal');
  });

  it('génère des timestamps relatifs courts', () => {
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    const event = {
      ...mockActivityEvent,
      created_at: hourAgo.toISOString()
    };
    
    const formatted = formatActivity(event);
    
    // Vérifie que le format contient les éléments attendus du temps relatif
    expect(formatted.timeAgo).toContain('il y a');
    expect(formatted.timeAgo).toContain('h');
    expect(formatted.timeAgo.length).toBeGreaterThan(5);
  });
});

describe('formatActivities', () => {
  it('formate plusieurs activités', () => {
    const events = [
      mockActivityEvent,
      { ...mockActivityEvent, id: 'test-2', details: { source: 'quiz:passed', xp_delta: 15 } }
    ];
    
    const formatted = formatActivities(events);
    
    expect(formatted).toHaveLength(2);
    expect(formatted[0].label).toBe('Profil complété');
    expect(formatted[1].label).toBe('Quiz réussi');
  });

  it('gère les arrays vides', () => {
    const formatted = formatActivities([]);
    expect(formatted).toEqual([]);
  });
});

describe('isProfileComplete', () => {
  it('retourne true pour profil complet', () => {
    const profile = {
      full_name: 'John Doe',
      avatar_url: 'https://example.com/avatar.jpg',
      phone: '+33123456789',
      profession: 'Developer',
      company: 'ACME Corp'
    };
    
    expect(isProfileComplete(profile)).toBe(true);
  });

  it('retourne false pour profil incomplet', () => {
    const profile = {
      full_name: 'John Doe',
      avatar_url: null,
      phone: '+33123456789',
      profession: '',
      company: 'ACME Corp'
    };
    
    expect(isProfileComplete(profile)).toBe(false);
  });

  it('gère les valeurs null/undefined', () => {
    const profile = {
      full_name: null,
      avatar_url: undefined,
      phone: '',
      profession: 'Developer',
      company: null
    };
    
    expect(isProfileComplete(profile)).toBe(false);
  });
});

describe('prettifyDetails', () => {
  it('nettoie et traduit les détails techniques', () => {
    const details = {
      xp_before: 0,
      xp_after: 60,
      xp_delta: 60,
      source: 'profile:full_completion',
      backfilled: true,
      fields: 5,
      lesson_name: 'React Basics'
    };
    
    const prettified = prettifyDetails(details);
    
    // Vérifie que les champs techniques sont supprimés
    expect(prettified).not.toContain('xp_before');
    expect(prettified).not.toContain('source');
    
    // Vérifie les traductions
    expect(prettified).toContain('Données migrées: true');
    expect(prettified).toContain('Champs complétés: 5');
    expect(prettified).toContain('Nom leçon: "React Basics"');
  });

  it('gère les détails vides', () => {
    const prettified = prettifyDetails({});
    expect(prettified).toBe('');
  });
});

describe('Mapping des activités', () => {
  const testCases = [
    { source: 'profile:full_completion', expectedLabel: 'Profil complété', expectedIcon: 'User' },
    { source: 'lesson:completed', expectedLabel: 'Leçon terminée', expectedIcon: 'BookOpen' },
    { source: 'quiz:perfect', expectedLabel: 'Quiz parfait', expectedIcon: 'Trophy' },
    { source: 'course:completed', expectedLabel: 'Cours terminé', expectedIcon: 'Award' },
    { source: 'achievement:unlocked', expectedLabel: 'Badge débloqué', expectedIcon: 'Medal' },
    { source: 'streak:daily', expectedLabel: 'Série quotidienne', expectedIcon: 'Flame' }
  ];

  testCases.forEach(({ source, expectedLabel, expectedIcon }) => {
    it(`mappe correctement ${source}`, () => {
      const event = {
        ...mockActivityEvent,
        details: { source, xp_delta: 10 }
      };
      
      const formatted = formatActivity(event);
      
      expect(formatted.label).toBe(expectedLabel);
      expect(formatted.icon).toBe(expectedIcon);
    });
  });
});

describe('Génération de meta-information', () => {
  it('inclut les informations contextuelles', () => {
    const event = {
      ...mockActivityEvent,
      type: 'lesson',
      details: {
        lesson_name: 'Introduction à React',
        score: 95,
        duration: 180
      }
    };
    
    const formatted = formatActivity(event);
    
    expect(formatted.meta).toContain('Introduction à React');
    expect(formatted.meta).toContain('95%');
    expect(formatted.meta).toContain('3 min');
  });

  it('ne génère pas de meta vide', () => {
    const event = {
      ...mockActivityEvent,
      details: {}
    };
    
    const formatted = formatActivity(event);
    
    expect(formatted.meta).toBe('');
  });
});