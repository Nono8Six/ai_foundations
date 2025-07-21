import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from '@core/supabase/client';
import Icon from '@shared/components/AppIcon';
import { log } from '@libs/logger';
import UserTable from './components/UserTable';
import UserDetailsPanel from './components/UserDetailsPanel';
import UserFilters from './components/UserFilters';
import CreateUserModal from './components/CreateUserModal';
import BulkActionsBar from './components/BulkActionsBar';
import type { AdminUser } from '@frontend/types/adminUser';

export interface AdminFilters {
  status: string;
  role: string;
  registrationDate: string;
  activityLevel: string;
  courseProgress: string;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

const UserManagementAdmin: React.FC = () => {

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const [showDetailsPanel, setShowDetailsPanel] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filters, setFilters] = useState<AdminFilters>({
    status: 'all',
    role: 'all',
    registrationDate: 'all',
    activityLevel: 'all',
    courseProgress: 'all',
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'lastActivity',
    direction: 'desc',
  });

  // Récupère les utilisateurs depuis Supabase au chargement du composant
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) {
        log.error('Error fetching users', error);
        return;
      }
      // Transforme les données de la base pour les adapter au format de l'application
      const mapped = (data || []).map(p => ({
        id: p.id,
        name: p.full_name || 'Utilisateur',
        email: p.email || '',
        avatar:
          p.avatar_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            p.full_name || 'User'
          )}&background=1e40af&color=ffffff`,
        role: (p.is_admin ? 'admin' : 'student') as 'admin' | 'student',
        status: 'active' as 'active' | 'inactive' | 'pending',
        registrationDate: p.created_at || new Date().toISOString(),
        lastActivity: p.updated_at || p.created_at || new Date().toISOString(),
        courseProgress: 0,
        totalCourses: 0,
        completedCourses: 0,
        xpPoints: p.xp || 0,
        level: 1,
        streak: p.current_streak || 0,
        achievements: 0,
        location: '',
        phone: '',
        notes: '',
        enrolledCourses: [],
      }));
      setUsers(mapped);
    };

    fetchUsers();
  }, []);

  // Filtre et trie les utilisateurs
  const filteredUsers = useMemo(() => {
    const filtered = users.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.status === 'all' || user.status === filters.status;
      const matchesRole = filters.role === 'all' || user.role === filters.role;
      return matchesSearch && matchesStatus && matchesRole;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key as keyof AdminUser];
        let bValue = b[sortConfig.key as keyof AdminUser];
        if (sortConfig.key === 'registrationDate' || sortConfig.key === 'lastActivity') {
          aValue = new Date(aValue as string).getTime();
          bValue = new Date(bValue as string).getTime();
        }
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [users, searchQuery, filters, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length ? [] : filteredUsers.map(user => user.id)
    );
  };

  const handleUserClick = (user: AdminUser) => {
    setSelectedUser(user);
    setShowDetailsPanel(true);
  };

  const handleBulkAction = (action: string) => {
    log.info(`Bulk action: ${action} for users`, { users: selectedUsers });
    setSelectedUsers([]);
  };

  return (
    <div className='min-h-screen bg-background'>
      <main className='p-6'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-8'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <h1 className='text-3xl font-bold text-text-primary'>Gestion des Utilisateurs</h1>
                <p className='mt-2 text-text-secondary'>
                  Gérez les comptes utilisateurs, permissions et progression d&rsquo;apprentissage
                </p>
              </div>
              <div className='mt-4 sm:mt-0 flex space-x-3'>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200'
                >
                  <Icon aria-hidden='true' name='Plus' size={16} className='mr-2' />
                  Nouvel Utilisateur
                </button>
                <button className='inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-lg text-text-secondary bg-surface hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200'>
                  <Icon aria-hidden='true' name='Download' size={16} className='mr-2' />
                  Exporter
                </button>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
            <div className='bg-surface rounded-lg p-6 border border-border shadow-subtle'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center'>
                    <Icon aria-hidden='true' name='Users' size={16} color='var(--color-primary)' />
                  </div>
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-text-secondary'>Total Utilisateurs</p>
                  <p className='text-2xl font-bold text-text-primary'>{users.length}</p>
                </div>
              </div>
            </div>

            <div className='bg-surface rounded-lg p-6 border border-border shadow-subtle'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center'>
                    <Icon
                      aria-hidden='true'
                      name='UserCheck'
                      size={16}
                      color='var(--color-success)'
                    />
                  </div>
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-text-secondary'>Actifs</p>
                  <p className='text-2xl font-bold text-text-primary'>
                    {users.filter(u => u.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>

            <div className='bg-surface rounded-lg p-6 border border-border shadow-subtle'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center'>
                    <Icon aria-hidden='true' name='Clock' size={16} color='var(--color-warning)' />
                  </div>
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-text-secondary'>En Attente</p>
                  <p className='text-2xl font-bold text-text-primary'>
                    {users.filter(u => u.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>

            <div className='bg-surface rounded-lg p-6 border border-border shadow-subtle'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='w-8 h-8 bg-error-100 rounded-lg flex items-center justify-center'>
                    <Icon aria-hidden='true' name='UserX' size={16} color='var(--color-error)' />
                  </div>
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-text-secondary'>Inactifs</p>
                  <p className='text-2xl font-bold text-text-primary'>
                    {users.filter(u => u.status === 'inactive').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col lg:flex-row gap-6'>
            <div
              className={`${showDetailsPanel ? 'lg:w-2/3' : 'w-full'} transition-all duration-300`}
            >
              <div className='bg-surface rounded-lg border border-border shadow-subtle mb-6'>
                <div className='p-6'>
                  <div className='flex flex-col sm:flex-row gap-4 mb-4'>
                    <div className='flex-1'>
                      <div className='relative'>
                        <Icon
                          aria-hidden='true'
                          name='Search'
                          size={20}
                          className='absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary'
                        />
                        <input
                          type='text'
                          placeholder='Rechercher par nom ou email...'
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className='w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        />
                      </div>
                    </div>
                    <button className='inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-lg text-text-secondary bg-surface hover:bg-secondary-50 transition-colors'>
                      <Icon aria-hidden='true' name='Filter' size={16} className='mr-2' />
                      Filtres
                    </button>
                  </div>
                  <UserFilters filters={filters} setFilters={setFilters} />
                </div>
              </div>

              {selectedUsers.length > 0 && (
                <BulkActionsBar
                  selectedCount={selectedUsers.length}
                  onBulkAction={handleBulkAction}
                  onClearSelection={() => setSelectedUsers([])}
                />
              )}

              <UserTable
                users={filteredUsers}
                selectedUsers={selectedUsers}
                sortConfig={sortConfig}
                onSort={handleSort}
                onUserSelect={handleUserSelect}
                onSelectAll={handleSelectAll}
                onUserClick={(user) => handleUserClick(user as AdminUser)}
              />
            </div>

            {showDetailsPanel && (
              <UserDetailsPanel user={selectedUser} onClose={() => setShowDetailsPanel(false)} />
            )}
          </div>
        </div>

        {showCreateModal && (
          <CreateUserModal
            onClose={() => setShowCreateModal(false)}
            onUserCreated={newUser => {
              log.info('New user created', { user: newUser });
              setShowCreateModal(false);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default UserManagementAdmin;
