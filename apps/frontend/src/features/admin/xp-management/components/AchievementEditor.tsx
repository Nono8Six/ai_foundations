import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@shared/components/ui/dialog';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Badge } from '@shared/components/ui/badge';
import Icon from '@shared/components/AppIcon';
import type { Achievement } from '../index';

interface AchievementEditorProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onSave: (achievement: Achievement) => Promise<void>;
  onCancel: () => void;
}

// Types de conditions disponibles
const CONDITION_TYPES = [
  { 
    value: 'xp_threshold', 
    label: 'Seuil XP Total',
    description: 'Déclenché quand l&apos;utilisateur atteint X XP total',
    params: ['threshold']
  },
  { 
    value: 'level_reached', 
    label: 'Niveau Atteint',
    description: 'Déclenché quand l&apos;utilisateur atteint le niveau X',
    params: ['level']
  },
  { 
    value: 'streak_milestone', 
    label: 'Série de Connexions',
    description: 'Déclenché après X jours de connexion consécutive',
    params: ['days']
  },
  { 
    value: 'course_completion_count', 
    label: 'Cours Terminés',
    description: 'Déclenché après avoir terminé X cours',
    params: ['count']
  },
  { 
    value: 'lesson_completion_count', 
    label: 'Leçons Terminées',
    description: 'Déclenché après avoir terminé X leçons',
    params: ['count']
  },
  { 
    value: 'perfect_scores_count', 
    label: 'Scores Parfaits',
    description: 'Déclenché après X scores parfaits',
    params: ['count']
  },
  { 
    value: 'profile_completion', 
    label: 'Profil Complet',
    description: 'Déclenché quand le profil est 100% complété',
    params: []
  },
  { 
    value: 'first_action', 
    label: 'Première Action',
    description: 'Déclenché lors de la première action d&apos;un type spécifique',
    params: ['action_type']
  }
];

