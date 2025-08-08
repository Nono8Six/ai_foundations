/**
 * Tests pour ActivityItem
 * 
 * Vérifie l'affichage des libellés humains, badges XP,
 * popover des détails et différentes tailles.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActivityItem from '../ActivityItem';
import { FormattedActivity } from '@shared/utils/activityFormatter';

// Mock d'Icon
jest.mock('@shared/components/AppIcon', () => {
  return function MockIcon({ name, size, className }: { name: string, size: number, className: string }) {
    return <span data-testid={`icon-${name}`} data-size={size} className={className}>{name}</span>;
  };
});

const mockFormattedActivity: FormattedActivity = {
  id: 'activity-1',
  label: 'Profil complété',
  icon: 'User',
  iconColor: 'text-green-600',
  xpDelta: 60,
  meta: '5 champs • Complété',
  timeAgo: 'il y a 2 h',
  isBackfilled: false,
  rawDetails: {
    source: 'profile:full_completion',
    xp_delta: 60,
    fields: 5
  }
};

describe('ActivityItem', () => {
  it('affiche les informations de base correctement', () => {
    render(<ActivityItem activity={mockFormattedActivity} />);
    
    expect(screen.getByText('Profil complété')).toBeInTheDocument();
    expect(screen.getByText('5 champs • Complété')).toBeInTheDocument();
    expect(screen.getByText('il y a 2 h')).toBeInTheDocument();
    expect(screen.getByTestId('icon-User')).toBeInTheDocument();
  });

  it('affiche le badge XP positif', () => {
    render(<ActivityItem activity={mockFormattedActivity} />);
    
    const xpBadge = screen.getByText('+60 XP');
    expect(xpBadge).toBeInTheDocument();
    expect(xpBadge).toHaveClass('bg-green-100', 'text-green-700');
  });

  it('affiche le badge XP négatif avec couleur appropriée', () => {
    const activityWithNegativeXP = {
      ...mockFormattedActivity,
      xpDelta: -10
    };
    
    render(<ActivityItem activity={activityWithNegativeXP} />);
    
    const xpBadge = screen.getByText('-10 XP');
    expect(xpBadge).toBeInTheDocument();
    expect(xpBadge).toHaveClass('bg-red-100', 'text-red-700');
  });

  it('n\'affiche pas le badge XP si delta = 0', () => {
    const activityWithoutXP = {
      ...mockFormattedActivity,
      xpDelta: 0
    };
    
    render(<ActivityItem activity={activityWithoutXP} />);
    
    expect(screen.queryByText('XP')).not.toBeInTheDocument();
  });

  it('affiche le badge "Migré" pour les activités backfillées', () => {
    const backfilledActivity = {
      ...mockFormattedActivity,
      isBackfilled: true
    };
    
    render(<ActivityItem activity={backfilledActivity} />);
    
    expect(screen.getByText('Migré')).toBeInTheDocument();
  });

  it('n\'affiche pas le badge "Migré" pour les activités normales', () => {
    render(<ActivityItem activity={mockFormattedActivity} />);
    
    expect(screen.queryByText('Migré')).not.toBeInTheDocument();
  });

  describe('Tailles du composant', () => {
    it('applique les classes CSS pour taille small', () => {
      render(<ActivityItem activity={mockFormattedActivity} size="sm" />);
      
      const icon = screen.getByTestId('icon-User');
      expect(icon).toHaveAttribute('data-size', '14');
    });

    it('applique les classes CSS pour taille large', () => {
      render(<ActivityItem activity={mockFormattedActivity} size="lg" />);
      
      const icon = screen.getByTestId('icon-User');
      expect(icon).toHaveAttribute('data-size', '20');
    });
  });

  describe('Popover des détails', () => {
    it('affiche le bouton détails quand showDetails=true', () => {
      render(
        <ActivityItem 
          activity={mockFormattedActivity} 
          showDetails={true} 
        />
      );
      
      expect(screen.getByText('Détails')).toBeInTheDocument();
    });

    it('n\'affiche pas le bouton détails par défaut', () => {
      render(<ActivityItem activity={mockFormattedActivity} />);
      
      expect(screen.queryByText('Détails')).not.toBeInTheDocument();
    });

    it('ouvre le popover au clic sur détails', () => {
      render(
        <ActivityItem 
          activity={mockFormattedActivity} 
          showDetails={true} 
        />
      );
      
      const detailsButton = screen.getByText('Détails');
      fireEvent.click(detailsButton);
      
      expect(screen.getByText('Détails techniques')).toBeInTheDocument();
      expect(screen.getByText(/source.*profile:full_completion/)).toBeInTheDocument();
    });

    it('ferme le popover au clic sur X', () => {
      render(
        <ActivityItem 
          activity={mockFormattedActivity} 
          showDetails={true} 
        />
      );
      
      // Ouvrir le popover
      fireEvent.click(screen.getByText('Détails'));
      expect(screen.getByText('Détails techniques')).toBeInTheDocument();
      
      // Fermer le popover
      const closeButton = screen.getByTestId('icon-X');
      fireEvent.click(closeButton);
      expect(screen.queryByText('Détails techniques')).not.toBeInTheDocument();
    });

    it('ferme le popover au clic sur overlay', () => {
      render(
        <ActivityItem 
          activity={mockFormattedActivity} 
          showDetails={true} 
        />
      );
      
      // Ouvrir le popover
      fireEvent.click(screen.getByText('Détails'));
      
      // Fermer via overlay (div avec fixed inset-0)
      const overlay = document.querySelector('.fixed.inset-0');
      expect(overlay).toBeInTheDocument();
      
      fireEvent.click(overlay!);
      expect(screen.queryByText('Détails techniques')).not.toBeInTheDocument();
    });

    it('n\'affiche pas le bouton détails si pas de rawDetails', () => {
      const activityWithoutDetails = {
        ...mockFormattedActivity,
        rawDetails: {}
      };
      
      render(
        <ActivityItem 
          activity={activityWithoutDetails} 
          showDetails={true} 
        />
      );
      
      expect(screen.queryByText('Détails')).not.toBeInTheDocument();
    });
  });

  describe('Gestion du contenu', () => {
    it('n\'affiche pas la meta si vide', () => {
      const activityWithoutMeta = {
        ...mockFormattedActivity,
        meta: ''
      };
      
      render(<ActivityItem activity={activityWithoutMeta} />);
      
      // Le label doit être présent mais pas la meta
      expect(screen.getByText('Profil complété')).toBeInTheDocument();
      expect(screen.queryByText('5 champs • Complété')).not.toBeInTheDocument();
    });

    it('applique la couleur d\'icône correctement', () => {
      render(<ActivityItem activity={mockFormattedActivity} />);
      
      const icon = screen.getByTestId('icon-User');
      expect(icon).toHaveClass('text-green-600');
    });

    it('gère les longues meta-informations', () => {
      const activityWithLongMeta = {
        ...mockFormattedActivity,
        meta: 'Très très longue description avec beaucoup de détails pour tester la troncature'
      };
      
      render(<ActivityItem activity={activityWithLongMeta} />);
      
      expect(screen.getByText(activityWithLongMeta.meta)).toBeInTheDocument();
    });
  });

  describe('Classes CSS et styling', () => {
    it('applique les classes personnalisées', () => {
      const { container } = render(
        <ActivityItem 
          activity={mockFormattedActivity} 
          className="custom-class" 
        />
      );
      
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('respecte la structure HTML pour l\'accessibilité', () => {
      render(<ActivityItem activity={mockFormattedActivity} />);
      
      // Vérifier la structure hiérarchique
      expect(screen.getByText('Profil complété')).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument(); // L'icône
    });
  });
});