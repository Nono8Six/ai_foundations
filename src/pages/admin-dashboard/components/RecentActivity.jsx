import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'user_registration',
      user: {
        name: 'Marie Dubois',
        avatar:
          'https://ui-avatars.com/api/?name=Marie+Dubois&background=3b82f6&color=ffffff',
      },
      action: "s'est inscrite sur la plateforme",
      timestamp: 'Il y a 5 minutes',
      icon: 'UserPlus',
      iconColor: 'text-success',
    },
    {
      id: 2,
      type: 'course_completion',
      user: {
        name: 'Jean Martin',
        avatar:
          'https://ui-avatars.com/api/?name=Jean+Martin&background=10b981&color=ffffff',
      },
      action: "a terminé le cours 'Introduction à l'IA'",
      timestamp: 'Il y a 12 minutes',
      icon: 'CheckCircle',
      iconColor: 'text-primary',
    },
    {
      id: 3,
      type: 'content_creation',
      user: {
        name: 'Sophie Laurent',
        avatar:
          'https://ui-avatars.com/api/?name=Sophie+Laurent&background=8b5cf6&color=ffffff',
      },
      action: "a créé un nouveau module 'Machine Learning Avancé'",
      timestamp: 'Il y a 1 heure',
      icon: 'BookOpen',
      iconColor: 'text-accent',
    },
    {
      id: 4,
      type: 'achievement_unlock',
      user: {
        name: 'Pierre Moreau',
        avatar:
          'https://ui-avatars.com/api/?name=Pierre+Moreau&background=f59e0b&color=ffffff',
      },
      action: "a débloqué le badge 'Expert IA'",
      timestamp: 'Il y a 2 heures',
      icon: 'Award',
      iconColor: 'text-warning',
    },
    {
      id: 5,
      type: 'system_update',
      user: {
        name: 'Système',
        avatar: null,
      },
      action: 'Mise à jour de sécurité appliquée',
      timestamp: 'Il y a 3 heures',
      icon: 'Shield',
      iconColor: 'text-secondary-500',
    },
    {
      id: 6,
      type: 'payment_received',
      user: {
        name: 'Emma Rousseau',
        avatar:
          'https://ui-avatars.com/api/?name=Emma+Rousseau&background=ec4899&color=ffffff',
      },
      action: 'a effectué un paiement de €299',
      timestamp: 'Il y a 4 heures',
      icon: 'CreditCard',
      iconColor: 'text-success',
    },
    {
      id: 7,
      type: 'course_enrollment',
      user: {
        name: 'Lucas Bernard',
        avatar:
          'https://ui-avatars.com/api/?name=Lucas+Bernard&background=6366f1&color=ffffff',
      },
      action: "s'est inscrit au cours 'Deep Learning Pratique'",
      timestamp: 'Il y a 5 heures',
      icon: 'BookMarked',
      iconColor: 'text-primary',
    },
    {
      id: 8,
      type: 'user_login',
      user: {
        name: 'Camille Petit',
        avatar:
          'https://ui-avatars.com/api/?name=Camille+Petit&background=ef4444&color=ffffff',
      },
      action: "s'est connectée depuis un nouvel appareil",
      timestamp: 'Il y a 6 heures',
      icon: 'LogIn',
      iconColor: 'text-secondary-500',
    },
  ];

  const getActivityTypeLabel = type => {
    const labels = {
      user_registration: 'Inscription',
      course_completion: 'Cours terminé',
      content_creation: 'Contenu créé',
      achievement_unlock: 'Badge débloqué',
      system_update: 'Système',
      payment_received: 'Paiement',
      course_enrollment: 'Inscription cours',
      user_login: 'Connexion',
    };
    return labels[type] || 'Activité';
  };

  return (
    <div className='bg-surface rounded-lg p-6 shadow-subtle border border-border mb-8'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-lg font-semibold text-text-primary'>Activité récente</h3>
        <div className='flex items-center space-x-2'>
          <button className='px-3 py-1 text-xs font-medium text-text-secondary border border-border rounded-md hover:bg-secondary-50 transition-colors'>
            Filtrer
          </button>
          <button className='px-3 py-1 text-xs font-medium text-primary border border-primary rounded-md hover:bg-primary-50 transition-colors'>
            Voir tout
          </button>
        </div>
      </div>

      <div className='space-y-4 max-h-96 overflow-y-auto'>
        {activities.map(activity => (
          <div
            key={activity.id}
            className='flex items-start space-x-4 p-3 rounded-lg hover:bg-secondary-50 transition-colors'
          >
            <div className='flex-shrink-0'>
              {activity.user.avatar ? (
                <Image
                  src={activity.user.avatar}
                  alt={activity.user.name}
                  className='w-10 h-10 rounded-full object-cover'
                />
              ) : (
                <div className='w-10 h-10 bg-secondary-200 rounded-full flex items-center justify-center'>
                  <Icon name='Settings' size={20} className='text-secondary-500' />
                </div>
              )}
            </div>

            <div className='flex-1 min-w-0'>
              <div className='flex items-center space-x-2 mb-1'>
                <Icon name={activity.icon} size={16} className={activity.iconColor} />
                <span className='text-xs font-medium text-text-secondary bg-secondary-100 px-2 py-1 rounded-full'>
                  {getActivityTypeLabel(activity.type)}
                </span>
              </div>
              <p className='text-sm text-text-primary'>
                <span className='font-medium'>{activity.user.name}</span> {activity.action}
              </p>
              <p className='text-xs text-text-secondary mt-1'>{activity.timestamp}</p>
            </div>

            <div className='flex-shrink-0'>
              <button className='p-1 rounded-md hover:bg-secondary-100 transition-colors'>
                <Icon name='MoreHorizontal' size={16} className='text-text-secondary' />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-4 pt-4 border-t border-border'>
        <div className='flex items-center justify-between text-sm'>
          <span className='text-text-secondary'>{activities.length} activités récentes</span>
          <button className='text-primary hover:text-primary-700 transition-colors font-medium'>
            Actualiser
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;