export const AchievementEditor: React.FC<AchievementEditorProps> = ({
  achievement,
  isOpen,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Achievement>({
    achievement_key: '',
    title: '',
    description: '',
    condition_type: 'xp_threshold',
    condition_params: { threshold: 100 },
    xp_reward: 50,
    is_active: true,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (achievement) {
      setFormData(achievement);
    } else {
      // Reset for new achievement
      setFormData({
        achievement_key: '',
        title: '',
        description: '',
        condition_type: 'xp_threshold',
        condition_params: { threshold: 100 },
        xp_reward: 50,
        is_active: true,
      });
    }
  }, [achievement]);

  const selectedConditionType = CONDITION_TYPES.find(ct => ct.value === formData.condition_type);

  const handleSave = async () => {
    if (!formData.title || !formData.achievement_key) {
      alert('Titre et clé d\'achievement sont requis');
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving achievement:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof Achievement, value: string | number | boolean | Record<string, any>) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateConditionParam = (param: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      condition_params: {
        ...prev.condition_params,
        [param]: value
      }
    }));
  };

  const renderConditionParams = () => {
    if (!selectedConditionType) return null;

    return selectedConditionType.params.map(param => {
      const currentValue = formData.condition_params[param];
      
      switch (param) {
        case 'threshold':
        case 'level':
        case 'days':
        case 'count':
          return (
            <div key={param}>
              <label className="text-sm font-medium text-text-primary mb-2 block">
                {param === 'threshold' ? 'Seuil XP' : 
                 param === 'level' ? 'Niveau' :
                 param === 'days' ? 'Jours' :
                 'Nombre'}
              </label>
              <Input
                type="number"
                min="1"
                value={currentValue || ''}
                onChange={(e) => updateConditionParam(param, parseInt(e.target.value) || 0)}
              />
            </div>
          );
        case 'action_type':
          return (
            <div key={param}>
              <label className="text-sm font-medium text-text-primary mb-2 block">
                Type d'Action
              </label>
              <Input
                value={currentValue || ''}
                onChange={(e) => updateConditionParam(param, e.target.value)}
                placeholder="ex: lesson_completion"
              />
            </div>
          );
        default:
          return null;
      }
    });
  };

  const generatePreviewDescription = () => {
    const conditionType = selectedConditionType;
    if (!conditionType) return formData.description;

    switch (formData.condition_type) {
      case 'xp_threshold':
        return `Atteindre ${formData.condition_params.threshold || 100} points d'expérience`;
      case 'level_reached':
        return `Atteindre le niveau ${formData.condition_params.level || 1}`;
      case 'streak_milestone':
        return `Se connecter ${formData.condition_params.days || 7} jours consécutifs`;
      case 'course_completion_count':
        return `Terminer ${formData.condition_params.count || 1} cours`;
      case 'lesson_completion_count':
        return `Terminer ${formData.condition_params.count || 1} leçons`;
      case 'perfect_scores_count':
        return `Obtenir ${formData.condition_params.count || 1} scores parfaits`;
      case 'profile_completion':
        return 'Compléter entièrement son profil';
      case 'first_action':
        return `Effectuer sa première action: ${formData.condition_params.action_type || 'action'}`;
      default:
        return formData.description;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {achievement ? 'Modifier l&apos;Achievement' : 'Créer un Nouvel Achievement'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations de base */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">
                Titre *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="ex: Premier cap"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">
                Clé d&apos;Achievement *
              </label>
              <Input
                value={formData.achievement_key}
                onChange={(e) => updateField('achievement_key', e.target.value)}
                placeholder="ex: first_100_xp"
              />
              <p className="text-xs text-text-secondary mt-1">
                Identifiant unique (lettres, chiffres, underscores)
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">
                Description
              </label>
              <textarea 
                className="w-full p-2 border rounded-md resize-none"
                rows={3}
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Description personnalisée (optionelle)"
              />
              <p className="text-xs text-text-secondary mt-1">
                Si vide, sera générée automatiquement
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">
                XP Reward *
              </label>
              <Input
                type="number"
                min="0"
                max="1000"
                value={formData.xp_reward}
                onChange={(e) => updateField('xp_reward', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Conditions de déclenchement */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">
                Type de Condition *
              </label>
              <select 
                className="w-full p-2 border rounded-md"
                value={formData.condition_type}
                onChange={(e) => {
                  const newConditionType = e.target.value;
                  const conditionConfig = CONDITION_TYPES.find(ct => ct.value === newConditionType);
                  
                  // Reset condition params based on new type
                  let defaultParams = {};
                  if (conditionConfig) {
                    conditionConfig.params.forEach(param => {
                      switch (param) {
                        case 'threshold':
                          defaultParams = { threshold: 100 };
                          break;
                        case 'level':
                          defaultParams = { level: 2 };
                          break;
                        case 'days':
                          defaultParams = { days: 7 };
                          break;
                        case 'count':
                          defaultParams = { count: 1 };
                          break;
                        case 'action_type':
                          defaultParams = { action_type: '' };
                          break;
                      }
                    });
                  }
                  
                  setFormData(prev => ({
                    ...prev,
                    condition_type: newConditionType,
                    condition_params: defaultParams
                  }));
                }}
              >
                {CONDITION_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {selectedConditionType && (
                <p className="text-xs text-text-secondary mt-1">
                  {selectedConditionType.description}
                </p>
              )}
            </div>

            {renderConditionParams()}

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => updateField('is_active', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-text-primary">Achievement actif</span>
              </label>
            </div>
          </div>
        </div>

        {/* Aperçu */}
        <div className="mt-6 p-4 bg-secondary-50 rounded-lg border">
          <h4 className="font-medium text-text-primary mb-3">Aperçu de l&apos;achievement</h4>
          <div className="flex items-center justify-between p-3 bg-white rounded-md border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Icon name="Award" size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-text-primary">
                  {formData.title || 'Titre de l&apos;achievement'}
                </p>
                <p className="text-sm text-text-secondary">
                  {formData.description || generatePreviewDescription()}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{formData.xp_reward} XP</Badge>
                  <Badge variant="outline">
                    {selectedConditionType?.label || 'Condition'}
                  </Badge>
                </div>
              </div>
            </div>
            <Badge variant={formData.is_active ? "default" : "outline"}>
              {formData.is_active ? "Actif" : "Inactif"}
            </Badge>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={saving}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sauvegarde...
              </>
            ) : (
              <>
                <Icon name="Save" size={16} />
                Sauvegarder
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};