import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@frontend/context/AuthContext';
import Icon, { type IconName } from './AppIcon';
import Avatar from './Avatar';
import { log } from '@libs/logger';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

// Typage des éléments de navigation
interface NavItem {
  name: string;
  path: string;
  icon: IconName;
}

const Header = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      const timer = setTimeout(() => clearProfileError(), 3000);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [user, profileError, authError, clearProfileError]);

  const getFirstName = () => {
    const name = userProfile?.full_name || user?.user_metadata?.full_name || '';
    return name.split(' ')[0] ?? 'Utilisateur';
  };

  const handleLogout = async () => {
    try {
      await logout();
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


  return (
    <header className='bg-surface border-b border-border sticky top-0 z-50'>
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
            }}
            className='lg:hidden p-2 rounded-lg hover:bg-secondary-50 transition-colors duration-200'
            aria-label='Toggle menu'
          >
            <Icon aria-hidden='true' name={isMenuOpen ? 'X' : 'Menu'} size={24} />
          </button>

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className='w-10 h-10 rounded-full hover:shadow-medium transition-all duration-200 flex items-center justify-center'
                >
                  {loading ? (
                    <Skeleton className='w-5 h-5 rounded-full' />
                  ) : (
                    <Avatar
                      src={userProfile?.avatar_url ?? undefined}
                      name={userProfile?.full_name || user?.user_metadata?.full_name}
                    />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56'>
                <div className='px-4 py-2 border-b border-border mb-2'>
                  <p className='font-medium text-text-primary'>{getFirstName()}</p>
                  <p className='text-sm text-text-secondary'>Niveau {userProfile?.level || 1}</p>
                </div>
                {profileItems.map(item => (
                  <DropdownMenuItem asChild key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 w-full ${
                        location.pathname === item.path.split('?')[0]
                          ? 'text-primary'
                          : 'text-text-secondary'
                      }`}
                    >
                      <Icon aria-hidden='true' name={item.icon} size={18} />
                      <span>{item.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                {adminItems.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    {adminItems.map(item => (
                      <DropdownMenuItem asChild key={item.path}>
                        <Link
                          to={item.path}
                          className={`flex items-center space-x-3 w-full ${
                            location.pathname === item.path ? 'text-primary' : 'text-text-secondary'
                          }`}
                        >
                          <Icon aria-hidden='true' name={item.icon} size={18} />
                          <span>{item.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout} className='flex items-center space-x-2'>
                  <Icon aria-hidden='true' name='LogOut' size={16} />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
