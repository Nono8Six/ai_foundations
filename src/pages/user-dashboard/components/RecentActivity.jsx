import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const RecentActivity = () => {
  const recentActivities = [
    {
      id: 1,
      type: "lesson_completed",
      title: "Leçon terminée",
      description: "Introduction aux Réseaux de Neurones",
      course: "IA Fondamentale",
      timestamp: "Il y a 2 heures",
      icon: "CheckCircle",
      iconColor: "text-success",
      xpEarned: 50
    },
    {
      id: 2,
      type: "achievement_unlocked",
      title: "Nouveau badge débloqué",
      description: "Apprenant Assidu - 7 jours consécutifs",
      timestamp: "Il y a 1 jour",
      icon: "Award",
      iconColor: "text-warning",
      badge: "https://images.pixabay.com/photo/2017/01/13/01/22/achievement-1976395_1280.png"
    },
    {
      id: 3,
      type: "quiz_completed",
      title: "Quiz réussi",
      description: "Fondamentaux du Machine Learning",
      course: "Machine Learning Pratique",
      timestamp: "Il y a 2 jours",
      icon: "Brain",
      iconColor: "text-primary",
      score: "85%"
    },
    {
      id: 4,
      type: "level_up",
      title: "Niveau supérieur atteint",
      description: "Vous êtes maintenant niveau 12",
      timestamp: "Il y a 3 jours",
      icon: "TrendingUp",
      iconColor: "text-accent",
      newLevel: 12
    },
    {
      id: 5,
      type: "course_started",
      title: "Nouveau cours commencé",
      description: "Éthique de l\'IA",
      instructor: "Dr. Claire Moreau",
      timestamp: "Il y a 5 jours",
      icon: "BookOpen",
      iconColor: "text-secondary",
      thumbnail: "https://images.pixabay.com/photo/2023/04/06/15/50/ai-generated-7904344_1280.jpg"
    },
    {
      id: 6,
      type: "project_submitted",
      title: "Projet soumis",
      description: "Analyse de données avec Python",
      course: "Machine Learning Pratique",
      timestamp: "Il y a 1 semaine",
      icon: "Upload",
      iconColor: "text-primary",
      status: "En attente de correction"
    }
  ];

  const getActivityIcon = (activity) => {
    return (
      <div className={`w-10 h-10 rounded-full bg-surface border-2 border-border flex items-center justify-center ${activity.iconColor}`}>
        <Icon name={activity.icon} size={20} />
      </div>
    );
  };

  const getActivityContent = (activity) => {
    switch (activity.type) {
      case "lesson_completed":
        return (
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-text-primary">{activity.title}</h4>
                <p className="text-sm text-text-secondary">{activity.description}</p>
                <p className="text-xs text-text-secondary mt-1">{activity.course}</p>
              </div>
              <div className="flex items-center space-x-1 bg-success-50 text-success px-2 py-1 rounded-full">
                <Icon name="Plus" size={12} />
                <span className="text-xs font-medium">{activity.xpEarned} XP</span>
              </div>
            </div>
          </div>
        );

      case "achievement_unlocked":
        return (
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h4 className="font-medium text-text-primary">{activity.title}</h4>
                <p className="text-sm text-text-secondary">{activity.description}</p>
              </div>
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <Image 
                  src={activity.badge}
                  alt="Badge"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        );

      case "quiz_completed":
        return (
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-text-primary">{activity.title}</h4>
                <p className="text-sm text-text-secondary">{activity.description}</p>
                <p className="text-xs text-text-secondary mt-1">{activity.course}</p>
              </div>
              <div className="bg-primary-50 text-primary px-2 py-1 rounded-full">
                <span className="text-xs font-medium">{activity.score}</span>
              </div>
            </div>
          </div>
        );

      case "level_up":
        return (
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-text-primary">{activity.title}</h4>
                <p className="text-sm text-text-secondary">{activity.description}</p>
              </div>
              <div className="bg-accent-50 text-accent px-2 py-1 rounded-full">
                <span className="text-xs font-medium">Niveau {activity.newLevel}</span>
              </div>
            </div>
          </div>
        );

      case "course_started":
        return (
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h4 className="font-medium text-text-primary">{activity.title}</h4>
                <p className="text-sm text-text-secondary">{activity.description}</p>
                <p className="text-xs text-text-secondary mt-1">Par {activity.instructor}</p>
              </div>
              <div className="w-12 h-8 rounded overflow-hidden flex-shrink-0">
                <Image 
                  src={activity.thumbnail}
                  alt={activity.description}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        );

      case "project_submitted":
        return (
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-text-primary">{activity.title}</h4>
                <p className="text-sm text-text-secondary">{activity.description}</p>
                <p className="text-xs text-text-secondary mt-1">{activity.course}</p>
              </div>
              <div className="bg-warning-50 text-warning px-2 py-1 rounded-full">
                <span className="text-xs font-medium">{activity.status}</span>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex-1">
            <h4 className="font-medium text-text-primary">{activity.title}</h4>
            <p className="text-sm text-text-secondary">{activity.description}</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Activité récente</h2>
        <button className="text-primary hover:text-primary-700 transition-colors text-sm font-medium">
          Voir tout
        </button>
      </div>

      <div className="space-y-4">
        {recentActivities.map((activity, index) => (
          <div key={activity.id} className="relative">
            {/* Timeline line */}
            {index < recentActivities.length - 1 && (
              <div className="absolute left-5 top-10 w-0.5 h-8 bg-border"></div>
            )}
            
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary-50 transition-colors duration-200">
              {getActivityIcon(activity)}
              
              <div className="flex-1 min-w-0">
                {getActivityContent(activity)}
                <p className="text-xs text-text-secondary mt-2">{activity.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-6 pt-4 border-t border-border">
        <button className="w-full text-center text-primary hover:text-primary-700 transition-colors text-sm font-medium py-2">
          Afficher toute l'activité
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;