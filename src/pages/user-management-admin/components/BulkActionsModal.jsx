import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const BulkActionsModal = ({ isOpen, onClose, selectedUsers, users }) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [actionData, setActionData] = useState({
    newStatus: 'Actif',
    newRole: 'Étudiant',
    messageSubject: '',
    messageContent: '',
    coursesToAssign: []
  });

  if (!isOpen) return null;

  const selectedUserData = users.filter(user => selectedUsers.includes(user.id));

  const bulkActions = [
    {
      id: 'status',
      label: 'Modifier le statut',
      icon: 'UserCheck',
      description: 'Changer le statut des utilisateurs sélectionnés'
    },
    {
      id: 'role',
      label: 'Modifier le rôle',
      icon: 'Shield',
      description: 'Attribuer un nouveau rôle aux utilisateurs'
    },
    {
      id: 'message',
      label: 'Envoyer un message',
      icon: 'Mail',
      description: 'Envoyer un message groupé aux utilisateurs'
    },
    {
      id: 'courses',
      label: 'Attribuer des cours',
      icon: 'BookOpen',
      description: 'Assigner des cours aux utilisateurs sélectionnés'
    },
    {
      id: 'export',
      label: 'Exporter les données',
      icon: 'Download',
      description: 'Télécharger les informations des utilisateurs'
    },
    {
      id: 'delete',
      label: 'Supprimer les comptes',
      icon: 'Trash2',
      description: 'Supprimer définitivement les comptes utilisateurs',
      dangerous: true
    }
  ];

  const availableCourses = [
    { id: 1, name: 'Introduction à l\'IA' },
    { id: 2, name: 'Apprentissage automatique' },
    { id: 3, name: 'Réseaux de neurones' },
    { id: 4, name: 'IA éthique' }
  ];

  const handleActionChange = (actionId) => {
    setSelectedAction(actionId);
    // Reset action data when changing action
    setActionData({
      newStatus: 'Actif',
      newRole: 'Étudiant',
      messageSubject: '',
      messageContent: '',
      coursesToAssign: []
    });
  };

  const handleCourseToggle = (courseId) => {
    setActionData(prev => ({
      ...prev,
      coursesToAssign: prev.coursesToAssign.includes(courseId)
        ? prev.coursesToAssign.filter(id => id !== courseId)
        : [...prev.coursesToAssign, courseId]
    }));
  };

  const handleExecuteAction = () => {
    switch (selectedAction) {
      case 'status':
        console.log(`Changing status to ${actionData.newStatus} for users:`, selectedUsers);
        alert(`Statut modifié pour ${selectedUsers.length} utilisateur(s)`);
        break;
      case 'role':
        console.log(`Changing role to ${actionData.newRole} for users:`, selectedUsers);
        alert(`Rôle modifié pour ${selectedUsers.length} utilisateur(s)`);
        break;
      case 'message': console.log('Sending message:', actionData.messageSubject, actionData.messageContent, 'to users:', selectedUsers);
        alert(`Message envoyé à ${selectedUsers.length} utilisateur(s)`);
        break;
      case 'courses': console.log('Assigning courses:', actionData.coursesToAssign, 'to users:', selectedUsers);
        alert(`Cours attribués à ${selectedUsers.length} utilisateur(s)`);
        break;
      case 'export':
        console.log('Exporting data for users:', selectedUsers);
        alert(`Données exportées pour ${selectedUsers.length} utilisateur(s)`);
        break;
      case 'delete':
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedUsers.length} utilisateur(s) ? Cette action est irréversible.`)) {
          console.log('Deleting users:', selectedUsers);
          alert(`${selectedUsers.length} utilisateur(s) supprimé(s)`);
        }
        break;
      default:
        break;
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-modal bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-border p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-text-primary">Actions groupées</h2>
              <p className="text-text-secondary text-sm mt-1">
                {selectedUsers.length} utilisateur(s) sélectionné(s)
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

        <div className="p-6">
          {/* Selected Users Preview */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-3">Utilisateurs sélectionnés</h3>
            <div className="bg-secondary-50 rounded-lg p-4 max-h-32 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {selectedUserData.map((user) => (
                  <span
                    key={user.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-50 text-primary border border-primary-100"
                  >
                    {user.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-3">Sélectionner une action</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bulkActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleActionChange(action.id)}
                  className={`flex items-start space-x-3 p-4 border rounded-lg text-left transition-all duration-200 ${
                    selectedAction === action.id
                      ? action.dangerous
                        ? 'border-error bg-error-50' :'border-primary bg-primary-50' :'border-border hover:bg-secondary-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    selectedAction === action.id
                      ? action.dangerous
                        ? 'bg-error text-white' :'bg-primary text-white' :'bg-secondary-100 text-text-secondary'
                  }`}>
                    <Icon name={action.icon} size={20} />
                  </div>
                  <div>
                    <h4 className={`font-medium ${
                      selectedAction === action.id
                        ? action.dangerous
                          ? 'text-error' :'text-primary' :'text-text-primary'
                    }`}>
                      {action.label}
                    </h4>
                    <p className="text-sm text-text-secondary mt-1">{action.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Configuration */}
          {selectedAction && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-3">Configuration de l'action</h3>
              
              {selectedAction === 'status' && (
                <div className="bg-secondary-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Nouveau statut
                  </label>
                  <select
                    value={actionData.newStatus}
                    onChange={(e) => setActionData(prev => ({ ...prev, newStatus: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Actif">Actif</option>
                    <option value="Inactif">Inactif</option>
                    <option value="Suspendu">Suspendu</option>
                  </select>
                </div>
              )}

              {selectedAction === 'role' && (
                <div className="bg-secondary-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Nouveau rôle
                  </label>
                  <select
                    value={actionData.newRole}
                    onChange={(e) => setActionData(prev => ({ ...prev, newRole: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Étudiant">Étudiant</option>
                    <option value="Modérateur">Modérateur</option>
                    <option value="Administrateur">Administrateur</option>
                  </select>
                </div>
              )}

              {selectedAction === 'message' && (
                <div className="bg-secondary-50 rounded-lg p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Sujet du message
                    </label>
                    <input
                      type="text"
                      value={actionData.messageSubject}
                      onChange={(e) => setActionData(prev => ({ ...prev, messageSubject: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Entrez le sujet du message"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Contenu du message
                    </label>
                    <textarea
                      value={actionData.messageContent}
                      onChange={(e) => setActionData(prev => ({ ...prev, messageContent: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Rédigez votre message..."
                    />
                  </div>
                </div>
              )}

              {selectedAction === 'courses' && (
                <div className="bg-secondary-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-text-secondary mb-3">
                    Cours à attribuer
                  </label>
                  <div className="space-y-2">
                    {availableCourses.map((course) => (
                      <label key={course.id} className="flex items-center space-x-3 p-2 hover:bg-surface rounded-lg transition-all duration-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={actionData.coursesToAssign.includes(course.id)}
                          onChange={() => handleCourseToggle(course.id)}
                          className="rounded border-border focus:ring-primary"
                        />
                        <span className="text-sm text-text-primary">{course.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {selectedAction === 'export' && (
                <div className="bg-secondary-50 rounded-lg p-4">
                  <p className="text-sm text-text-secondary">
                    Les données des utilisateurs sélectionnés seront exportées au format CSV incluant :
                    nom, email, rôle, statut, progression des cours et dernière activité.
                  </p>
                </div>
              )}

              {selectedAction === 'delete' && (
                <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Icon name="AlertTriangle" size={20} className="text-error flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-error mb-2">Attention : Action irréversible</h4>
                      <p className="text-sm text-error">
                        Cette action supprimera définitivement les comptes utilisateurs sélectionnés.
                        Toutes leurs données, progression et historique seront perdus.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-border text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-all duration-200"
            >
              Annuler
            </button>
            <button
              onClick={handleExecuteAction}
              disabled={!selectedAction}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-all duration-200 shadow-subtle hover:shadow-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedAction === 'delete'
                  ? 'bg-error text-white hover:bg-red-700' :'bg-primary text-white hover:bg-primary-700'
              }`}
            >
              <Icon name="Play" size={18} />
              <span>Exécuter l'action</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsModal;