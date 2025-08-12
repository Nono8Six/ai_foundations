import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@shared/components/ui/dialog';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Badge } from '@shared/components/ui/badge';
import Icon from '@shared/components/AppIcon';
import type { XPSource } from '../index';

interface XPSourceEditorProps {
  action: XPSource | null;
  isOpen: boolean;
  onSave: (action: XPSource) => Promise<void>;
  onCancel: () => void;
}

// Liste des icônes disponibles (pour usage futur)
// const AVAILABLE_ICONS = [
//   'BookOpen', 'GraduationCap', 'Trophy', 'User', 'Calendar', 'Layers', 
//   'Award', 'Zap', 'TrendingUp', 'Star', 'Shield', 'CheckCircle',
//   'Target', 'Flame', 'Gift', 'Heart', 'Crown'
// ];

// Liste des types de source prédéfinis
const SOURCE_TYPES = [
  'lesson', 'course', 'quiz', 'module', 'profile', 'streak', 
  'engagement', 'social', 'achievement', 'special'
];

export const XPSourceEditor: React.FC<XPSourceEditorProps> = ({
  action,
  isOpen,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<XPSource>({
    source_type: '',
    action_type: '',
    xp_value: 10,
    title: '',
    description: '',
    is_repeatable: true,
    cooldown_minutes: 0,
    max_per_day: null,
    is_active: true,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (action) {
      setFormData(action);
    } else {
      // Reset for new action
      setFormData({
        source_type: 'lesson',
        action_type: '',
        xp_value: 10,
        title: '',
        description: '',
        is_repeatable: true,
        cooldown_minutes: 0,
        max_per_day: null,
        is_active: true,
      });
    }
  }, [action]);

  const handleSave = async () => {
    if (!formData.title || !formData.action_type) {
      alert('Titre et type d\'action sont requis');
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving action:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof XPSource, value: string | number | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onCancel()}>
      <DialogContent className="w-full max-w-4xl mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {action ? 'Modifier l&apos;Action XP' : 'Créer une Nouvelle Action XP'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Informations de base */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-800 mb-2 block">
                Titre *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="ex: Terminer une leçon"
                className="text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-800 mb-2 block">
                Description
              </label>
              <textarea 
                className="w-full p-2 border border-gray-200 rounded-md resize-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Description de l&apos;action pour les utilisateurs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-800 mb-2 block">
                  Type de Source *
                </label>
                <select 
                  className="w-full p-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.source_type}
                  onChange={(e) => updateField('source_type', e.target.value)}
                >
                  {SOURCE_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800 mb-2 block">
                  Type d&apos;Action *
                </label>
                <Input
                  value={formData.action_type}
                  onChange={(e) => updateField('action_type', e.target.value)}
                  placeholder="ex: completion"
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Paramètres XP et règles */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-800 mb-2 block">
                Valeur XP *
              </label>
              <Input
                type="number"
                min="0"
                max="1000"
                value={formData.xp_value}
                onChange={(e) => updateField('xp_value', parseInt(e.target.value) || 0)}
                className="text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-800 mb-2 block">
                Cooldown (minutes)
              </label>
              <Input
                type="number"
                min="0"
                value={formData.cooldown_minutes}
                onChange={(e) => updateField('cooldown_minutes', parseInt(e.target.value) || 0)}
                placeholder="0 = pas de cooldown"
                className="text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-800 mb-2 block">
                Maximum par jour
              </label>
              <Input
                type="number"
                min="1"
                value={formData.max_per_day || ''}
                onChange={(e) => updateField('max_per_day', e.target.value ? parseInt(e.target.value) : null)}
                placeholder="Vide = illimité"
                className="text-sm"
              />
            </div>

            {/* Switches/Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_repeatable}
                  onChange={(e) => updateField('is_repeatable', e.target.checked)}
                  className="rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-800">Action répétable</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => updateField('is_active', e.target.checked)}
                  className="rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-800">Action active</span>
              </label>
            </div>
          </div>
        </div>

        {/* Aperçu */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg border">
          <h4 className="font-medium text-gray-800 mb-3">Aperçu de l&apos;action</h4>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-white rounded-md border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {formData.title || 'Titre de l&apos;action'}
                </p>
                <p className="text-sm text-gray-600">
                  {formData.description || 'Description de l&apos;action'}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">{formData.xp_value} XP</Badge>
                  {formData.is_repeatable && <Badge variant="outline" className="text-xs">Répétable</Badge>}
                  {formData.cooldown_minutes > 0 && (
                    <Badge variant="outline" className="text-xs">{formData.cooldown_minutes}min cooldown</Badge>
                  )}
                  {formData.max_per_day && (
                    <Badge variant="outline" className="text-xs">Max {formData.max_per_day}/jour</Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="sm:self-start">
              <Badge variant={formData.is_active ? "default" : "outline"} 
                     className={formData.is_active ? "bg-green-100 text-green-800" : "text-gray-500"}>
                {formData.is_active ? "Actif" : "Inactif"}
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={onCancel} disabled={saving} className="w-full sm:w-auto">
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
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