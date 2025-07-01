import React, { useState } from 'react';
import Icon from '@frontend/components/AppIcon';
import { uploadToBucket, BUCKETS } from '@frontend/services/storageService';
import { log } from '@libs/logger';
import type { LessonRow } from '@frontend/types/lessonRow';

export interface LessonEditorProps {
  lesson: LessonRow | null;
  onSave: (data: LessonRow) => void;
  onDelete: () => void;
}

interface FormValues {
  title: string;
  content: string;
  duration: number;
  videoUrl: string;
  status: string;
  order: number;
  hasQuiz: boolean;
  allowComments: boolean;
  isPreview: boolean;
}

const LessonEditor: React.FC<LessonEditorProps> = ({ lesson, onSave, onDelete }) => {
  const [formData, setFormData] = useState<FormValues>({
    title: lesson?.title ?? '',
    content: lesson?.content ?? '',
    duration: lesson?.duration ?? 0,
    videoUrl: lesson?.videoUrl ?? '',
    status: lesson?.status ?? 'draft',
    order: lesson?.order ?? 1,
    hasQuiz: lesson?.hasQuiz ?? false,
    allowComments: lesson?.allowComments ?? true,
    isPreview: lesson?.isPreview ?? false,
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  const handleInputChange = <K extends keyof FormValues>(
    field: K,
    value: FormValues[K]
  ) => {
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

    if (!formData.content.trim()) {
      newErrors.content = 'Le contenu est requis';
    }

    if (formData.duration <= 0) {
      newErrors.duration = 'La durée doit être supérieure à 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({ ...lesson, ...formData });
    }
  };

  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      try {
        const { url } = await uploadToBucket(BUCKETS.videos, file);
        handleInputChange('videoUrl', url);
      } catch (err) {
        log.error('Video upload failed', err);
      }
      setIsUploading(false);
    }
  };

  const formatContent = text => {
    return text.split('\n').map((line, index) => (
      <p key={index} className='mb-4'>
        {line}
      </p>
    ));
  };

  const tabs = [
    { id: 'content', label: 'Contenu', icon: 'FileText' },
    { id: 'media', label: 'Média', icon: 'Video' },
    { id: 'settings', label: 'Paramètres', icon: 'Settings' },
    { id: 'preview', label: 'Aperçu', icon: 'Eye' },
  ];

  return (
    <div className='flex-1 bg-surface overflow-y-auto'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-2xl font-bold text-text-primary'>
              {lesson?.id ? 'Modifier la leçon' : 'Nouvelle leçon'}
            </h1>
            <p className='text-text-secondary mt-1'>
              Créez du contenu engageant pour vos apprenants
            </p>
          </div>

          <div className='flex items-center space-x-3'>
            <button
              onClick={() =>
                handleInputChange('status', formData.status === 'published' ? 'draft' : 'published')
              }
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                formData.status === 'published'
                  ? 'bg-accent text-white hover:bg-accent-700'
                  : 'bg-warning text-white hover:bg-warning-600'
              }`}
            >
              <Icon
                aria-hidden='true'
                name={formData.status === 'published' ? 'Eye' : 'EyeOff'}
                size={16}
                className='mr-2'
              />
              {formData.status === 'published' ? 'Publié' : 'Brouillon'}
            </button>

            <button
              onClick={handleSave}
              className='px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium'
            >
              <Icon aria-hidden='true' name='Save' size={16} className='mr-2' />
              Enregistrer
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className='border-b border-border mb-6'>
          <nav className='flex space-x-8'>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-secondary-300'
                }`}
              >
                <Icon aria-hidden='true' name={tab.icon} size={16} className='mr-2' />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-3'>
            {activeTab === 'content' && (
              <div className='space-y-6'>
                {/* Basic Information */}
                <div className='bg-white rounded-lg border border-border p-6'>
                  <h2 className='text-lg font-semibold text-text-primary mb-4'>
                    Informations de base
                  </h2>

                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-text-primary mb-2'>
                        Titre de la leçon *
                      </label>
                      <input
                        id='lesson-title'
                        type='text'
                        value={formData.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange('title', e.target.value)
                        }
                        aria-invalid={Boolean(errors.title)}
                        aria-describedby='lesson-title-error'
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                          errors.title ? 'border-error' : 'border-border'
                        }`}
                        placeholder="Ex: Qu'est-ce que l'Intelligence Artificielle ?"
                      />
                      {errors.title && (
                        <p
                          id='lesson-title-error'
                          role='alert'
                          className='text-error text-sm mt-1'
                        >
                          {errors.title}
                        </p>
                      )}
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-text-primary mb-2'>
                          Durée (minutes) *
                        </label>
                        <input
                          id='lesson-duration'
                          type='number'
                          value={formData.duration}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleInputChange('duration', parseInt(e.target.value) || 0)
                          }
                          aria-invalid={Boolean(errors.duration)}
                          aria-describedby='lesson-duration-error'
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                            errors.duration ? 'border-error' : 'border-border'
                          }`}
                          min='1'
                        />
                        {errors.duration && (
                          <p id='lesson-duration-error' role='alert' className='text-error text-sm mt-1'>
                            {errors.duration}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-text-primary mb-2'>
                          Ordre dans le module
                        </label>
                        <input
                          id='lesson-order'
                          type='number'
                          value={formData.order}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleInputChange('order', parseInt(e.target.value) || 1)
                          }
                          className='w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200'
                          min='1'
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Editor */}
                <div className='bg-white rounded-lg border border-border p-6'>
                  <h2 className='text-lg font-semibold text-text-primary mb-4'>
                    Contenu de la leçon
                  </h2>

                  <div className='space-y-4'>
                    <div className='flex space-x-2 mb-4'>
                      <button className='px-3 py-1 text-sm bg-primary-50 text-primary rounded hover:bg-primary-100 transition-colors duration-200'>
                        <Icon aria-hidden='true' name='Bold' size={14} className='mr-1' />
                        Gras
                      </button>
                      <button className='px-3 py-1 text-sm bg-secondary-100 text-text-secondary rounded hover:bg-secondary-200 transition-colors duration-200'>
                        <Icon aria-hidden='true' name='Italic' size={14} className='mr-1' />
                        Italique
                      </button>
                      <button className='px-3 py-1 text-sm bg-secondary-100 text-text-secondary rounded hover:bg-secondary-200 transition-colors duration-200'>
                        <Icon aria-hidden='true' name='List' size={14} className='mr-1' />
                        Liste
                      </button>
                      <button className='px-3 py-1 text-sm bg-secondary-100 text-text-secondary rounded hover:bg-secondary-200 transition-colors duration-200'>
                        <Icon aria-hidden='true' name='Link' size={14} className='mr-1' />
                        Lien
                      </button>
                    </div>

                    <textarea
                      id='lesson-content'
                      value={formData.content}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        handleInputChange('content', e.target.value)
                      }
                      rows={12}
                      aria-invalid={Boolean(errors.content)}
                      aria-describedby='lesson-content-error'
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none font-mono text-sm ${
                        errors.content ? 'border-error' : 'border-border'
                      }`}
                      placeholder='Rédigez le contenu de votre leçon ici...'
                    />
                    {errors.content && (
                      <p id='lesson-content-error' role='alert' className='text-error text-sm mt-1'>
                        {errors.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className='space-y-6'>
                {/* Video Upload */}
                <div className='bg-white rounded-lg border border-border p-6'>
                  <h2 className='text-lg font-semibold text-text-primary mb-4'>
                    Vidéo de la leçon
                  </h2>

                  {formData.videoUrl ? (
                    <div className='space-y-4'>
                      <div className='aspect-video bg-secondary-100 rounded-lg flex items-center justify-center'>
                        <div className='text-center'>
                          <Icon
                            aria-hidden='true'
                            name='Play'
                            size={48}
                            className='text-secondary-400 mx-auto mb-2'
                          />
                          <p className='text-text-secondary'>Aperçu vidéo</p>
                          <p className='text-sm text-text-secondary mt-1'>{formData.videoUrl}</p>
                        </div>
                      </div>

                      <div className='flex space-x-3'>
                        <button
                          onClick={() => handleInputChange('videoUrl', '')}
                          className='px-4 py-2 bg-error text-white rounded-lg hover:bg-error-600 transition-colors duration-200'
                        >
                          <Icon aria-hidden='true' name='Trash2' size={16} className='mr-2' />
                          Supprimer
                        </button>

                        <label className='px-4 py-2 bg-secondary-100 text-text-secondary rounded-lg hover:bg-secondary-200 transition-colors duration-200 cursor-pointer'>
                          <input
                            type='file'
                            accept='video/*'
                            onChange={handleVideoUpload}
                            className='hidden'
                          />
                          <Icon aria-hidden='true' name='Upload' size={16} className='mr-2' />
                          Remplacer
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      <div className='aspect-video border-2 border-dashed border-secondary-300 rounded-lg flex items-center justify-center'>
                        <div className='text-center'>
                          <Icon
                            aria-hidden='true'
                            name='Video'
                            size={48}
                            className='text-secondary-400 mx-auto mb-4'
                          />
                          <p className='text-text-secondary mb-2'>Aucune vidéo téléchargée</p>
                          <p className='text-sm text-text-secondary'>
                            Formats supportés: MP4, WebM, MOV
                          </p>
                        </div>
                      </div>

                      <label className='block'>
                        <input
                          type='file'
                          accept='video/*'
                          onChange={handleVideoUpload}
                          className='hidden'
                        />
                        <div className='w-full px-4 py-3 border border-border rounded-lg text-center cursor-pointer hover:bg-secondary-50 transition-colors duration-200'>
                          {isUploading ? (
                            <div className='flex items-center justify-center'>
                              <Icon
                                aria-hidden='true'
                                name='Loader2'
                                size={20}
                                className='animate-spin mr-2'
                              />
                              Téléchargement en cours...
                            </div>
                          ) : (
                            <div className='flex items-center justify-center'>
                              <Icon aria-hidden='true' name='Upload' size={20} className='mr-2' />
                              Télécharger une vidéo
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  )}
                </div>

                {/* Additional Media */}
                <div className='bg-white rounded-lg border border-border p-6'>
                  <h2 className='text-lg font-semibold text-text-primary mb-4'>
                    Ressources supplémentaires
                  </h2>

                  <div className='space-y-4'>
                    <button className='w-full px-4 py-3 border border-border rounded-lg text-center hover:bg-secondary-50 transition-colors duration-200'>
                      <Icon aria-hidden='true' name='FileText' size={20} className='mx-auto mb-2' />
                      <p className='text-text-secondary'>Ajouter des documents PDF</p>
                    </button>

                    <button className='w-full px-4 py-3 border border-border rounded-lg text-center hover:bg-secondary-50 transition-colors duration-200'>
                      <Icon aria-hidden='true' name='Image' size={20} className='mx-auto mb-2' />
                      <p className='text-text-secondary'>Ajouter des images</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className='space-y-6'>
                {/* Lesson Settings */}
                <div className='bg-white rounded-lg border border-border p-6'>
                  <h2 className='text-lg font-semibold text-text-primary mb-4'>
                    Paramètres de la leçon
                  </h2>

                  <div className='space-y-6'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-medium text-text-primary'>Quiz intégré</h3>
                        <p className='text-sm text-text-secondary'>
                          Ajouter un quiz à la fin de cette leçon
                        </p>
                      </div>
                      <button
                        onClick={() => handleInputChange('hasQuiz', !formData.hasQuiz)}
                        className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                          formData.hasQuiz ? 'bg-primary' : 'bg-secondary-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 mt-0.5 ${
                            formData.hasQuiz ? 'translate-x-6 ml-1' : 'translate-x-1'
                          }`}
                        ></div>
                      </button>
                    </div>

                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-medium text-text-primary'>Commentaires</h3>
                        <p className='text-sm text-text-secondary'>
                          Permettre aux apprenants de commenter
                        </p>
                      </div>
                      <button
                        onClick={() => handleInputChange('allowComments', !formData.allowComments)}
                        className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                          formData.allowComments ? 'bg-primary' : 'bg-secondary-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 mt-0.5 ${
                            formData.allowComments ? 'translate-x-6 ml-1' : 'translate-x-1'
                          }`}
                        ></div>
                      </button>
                    </div>

                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-medium text-text-primary'>Aperçu gratuit</h3>
                        <p className='text-sm text-text-secondary'>
                          Cette leçon est accessible sans inscription
                        </p>
                      </div>
                      <button
                        onClick={() => handleInputChange('isPreview', !formData.isPreview)}
                        className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                          formData.isPreview ? 'bg-primary' : 'bg-secondary-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 mt-0.5 ${
                            formData.isPreview ? 'translate-x-6 ml-1' : 'translate-x-1'
                          }`}
                        ></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className='space-y-6'>
                {/* Lesson Preview */}
                <div className='bg-white rounded-lg border border-border p-6'>
                  <h2 className='text-lg font-semibold text-text-primary mb-4'>
                    Aperçu de la leçon
                  </h2>

                  <div className='space-y-6'>
                    <div>
                      <h1 className='text-2xl font-bold text-text-primary mb-2'>
                        {formData.title || 'Titre de la leçon'}
                      </h1>
                      <div className='flex items-center space-x-4 text-sm text-text-secondary'>
                        <span className='flex items-center'>
                          <Icon aria-hidden='true' name='Clock' size={16} className='mr-1' />
                          {formData.duration} minutes
                        </span>
                        <span className='flex items-center'>
                          <Icon aria-hidden='true' name='User' size={16} className='mr-1' />
                          Leçon #{formData.order}
                        </span>
                      </div>
                    </div>

                    {formData.videoUrl && (
                      <div className='aspect-video bg-secondary-100 rounded-lg flex items-center justify-center'>
                        <div className='text-center'>
                          <Icon
                            aria-hidden='true'
                            name='Play'
                            size={64}
                            className='text-secondary-400 mx-auto mb-4'
                          />
                          <p className='text-text-secondary'>Vidéo de la leçon</p>
                        </div>
                      </div>
                    )}

                    <div className='prose prose-lg max-w-none'>
                      {formData.content ? (
                        formatContent(formData.content)
                      ) : (
                        <p className='text-text-secondary italic'>
                          Le contenu de la leçon apparaîtra ici...
                        </p>
                      )}
                    </div>

                    {formData.hasQuiz && (
                      <div className='bg-primary-50 border border-primary-200 rounded-lg p-4'>
                        <div className='flex items-center'>
                          <Icon
                            aria-hidden='true'
                            name='HelpCircle'
                            size={20}
                            className='text-primary mr-2'
                          />
                          <span className='font-medium text-primary'>
                            Quiz de fin de leçon activé
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Quick Stats */}
            <div className='bg-white rounded-lg border border-border p-6'>
              <h3 className='text-lg font-semibold text-text-primary mb-4'>Statistiques</h3>

              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-text-secondary'>Statut</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      formData.status === 'published'
                        ? 'bg-accent-100 text-accent-700'
                        : 'bg-warning-100 text-warning-700'
                    }`}
                  >
                    {formData.status === 'published' ? 'Publié' : 'Brouillon'}
                  </span>
                </div>

                <div className='flex justify-between items-center'>
                  <span className='text-text-secondary'>Durée</span>
                  <span className='font-semibold text-text-primary'>{formData.duration} min</span>
                </div>

                <div className='flex justify-between items-center'>
                  <span className='text-text-secondary'>Ordre</span>
                  <span className='font-semibold text-text-primary'>#{formData.order}</span>
                </div>

                {lesson?.completions && (
                  <div className='flex justify-between items-center'>
                    <span className='text-text-secondary'>Complétions</span>
                    <span className='font-semibold text-text-primary'>{lesson.completions}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className='bg-white rounded-lg border border-border p-6'>
              <h3 className='text-lg font-semibold text-text-primary mb-4'>Fonctionnalités</h3>

              <div className='space-y-3'>
                <div className='flex items-center'>
                  <Icon
                    aria-hidden='true'
                    name={formData.hasQuiz ? 'CheckCircle' : 'Circle'}
                    size={16}
                    className={formData.hasQuiz ? 'text-accent' : 'text-secondary-400'}
                  />
                  <span className='ml-2 text-sm text-text-secondary'>Quiz intégré</span>
                </div>

                <div className='flex items-center'>
                  <Icon
                    aria-hidden='true'
                    name={formData.allowComments ? 'CheckCircle' : 'Circle'}
                    size={16}
                    className={formData.allowComments ? 'text-accent' : 'text-secondary-400'}
                  />
                  <span className='ml-2 text-sm text-text-secondary'>Commentaires</span>
                </div>

                <div className='flex items-center'>
                  <Icon
                    aria-hidden='true'
                    name={formData.isPreview ? 'CheckCircle' : 'Circle'}
                    size={16}
                    className={formData.isPreview ? 'text-accent' : 'text-secondary-400'}
                  />
                  <span className='ml-2 text-sm text-text-secondary'>Aperçu gratuit</span>
                </div>

                <div className='flex items-center'>
                  <Icon
                    aria-hidden='true'
                    name={formData.videoUrl ? 'CheckCircle' : 'Circle'}
                    size={16}
                    className={formData.videoUrl ? 'text-accent' : 'text-secondary-400'}
                  />
                  <span className='ml-2 text-sm text-text-secondary'>Vidéo</span>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            {lesson?.id && (
              <div className='bg-white rounded-lg border border-error p-6'>
                <h3 className='text-lg font-semibold text-error mb-4'>Zone de danger</h3>

                <p className='text-sm text-text-secondary mb-4'>
                  La suppression de cette leçon est irréversible.
                </p>

                <button
                  onClick={() => onDelete(lesson.id)}
                  className='w-full px-4 py-2 bg-error text-white rounded-lg hover:bg-error-600 transition-colors duration-200 font-medium'
                >
                  <Icon aria-hidden='true' name='Trash2' size={16} className='mr-2' />
                  Supprimer la leçon
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonEditor;
