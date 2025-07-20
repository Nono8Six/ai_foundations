import { useState } from 'react';
import Icon from '@shared/components/AppIcon';
import Image from '@shared/components/AppImage';
import type { AdminUser } from '@frontend/types/adminUser';

interface UserDetailsPanelProps {
  user: AdminUser | null;
  onClose: () => void;
}

const UserDetailsPanel = ({ user, onClose }: UserDetailsPanelProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'activity' | 'notes'>('overview');

  if (!user) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-success-100 text-success-700', label: 'Actif', icon: 'CheckCircle' },
      inactive: { color: 'bg-error-100 text-error-700', label: 'Inactif', icon: 'XCircle' },
      pending: { color: 'bg-warning-100 text-warning-700', label: 'En attente', icon: 'Clock' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        <Icon aria-hidden='true' name={config.icon} size={14} className='mr-1' />
        {config.label}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { color: 'bg-primary-100 text-primary-700', label: 'Administrateur', icon: 'Shield' },
      student: { color: 'bg-secondary-100 text-secondary-700', label: 'Étudiant', icon: 'User' },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.student;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        <Icon aria-hidden='true' name={config.icon} size={14} className='mr-1' />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const tabs = [
    { id: 'overview', label: "Vue d'ensemble", icon: 'User' },
    { id: 'progress', label: 'Progression', icon: 'TrendingUp' },
    { id: 'activity', label: 'Activité', icon: 'Activity' },
    { id: 'notes', label: 'Notes', icon: 'FileText' },
  ];

  const mockActivityLog = [
    {
      id: 1,
      action: 'Connexion à la plateforme',
      timestamp: '2024-12-15T09:30:00',
      details: 'Connexion depuis Paris, France',
    },
    {
      id: 2,
      action: 'Leçon terminée',
      timestamp: '2024-12-15T09:15:00',
      details: 'Deep Learning - Réseaux de neurones convolutifs',
    },
    {
      id: 3,
      action: 'Badge obtenu',
      timestamp: '2024-12-15T09:10:00',
      details: 'Expert en Vision par Ordinateur',
    },
    {
      id: 4,
      action: 'Quiz réussi',
      timestamp: '2024-12-14T16:45:00',
      details: 'Score: 95% - Machine Learning Avancé',
    },
  ];

  return (
    <div className='lg:w-1/3 bg-surface border border-border rounded-lg shadow-subtle'>
      {/* Header */}
      <div className='flex items-center justify-between p-6 border-b border-border'>
        <h3 className='text-lg font-semibold text-text-primary'>Détails Utilisateur</h3>
        <button
          onClick={onClose}
          className='p-2 hover:bg-secondary-50 rounded-lg transition-colors'
        >
          <Icon name='X' size={20} aria-label='Fermer' className='text-text-secondary' />
        </button>
      </div>

      {/* User Header */}
      <div className='p-6 border-b border-border'>
        <div className='flex items-center space-x-4 mb-4'>
          <Image
            src={user.avatar}
            alt={user.name}
            className='h-16 w-16 rounded-full object-cover'
          />
          <div className='flex-1'>
            <h4 className='text-xl font-semibold text-text-primary'>{user.name}</h4>
            <p className='text-text-secondary'>{user.email}</p>
            <div className='flex items-center space-x-2 mt-2'>
              {getRoleBadge(user.role)}
              {getStatusBadge(user.status)}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='flex space-x-2'>
          <button className='flex-1 inline-flex items-center justify-center px-3 py-2 border border-border text-sm font-medium rounded-lg text-text-secondary bg-surface hover:bg-secondary-50 transition-colors'>
            <Icon aria-hidden='true' name='MessageCircle' size={16} className='mr-2' />
            Message
          </button>
          <button className='flex-1 inline-flex items-center justify-center px-3 py-2 border border-border text-sm font-medium rounded-lg text-text-secondary bg-surface hover:bg-secondary-50 transition-colors'>
            <Icon aria-hidden='true' name='Edit' size={16} className='mr-2' />
            Modifier
          </button>
          <button className='px-3 py-2 border border-border text-sm font-medium rounded-lg text-text-secondary bg-surface hover:bg-secondary-50 transition-colors'>
            <Icon name='MoreVertical' size={16} aria-label="Plus d'options" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className='border-b border-border'>
        <nav className='flex space-x-1 p-1'>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'progress' | 'activity' | 'notes')}
              className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
              }`}
            >
              <Icon aria-hidden='true' name={tab.icon} size={16} className='mr-1' />
              <span className='hidden sm:inline'>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className='p-6 max-h-96 overflow-y-auto'>
        {activeTab === 'overview' && (
          <div className='space-y-6'>
            {/* Stats Grid */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='text-center p-4 bg-primary-50 rounded-lg'>
                <div className='text-2xl font-bold text-primary'>{user.level}</div>
                <div className='text-sm text-text-secondary'>Niveau</div>
              </div>
              <div className='text-center p-4 bg-success-50 rounded-lg'>
                <div className='text-2xl font-bold text-success'>{user.xpPoints}</div>
                <div className='text-sm text-text-secondary'>XP Points</div>
              </div>
              <div className='text-center p-4 bg-warning-50 rounded-lg'>
                <div className='text-2xl font-bold text-warning'>{user.streak}</div>
                <div className='text-sm text-text-secondary'>Série</div>
              </div>
              <div className='text-center p-4 bg-accent-50 rounded-lg'>
                <div className='text-2xl font-bold text-accent'>{user.achievements}</div>
                <div className='text-sm text-text-secondary'>Badges</div>
              </div>
            </div>

            {/* User Info */}
            <div className='space-y-4'>
              <div>
                <label className='text-sm font-medium text-text-secondary'>Localisation</label>
                <p className='text-text-primary'>{user.location}</p>
              </div>
              <div>
                <label className='text-sm font-medium text-text-secondary'>Téléphone</label>
                <p className='text-text-primary'>{user.phone}</p>
              </div>
              <div>
                <label className='text-sm font-medium text-text-secondary'>Inscription</label>
                <p className='text-text-primary'>{formatDate(user.registrationDate)}</p>
              </div>
              <div>
                <label className='text-sm font-medium text-text-secondary'>Dernière activité</label>
                <p className='text-text-primary'>{formatDate(user.lastActivity)}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className='space-y-6'>
            {/* Overall Progress */}
            <div>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm font-medium text-text-secondary'>Progression globale</span>
                <span className='text-sm text-text-primary'>{user.courseProgress}%</span>
              </div>
              <div className='w-full bg-secondary-200 rounded-full h-3'>
                <div
                  className='bg-primary h-3 rounded-full transition-all duration-300'
                  style={{ width: `${user.courseProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Course Stats */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='text-center p-4 bg-surface border border-border rounded-lg'>
                <div className='text-xl font-bold text-text-primary'>{user.totalCourses}</div>
                <div className='text-sm text-text-secondary'>Cours inscrits</div>
              </div>
              <div className='text-center p-4 bg-surface border border-border rounded-lg'>
                <div className='text-xl font-bold text-success'>{user.completedCourses}</div>
                <div className='text-sm text-text-secondary'>Cours terminés</div>
              </div>
            </div>

            {/* Enrolled Courses */}
            <div>
              <h5 className='text-sm font-medium text-text-secondary mb-3'>Cours inscrits</h5>
              <div className='space-y-2'>
                {user.enrolledCourses.map((course, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-3 bg-secondary-50 rounded-lg'
                  >
                    <span className='text-sm text-text-primary'>{course}</span>
                    <Icon
                      aria-hidden='true'
                      name='BookOpen'
                      size={16}
                      className='text-text-secondary'
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className='space-y-4'>
            <h5 className='text-sm font-medium text-text-secondary'>Activité récente</h5>
            <div className='space-y-3'>
              {mockActivityLog.map(activity => (
                <div
                  key={activity.id}
                  className='flex items-start space-x-3 p-3 bg-secondary-50 rounded-lg'
                >
                  <div className='flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2'></div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-text-primary'>{activity.action}</p>
                    <p className='text-xs text-text-secondary'>{activity.details}</p>
                    <p className='text-xs text-text-secondary mt-1'>
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium text-text-secondary mb-2 block'>
                Notes administratives
              </label>
              <div className='p-4 bg-secondary-50 rounded-lg'>
                <p className='text-sm text-text-primary whitespace-pre-wrap'>{user.notes}</p>
              </div>
            </div>

            <div>
              <label className='text-sm font-medium text-text-secondary mb-2 block'>
                Ajouter une note
              </label>
              <textarea
                rows={4}
                className='w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none'
                placeholder='Ajouter une note sur cet utilisateur...'
              ></textarea>
              <button className='mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-700 transition-colors'>
                <Icon aria-hidden='true' name='Plus' size={16} className='mr-2' />
                Ajouter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailsPanel;
