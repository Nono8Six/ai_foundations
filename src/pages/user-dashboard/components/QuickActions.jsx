import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickActions = () => {
  const quickActions = [
    {
      id: 1,
      title: "Profil",
      description: "Gérer votre profil",
      icon: "User",
      color: "bg-primary",
      hoverColor: "hover:bg-primary-700",
      link: "/user-profile-management"
    },
    {
      id: 2,
      title: "Certificats",
      description: "Télécharger vos certificats",
      icon: "Award",
      color: "bg-success",
      hoverColor: "hover:bg-success-700",
      link: "#",
      action: "download"
    },
    {
      id: 3,
      title: "Catalogue",
      description: "Explorer les cours",
      icon: "BookOpen",
      color: "bg-warning",
      hoverColor: "hover:bg-warning-700",
      link: "/program-overview"
    },
    {
      id: 4,
      title: "Support",
      description: "Obtenir de l\'aide",
      icon: "HelpCircle",
      color: "bg-secondary",
      hoverColor: "hover:bg-secondary-700",
      link: "#",
      action: "support"
    }
  ];

  const handleAction = (action) => {
    switch (action) {
      case 'download':
        // Mock certificate download
        alert('Téléchargement des certificats...');
        break;
      case 'support':
        // Mock support action
        alert('Redirection vers le support...');
        break;
      default:
        break;
    }
  };

  const renderAction = (action) => {
    if (action.link && action.link !== '#') {
      return (
        <Link
          key={action.id}
          to={action.link}
          className={`${action.color} ${action.hoverColor} text-white rounded-lg p-4 transition-all duration-200 hover:shadow-medium hover:-translate-y-0.5 group`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-200">
              <Icon name={action.icon} size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{action.title}</h4>
              <p className="text-sm opacity-90">{action.description}</p>
            </div>
            <Icon name="ArrowRight" size={16} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
          </div>
        </Link>
      );
    }

    return (
      <button
        key={action.id}
        onClick={() => handleAction(action.action)}
        className={`${action.color} ${action.hoverColor} text-white rounded-lg p-4 transition-all duration-200 hover:shadow-medium hover:-translate-y-0.5 group w-full text-left`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-200">
            <Icon name={action.icon} size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-medium">{action.title}</h4>
            <p className="text-sm opacity-90">{action.description}</p>
          </div>
          <Icon name="ArrowRight" size={16} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
        </div>
      </button>
    );
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Actions rapides
      </h3>
      
      <div className="space-y-3">
        {quickActions.map(renderAction)}
      </div>

      {/* Additional Quick Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-primary-50 rounded-lg">
            <Icon name="Clock" size={20} className="text-primary mx-auto mb-1" />
            <p className="text-sm font-medium text-text-primary">2h 30m</p>
            <p className="text-xs text-text-secondary">Aujourd'hui</p>
          </div>
          <div className="text-center p-3 bg-success-50 rounded-lg">
            <Icon name="Target" size={20} className="text-success mx-auto mb-1" />
            <p className="text-sm font-medium text-text-primary">85%</p>
            <p className="text-xs text-text-secondary">Objectif hebdo</p>
          </div>
        </div>
      </div>

      {/* Study Reminder */}
      <div className="mt-4 p-3 bg-gradient-to-r from-warning-50 to-warning-100 border border-warning-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <Icon name="Bell" size={16} className="text-warning" />
          <div className="flex-1">
            <p className="text-sm font-medium text-text-primary">Rappel d'étude</p>
            <p className="text-xs text-text-secondary">Il vous reste 30 min pour atteindre votre objectif quotidien</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;