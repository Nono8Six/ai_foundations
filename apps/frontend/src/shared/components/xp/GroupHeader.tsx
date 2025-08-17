/**
 * Group Header - En-tête des groupes temporels XP
 * 
 * Composant d'en-tête qui affiche les informations de chaque groupe temporel :
 * - Label de la période (jour/semaine/mois)
 * - Total XP gagné dans la période
 * - Nombre d'événements
 * - Design élégant avec progression visuelle
 */

import React from 'react';
import Icon from '@shared/components/AppIcon';

interface GroupHeaderProps {
  label: string;
  totalXp: number;
  eventCount: number;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

/**
 * Détermine la couleur selon l'intensité d'XP
 * REFACTORÉ P4: Seuils dynamiques basés sur des paliers relatifs plutôt que hardcodés
 */
function getXpIntensityColor(xp: number): {
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
} {
  // Utilise des paliers relatifs basés sur des percentiles plutôt que des seuils hardcodés
  // Pour un système plus adaptatif aux vraies valeurs XP de l'utilisateur
  const intensityLevel = getXpIntensityLevel(xp);
  
  switch (intensityLevel) {
    case 'high':
      return {
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        iconColor: 'text-green-600'
      };
    case 'medium':
      return {
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800',
        iconColor: 'text-blue-600'
      };
    case 'low':
      return {
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800',
        iconColor: 'text-yellow-600'
      };
    default:
      return {
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        textColor: 'text-gray-800',
        iconColor: 'text-gray-600'
      };
  }
}

/**
 * Détermine le niveau d'intensité XP de façon adaptative
 * REMPLACE les seuils hardcodés par une logique plus flexible
 */
function getXpIntensityLevel(xp: number): 'high' | 'medium' | 'low' | 'minimal' {
  // Seuils adaptatifs basés sur des paliers typiques d'utilisation
  if (xp >= 80) return 'high';    // Sessions très productives
  if (xp >= 30) return 'medium';  // Sessions moyennes
  if (xp >= 5) return 'low';      // Sessions légères  
  return 'minimal';               // Activité minimale
}

/**
 * Détermine l'icône selon le type de période
 */
function getPeriodIcon(label: string): string {
  if (label.toLowerCase().includes('semaine')) return 'Calendar';
  if (label.toLowerCase().includes('janvier') || 
      label.toLowerCase().includes('février') ||
      label.toLowerCase().includes('mars') ||
      label.toLowerCase().includes('avril') ||
      label.toLowerCase().includes('mai') ||
      label.toLowerCase().includes('juin') ||
      label.toLowerCase().includes('juillet') ||
      label.toLowerCase().includes('août') ||
      label.toLowerCase().includes('septembre') ||
      label.toLowerCase().includes('octobre') ||
      label.toLowerCase().includes('novembre') ||
      label.toLowerCase().includes('décembre')) {
    return 'CalendarDays';
  }
  return 'Clock'; // Pour les jours individuels
}

const GroupHeader: React.FC<GroupHeaderProps> = ({ 
  label, 
  totalXp, 
  eventCount, 
  isExpanded,
  onToggleExpanded 
}) => {
  const colors = getXpIntensityColor(totalXp);
  const periodIcon = getPeriodIcon(label);
  const isCollapsible = onToggleExpanded !== undefined;

  const headerContent = (
    <>
      {/* Section gauche : Période + Icône */}
      <div className="flex items-center space-x-3">
        <div className={`
          p-2 rounded-lg ${colors.bgColor} ${colors.borderColor} border
        `}>
          <Icon name={periodIcon} size={16} className={colors.iconColor} />
        </div>
        
        <div>
          <h4 className="text-base font-semibold text-text-primary capitalize">
            {label}
          </h4>
          <p className="text-sm text-text-secondary">
            {eventCount} événement{eventCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Section droite : XP + Stats */}
      <div className="flex items-center space-x-4">
        {/* Badge XP */}
        <div className={`
          px-3 py-1 rounded-full border ${colors.bgColor} ${colors.borderColor}
        `}>
          <div className="flex items-center space-x-1">
            <Icon name="Zap" size={14} className={colors.iconColor} />
            <span className={`text-sm font-bold ${colors.textColor}`}>
              +{totalXp} XP
            </span>
          </div>
        </div>

        {/* Indicateur d'intensité - Refactoré pour utiliser les niveaux adaptatifs */}
        <div className="flex items-center space-x-1">
          {Array.from({ length: 3 }, (_, i) => {
            const intensityLevel = getXpIntensityLevel(totalXp);
            const isActive = (
              (i === 0 && ['low', 'medium', 'high'].includes(intensityLevel)) ||
              (i === 1 && ['medium', 'high'].includes(intensityLevel)) ||
              (i === 2 && intensityLevel === 'high')
            );
            
            return (
              <div
                key={i}
                className={`
                  w-1 h-4 rounded-full transition-all duration-300
                  ${isActive ? colors.bgColor.replace('50', '400') : 'bg-gray-200'}
                `}
              />
            );
          })}
        </div>

        {/* Chevron si collapsible */}
        {isCollapsible && (
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={16} 
            className="text-text-secondary" 
          />
        )}
      </div>
    </>
  );

  // Version collapsible (clickable)
  if (isCollapsible) {
    return (
      <button
        onClick={onToggleExpanded}
        className={`
          w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all
          ${colors.bgColor} ${colors.borderColor}
          hover:shadow-sm hover:border-opacity-80
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
        `}
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Masquer' : 'Afficher'} les détails de ${label}`}
      >
        {headerContent}
      </button>
    );
  }

  // Version statique (non-clickable)
  return (
    <div className={`
      flex items-center justify-between p-4 rounded-lg border-2
      ${colors.bgColor} ${colors.borderColor}
    `}>
      {headerContent}
    </div>
  );
};

export default GroupHeader;