/**
 * AI Foundations LMS - Minimal Top Header
 * Simplified header focusing on search, notifications, and user menu
 */

import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/contexts/AuthContext';
import { useScreenReaderAnnouncer } from '@shared/hooks/useAccessibility';
import HorizontalNavigation from './HorizontalNavigation';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@shared/ui/dropdown-menu';
import { Skeleton } from '@shared/ui/SkeletonComponents';
import { HeaderThemeToggle } from '@shared/ui';
import Icon from '@shared/components/AppIcon';
// Image is imported but not used - keeping for future use
// import Image from '@shared/components/AppImage';
import { cn } from '@shared/utils/utils';

/* ================================
   GLOBAL SEARCH COMPONENT
   ================================ */

interface GlobalSearchProps {
  className?: string;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ className }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { announce } = useScreenReaderAnnouncer();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // TODO: Implement actual search functionality
    announce(`Recherche lancée pour: ${searchQuery}`, 'polite');
    // Search functionality will be implemented later
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchQuery('');
      searchInputRef.current?.blur();
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className={cn('relative', className)}>
      <div className="relative">
        <Icon
          name="Search"
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary transition-colors"
          aria-hidden="true"
        />
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Rechercher..."
          className={cn(
            'w-full pl-10 pr-4 py-2 text-sm',
            'bg-surface-elevated border border-border rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'placeholder:text-text-tertiary transition-all duration-200',
            'hover:border-border-hover',
            isSearchFocused && 'bg-surface ring-2 ring-primary/20 border-primary'
          )}
          aria-label="Recherche globale"
        />
        
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              searchInputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
            aria-label="Effacer la recherche"
          >
            <Icon name="X" size={16} />
          </button>
        )}
      </div>
    </form>
  );
};

/* ================================
   NOTIFICATION CENTER COMPONENT
   ================================ */

