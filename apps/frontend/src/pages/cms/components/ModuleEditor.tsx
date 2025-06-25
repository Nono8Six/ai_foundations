import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import type { ModuleRow } from '../../../types/moduleRow';

export interface ModuleEditorProps {
  module: ModuleRow | null;
  onSave: (data: ModuleRow) => void;
  onDelete: () => void;
}

const ModuleEditor: React.FC<ModuleEditorProps> = ({ module, onSave, onDelete }) => {
  const [formData, setFormData] = useState<Partial<ModuleRow>>({
    title: module?.title || '',
    description: module?.description || '',
    order: module?.order || 1,
    learningObjectives: module?.learningObjectives || '',
    estimatedDuration: module?.estimatedDuration || 0,
    isOptional: module?.isOptional || false,
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof ModuleRow, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setIsSaving(true);
    try {
      await onSave({ ...module, ...formData });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='flex-1 bg-surface overflow-y-auto'>
      <div className='max-w-4xl mx-auto p-6'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-2xl font-bold text-text-primary'>
              {module?.id ? 'Modifier le module' : 'Nouveau module'}
            </h1>
            <p className='text-text-secondary mt-1'>
              Organisez le contenu de votre module d'apprentissage
            </p>
          </div>

          <div className='flex items-center space-x-3'>
            <Button onClick={handleSave} disabled={isSaving} className='px-6 py-2 bg-primary text-white hover:bg-primary-700'>
              {isSaving ? (
                <Spinner size={16} className='mr-2' />
              ) : (
                <Icon aria-hidden="true"  name='Save' size={16} className='mr-2' />
              )}
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Basic Information */}
            <div className='bg-white rounded-lg border border-border p-6'>
              <h2 className='text-lg font-semibold text-text-primary mb-4'>
                Informations du module
              </h2>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-text-primary mb-2'>
                    Titre du module *
                  </label>
                  <input
                    type='text'
                    value={formData.title}
                    onChange={e => handleInputChange('title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                      errors.title ? 'border-error' : 'border-border'
                    }`}
                    placeholder="Ex: Concepts de base de l'IA"
                  />
                  {errors.title && <p className='text-error text-sm mt-1'>{errors.title}</p>}
                </div>

                <div>
                  <label className='block text-sm font-medium text-text-primary mb-2'>
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e => handleInputChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none ${
                      errors.description ? 'border-error' : 'border-border'
                    }`}
                    placeholder='Décrivez le contenu et les objectifs de ce module...'
                  />
                  {errors.description && (
                    <p className='text-error text-sm mt-1'>{errors.description}</p>
                  )}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-text-primary mb-2'>
                      Ordre dans le cours
                    </label>
                    <input
                      type='number'
                      value={formData.order}
                      onChange={e => handleInputChange('order', parseInt(e.target.value) || 1)}
                      className='w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200'
                      min='1'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-text-primary mb-2'>
                      Durée estimée (heures)
                    </label>
                    <input
                      type='number'
                      value={formData.estimatedDuration}
                      onChange={e =>
                        handleInputChange('estimatedDuration', parseFloat(e.target.value) || 0)
                      }
                      className='w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200'
                      min='0'
                      step='0.5'
                    />
                  </div>
                </div>

                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    id='isOptional'
                    checked={formData.isOptional}
                    onChange={e => handleInputChange('isOptional', e.target.checked)}
                    className='rounded border-secondary-300 text-primary focus:ring-primary'
                  />
                  <label htmlFor='isOptional' className='ml-2 text-sm text-text-primary'>
                    Module optionnel
                  </label>
                </div>
              </div>
            </div>

            {/* Learning Objectives */}
            <div className='bg-white rounded-lg border border-border p-6'>
              <h2 className='text-lg font-semibold text-text-primary mb-4'>
                Objectifs d'apprentissage
              </h2>

              <textarea
                value={formData.learningObjectives}
                onChange={e => handleInputChange('learningObjectives', e.target.value)}
                rows={4}
                className='w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none'
                placeholder='Décrivez ce que les apprenants sauront faire à la fin de ce module...'
              />
            </div>

            {/* Lesson Management */}
            <div className='bg-white rounded-lg border border-border p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-lg font-semibold text-text-primary'>Leçons du module</h2>
                <button className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium'>
                  <Icon aria-hidden="true"  name='Plus' size={16} className='mr-2' />
                  Ajouter une leçon
                </button>
              </div>

              {module?.lessons && module.lessons.length > 0 ? (
                <div className='space-y-3'>
                  {module.lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className='flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary-50 transition-colors duration-200'
                    >
                      <div className='flex items-center'>
                        <div className='w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center mr-3'>
                          <span className='text-sm font-medium text-text-secondary'>
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h4 className='font-medium text-text-primary'>{lesson.title}</h4>
                          <p className='text-sm text-text-secondary'>
                            {lesson.duration} min • {lesson.completions} complétions
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center space-x-2'>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            lesson.status === 'published'
                              ? 'bg-accent-100 text-accent-700'
                              : 'bg-warning-100 text-warning-700'
                          }`}
                        >
                          {lesson.status === 'published' ? 'Publié' : 'Brouillon'}
                        </span>

                        <button className='p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200'>
                          <Icon name='Edit' size={16} aria-label='Modifier la leçon' />
                        </button>

                        <button className='p-2 text-text-secondary hover:text-error hover:bg-error-50 rounded-lg transition-colors duration-200'>
                          <Icon name='Trash2' size={16} aria-label='Supprimer la leçon' />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8'>
                  <Icon aria-hidden="true"  name='FileText' size={48} className='text-secondary-300 mx-auto mb-4' />
                  <p className='text-text-secondary mb-4'>Aucune leçon dans ce module</p>
                  <button className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium'>
                    <Icon aria-hidden="true"  name='Plus' size={16} className='mr-2' />
                    Créer la première leçon
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Module Progress */}
            <div className='bg-white rounded-lg border border-border p-6'>
              <h3 className='text-lg font-semibold text-text-primary mb-4'>Progression</h3>

              <div className='space-y-4'>
                <div>
                  <div className='flex justify-between text-sm mb-2'>
                    <span className='text-text-secondary'>Leçons créées</span>
                    <span className='font-medium text-text-primary'>
                      {module?.lessons?.length || 0}/5
                    </span>
                  </div>
                  <div className='w-full bg-secondary-200 rounded-full h-2'>
                    <div
                      className='bg-primary h-2 rounded-full transition-all duration-300'
                      style={{
                        width: `${Math.min(((module?.lessons?.length || 0) / 5) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className='flex justify-between text-sm mb-2'>
                    <span className='text-text-secondary'>Contenu publié</span>
                    <span className='font-medium text-text-primary'>
                      {module?.lessons?.filter(l => l.status === 'published').length || 0}/
                      {module?.lessons?.length || 0}
                    </span>
                  </div>
                  <div className='w-full bg-secondary-200 rounded-full h-2'>
                    <div
                      className='bg-accent h-2 rounded-full transition-all duration-300'
                      style={{
                        width: module?.lessons?.length
                          ? `${(module.lessons.filter(l => l.status === 'published').length / module.lessons.length) * 100}%`
                          : '0%',
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Module Settings */}
            <div className='bg-white rounded-lg border border-border p-6'>
              <h3 className='text-lg font-semibold text-text-primary mb-4'>Paramètres</h3>

              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-text-secondary'>Module optionnel</span>
                  <div
                    className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                      formData.isOptional ? 'bg-primary' : 'bg-secondary-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 mt-0.5 ${
                        formData.isOptional ? 'translate-x-6 ml-1' : 'translate-x-1'
                      }`}
                    ></div>
                  </div>
                </div>

                <div className='flex justify-between items-center'>
                  <span className='text-text-secondary'>Ordre</span>
                  <span className='font-semibold text-text-primary'>#{formData.order}</span>
                </div>

                <div className='flex justify-between items-center'>
                  <span className='text-text-secondary'>Durée estimée</span>
                  <span className='font-semibold text-text-primary'>
                    {formData.estimatedDuration}h
                  </span>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            {module?.id && (
              <div className='bg-white rounded-lg border border-error p-6'>
                <h3 className='text-lg font-semibold text-error mb-4'>Zone de danger</h3>

                <p className='text-sm text-text-secondary mb-4'>
                  La suppression du module supprimera également toutes les leçons qu'il contient.
                </p>

                <button
                  onClick={() => onDelete(module.id)}
                  className='w-full px-4 py-2 bg-error text-white rounded-lg hover:bg-error-600 transition-colors duration-200 font-medium'
                >
                  <Icon aria-hidden="true"  name='Trash2' size={16} className='mr-2' />
                  Supprimer le module
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleEditor;
