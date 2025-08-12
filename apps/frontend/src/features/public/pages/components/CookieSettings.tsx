import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '@shared/components/AppIcon';
import type { CookiePreferences } from '@frontend/types/userSettings';

export interface CookieSettingsProps {
  onSave: (preferences: Omit<CookiePreferences, 'acceptedAt' | 'lastUpdated'>) => void;
  onClose: () => void;
  initialPreferences?: Partial<CookiePreferences>;
}

const CookieSettings: React.FC<CookieSettingsProps> = ({
  onSave,
  onClose,
  initialPreferences = {},
}) => {
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, cannot be disabled
    analytics: initialPreferences.analytics ?? false,
    marketing: initialPreferences.marketing ?? false,
    functional: initialPreferences.functional ?? false,
  });

  const handleToggle = (key: keyof typeof preferences) => {
    if (key === 'essential') return; // Cannot disable essential cookies
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setPreferences(allAccepted);
    onSave(allAccepted);
  };

  const handleAcceptSelected = () => {
    onSave(preferences);
  };

  const handleRejectAll = () => {
    const onlyEssential = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    setPreferences(onlyEssential);
    onSave(onlyEssential);
  };

  const cookieTypes = [
    {
      key: 'essential' as const,
      title: 'Cookies essentiels',
      description: 'Nécessaires au fonctionnement du site web. Ils ne peuvent pas être désactivés.',
      required: true,
    },
    {
      key: 'functional' as const,
      title: 'Cookies fonctionnels',
      description: 'Permettent d\'améliorer votre expérience avec des fonctionnalités avancées comme la mémorisation de vos préférences.',
      required: false,
    },
    {
      key: 'analytics' as const,
      title: 'Cookies analytiques',
      description: 'Nous aident à comprendre comment vous utilisez notre site pour l\'améliorer. Aucune donnée personnelle n\'est collectée.',
      required: false,
    },
    {
      key: 'marketing' as const,
      title: 'Cookies marketing',
      description: 'Utilisés pour personnaliser les publicités et mesurer l\'efficacité de nos campagnes publicitaires.',
      required: false,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-surface rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon aria-hidden="true" name="Cookie" size={24} className="text-primary" />
            <h2 className="text-xl font-semibold text-text-primary">
              Paramètres des cookies
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <Icon aria-hidden="true" name="X" size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <p className="text-text-secondary mb-6">
            Nous utilisons des cookies pour améliorer votre expérience de navigation, 
            analyser le trafic du site et personnaliser le contenu. Vous pouvez choisir 
            quels types de cookies vous souhaitez accepter.
          </p>

          <div className="space-y-4">
            {cookieTypes.map(({ key, title, description, required }) => (
              <div
                key={key}
                className={`p-4 border border-border rounded-lg ${
                  required ? 'bg-secondary-25' : 'bg-surface'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-text-primary">{title}</h3>
                      {required && (
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                          Obligatoire
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary">{description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle(key)}
                    disabled={required}
                    className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences[key] ? 'bg-primary' : 'bg-secondary-300'
                    } ${required ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences[key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-border">
          <button
            onClick={handleRejectAll}
            className="flex-1 px-4 py-2 border border-border text-text-secondary rounded-lg hover:bg-secondary-50 transition-colors"
          >
            Rejeter tout
          </button>
          <button
            onClick={handleAcceptSelected}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Enregistrer la sélection
          </button>
          <button
            onClick={handleAcceptAll}
            className="flex-1 px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors"
          >
            Tout accepter
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CookieSettings;