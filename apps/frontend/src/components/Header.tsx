import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@frontend/context/AuthContext';
import Icon, { type IconName } from './AppIcon';
import Image from './AppImage';
import { log } from '@libs/logger';

// Typage des éléments de navigation
interface NavItem {
  name: string;
  path: string;
  icon: IconName;
}

const Header = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const {
    user,
    userProfile,
    loading,
    profileError,
    authError,
    logout,
    clearProfileError,
  } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (user && profileError && !authError) {
      log.error('Erreur de chargement du profil:', profileError);
      const timer = setTimeout(() => {
        clearProfileError();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, profileError, authError, clearProfileError]);

  const getInitials = () => {
    const name = userProfile?.full_name || user?.user_metadata?.full_name || '';
    const [first, last] = name.split(' ');
    const initials = `${first?.charAt(0) ?? ''}${last?.charAt(0) ?? ''}`.toUpperCase();
    return initials || null;
  };

  const getFirstName = () => {
    const name = userProfile?.full_name || user?.user_metadata?.full_name || '';
    return name.split(' ')[0] ?? 'Utilisateur';
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
      setIsMenuOpen(false);
    } catch (error) {
      log.error('Erreur lors de la déconnexion:', error);
    }
  };

  // NavBar top
  const navItems: NavItem[] = user
    ? [
        { name: 'Accueil', path: '/', icon: 'Home' },
        { name: 'Catalogue', path: '/programmes', icon: 'BookOpen' },
        { name: 'Mon Espace', path: '/espace', icon: 'LayoutDashboard' },
      ]
    : [
        { name: 'Accueil', path: '/', icon: 'Home' },
        { name: 'Programmes', path: '/programmes', icon: 'BookOpen' },
      ];

  // Menu profil
  const profileItems: NavItem[] = user
    ? [
        { name: 'Mon Profil', path: '/profile', icon: 'User' },
        { name: 'Mes Statistiques', path: '/profile?tab=stats', icon: 'BarChart3' },
        { name: 'Paramètres', path: '/profile?tab=settings', icon: 'Settings' },
      ]
    : [];

  // Menu admin (si admin)
  const adminItems: NavItem[] = userProfile?.is_admin
    ? [
        { name: 'Administration', path: '/admin-dashboard', icon: 'Shield' },
        { name: 'Gestion Contenu', path: '/cms', icon: 'FileText' },
        { name: 'Gestion Utilisateurs', path: '/user-management-admin', icon: 'Users' },
      ]
    : [];

  // Close profile menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileOpen && !(event.target as HTMLElement).closest('.profile-menu')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <header className='bg-surface border-b border-border sticky top-0 z-50'>
      {user && profileError && !authError && (
        <div className='bg-warning-50 text-warning-800 text-sm text-center px-4 py-2 border-b border-warning-200'>
          Impossible de charger les informations du profil. Certaines fonctionnalités peuvent être limitées.
        </div>
      )}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link to='/' className='flex items-center space-x-2'>
            <div className='w-10 h-10 bg-gradient-to-br from-primary to-primary-700 rounded-full flex items-center justify-center'>
              <Icon aria-hidden='true' name='GraduationCap' size={24} color='white' />
            </div>
            <span className='text-xl font-bold text-text-primary'>AI Foundations</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden lg:flex items-center space-x-8'>
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-primary font-medium'
                    : 'text-text-secondary hover:text-primary'
                }`}
              >
                <Icon aria-hidden='true' name={item.icon} size={18} />
                <span>{item.name}</span>
              </Link>
            ))}
            {!user && (
              <>
                <Link
                  to='/login'
                  className='text-text-secondary hover:text-primary transition-colors duration-200'
                >
                  Connexion
                </Link>
                <Link
                  to='/register'
                  className='bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium'
                >
                  Rejoindre
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsProfileOpen(false);
            }}
            className='lg:hidden p-2 rounded-lg hover:bg-secondary-50 transition-colors duration-200'
            aria-label='Toggle menu'
          >
            <Icon aria-hidden='true' name={isMenuOpen ? 'X' : 'Menu'} size={24} />
          </button>

          {/* User Menu */}
          {user && (
            <div className='profile-menu relative'>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className='w-10 h-10 bg-gradient-to-br from-primary to-primary-700 rounded-full flex items-center justify-center hover:shadow-medium transition-all duration-200'
              >
                {loading ? (
                  <div className='w-5 h-5 rounded-full bg-gray-200 animate-pulse' />
                ) : userProfile?.avatar_url ? (
                  <Image
                    src={userProfile.avatar_url}
                    alt='Profile'
                    className='w-full h-full rounded-full object-cover'
                  />
                ) : getInitials() ? (
                  <span className='text-white font-medium text-sm'>{getInitials()}</span>
                ) : (
                  <Icon aria-hidden='true' name='User' size={20} color='white' />
                )}
              </button>

              {isProfileOpen && (
                <div className='absolute right-0 mt-2 w-56 bg-surface rounded-lg shadow-medium border border-border py-2 z-50'>
                  <div className='px-4 py-2 border-b border-border mb-2'>
                    <p className='font-medium text-text-primary'>{getFirstName()}</p>
                    <p className='text-sm text-text-secondary'>Niveau {userProfile?.level || 1}</p>
                  </div>

                  {/* Profile menu items */}
                  {profileItems.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsProfileOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-2 text-text-secondary hover:bg-secondary-50 hover:text-primary transition-colors duration-200 ${
                        location.pathname === item.path.split('?')[0]
                          ? 'bg-secondary-50 text-primary'
                          : ''
                      }`}
                    >
                      <Icon aria-hidden='true' name={item.icon} size={18} />
                      <span>{item.name}</span>
                    </Link>
                  ))}

                  {/* Admin menu items */}
                  {adminItems.length > 0 && (
                    <>
                      <div className='border-t border-border my-2'></div>
                      {adminItems.map(item => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsProfileOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-2 text-text-secondary hover:bg-secondary-50 hover:text-primary transition-colors duration-200 ${
                            location.pathname === item.path ? 'bg-secondary-50 text-primary' : ''
                          }`}
                        >
                          <Icon aria-hidden='true' name={item.icon} size={18} />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className='w-full px-4 py-2 text-left text-text-primary hover:bg-secondary-50 transition-colors duration-200 flex items-center space-x-2 border-t border-border mt-2 pt-2'
                  >
                    <Icon aria-hidden='true' name='LogOut' size={16} />
                    <span>Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className='lg:hidden border-t border-border mt-4 pt-4 pb-4'>
          <nav className='space-y-2'>
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 text-text-secondary hover:bg-secondary-50 hover:text-primary transition-colors duration-200 rounded-lg ${
                  location.pathname === item.path ? 'bg-secondary-50 text-primary' : ''
                }`}
              >
                <Icon aria-hidden='true' name={item.icon} size={18} />
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Profile items in mobile menu */}
            {user &&
              profileItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 text-text-secondary hover:bg-secondary-50 hover:text-primary transition-colors duration-200 rounded-lg ${
                    location.pathname === item.path.split('?')[0]
                      ? 'bg-secondary-50 text-primary'
                      : ''
                  }`}
                >
                  <Icon aria-hidden='true' name={item.icon} size={18} />
                  <span>{item.name}</span>
                </Link>
              ))}

            {/* Admin items in mobile menu */}
            {adminItems.length > 0 &&
              adminItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 text-text-secondary hover:bg-secondary-50 hover:text-primary transition-colors duration-200 rounded-lg ${
                    location.pathname === item.path ? 'bg-secondary-50 text-primary' : ''
                  }`}
                >
                  <Icon aria-hidden='true' name={item.icon} size={18} />
                  <span>{item.name}</span>
                </Link>
              ))}

            {user && (
              <button
                onClick={handleLogout}
                className='flex items-center space-x-2 w-full px-4 py-3 text-text-primary hover:bg-secondary-50 transition-colors duration-200 rounded-lg'
              >
                <Icon aria-hidden='true' name='LogOut' size={16} />
                <span>Déconnexion</span>
              </button>
            )}
            {!user && (
              <div className='space-y-3 mt-4'>
                <Link
                  to='/login'
                  onClick={() => setIsMenuOpen(false)}
                  className='flex items-center justify-center space-x-2 text-text-secondary hover:text-primary transition-colors duration-200'
                >
                  <Icon aria-hidden='true' name='LogIn' size={18} />
                  <span>Connexion</span>
                </Link>
                <Link
                  to='/register'
                  onClick={() => setIsMenuOpen(false)}
                  className='flex items-center justify-center space-x-2 bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium'
                >
                  <Icon aria-hidden='true' name='UserPlus' size={18} />
                  <span>Rejoindre</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
