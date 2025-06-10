import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';

import UserTable from './components/UserTable';
import UserDetailsPanel from './components/UserDetailsPanel';
import UserFilters from './components/UserFilters';
import CreateUserModal from './components/CreateUserModal';
import BulkActionsBar from './components/BulkActionsBar';

const UserManagementAdmin = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    role: 'all',
    registrationDate: 'all',
    activityLevel: 'all',
    courseProgress: 'all',
  });
  const [sortConfig, setSortConfig] = useState({ key: 'lastActivity', direction: 'desc' });

  // Mock user data
  const mockUsers = [
    {
      id: 1,
      name: 'Marie Dubois',
      email: 'marie.dubois@email.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      role: 'student',
      status: 'active',
      registrationDate: '2024-01-15',
      lastActivity: '2024-12-15',
      courseProgress: 75,
      totalCourses: 4,
      completedCourses: 3,
      xpPoints: 2450,
      level: 8,
      streak: 12,
      achievements: 15,
      location: 'Paris, France',
      phone: '+33 1 23 45 67 89',
      notes: `Utilisatrice très active avec d'excellents résultats. Participe régulièrement aux discussions et aide les autres étudiants. Recommandée pour le programme avancé.`,
      enrolledCourses: [
        'IA Fondamentaux',
        'Machine Learning',
        'Deep Learning',
        'Vision par Ordinateur',
      ],
    },
    {
      id: 2,
      name: 'Jean Martin',
      email: 'jean.martin@entreprise.fr',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      role: 'admin',
      status: 'active',
      registrationDate: '2023-11-20',
      lastActivity: '2024-12-14',
      courseProgress: 100,
      totalCourses: 6,
      completedCourses: 6,
      xpPoints: 4200,
      level: 12,
      streak: 45,
      achievements: 28,
      location: 'Lyon, France',
      phone: '+33 4 56 78 90 12',
      notes: `Administrateur expérimenté responsable de la gestion des contenus. Excellent feedback sur l'amélioration de la plateforme.`,
      enrolledCourses: ['Tous les cours', 'Formation Admin', 'Gestion Plateforme'],
    },
    {
      id: 3,
      name: 'Sophie Laurent',
      email: 'sophie.laurent@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      role: 'student',
      status: 'inactive',
      registrationDate: '2024-03-10',
      lastActivity: '2024-11-20',
      courseProgress: 35,
      totalCourses: 2,
      completedCourses: 0,
      xpPoints: 850,
      level: 3,
      streak: 0,
      achievements: 5,
      location: 'Marseille, France',
      phone: '+33 6 12 34 56 78',
      notes: `Étudiante ayant besoin d'encouragement. Dernière connexion il y a 3 semaines. Candidat pour campagne de réengagement.`,
      enrolledCourses: ['IA Fondamentaux', 'Python Basics'],
    },
    {
      id: 4,
      name: 'Pierre Moreau',
      email: 'pierre.moreau@tech.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      role: 'student',
      status: 'active',
      registrationDate: '2024-02-28',
      lastActivity: '2024-12-15',
      courseProgress: 90,
      totalCourses: 5,
      completedCourses: 4,
      xpPoints: 3100,
      level: 10,
      streak: 23,
      achievements: 22,
      location: 'Toulouse, France',
      phone: '+33 5 67 89 01 23',
      notes: `Étudiant très motivé avec d'excellents résultats. Progression rapide et constante. Potentiel pour devenir mentor.`,
      enrolledCourses: [
        'IA Fondamentaux',
        'Machine Learning',
        'Data Science',
        'NLP',
        'Computer Vision',
      ],
    },
    {
      id: 5,
      name: 'Camille Rousseau',
      email: 'camille.rousseau@startup.fr',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'student',
      status: 'pending',
      registrationDate: '2024-12-10',
      lastActivity: '2024-12-12',
      courseProgress: 5,
      totalCourses: 1,
      completedCourses: 0,
      xpPoints: 120,
      level: 1,
      streak: 2,
      achievements: 1,
      location: 'Nantes, France',
      phone: '+33 2 34 56 78 90',
      notes: `Nouvelle utilisatrice. Inscription récente, en cours d'exploration de la plateforme. Suivi nécessaire pour l'onboarding.`,
      enrolledCourses: ['IA Fondamentaux'],
    },
  ];

  // Filter and search users
  const filteredUsers = useMemo(() => {
    let filtered = mockUsers.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filters.status === 'all' || user.status === filters.status;
      const matchesRole = filters.role === 'all' || user.role === filters.role;

      return matchesSearch && matchesStatus && matchesRole;
    });

    // Sort users
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'registrationDate' || sortConfig.key === 'lastActivity') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [mockUsers, searchQuery, filters, sortConfig]);

  const handleSort = key => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleUserSelect = userId => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length ? [] : filteredUsers.map(user => user.id)
    );
  };

  const handleUserClick = user => {
    setSelectedUser(user);
    setShowDetailsPanel(true);
  };

  const handleBulkAction = action => {
    console.log(`Bulk action: ${action} for users:`, selectedUsers);
    // Implement bulk actions here
    setSelectedUsers([]);
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='bg-surface border-b border-border shadow-subtle'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            {/* Logo and Navigation */}
            <div className='flex items-center space-x-8'>
              <Link to='/admin-dashboard' className='flex items-center space-x-2'>
                <div className='w-8 h-8 bg-gradient-to-br from-primary to-primary-700 rounded-full flex items-center justify-center'>
                  <Icon name='GraduationCap' size={20} color='white' />
                </div>
                <span className='text-xl font-bold text-text-primary'>AI Foundations</span>
              </Link>

              <nav className='hidden md:flex space-x-6'>
                <Link
                  to='/admin-dashboard'
                  className='text-text-secondary hover:text-primary transition-colors'
                >
                  Tableau de bord
                </Link>
                <Link
                  to='/content-management-courses-modules-lessons'
                  className='text-text-secondary hover:text-primary transition-colors'
                >
                  Contenu
                </Link>
                <span className='text-primary font-medium'>Utilisateurs</span>
              </nav>
            </div>

            {/* User Menu */}
            <div className='flex items-center space-x-4'>
              <button className='p-2 text-text-secondary hover:text-primary transition-colors'>
                <Icon name='Bell' size={20} />
              </button>
              <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center'>
                <Icon name='User' size={16} color='white' />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Page Header */}
        <div className='mb-8'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-text-primary'>Gestion des Utilisateurs</h1>
              <p className='mt-2 text-text-secondary'>
                Gérez les comptes utilisateurs, permissions et progression d'apprentissage
              </p>
            </div>
            <div className='mt-4 sm:mt-0 flex space-x-3'>
              <button
                onClick={() => setShowCreateModal(true)}
                className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200'
              >
                <Icon name='Plus' size={16} className='mr-2' />
                Nouvel Utilisateur
              </button>
              <button className='inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-lg text-text-secondary bg-surface hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200'>
                <Icon name='Download' size={16} className='mr-2' />
                Exporter
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <div className='bg-surface rounded-lg p-6 border border-border shadow-subtle'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center'>
                  <Icon name='Users' size={16} color='var(--color-primary)' />
                </div>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-text-secondary'>Total Utilisateurs</p>
                <p className='text-2xl font-bold text-text-primary'>{mockUsers.length}</p>
              </div>
            </div>
          </div>

          <div className='bg-surface rounded-lg p-6 border border-border shadow-subtle'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center'>
                  <Icon name='UserCheck' size={16} color='var(--color-success)' />
                </div>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-text-secondary'>Actifs</p>
                <p className='text-2xl font-bold text-text-primary'>
                  {mockUsers.filter(u => u.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-surface rounded-lg p-6 border border-border shadow-subtle'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center'>
                  <Icon name='Clock' size={16} color='var(--color-warning)' />
                </div>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-text-secondary'>En Attente</p>
                <p className='text-2xl font-bold text-text-primary'>
                  {mockUsers.filter(u => u.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-surface rounded-lg p-6 border border-border shadow-subtle'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-error-100 rounded-lg flex items-center justify-center'>
                  <Icon name='UserX' size={16} color='var(--color-error)' />
                </div>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-text-secondary'>Inactifs</p>
                <p className='text-2xl font-bold text-text-primary'>
                  {mockUsers.filter(u => u.status === 'inactive').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Main Content */}
          <div
            className={`${showDetailsPanel ? 'lg:w-2/3' : 'w-full'} transition-all duration-300`}
          >
            {/* Search and Filters */}
            <div className='bg-surface rounded-lg border border-border shadow-subtle mb-6'>
              <div className='p-6'>
                <div className='flex flex-col sm:flex-row gap-4 mb-4'>
                  <div className='flex-1'>
                    <div className='relative'>
                      <Icon
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
                    <Icon name='Filter' size={16} className='mr-2' />
                    Filtres
                  </button>
                </div>

                <UserFilters filters={filters} setFilters={setFilters} />
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <BulkActionsBar
                selectedCount={selectedUsers.length}
                onBulkAction={handleBulkAction}
                onClearSelection={() => setSelectedUsers([])}
              />
            )}

            {/* Users Table */}
            <UserTable
              users={filteredUsers}
              selectedUsers={selectedUsers}
              sortConfig={sortConfig}
              onSort={handleSort}
              onUserSelect={handleUserSelect}
              onSelectAll={handleSelectAll}
              onUserClick={handleUserClick}
            />
          </div>

          {/* User Details Panel */}
          {showDetailsPanel && (
            <UserDetailsPanel user={selectedUser} onClose={() => setShowDetailsPanel(false)} />
          )}
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onUserCreated={newUser => {
            console.log('New user created:', newUser);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};

export default UserManagementAdmin;
