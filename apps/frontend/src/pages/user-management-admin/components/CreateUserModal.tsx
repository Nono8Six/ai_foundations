import React, { useState } from 'react';
import Icon from '@frontend/components/AppIcon';
import { log } from '@libs/logger';
import type { AdminUser } from '@frontend/types/adminUser';

interface UserForm {
  name: string;
  email: string;
  role: 'student' | 'admin';
  status: 'active' | 'pending' | 'inactive';
  phone: string;
  location: string;
  initialCourses: string[];
}

interface CreateUserModalProps {
  onClose: () => void;
  onUserCreated: (user: AdminUser) => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ onClose, onUserCreated }) => {
  const [formData, setFormData] = useState<UserForm>({
    name: '',
    email: '',
    role: 'student',
    status: 'active',
    phone: '',
    location: '',
    initialCourses: [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UserForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const availableCourses = [
    'IA Fondamentaux',
    'Machine Learning',
    'Deep Learning',
    'Vision par Ordinateur',
    'Traitement du Langage Naturel',
    'Data Science',
    "Python pour l'IA",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleCourseToggle = (course: string) => {
    setFormData(prev => ({
      ...prev,
      initialCourses: prev.initialCourses.includes(course)
        ? prev.initialCourses.filter(c => c !== course)
        : [...prev.initialCourses, course],
    }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof UserForm, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d&rsquo;email invalide";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'La localisation est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser: AdminUser = {
        id: Date.now(),
        ...formData,
        avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=150`,
        registrationDate: new Date().toISOString().split('T')[0],
        lastActivity: new Date().toISOString().split('T')[0],
        courseProgress: 0,
        totalCourses: formData.initialCourses.length,
        completedCourses: 0,
        xpPoints: 0,
        level: 1,
        streak: 0,
        achievements: 0,
        notes: "Nouvel utilisateur créé par l'administrateur.",
        enrolledCourses: formData.initialCourses,
      };

      log.info('New user created', { 
        userId: newUser.id, 
        email: newUser.email,
        role: newUser.role
      });
      onUserCreated(newUser);
    } catch (error) {
      log.error('Error creating user', { 
        error, 
        email: formData.email,
        role: formData.role
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-surface rounded-lg shadow-medium max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-border'>
          <h2 className='text-xl font-semibold text-text-primary'>Créer un nouvel utilisateur</h2>
          <button
            onClick={onClose}
            className='p-2 hover:bg-secondary-50 rounded-lg transition-colors'
          >
            <Icon name='X' size={20} aria-label='Fermer' className='text-text-secondary' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* Basic Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-text-primary'>Informations de base</h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-text-secondary mb-2'>
                  Nom complet *
                </label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.name ? 'border-error' : 'border-border'
                  }`}
                  placeholder='Ex: Marie Dubois'
                />
                {errors.name && <p className='mt-1 text-sm text-error'>{errors.name}</p>}
              </div>

              <div>
                <label className='block text-sm font-medium text-text-secondary mb-2'>
                  Email *
                </label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.email ? 'border-error' : 'border-border'
                  }`}
                  placeholder='marie.dubois@email.com'
                />
                {errors.email && <p className='mt-1 text-sm text-error'>{errors.email}</p>}
              </div>

              <div>
                <label className='block text-sm font-medium text-text-secondary mb-2'>
                  Téléphone *
                </label>
                <input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.phone ? 'border-error' : 'border-border'
                  }`}
                  placeholder='+33 1 23 45 67 89'
                />
                {errors.phone && <p className='mt-1 text-sm text-error'>{errors.phone}</p>}
              </div>

              <div>
                <label className='block text-sm font-medium text-text-secondary mb-2'>
                  Localisation *
                </label>
                <input
                  type='text'
                  name='location'
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.location ? 'border-error' : 'border-border'
                  }`}
                  placeholder='Paris, France'
                />
                {errors.location && <p className='mt-1 text-sm text-error'>{errors.location}</p>}
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-text-primary'>Paramètres du compte</h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-text-secondary mb-2'>Rôle</label>
                <select
                  name='role'
                  value={formData.role}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                >
                  <option value='student'>Étudiant</option>
                  <option value='admin'>Administrateur</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-text-secondary mb-2'>Statut</label>
                <select
                  name='status'
                  value={formData.status}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                >
                  <option value='active'>Actif</option>
                  <option value='pending'>En attente</option>
                  <option value='inactive'>Inactif</option>
                </select>
              </div>
            </div>
          </div>

          {/* Course Enrollment */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-text-primary'>Inscription aux cours</h3>
            <p className='text-sm text-text-secondary'>
              Sélectionnez les cours auxquels inscrire l&rsquo;utilisateur initialement
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {availableCourses.map(course => (
                <label
                  key={course}
                  className='flex items-center p-3 border border-border rounded-lg hover:bg-secondary-50 cursor-pointer transition-colors'
                >
                  <input
                    type='checkbox'
                    checked={formData.initialCourses.includes(course)}
                    onChange={() => handleCourseToggle(course)}
                    className='h-4 w-4 text-primary focus:ring-primary border-border rounded'
                  />
                  <span className='ml-3 text-sm text-text-primary'>{course}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center justify-end space-x-3 pt-6 border-t border-border'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 border border-border text-sm font-medium rounded-lg text-text-secondary bg-surface hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200'
            >
              Annuler
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSubmitting ? (
                <>
                  <Icon aria-hidden='true' name='Loader2' size={16} className='mr-2 animate-spin' />
                  Création...
                </>
              ) : (
                <>
                  <Icon aria-hidden='true' name='Plus' size={16} className='mr-2' />
                  Créer l&rsquo;utilisateur
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
