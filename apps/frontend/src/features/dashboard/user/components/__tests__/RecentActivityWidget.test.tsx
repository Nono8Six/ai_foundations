/**
 * Tests pour RecentActivityWidget
 * 
 * Vérifie l'affichage du widget avec données réelles,
 * état de chargement et état vide élégant.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import RecentActivityWidget from '../RecentActivityWidget';
import { ActivityService } from '@shared/services/activityService';

// Mock du service et des composants
jest.mock('@shared/services/activityService');
jest.mock('@shared/components/AppIcon', () => {
  return function MockIcon({ name, size, className }: { name: string, size: number, className: string }) {
    return <span data-testid={`icon-${name}`} data-size={size} className={className}>{name}</span>;
  };
});

jest.mock('@shared/components/activity/ActivityItem', () => {
  return function MockActivityItem({ activity }: { activity: any }) {
    return (
      <div data-testid="activity-item">
        {activity.label} - {activity.xpDelta ? `${activity.xpDelta > 0 ? '+' : ''}${activity.xpDelta} XP` : ''}
      </div>
    );
  };
});

const mockActivityService = ActivityService as jest.Mocked<typeof ActivityService>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

const mockActivities = [
  {
    id: 'activity-1',
    user_id: 'user-123',
    type: 'profile',
    action: 'full_completion',
    details: { xp_delta: 60, source: 'profile:full_completion' },
    created_at: '2025-01-08T10:00:00Z'
  },
  {
    id: 'activity-2',
    user_id: 'user-123',
    type: 'lesson',
    action: 'completed',
    details: { xp_delta: 20, source: 'lesson:completed' },
    created_at: '2025-01-07T15:30:00Z'
  }
];

describe('RecentActivityWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche le titre du widget', () => {
    mockActivityService.getRecentActivities.mockResolvedValue([]);
    
    render(
      <RecentActivityWidget userId="user-123" />,
      { wrapper: createWrapper() }
    );
    
    expect(screen.getByText('Activité récente')).toBeInTheDocument();
  });

  it('affiche l\'état de chargement', () => {
    mockActivityService.getRecentActivities.mockImplementation(
      () => new Promise(() => {}) // Promise qui ne se résout jamais
    );
    
    render(
      <RecentActivityWidget userId="user-123" />,
      { wrapper: createWrapper() }
    );
    
    expect(screen.getAllByText('', { selector: '.animate-pulse' })).toHaveLength(3);
  });

  it('affiche les activités formatées', async () => {
    mockActivityService.getRecentActivities.mockResolvedValue(mockActivities);
    
    render(
      <RecentActivityWidget userId="user-123" />,
      { wrapper: createWrapper() }
    );
    
    await waitFor(() => {
      expect(screen.getByText('Profil complété - +60 XP')).toBeInTheDocument();
      expect(screen.getByText('Leçon terminée - +20 XP')).toBeInTheDocument();
    });
    
    expect(screen.getAllByTestId('activity-item')).toHaveLength(2);
  });

  it('affiche le lien "Voir tout" quand il y a des activités', async () => {
    mockActivityService.getRecentActivities.mockResolvedValue(mockActivities);
    
    render(
      <RecentActivityWidget userId="user-123" />,
      { wrapper: createWrapper() }
    );
    
    await waitFor(() => {
      expect(screen.getAllByText('Voir tout')).toHaveLength(2); // Header + Footer
    });
    
    const links = screen.getAllByRole('link', { name: 'Voir tout' });
    expect(links[0]).toHaveAttribute('href', '/profile?tab=stats');
  });

  it('affiche l\'état vide élégant sans activités', async () => {
    mockActivityService.getRecentActivities.mockResolvedValue([]);
    
    render(
      <RecentActivityWidget userId="user-123" />,
      { wrapper: createWrapper() }
    );
    
    await waitFor(() => {
      expect(screen.getByText('Prêt à commencer ?')).toBeInTheDocument();
      expect(screen.getByText('Vos activités d\'apprentissage apparaîtront ici')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Explorer les cours' })).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('icon-Sparkles')).toBeInTheDocument();
  });

  it('n\'affiche pas le lien "Voir tout" sans activités', async () => {
    mockActivityService.getRecentActivities.mockResolvedValue([]);
    
    render(
      <RecentActivityWidget userId="user-123" />,
      { wrapper: createWrapper() }
    );
    
    await waitFor(() => {
      expect(screen.getByText('Prêt à commencer ?')).toBeInTheDocument();
    });
    
    expect(screen.queryByText('Voir tout')).not.toBeInTheDocument();
  });

  it('gère les erreurs de chargement', async () => {
    mockActivityService.getRecentActivities.mockRejectedValue(new Error('Network error'));
    
    render(
      <RecentActivityWidget userId="user-123" />,
      { wrapper: createWrapper() }
    );
    
    await waitFor(() => {
      expect(screen.getByText('Impossible de charger votre activité récente')).toBeInTheDocument();
      expect(screen.getByTestId('icon-AlertCircle')).toBeInTheDocument();
    });
  });

  it('ne fait pas de requête sans userId', () => {
    mockActivityService.getRecentActivities.mockResolvedValue([]);
    
    render(
      <RecentActivityWidget userId={undefined} />,
      { wrapper: createWrapper() }
    );
    
    expect(mockActivityService.getRecentActivities).not.toHaveBeenCalled();
  });

  it('respecte la limite d\'activités', async () => {
    mockActivityService.getRecentActivities.mockResolvedValue(mockActivities);
    
    render(
      <RecentActivityWidget userId="user-123" limit={3} />,
      { wrapper: createWrapper() }
    );
    
    await waitFor(() => {
      expect(mockActivityService.getRecentActivities).toHaveBeenCalledWith('user-123', 3);
    });
  });

  it('applique les classes CSS personnalisées', () => {
    mockActivityService.getRecentActivities.mockResolvedValue([]);
    
    const { container } = render(
      <RecentActivityWidget userId="user-123" className="custom-widget-class" />,
      { wrapper: createWrapper() }
    );
    
    expect(container.firstChild).toHaveClass('custom-widget-class');
  });

  describe('Intégration avec formatters', () => {
    it('transforme les événements bruts en affichage humanisé', async () => {
      const rawActivity = {
        id: 'test-activity',
        user_id: 'user-123',
        type: 'quiz',
        action: 'perfect',
        details: { 
          xp_delta: 25, 
          source: 'quiz:perfect',
          score: 100 
        },
        created_at: '2025-01-08T14:00:00Z'
      };
      
      mockActivityService.getRecentActivities.mockResolvedValue([rawActivity]);
      
      render(
        <RecentActivityWidget userId="user-123" />,
        { wrapper: createWrapper() }
      );
      
      await waitFor(() => {
        // Vérifie que le libellé humain est affiché (pas le JSON brut)
        expect(screen.getByText('Quiz parfait - +25 XP')).toBeInTheDocument();
        expect(screen.queryByText('quiz:perfect')).not.toBeInTheDocument();
        expect(screen.queryByText('{"xp_delta"')).not.toBeInTheDocument();
      });
    });
  });

  describe('Lignes de connexion timeline', () => {
    it('affiche les lignes de connexion entre activités', async () => {
      mockActivityService.getRecentActivities.mockResolvedValue(mockActivities);
      
      const { container } = render(
        <RecentActivityWidget userId="user-123" />,
        { wrapper: createWrapper() }
      );
      
      await waitFor(() => {
        // Cherche les lignes de connexion CSS
        const connectionLines = container.querySelectorAll('.absolute.left-4.top-12.w-0\\.5.h-8');
        expect(connectionLines.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Accessibilité', () => {
    it('a les bons roles et labels ARIA', async () => {
      mockActivityService.getRecentActivities.mockResolvedValue(mockActivities);
      
      render(
        <RecentActivityWidget userId="user-123" />,
        { wrapper: createWrapper() }
      );
      
      await waitFor(() => {
        expect(screen.getByRole('link', { name: 'Voir tout' })).toBeInTheDocument();
      });
    });
  });
});