import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import logger from '../../../utils/logger.ts';

const UserTable = ({
  users,
  selectedUsers,
  sortConfig,
  onSort,
  onUserSelect,
  onSelectAll,
  onUserClick,
}) => {
  const getSortIcon = key => {
    if (sortConfig.key !== key) return 'ArrowUpDown';
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const getStatusBadge = status => {
    const statusConfig = {
      active: { color: 'bg-success-100 text-success-700', label: 'Actif' },
      inactive: { color: 'bg-error-100 text-error-700', label: 'Inactif' },
      pending: { color: 'bg-warning-100 text-warning-700', label: 'En attente' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const getRoleBadge = role => {
    const roleConfig = {
      admin: { color: 'bg-primary-100 text-primary-700', label: 'Admin' },
      student: { color: 'bg-secondary-100 text-secondary-700', label: 'Étudiant' },
    };

    const config = roleConfig[role] || roleConfig.student;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getActivityStatus = lastActivity => {
    const daysSinceActivity = Math.floor(
      (new Date() - new Date(lastActivity)) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceActivity === 0) return { color: 'text-success', label: "Aujourd'hui" };
    if (daysSinceActivity === 1) return { color: 'text-success', label: 'Hier' };
    if (daysSinceActivity <= 7)
      return { color: 'text-warning', label: `Il y a ${daysSinceActivity}j` };
    if (daysSinceActivity <= 30)
      return { color: 'text-warning', label: `Il y a ${daysSinceActivity}j` };
    return { color: 'text-error', label: `Il y a ${daysSinceActivity}j` };
  };

  return (
    <div className='bg-surface rounded-lg border border-border shadow-subtle overflow-hidden'>
      {/* Desktop Table */}
      <div className='hidden lg:block overflow-x-auto'>
        <table className='min-w-full divide-y divide-border'>
          <thead className='bg-secondary-50'>
            <tr>
              <th className='px-6 py-3 text-left'>
                <input
                  type='checkbox'
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={onSelectAll}
                  className='h-4 w-4 text-primary focus:ring-primary border-border rounded'
                />
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider'>
                <button
                  onClick={() => onSort('name')}
                  className='flex items-center space-x-1 hover:text-text-primary transition-colors'
                >
                  <span>Utilisateur</span>
                  <Icon name={getSortIcon('name')} size={14} />
                </button>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider'>
                <button
                  onClick={() => onSort('role')}
                  className='flex items-center space-x-1 hover:text-text-primary transition-colors'
                >
                  <span>Rôle</span>
                  <Icon name={getSortIcon('role')} size={14} />
                </button>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider'>
                <button
                  onClick={() => onSort('status')}
                  className='flex items-center space-x-1 hover:text-text-primary transition-colors'
                >
                  <span>Statut</span>
                  <Icon name={getSortIcon('status')} size={14} />
                </button>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider'>
                <button
                  onClick={() => onSort('registrationDate')}
                  className='flex items-center space-x-1 hover:text-text-primary transition-colors'
                >
                  <span>Inscription</span>
                  <Icon name={getSortIcon('registrationDate')} size={14} />
                </button>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider'>
                <button
                  onClick={() => onSort('lastActivity')}
                  className='flex items-center space-x-1 hover:text-text-primary transition-colors'
                >
                  <span>Dernière activité</span>
                  <Icon name={getSortIcon('lastActivity')} size={14} />
                </button>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider'>
                <button
                  onClick={() => onSort('courseProgress')}
                  className='flex items-center space-x-1 hover:text-text-primary transition-colors'
                >
                  <span>Progression</span>
                  <Icon name={getSortIcon('courseProgress')} size={14} />
                </button>
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-surface divide-y divide-border'>
            {users.map(user => {
              const activityStatus = getActivityStatus(user.lastActivity);
              return (
                <tr
                  key={user.id}
                  className='hover:bg-secondary-50 transition-colors cursor-pointer'
                  onClick={() => onUserClick(user)}
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <input
                      type='checkbox'
                      checked={selectedUsers.includes(user.id)}
                      onChange={e => {
                        e.stopPropagation();
                        onUserSelect(user.id);
                      }}
                      className='h-4 w-4 text-primary focus:ring-primary border-border rounded'
                    />
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 h-10 w-10'>
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          className='h-10 w-10 rounded-full object-cover'
                        />
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-text-primary'>{user.name}</div>
                        <div className='text-sm text-text-secondary'>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>{getRoleBadge(user.role)}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>{getStatusBadge(user.status)}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-text-secondary'>
                    {formatDate(user.registrationDate)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className={`text-sm ${activityStatus.color}`}>
                      {activityStatus.label}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='w-full bg-secondary-200 rounded-full h-2 mr-2'>
                        <div
                          className='bg-primary h-2 rounded-full transition-all duration-300'
                          style={{ width: `${user.courseProgress}%` }}
                        ></div>
                      </div>
                      <span className='text-sm text-text-secondary min-w-[3rem]'>
                        {user.courseProgress}%
                      </span>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <div className='flex items-center justify-end space-x-2'>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          logger.info('Edit user:', user.id);
                        }}
                        className='text-primary hover:text-primary-700 transition-colors'
                      >
                        <Icon name='Edit' size={16} />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          logger.info('Message user:', user.id);
                        }}
                        className='text-text-secondary hover:text-primary transition-colors'
                      >
                        <Icon name='MessageCircle' size={16} />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          logger.info('More actions for user:', user.id);
                        }}
                        className='text-text-secondary hover:text-primary transition-colors'
                      >
                        <Icon name='MoreVertical' size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className='lg:hidden'>
        {users.map(user => {
          const activityStatus = getActivityStatus(user.lastActivity);
          return (
            <div
              key={user.id}
              className='p-4 border-b border-border last:border-b-0 hover:bg-secondary-50 transition-colors cursor-pointer'
              onClick={() => onUserClick(user)}
            >
              <div className='flex items-start space-x-3'>
                <input
                  type='checkbox'
                  checked={selectedUsers.includes(user.id)}
                  onChange={e => {
                    e.stopPropagation();
                    onUserSelect(user.id);
                  }}
                  className='mt-1 h-4 w-4 text-primary focus:ring-primary border-border rounded'
                />
                <div className='flex-shrink-0'>
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    className='h-12 w-12 rounded-full object-cover'
                  />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-medium text-text-primary truncate'>{user.name}</p>
                    <div className='flex space-x-1'>
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
                    </div>
                  </div>
                  <p className='text-sm text-text-secondary truncate'>{user.email}</p>
                  <div className='mt-2 flex items-center justify-between'>
                    <span className={`text-xs ${activityStatus.color}`}>
                      {activityStatus.label}
                    </span>
                    <span className='text-xs text-text-secondary'>
                      {user.courseProgress}% progression
                    </span>
                  </div>
                  <div className='mt-2 w-full bg-secondary-200 rounded-full h-1.5'>
                    <div
                      className='bg-primary h-1.5 rounded-full transition-all duration-300'
                      style={{ width: `${user.courseProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {users.length === 0 && (
        <div className='text-center py-12'>
          <Icon name='Users' size={48} className='mx-auto text-text-secondary mb-4' />
          <h3 className='text-lg font-medium text-text-primary mb-2'>Aucun utilisateur trouvé</h3>
          <p className='text-text-secondary'>
            Essayez de modifier vos critères de recherche ou filtres.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserTable;