interface NotificationCenterProps {
  className?: string;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ className }) => {
  // These will be used when implementing notification functionality
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasUnread, _setHasUnread] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [notificationCount, _setNotificationCount] = useState(3);

  // Mock notifications - replace with real data
  const notifications = [
    {
      id: 'notif-1',
      label: 'Nouveau cours disponible',
      description: 'Introduction à React avancé',
      icon: 'BookOpen',
      onClick: () => {
        // Will be implemented when course navigation is ready
      },
    },
    {
      id: 'notif-2',
      label: 'Certificat prêt',
      description: 'Votre certificat JavaScript est disponible',
      icon: 'Award',
      onClick: () => {
        // Will be implemented when certificates page is ready
      },
    },
    {
      id: 'notif-3',
      label: 'Maintenance programmée',
      description: 'Le 25 décembre de 2h à 4h',
      icon: 'AlertTriangle',
      onClick: () => {
        // Will be implemented when maintenance page is ready
      },
    },
    {
      id: 'view-all',
      label: 'Voir toutes les notifications',
      icon: 'Bell',
      onClick: () => {
        // Will be implemented when notifications page is ready
      },
    }
  ];

  const trigger = (
    <button
      className={cn(
        'relative p-2 rounded-lg transition-colors touch-target',
        'hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        'text-text-secondary hover:text-text-primary',
        className
      )}
      aria-label={`Notifications${hasUnread ? ` (${notificationCount} non lues)` : ''}`}
    >
      <Icon name="Bell" size={20} aria-hidden="true" />
      
      {hasUnread && (
        <>
          {/* Notification dot */}
          <div 
            className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full animate-pulse"
            aria-hidden="true"
          />
          
          {/* Notification count */}
          {notificationCount > 0 && (
            <div 
              className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-error text-white text-xs font-medium rounded-full flex items-center justify-center px-1"
              aria-hidden="true"
            >
              {notificationCount > 9 ? '9+' : notificationCount}
            </div>
          )}
        </>
      )}
    </button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-2" align="end" sideOffset={8}>
        <div className="px-3 py-2">
          <p className="font-medium text-text-primary">Notifications</p>
          {notificationCount > 0 && (
            <p className="text-xs text-text-secondary">
              {notificationCount} nouvelle{notificationCount > 1 ? 's' : ''} notification{notificationCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-3 py-4 text-center text-text-secondary text-sm">
              Aucune notification
            </div>
          ) : (
            notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <DropdownMenuItem
                  onSelect={notification.onClick}
                  className="flex items-start space-x-3 p-3 hover:bg-secondary-50 rounded-md cursor-pointer"
                >
                  {notification.icon && (
                    <div className="flex-shrink-0 mt-0.5">
                      <Icon name={notification.icon} size={16} className="text-text-tertiary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {notification.label}
                    </p>
                    {notification.description && (
                      <p className="text-xs text-text-secondary mt-0.5">
                        {notification.description}
                      </p>
                    )}
                  </div>
                </DropdownMenuItem>
              </React.Fragment>
            ))
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="border-t border-border pt-2 px-2">
            <button 
              className="w-full text-xs text-primary hover:underline text-center py-1.5"
              onClick={() => {}}
            >
              Voir toutes les notifications
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/* ================================
   USER MENU COMPONENT
   ================================ */

interface UserMenuProps {
  className?: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ className }) => {
  const navigate = useNavigate();
  const { user, userProfile, loading, logout } = useAuth();
  const { announce } = useScreenReaderAnnouncer();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      announce('Déconnexion réussie', 'polite');
    } catch (error) {
      announce('Erreur lors de la déconnexion', 'assertive');
      console.error('Logout error:', error);
    }
  }, [logout, announce]);

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton variant="circular" className="w-8 h-8" />
        <Skeleton variant="text" className="w-20 h-4 hidden sm:block" />
      </div>
    );
  }

  if (!user || !userProfile) {
    return (
      <div className="flex items-center space-x-3">
        <Link
          to="/auth/login"
          className={cn(
            'px-4 py-2 text-sm font-medium text-text-primary',
            'hover:text-primary transition-colors touch-target'
          )}
        >
          Connexion
        </Link>
        <Link
          to="/auth/register"
          className={cn(
            'px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg',
            'hover:bg-primary-600 transition-colors touch-target'
          )}
        >
          S&apos;inscrire
        </Link>
      </div>
    );
  }

  type UserMenuItem = {
    id: string;
    label: string;
    icon?: string;
    description?: string;
    separator?: boolean;
    danger?: boolean;
    disabled?: boolean;
    onClick?: () => void;
  };

  const userMenuItems: UserMenuItem[] = [
    {
      id: 'profile-header',
      label: userProfile.full_name || userProfile.email?.split('@')[0] || 'Utilisateur',
      description: userProfile.email || 'Aucun email',
      icon: 'User',
      disabled: true,
    },
    {
      id: 'separator-1',
      label: '',
      separator: true,
    },
    {
      id: 'my-profile',
      label: 'Mon profil',
      icon: 'User',
      onClick: () => navigate('/user-profile-management'),
    },
    {
      id: 'my-courses',
      label: 'Mes cours',
      icon: 'BookOpen',
      onClick: () => navigate('/my-courses'),
    },
    {
      id: 'certificates',
      label: 'Certificats',
      icon: 'Award',
      onClick: () => navigate('/certificates'),
    },
    {
      id: 'separator-2',
      label: '',
      separator: true,
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: 'Settings',
      onClick: () => navigate('/settings'),
    },
    {
      id: 'help',
      label: 'Aide',
      icon: 'HelpCircle',
      onClick: () => navigate('/help'),
    },
    {
      id: 'separator-3',
      label: '',
      separator: true,
    },
    {
      id: 'logout',
      label: 'Déconnexion',
      icon: 'LogOut',
      onClick: handleLogout,
      danger: true,
    }
  ];

  const getInitials = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return userProfile?.email?.[0]?.toUpperCase() || 'U';
  };

  const trigger = (
    <div
      className={cn(
        'flex items-center space-x-2 p-1 rounded-lg transition-colors touch-target',
        'hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        'cursor-pointer select-none',
        className
      )}
      role="button"
      tabIndex={0}
      aria-label="Menu utilisateur"
    >
      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
        <span className="text-white text-sm font-medium">
          {getInitials()}
        </span>
      </div>
      
      <div className="hidden sm:block text-left min-w-0">
        <p className="text-sm font-medium text-text-primary truncate max-w-[8rem]">
          {userProfile.full_name || userProfile.email?.split('@')[0] || 'Utilisateur'}
        </p>
        <p className="text-xs text-text-secondary">
          {userProfile.is_admin ? 'Admin' : 'Utilisateur'}
        </p>
      </div>
      
      <Icon 
        name="ChevronDown" 
        size={14} 
        className="text-text-tertiary hidden sm:block"
        aria-hidden="true"
      />
    </div>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
        <div className="px-4 py-2 border-b border-border mb-2">
          <p className="font-medium text-text-primary">
            {userProfile.full_name || userProfile.email?.split('@')[0] || 'Utilisateur'}
          </p>
          <p className="text-xs text-text-secondary">
            {userProfile.is_admin ? 'Administrateur' : 'Utilisateur'}
          </p>
        </div>
        
        {userMenuItems.map((item) => {
          if (item.separator) {
            return <DropdownMenuSeparator key={item.id} />;
          }
          
          return (
            <DropdownMenuItem
              key={item.id}
              onSelect={item.onClick ? (e: Event) => {
                e.preventDefault();
                item.onClick?.();
              } : (e: Event) => {
                e.preventDefault();
                // Ne rien faire d'autre si pas de gestionnaire
              }}
              className={`flex items-center space-x-3 w-full ${
                item.danger ? 'text-destructive hover:bg-destructive/10' : 'text-text-secondary hover:bg-secondary-50'
              }`}
            >
              {item.icon && <Icon aria-hidden="true" name={item.icon} size={16} />}
              <span>{item.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/* ================================
   MAIN TOP HEADER COMPONENT
   ================================ */

export interface TopHeaderProps {
  className?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ className }) => {

  return (
    <header 
      className={cn(
        'h-16 bg-surface border-b border-border flex items-center px-4',
        'sticky top-0 z-50',
        className
      )}
      role="banner"
    >
      {/* Left Section - Logo */}
      <div className="flex items-center space-x-6">
        <Link 
          to="/" 
          className="flex items-center space-x-2"
          aria-label="AI Foundations - Accueil"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">AI</span>
          </div>
          <span className="text-lg font-semibold text-text-primary hidden sm:block">AI Foundations</span>
        </Link>
      </div>

      {/* Center Section - Navigation */}
      <div className="hidden lg:flex flex-1 justify-center max-w-4xl mx-6">
        <HorizontalNavigation />
      </div>

      {/* Mobile Navigation Button */}
      <div className="lg:hidden flex-1 flex justify-center">
        <button
          className={cn(
            'flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors touch-target',
            'hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            'text-text-secondary hover:text-text-primary'
          )}
          aria-label="Menu de navigation"
        >
          <Icon name="Menu" size={18} aria-hidden="true" />
          <span className="text-sm font-medium">Menu</span>
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {/* Global Search - Desktop */}
        <GlobalSearch className="hidden xl:block w-64" />

        {/* Search Button - Mobile and Tablet */}
        <button
          className={cn(
            'xl:hidden p-2 rounded-lg transition-colors touch-target',
            'hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            'text-text-secondary hover:text-text-primary'
          )}
          aria-label="Rechercher"
        >
          <Icon name="Search" size={20} aria-hidden="true" />
        </button>

        {/* Theme Toggle */}
        <HeaderThemeToggle />

        {/* Notifications */}
        <NotificationCenter />

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
};

export default TopHeader;