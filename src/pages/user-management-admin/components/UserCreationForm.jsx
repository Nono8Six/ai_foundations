import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const UserCreationForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Étudiant',
    status: 'Actif',
    sendWelcomeEmail: true,
    assignCourses: [],
    location: '',
    department: ''
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const availableCourses = [
    { id: 1, name: 'Introduction à l\'IA', category: 'Débutant' },
    { id: 2, name: 'Apprentissage automatique', category: 'Intermédiaire' },
    { id: 3, name: 'Réseaux de neurones', category: 'Avancé' },
    { id: 4, name: 'IA éthique', category: 'Spécialisé' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCourseToggle = (courseId) => {
    setFormData(prev => ({
      ...prev,
      assignCourses: prev.assignCourses.includes(courseId)
        ? prev.assignCourses.filter(id => id !== courseId)
        : [...prev.assignCourses, courseId]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate user creation
      console.log('Creating user:', formData);
      
      // Reset form and close modal
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        role: 'Étudiant',
        status: 'Actif',
        sendWelcomeEmail: true,
        assignCourses: [],
        location: '',
        department: ''
      });
      setErrors({});
      onClose();
      
      // Show success message (in real app, this would be a toast notification)
      alert('Utilisateur créé avec succès !');
    }
  };

  return (
    <div className="fixed inset-0 z-modal bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-border p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-text-primary">Créer un nouvel utilisateur</h2>
              <p className="text-text-secondary text-sm mt-1">
                Ajoutez un nouvel utilisateur à la plateforme
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-all duration-200"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Informations personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                    errors.firstName ? 'border-error' : 'border-border'
                  }`}
                  placeholder="Entrez le prénom"
                />
                {errors.firstName && (
                  <p className="text-error text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                    errors.lastName ? 'border-error' : 'border-border'
                  }`}
                  placeholder="Entrez le nom"
                />
                {errors.lastName && (
                  <p className="text-error text-sm mt-1">{errors.lastName}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-error' : 'border-border'
                  }`}
                  placeholder="utilisateur@email.com"
                />
                {errors.email && (
                  <p className="text-error text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Localisation
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  placeholder="Paris, France"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Département
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  placeholder="Ressources humaines"
                />
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Paramètres du compte</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Rôle
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                >
                  <option value="Étudiant">Étudiant</option>
                  <option value="Modérateur">Modérateur</option>
                  <option value="Administrateur">Administrateur</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Statut
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                >
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                  <option value="Suspendu">Suspendu</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="sendWelcomeEmail"
                  checked={formData.sendWelcomeEmail}
                  onChange={handleInputChange}
                  className="rounded border-border focus:ring-primary"
                />
                <span className="text-sm text-text-secondary">
                  Envoyer un email de bienvenue avec les informations de connexion
                </span>
              </label>
            </div>
          </div>

          {/* Course Assignment */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Attribution des cours</h3>
            <p className="text-sm text-text-secondary mb-4">
              Sélectionnez les cours à attribuer automatiquement à cet utilisateur
            </p>
            <div className="space-y-3">
              {availableCourses.map((course) => (
                <label key={course.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-secondary-50 transition-all duration-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.assignCourses.includes(course.id)}
                    onChange={() => handleCourseToggle(course.id)}
                    className="rounded border-border focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text-primary">{course.name}</span>
                      <span className="text-xs px-2 py-1 bg-primary-50 text-primary rounded-full">
                        {course.category}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-all duration-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-subtle hover:shadow-medium"
            >
              <Icon name="UserPlus" size={18} />
              <span>Créer l'utilisateur</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserCreationForm;