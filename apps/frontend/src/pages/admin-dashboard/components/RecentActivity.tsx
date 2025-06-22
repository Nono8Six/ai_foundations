import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { supabase } from '../../../lib/supabase';

// Helper function to format time since date
const timeSince = date => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return `Il y a ${Math.floor(interval)} an(s)`;
  interval = seconds / 2592000;
  if (interval > 1) return `Il y a ${Math.floor(interval)} mois`;
  interval = seconds / 86400;
  if (interval > 1) return `Il y a ${Math.floor(interval)} jour(s)`;
  interval = seconds / 3600;
  if (interval > 1) return `Il y a ${Math.floor(interval)} heure(s)`;
  interval = seconds / 60;
  if (interval > 1) return `Il y a ${Math.floor(interval)} minute(s)`;
  return `Il y a ${Math.floor(seconds)} seconde(s)`;
};

// Helper function to get activity type properties (icon, color, label)
const getActivityTypeProps = type => {
  const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=random&color=ffffff';
  switch (type) {
    case 'user_registration':
      return {
        label: 'Inscription',
        icon: 'UserPlus',
        iconColor: 'text-success',
        defaultUser: { name: 'Nouvel utilisateur', avatar: defaultAvatar },
      };
    case 'course_completion':
      return {
        label: 'Cours terminé',
        icon: 'CheckCircle',
        iconColor: 'text-primary',
        defaultUser: { name: 'Apprenant', avatar: defaultAvatar },
      };
    case 'content_creation':
      return {
        label: 'Contenu créé',
        icon: 'BookOpen',
        iconColor: 'text-accent',
        defaultUser: { name: 'Auteur', avatar: defaultAvatar },
      };
    case 'achievement_unlock':
      return {
        label: 'Badge débloqué',
        icon: 'Award',
        iconColor: 'text-warning',
        defaultUser: { name: 'Apprenant', avatar: defaultAvatar },
      };
    case 'system_update':
      return {
        label: 'Système',
        icon: 'Shield',
        iconColor: 'text-secondary-500',
        defaultUser: { name: 'Système', avatar: null },
      };
    case 'payment_received':
       return {
        label: 'Paiement',
        icon: 'CreditCard',
        iconColor: 'text-success',
        defaultUser: { name: 'Client', avatar: defaultAvatar },
      };
    case 'course_enrollment':
      return {
        label: 'Inscription cours',
        icon: 'BookMarked',
        iconColor: 'text-primary',
        defaultUser: { name: 'Apprenant', avatar: defaultAvatar },
      };
    case 'user_login':
      return {
        label: 'Connexion',
        icon: 'LogIn',
        iconColor: 'text-secondary-500',
        defaultUser: { name: 'Utilisateur', avatar: defaultAvatar },
      };
    default:
      return {
        label: 'Activité',
        icon: 'Activity',
        iconColor: 'text-text-secondary',
        defaultUser: { name: 'Utilisateur', avatar: defaultAvatar },
      };
  }
};


const RecentActivity = () => {
  const [activitiesData, setActivitiesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentActivity = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .select(`
          id,
          type,
          action,
          details,
          created_at,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching recent activity:', error);
        setActivitiesData([]);
      } else {
        const transformedData = data.map(activity => {
          const typeProps = getActivityTypeProps(activity.type);
          const user = activity.profiles
            ? { name: activity.profiles.full_name, avatar: activity.profiles.avatar_url }
            : typeProps.defaultUser;

          return {
            id: activity.id,
            type: activity.type,
            user: user,
            action: activity.action || typeProps.label, // Use Supabase action or default label
            timestamp: timeSince(activity.created_at),
            icon: typeProps.icon,
            iconColor: typeProps.iconColor,
            label: typeProps.label, // Adding label for consistency
          };
        });
        setActivitiesData(transformedData);
      }
    } catch (err) {
      console.error('Unexpected error in fetchRecentActivity:', err);
      setActivitiesData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  if (loading) {
    return (
      <div className='bg-surface rounded-lg p-6 shadow-subtle border border-border mb-8'>
        <h3 className='text-lg font-semibold text-text-primary mb-6'>Activité récente</h3>
        <p className="text-text-secondary">Chargement des activités...</p>
      </div>
    );
  }

  if (!activitiesData || activitiesData.length === 0) {
    return (
      <div className='bg-surface rounded-lg p-6 shadow-subtle border border-border mb-8'>
        <h3 className='text-lg font-semibold text-text-primary mb-6'>Activité récente</h3>
        <p className="text-text-secondary">Aucune activité récente.</p>
      </div>
    );
  }

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
        {activitiesData.map(activity => (
          <div
            key={activity.id}
            className='flex items-start space-x-4 p-3 rounded-lg hover:bg-secondary-50 transition-colors'
          >
            <div className='flex-shrink-0'>
              {activity.user && activity.user.avatar ? (
                <Image
                  src={activity.user.avatar}
                  alt={activity.user.name || 'Utilisateur'}
                  className='w-10 h-10 rounded-full object-cover'
                />
              ) : (
                <div className='w-10 h-10 bg-secondary-200 rounded-full flex items-center justify-center'>
                  <Icon aria-hidden="true"  name={activity.user && activity.user.name === 'Système' ? 'Settings' : 'User'} size={20} className='text-secondary-500' />
                </div>
              )}
            </div>

            <div className='flex-1 min-w-0'>
              <div className='flex items-center space-x-2 mb-1'>
                <Icon aria-hidden="true"  name={activity.icon} size={16} className={activity.iconColor} />
                <span className='text-xs font-medium text-text-secondary bg-secondary-100 px-2 py-1 rounded-full'>
                  {activity.label}
                </span>
              </div>
              <p className='text-sm text-text-primary'>
                <span className='font-medium'>{activity.user ? activity.user.name : 'Utilisateur inconnu'}</span> {activity.action}
              </p>
              <p className='text-xs text-text-secondary mt-1'>{activity.timestamp}</p>
            </div>

            <div className='flex-shrink-0'>
              <button className='p-1 rounded-md hover:bg-secondary-100 transition-colors'>
                <Icon aria-hidden="true"  name='MoreHorizontal' size={16} className='text-text-secondary' />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-4 pt-4 border-t border-border'>
        <div className='flex items-center justify-between text-sm'>
          <span className='text-text-secondary'>{activitiesData.length} activités récentes</span>
          <button
            onClick={fetchRecentActivity}
            className='text-primary hover:text-primary-700 transition-colors font-medium'
            disabled={loading}
          >
            {loading ? 'Actualisation...' : 'Actualiser'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
