import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickActions = () => {
  const quickActions = [
    {
      id: 1,
      title: 'Créer un cours',
      description: 'Ajouter un nouveau cours à la plateforme',
      icon: 'Plus',
      color: 'bg-primary',
      hoverColor: 'hover:bg-primary-700',
      path: '/content-management-courses-modules-lessons'
    },
    {
      id: 2,
      title: 'Gérer les utilisateurs',
      description: 'Voir et modifier les comptes utilisateurs',
      icon: 'Users',
      color: 'bg-accent',
      hoverColor: 'hover:bg-accent-700',
      path: '/user-management-admin'
    },
    {
      id: 3,
      title: 'Voir les rapports',
      description: 'Consulter les analyses et statistiques',
      icon: 'BarChart3',
      color: 'bg-warning',
      hoverColor: 'hover:bg-warning-600',
      path: '/admin-dashboard'
    },
    {
      id: 4,
      title: 'Paramètres système',
      description: 'Configurer les paramètres de la plateforme',
      icon: 'Settings',
      color: 'bg-secondary-600',
      hoverColor: 'hover:bg-secondary-700',
      path: '/admin-dashboard'
    }
  ];

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Actions rapides</h3>
      
      <div className="space-y-3">
        {quickActions.map((action) => (
          <Link
            key={action.id}
            to={action.path}
            className="flex items-center space-x-4 p-4 rounded-lg border border-border hover:border-primary hover:shadow-subtle transition-all duration-200 group"
          >
            <div className={`p-3 rounded-lg ${action.color} ${action.hoverColor} transition-colors duration-200`}>
              <Icon name={action.icon} size={20} color="white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors duration-200">
                {action.title}
              </h4>
              <p className="text-xs text-text-secondary mt-1">{action.description}</p>
            </div>
            
            <Icon 
              name="ChevronRight" 
              size={16} 
              className="text-text-secondary group-hover:text-primary transition-colors duration-200" 
            />
          </Link>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border">
        <Link
          to="/content-management-courses-modules-lessons"
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm font-medium"
        >
          <Icon name="Zap" size={16} />
          <span>Accès complet à l'administration</span>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;