import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CourseEditor = ({ course, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    price: course?.price || 0,
    thumbnail: course?.thumbnail || '',
    status: course?.status || 'draft',
    prerequisites: course?.prerequisites || '',
    learningObjectives: course?.learningObjectives || '',
    difficulty: course?.difficulty || 'beginner',
    estimatedDuration: course?.estimatedDuration || 0,
    tags: course?.tags || [],
  });

  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

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

  const handleSave = () => {
    if (validateForm()) {
      onSave({ ...course, ...formData });
    }
  };

  const handleThumbnailUpload = event => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      // Mock upload process
      setTimeout(() => {
        const mockUrl = `https://images.unsplash.com/photo-${Date.now()}?w=400`;
        handleInputChange('thumbnail', mockUrl);
        setIsUploading(false);
      }, 2000);
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
              <Icon name='Save' size={16} className='mr-2' />
              Enregistrer
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Basic Information */}
            <div className='bg-white rounded-lg border border-border p-6'>
              <h2 className='text-lg font-semibold text-text-primary mb-4'>
                Informations générales
              </h2>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-text-primary mb-2'>
                    Titre du cours *
                  </label>
                  <input
                    type='text'
                    value={formData.title}
                    onChange={e => handleInputChange('title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                      errors.title ? 'border-error' : 'border-border'
                    }`}
                    placeholder="Ex: Introduction à l'Intelligence Artificielle"
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
                    placeholder='Décrivez le contenu et les objectifs de votre cours...'
                  />
                  {errors.description && (
                    <p className='text-error text-sm mt-1'>{errors.description}</p>
                  )}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-text-primary mb-2'>
                      Prix (€)
                    </label>
                    <input
                      type='number'
                      value={formData.price}
                      onChange={e => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                        errors.price ? 'border-error' : 'border-border'
                      }`}
                      min='0'
                      step='0.01'
                    />
                    {errors.price && <p className='text-error text-sm mt-1'>{errors.price}</p>}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-text-primary mb-2'>
                      Niveau de difficulté
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={e => handleInputChange('difficulty', e.target.value)}
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
            </div>

            {/* Learning Objectives */}
            <div className='bg-white rounded-lg border border-border p-6'>
              <h2 className='text-lg font-semibold text-text-primary mb-4'>
                Objectifs pédagogiques
              </h2>

              <textarea
                value={formData.learningObjectives}
                onChange={e => handleInputChange('learningObjectives', e.target.value)}
                rows={4}
                className='w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none'
                placeholder='Listez les compétences et connaissances que les apprenants acquerront...'
              />
            </div>

            {/* Prerequisites */}
            <div className='bg-white rounded-lg border border-border p-6'>
              <h2 className='text-lg font-semibold text-text-primary mb-4'>Prérequis</h2>

              <textarea
                value={formData.prerequisites}
                onChange={e => handleInputChange('prerequisites', e.target.value)}
                rows={3}
                className='w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none'
                placeholder='Décrivez les connaissances préalables nécessaires...'
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Thumbnail */}
            <div className='bg-white rounded-lg border border-border p-6'>
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
                      <Icon name='X' size={16} />
                    </button>
                  </div>
                ) : (
                  <div className='w-full h-32 border-2 border-dashed border-secondary-300 rounded-lg flex items-center justify-center'>
                    <div className='text-center'>
                      <Icon name='Image' size={32} className='text-secondary-400 mx-auto mb-2' />
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
                        <Icon name='Loader2' size={16} className='animate-spin mr-2' />
                        Téléchargement...
                      </div>
                    ) : (
                      <div className='flex items-center justify-center'>
                        <Icon name='Upload' size={16} className='mr-2' />
                        Choisir une image
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Course Stats */}
            {course?.id && (
              <div className='bg-white rounded-lg border border-border p-6'>
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
                      <Icon name='Star' size={16} className='text-warning mr-1' />
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
              </div>
            )}

            {/* Danger Zone */}
            {course?.id && (
              <div className='bg-white rounded-lg border border-error p-6'>
                <h3 className='text-lg font-semibold text-error mb-4'>Zone de danger</h3>

                <p className='text-sm text-text-secondary mb-4'>
                  La suppression du cours est irréversible et supprimera tous les modules et leçons
                  associés.
                </p>

                <button
                  onClick={() => onDelete(course.id)}
                  className='w-full px-4 py-2 bg-error text-white rounded-lg hover:bg-error-600 transition-colors duration-200 font-medium'
                >
                  <Icon name='Trash2' size={16} className='mr-2' />
                  Supprimer le cours
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEditor;
