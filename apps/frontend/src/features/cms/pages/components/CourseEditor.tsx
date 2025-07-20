import React, { useState } from 'react';
import Icon from '@shared/components/AppIcon';
import Image from '@shared/components/AppImage';
import Button from '@shared/ui/Button';
import TextInput from '@shared/ui/TextInput';
import Card from '@shared/ui/Card';
import Spinner from '@shared/ui/Spinner';
import { uploadToBucket, BUCKETS } from '@shared/services/storageService';
import { log } from '@libs/logger';
import type { CmsCourse } from '@libs/cms-utils';


export interface CourseEditorProps {
  course: CmsCourse | null;
  onSave: (data: CmsCourse) => void;
  onDelete: () => void;
}

interface FormValues {
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  status: string;
  prerequisites: string;
  learningObjectives: string;
  difficulty: string;
  estimatedDuration: number;
  tags: string[];
}

const CourseEditor: React.FC<CourseEditorProps> = ({ course, onSave, onDelete }) => {
  const [formData, setFormData] = useState<FormValues>({
    title: course?.title ?? '',
    description: course?.description ?? '',
    price: course?.price ?? 0,
    thumbnail: course?.thumbnail ?? '',
    status: course?.status ?? 'draft',
    prerequisites: course?.prerequisites ?? '',
    learningObjectives: course?.learningObjectives ?? '',
    difficulty: course?.difficulty ?? 'beginner',
    estimatedDuration: course?.estimatedDuration ?? 0,
    tags: course?.tags ?? [],
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (formData.price < 0) {
      newErrors.price = 'Le prix ne peut pas être négatif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setIsSaving(true);
    try {
      await onSave({ ...course, ...formData } as CmsCourse);
    } finally {
      setIsSaving(false);
    }
  };

  const handleThumbnailUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const { url } = await uploadToBucket(BUCKETS.images, file);
        handleInputChange('thumbnail', url);
      } catch (err) {
        log.error('Thumbnail upload failed', err);
      }
      setIsUploading(false);
    }
  };

  const difficultyOptions = [
    { value: 'beginner', label: 'Débutant', color: 'text-accent' },
    { value: 'intermediate', label: 'Intermédiaire', color: 'text-warning' },
    { value: 'advanced', label: 'Avancé', color: 'text-error' },
  ];

  return (
    <div className='flex-1 bg-surface overflow-y-auto'>
      <div className='max-w-4xl mx-auto p-6'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-2xl font-bold text-text-primary'>
              {course?.id ? 'Modifier le cours' : 'Nouveau cours'}
            </h1>
            <p className='text-text-secondary mt-1'>
              Configurez les informations principales de votre cours
            </p>
          </div>

          <div className='flex items-center space-x-3'>
            <Button
              onClick={() =>
                handleInputChange('status', formData.status === 'published' ? 'draft' : 'published')
              }
              className={`px-4 py-2 ${
                formData.status === 'published'
                  ? 'bg-accent text-white hover:bg-accent-700'
                  : 'bg-warning text-white hover:bg-warning-600'
              }`}
              variant='outline'
            >
              <Icon
                aria-hidden='true'
                name={formData.status === 'published' ? 'Eye' : 'EyeOff'}
                size={16}
                className='mr-2'
              />
              {formData.status === 'published' ? 'Publié' : 'Brouillon'}
            </Button>

            <Button onClick={handleSave} disabled={isSaving} className='px-6 py-2'>
              {isSaving ? (
                <Spinner size={16} className='mr-2' />
              ) : (
                <Icon aria-hidden='true' name='Save' size={16} className='mr-2' />
              )}
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Basic Information */}
            <Card className='p-6'>
              <h2 className='text-lg font-semibold text-text-primary mb-4'>
                Informations générales
              </h2>

              <div className='space-y-4'>
                <TextInput
                  id='course-title'
                  label='Titre du cours *'
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('title', e.target.value)
                  }
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby='course-title-error'
                  placeholder="Ex: Introduction à l'Intelligence Artificielle"
                  error={errors.title ?? undefined}
                />
                {errors.title && (
                  <p
                    id='course-title-error'
                    role='alert'
                    className='text-error text-sm mt-1'
                  >
                    {errors.title}
                  </p>
                )}

                <div>
                  <label className='block text-sm font-medium text-text-primary mb-2'>
                    Description *
                  </label>
                  <textarea
                    id='course-description'
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleInputChange('description', e.target.value)
                    }
                    rows={4}
                    aria-invalid={Boolean(errors.description)}
                    aria-describedby='course-description-error'
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none ${
                      errors.description ? 'border-error' : 'border-border'
                    }`}
                    placeholder='Décrivez le contenu et les objectifs de votre cours...'
                  />
                  {errors.description && (
                    <p
                      id='course-description-error'
                      role='alert'
                      className='text-error text-sm mt-1'
                    >
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <TextInput
                    id='course-price'
                    type='number'
                    label='Prix (€)'
                    value={formData.price}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('price', parseFloat(e.target.value) || 0)
                    }
                    aria-invalid={Boolean(errors.price)}
                    aria-describedby='course-price-error'
                    error={errors.price ?? undefined}
                    inputClassName='[appearance:textfield]'
                    min='0'
                    step='0.01'
                  />
                  {errors.price && (
                    <p
                      id='course-price-error'
                      role='alert'
                      className='text-error text-sm mt-1'
                    >
                      {errors.price}
                    </p>
                  )}

                  <div>
                    <label className='block text-sm font-medium text-text-primary mb-2'>
                      Niveau de difficulté
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleInputChange('difficulty', e.target.value)
                      }
                      className='w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200'
                    >
                      {difficultyOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-text-primary mb-2'>
                    Durée estimée (heures)
                  </label>
                  <input
                    id='estimated-duration'
                    type='number'
                    value={formData.estimatedDuration}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('estimatedDuration', parseFloat(e.target.value) || 0)
                    }
                    aria-invalid={false}
                    className='w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200'
                    min='0'
                    step='0.5'
                  />
                </div>
              </div>
            </Card>

            {/* Learning Objectives */}
            <Card className='p-6'>
              <h2 className='text-lg font-semibold text-text-primary mb-4'>
                Objectifs pédagogiques
              </h2>

              <textarea
                id='learning-objectives'
                value={formData.learningObjectives}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleInputChange('learningObjectives', e.target.value)
                }
                rows={4}
                className='w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none'
                placeholder='Listez les compétences et connaissances que les apprenants acquerront...'
              />
            </Card>

            {/* Prerequisites */}
            <Card className='p-6'>
              <h2 className='text-lg font-semibold text-text-primary mb-4'>Prérequis</h2>

              <textarea
                id='course-prerequisites'
                value={formData.prerequisites}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleInputChange('prerequisites', e.target.value)
                }
                rows={3}
                className='w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none'
                placeholder='Décrivez les connaissances préalables nécessaires...'
              />
            </Card>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Thumbnail */}
            <Card className='p-6'>
              <h3 className='text-lg font-semibold text-text-primary mb-4'>Image de couverture</h3>

              <div className='space-y-4'>
                {formData.thumbnail ? (
                  <div className='relative'>
                    <Image
                      src={formData.thumbnail}
                      alt='Course thumbnail'
                      className='w-full h-32 object-cover rounded-lg'
                    />
                    <button
                      onClick={() => handleInputChange('thumbnail', '')}
                      className='absolute top-2 right-2 p-1 bg-error text-white rounded-full hover:bg-error-600 transition-colors duration-200'
                    >
                      <Icon name='X' size={16} aria-label='Supprimer la miniature' />
                    </button>
                  </div>
                ) : (
                  <div className='w-full h-32 border-2 border-dashed border-secondary-300 rounded-lg flex items-center justify-center'>
                    <div className='text-center'>
                      <Icon
                        aria-hidden='true'
                        name='Image'
                        size={32}
                        className='text-secondary-400 mx-auto mb-2'
                      />
                      <p className='text-sm text-text-secondary'>Aucune image</p>
                    </div>
                  </div>
                )}

                <label className='block'>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleThumbnailUpload}
                    className='hidden'
                  />
                  <div className='w-full px-4 py-2 border border-border rounded-lg text-center cursor-pointer hover:bg-secondary-50 transition-colors duration-200'>
                    {isUploading ? (
                      <div className='flex items-center justify-center'>
                        <Icon
                          aria-hidden='true'
                          name='Loader2'
                          size={16}
                          className='animate-spin mr-2'
                        />
                        Téléchargement...
                      </div>
                    ) : (
                      <div className='flex items-center justify-center'>
                        <Icon aria-hidden='true' name='Upload' size={16} className='mr-2' />
                        Choisir une image
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </Card>

            {/* Course Stats */}
            {course?.id && (
              <Card className='p-6'>
                <h3 className='text-lg font-semibold text-text-primary mb-4'>Statistiques</h3>

                <div className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <span className='text-text-secondary'>Inscriptions</span>
                    <span className='font-semibold text-text-primary'>
                      {course.enrollments || 0}
                    </span>
                  </div>

                  <div className='flex justify-between items-center'>
                    <span className='text-text-secondary'>Note moyenne</span>
                    <div className='flex items-center'>
                      <Icon
                        aria-hidden='true'
                        name='Star'
                        size={16}
                        className='text-warning mr-1'
                      />
                      <span className='font-semibold text-text-primary'>
                        {course.rating || 0}/5
                      </span>
                    </div>
                  </div>

                  <div className='flex justify-between items-center'>
                    <span className='text-text-secondary'>Modules</span>
                    <span className='font-semibold text-text-primary'>
                      {course.modules?.length || 0}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Danger Zone */}
            {course?.id && (
              <Card className='p-6 border-error'>
                <h3 className='text-lg font-semibold text-error mb-4'>Zone de danger</h3>

                <p className='text-sm text-text-secondary mb-4'>
                  La suppression du cours est irréversible et supprimera tous les modules et leçons
                  associés.
                </p>

                <Button
                  onClick={() => onDelete()}
                  className='w-full px-4 py-2 bg-error text-white hover:bg-error-600'
                  variant='danger'
                >
                  <Icon aria-hidden='true' name='Trash2' size={16} className='mr-2' />
                  Supprimer le cours
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEditor;
