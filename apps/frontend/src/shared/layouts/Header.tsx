import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@features/auth/contexts/AuthContext';
import Icon, { type IconName } from '@shared/components/AppIcon';
import Avatar from '@shared/components/Avatar';
import { log } from '@libs/logger';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@shared/ui/dropdown-menu';
import { Skeleton } from '@shared/ui/skeleton';

// Typage des éléments de navigation
interface NavItem {
  name: string;
  path: string;
  icon: IconName;
}

const Header = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
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

  // Handle scroll effect for glassomorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Handle body scroll lock for mobile menu only
  useEffect(() => {
    if (isMenuOpen && window.innerWidth < 1024) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalOverflow || 'unset';
      };
    }
    return undefined;
  }, [isMenuOpen]);

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
        { name: 'Gestion XP', path: '/admin-xp-management', icon: 'Zap' },
      ]
    : [];


  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        isScrolled 
          ? 'backdrop-blur-md bg-surface/80 border-b border-border/50 shadow-lg' 
          : 'backdrop-blur-sm bg-surface/50 border-b border-transparent'
      }`}>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            {/* Logo with enhanced animation */}
            <Link to='/' className='flex items-center space-x-3 group'>
              <div className='relative w-10 h-10 bg-gradient-to-br from-primary via-primary-600 to-primary-700 rounded-xl flex items-center justify-center transform transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-primary/25'>
                <Icon aria-hidden='true' name='GraduationCap' size={24} color='white' />
                <div className='absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              </div>
              <div className='flex flex-col'>
                <span className='text-xl font-bold text-text-primary group-hover:text-primary transition-colors duration-300'>AI Foundations</span>
                <span className='text-xs text-text-tertiary font-medium -mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2'>Bâtissez votre avenir</span>
              </div>
            </Link>

            {/* Desktop Navigation with modern effects */}
            <nav className='hidden lg:flex items-center space-x-1'>
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-indicator flex items-center space-x-2 px-4 py-2 rounded-lg group ${
                    location.pathname === item.path ? 'active text-primary' : 'text-text-secondary hover:text-primary'
                  }`}
                >
                  <Icon aria-hidden='true' name={item.icon} size={18} className='transition-transform duration-300 group-hover:scale-110' />
                  <span className='font-medium nav-text'>{item.name}</span>
                </Link>
              ))}
              {/* Admin menu in desktop navigation */}
              {userProfile?.is_admin && (
                <div className='relative group'>
                  <button className='flex items-center space-x-2 px-4 py-2 rounded-xl text-text-secondary hover:text-primary hover:bg-surface/80 transition-all duration-300 backdrop-blur-sm'>
                    <Icon aria-hidden='true' name='Shield' size={18} className='transition-transform duration-300 group-hover:scale-110' />
                    <span className='font-medium'>Admin</span>
                    <Icon aria-hidden='true' name='ChevronDown' size={16} className='transition-transform duration-300 group-hover:rotate-180' />
                  </button>
                  <div className='absolute top-full right-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2'>
                    <div className='bg-surface/95 backdrop-blur-md border border-border/50 rounded-xl shadow-xl p-2'>
                      {adminItems.map(item => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            location.pathname === item.path
                              ? 'text-primary bg-primary/10'
                              : 'text-text-secondary hover:text-primary hover:bg-surface/60'
                          }`}
                        >
                          <Icon aria-hidden='true' name={item.icon} size={18} />
                          <span className='font-medium'>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!user && (
                <div className='flex items-center space-x-3 ml-4'>
                  <Link
                    to='/login'
                    className='flex items-center space-x-2 px-4 py-2 rounded-xl text-text-secondary hover:text-primary hover:bg-surface/80 transition-all duration-300 font-medium backdrop-blur-sm'
                  >
                    <Icon aria-hidden='true' name='LogIn' size={18} />
                    <span>Connexion</span>
                  </Link>
                  <Link
                    to='/register'
                    className='flex items-center space-x-2 bg-gradient-to-r from-primary to-primary-600 text-white px-6 py-2.5 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 font-medium shadow-lg hover:shadow-primary/25 transform hover:scale-105 backdrop-blur-sm btn-modern hover-lift'
                  >
                    <Icon aria-hidden='true' name='UserPlus' size={18} />
                    <span>Rejoindre</span>
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button with animation */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='lg:hidden relative p-3 rounded-xl hover:bg-surface/80 transition-all duration-300 backdrop-blur-sm group'
              aria-label='Toggle menu'
            >
              <div className='relative w-6 h-6'>
                <span className={`absolute left-0 top-1 w-6 h-0.5 bg-text-primary transition-all duration-300 ease-out ${
                  isMenuOpen ? 'rotate-45 translate-y-2' : 'rotate-0 translate-y-0'
                }`} />
                <span className={`absolute left-0 top-3 w-6 h-0.5 bg-text-primary transition-all duration-300 ease-out ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`} />
                <span className={`absolute left-0 top-5 w-6 h-0.5 bg-text-primary transition-all duration-300 ease-out ${
                  isMenuOpen ? '-rotate-45 -translate-y-2' : 'rotate-0 translate-y-0'
                }`} />
              </div>
            </button>

            {/* Enhanced User Menu */}
            {user && (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className='hidden lg:flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-surface/80 transition-all duration-300 backdrop-blur-sm group'>
                    <div className='relative'>
                      {loading ? (
                        <Skeleton className='w-8 h-8 rounded-full' />
                      ) : (
                        <>
                          <Avatar
                            src={userProfile?.avatar_url ?? undefined}
                            name={userProfile?.full_name || user?.user_metadata?.full_name}
                            className='w-8 h-8 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300'
                          />
                          <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-surface animate-pulse' />
                        </>
                      )}
                    </div>
                    <div className='flex flex-col items-start'>
                      <span className='text-sm font-medium text-text-primary'>{getFirstName()}</span>
                      <span className='text-xs text-text-tertiary'>Niveau {userProfile?.level || 1}</span>
                    </div>
                    <Icon aria-hidden='true' name='ChevronDown' size={16} className='text-text-tertiary group-hover:text-primary transition-all duration-300 group-hover:rotate-180' />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56 bg-surface/95 backdrop-blur-md border border-border/50 shadow-xl'>
                  {profileItems.map(item => (
                    <DropdownMenuItem asChild key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-3 w-full px-4 py-3 transition-all duration-200 ${
                          location.pathname === item.path.split('?')[0]
                            ? 'text-primary bg-primary/10'
                            : 'text-text-secondary hover:text-primary hover:bg-surface/60'
                        }`}
                      >
                        <Icon aria-hidden='true' name={item.icon} size={18} />
                        <span className='font-medium'>{item.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className='bg-border/50' />
                  <DropdownMenuItem onSelect={handleLogout} className='flex items-center space-x-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50/50 transition-all duration-200'>
                    <Icon aria-hidden='true' name='LogOut' size={18} />
                    <span className='font-medium'>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Menu */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ease-out ${
        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        {/* Backdrop */}
        <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={() => setIsMenuOpen(false)} />
        
        {/* Menu Panel */}
        <div 
          ref={mobileMenuRef}
          className={`absolute top-16 left-0 right-0 bg-surface/95 backdrop-blur-md border-b border-border/50 shadow-2xl transition-all duration-300 ease-out transform ${
            isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
        >
          <div className='max-w-7xl mx-auto px-4 py-6 stagger-animation'>
            {/* User info for mobile */}
            {user && (
              <div className='flex items-center space-x-4 p-4 bg-surface/60 rounded-xl mb-6 backdrop-blur-sm'>
                <Avatar
                  src={userProfile?.avatar_url ?? undefined}
                  name={userProfile?.full_name || user?.user_metadata?.full_name}
                  className='w-12 h-12 ring-2 ring-primary/20'
                />
                <div>
                  <p className='font-semibold text-text-primary'>{getFirstName()}</p>
                  <p className='text-sm text-text-tertiary'>Niveau {userProfile?.level || 1} • {userProfile?.xp || 0} XP</p>
                </div>
              </div>
            )}

            <nav className='space-y-2'>
              {/* Main Navigation */}
              <div className='space-y-1'>
                {navItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`relative flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-300 overflow-hidden ${
                      location.pathname === item.path 
                        ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary shadow-lg border-l-4 border-primary' 
                        : 'text-text-secondary hover:bg-surface/60 hover:text-primary'
                    }`}
                  >
                    <Icon aria-hidden='true' name={item.icon} size={20} />
                    <span className='font-medium text-lg'>{item.name}</span>
                    {location.pathname === item.path && (
                      <>
                        <div className='ml-auto flex items-center space-x-1'>
                          <div className='w-2 h-2 bg-primary rounded-full animate-pulse' />
                          <div className='w-1 h-1 bg-primary/60 rounded-full animate-pulse' style={{animationDelay: '0.3s'}} />
                        </div>
                        <div className='absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-primary/10 to-transparent' />
                      </>
                    )}
                  </Link>
                ))}
              </div>

              {/* Profile section for mobile */}
              {user && (
                <>
                  <div className='h-px bg-border/30 my-4' />
                  <div className='space-y-1'>
                    <h3 className='px-4 py-2 text-sm font-semibold text-text-tertiary uppercase tracking-wide'>Mon Compte</h3>
                    {profileItems.map(item => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`relative flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden ${
                          location.pathname === item.path.split('?')[0]
                            ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary shadow-sm border-l-2 border-primary'
                            : 'text-text-secondary hover:bg-surface/60 hover:text-primary'
                        }`}
                      >
                        <Icon aria-hidden='true' name={item.icon} size={18} />
                        <span className='font-medium'>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {/* Admin section for mobile */}
              {adminItems.length > 0 && (
                <>
                  <div className='h-px bg-border/30 my-4' />
                  <div className='space-y-1'>
                    <h3 className='px-4 py-2 text-sm font-semibold text-primary uppercase tracking-wide flex items-center space-x-2'>
                      <Icon aria-hidden='true' name='Shield' size={16} />
                      <span>Administration</span>
                    </h3>
                    {adminItems.map(item => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`relative flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden ${
                          location.pathname === item.path 
                            ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary shadow-sm border-l-2 border-primary' 
                            : 'text-text-secondary hover:bg-surface/60 hover:text-primary'
                        }`}
                      >
                        <Icon aria-hidden='true' name={item.icon} size={18} />
                        <span className='font-medium'>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {/* Actions section */}
              <div className='h-px bg-border/30 my-6' />
              <div className='space-y-3'>
                {user ? (
                  <button
                    onClick={handleLogout}
                    className='flex items-center space-x-4 w-full px-4 py-4 text-red-600 hover:bg-red-50/50 transition-all duration-300 rounded-xl'
                  >
                    <Icon aria-hidden='true' name='LogOut' size={18} />
                    <span className='font-medium'>Déconnexion</span>
                  </button>
                ) : (
                  <div className='space-y-3'>
                    <Link
                      to='/login'
                      onClick={() => setIsMenuOpen(false)}
                      className='flex items-center space-x-4 px-4 py-4 text-text-secondary hover:text-primary hover:bg-surface/60 transition-all duration-300 rounded-xl'
                    >
                      <Icon aria-hidden='true' name='LogIn' size={18} />
                      <span className='font-medium text-lg'>Connexion</span>
                    </Link>
                    <Link
                      to='/register'
                      onClick={() => setIsMenuOpen(false)}
                      className='flex items-center space-x-4 bg-gradient-to-r from-primary to-primary-600 text-white px-4 py-4 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 font-medium shadow-lg btn-modern hover-lift'
                    >
                      <Icon aria-hidden='true' name='UserPlus' size={18} />
                      <span className='text-lg'>Rejoindre</span>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Spacer for fixed header */}
      <div className='h-16' />
    </>
  );
};

export default Header;
