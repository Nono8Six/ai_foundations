/**
 * Empty State - État vide élégant pour la timeline XP
 * 
 * Composant d'état vide personnalisable qui s'affiche quand :
 * - Aucun événement XP n'est trouvé
 * - Les filtres ne retournent pas de résultats
 * - L'utilisateur n'a pas encore commencé d'activités
 * - Encouragement avec CTA contextuel selon la situation
 */

import React from 'react';
import Icon from '@shared/components/AppIcon';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  variant?: 'no-data' | 'no-results' | 'first-time';
  title?: string;
  description?: string;
  illustration?: React.ReactNode;
  cta?: {
    label: string;
    href: string;
    icon?: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
    icon?: string;
  };
  hideProfileCompletionCta?: boolean;
}

/**
 * Configurations par défaut selon le variant
 */
const getDefaultConfig = (variant: EmptyStateProps['variant']) => {
  switch (variant) {
    case 'no-results':
      return {
        title: 'Aucun résultat trouvé',
        description: 'Essayez de modifier vos filtres ou d\'élargir la période de recherche pour voir plus d\'événements XP.',
        icon: 'Search',
        cta: {
          label: 'Effacer les filtres',
          href: '#',
          icon: 'RotateCcw'
        }
      };
      
    case 'first-time':
      return {
        title: 'Prêt à commencer votre aventure XP ?',
        description: 'Vos premiers gains d\'expérience apparaîtront ici dès que vous terminerez une activité d\'apprentissage. Chaque action compte !',
        icon: 'Sparkles',
        cta: {
          label: 'Découvrir les programmes',
          href: '/programmes',
          icon: 'ArrowRight'
        },
        secondaryCta: {
          label: 'Compléter mon profil',
          href: '/profile?tab=personal',
          icon: 'User'
        }
      };
      
    case 'no-data':
    default:
      return {
        title: 'Aucun événement XP',
        description: 'Votre timeline d\'expérience est encore vide. Commencez une activité d\'apprentissage pour voir vos premiers gains apparaître ici.',
        icon: 'BarChart3',
        cta: {
          label: 'Commencer maintenant',
          href: '/programmes',
          icon: 'Play'
        }
      };
  }
};

/**
 * Illustrations par défaut selon l'icône
 */
const getIllustration = (iconName: string, size: number = 64) => {
  const iconClasses = "text-gray-300";
  
  return (
    <div className="mb-6">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
        <Icon name={iconName} size={size * 0.6} className={iconClasses} />
      </div>
    </div>
  );
};

const EmptyState: React.FC<EmptyStateProps> = ({ 
  variant = 'no-data',
  title,
  description,
  illustration,
  cta,
  secondaryCta,
  hideProfileCompletionCta = false
}) => {
  const defaultConfig = getDefaultConfig(variant);
  
  const finalTitle = title || defaultConfig.title;
  const finalDescription = description || defaultConfig.description;
  const finalCta = cta || defaultConfig.cta;
  const finalSecondaryCta = secondaryCta || defaultConfig.secondaryCta;
  const finalIllustration = illustration || getIllustration(defaultConfig.icon);

  return (
    <div className="text-center py-16 px-6">
      {/* Illustration */}
      {finalIllustration}
      
      {/* Title */}
      <h3 className="text-xl font-semibold text-text-primary mb-3">
        {finalTitle}
      </h3>
      
      {/* Description */}
      <p className="text-text-secondary mb-8 max-w-md mx-auto leading-relaxed">
        {finalDescription}
      </p>
      
      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* Primary CTA */}
        {finalCta && (
          <Link
            to={finalCta.href}
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm hover:shadow-md"
          >
            {finalCta.icon && (
              <Icon name={finalCta.icon} size={18} className="mr-2" />
            )}
            {finalCta.label}
          </Link>
        )}
        
        {/* Secondary CTA */}
        {finalSecondaryCta && (
          <Link
            to={finalSecondaryCta.href}
            className="inline-flex items-center px-6 py-3 text-text-primary border border-border rounded-lg hover:bg-secondary-50 transition-colors font-medium"
          >
            {finalSecondaryCta.icon && (
              <Icon name={finalSecondaryCta.icon} size={18} className="mr-2" />
            )}
            {finalSecondaryCta.label}
          </Link>
        )}
      </div>
      
      {/* Optional helper text */}
      {variant === 'first-time' && !hideProfileCompletionCta && (
        <div className="mt-8 pt-6 border-t border-border max-w-sm mx-auto">
          <div className="flex items-center justify-center space-x-2 text-xs text-text-secondary">
            <Icon name="Lightbulb" size={14} />
            <span>
              Astuce : Complétez votre profil pour gagner vos premiers XP !
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmptyState;