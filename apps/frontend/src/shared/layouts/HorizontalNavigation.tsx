/**
 * AI Foundations LMS - Horizontal Navigation
 * Navigation horizontale dans le header avec menus séparés utilisateur/admin
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@features/auth/contexts/AuthContext';
import Icon, { IconName } from '@shared/components/AppIcon';
import { cn } from '@shared/utils/utils';

/* ================================
   TYPES ET INTERFACES
   ================================ */

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  description?: string;
  adminOnly?: boolean;
  guestHidden?: boolean;
}

export interface NavMenu {
  id: string;
  title: string;
  items: NavItem[];
  adminOnly?: boolean;
  guestHidden?: boolean;
}

/* ================================
   CONFIGURATION DE NAVIGATION
   ================================ */

const getStandardNavigation = (): NavMenu[] => [
  {
    id: 'public',
    title: 'Public',
    items: [
      {
        id: 'home',
        label: 'Accueil',
        path: '/',
        icon: 'Home',
        description: 'Page d\'accueil'
      },
      {
        id: 'catalog',
        label: 'Catalogue',
        path: '/catalogue',
        icon: 'BookOpen',
        description: 'Parcourir les formations'
      },
      {
        id: 'about',
        label: 'À propos',
        path: '/a-propos',
        icon: 'Info',
        description: 'En savoir plus sur AI Foundations'
      }
    ]
  },
  {
    id: 'learning',
    title: 'Formation',
    guestHidden: true,
    items: [
      {
        id: 'dashboard',
        label: 'Mon espace',
        path: '/espace',
        icon: 'LayoutDashboard',
        description: 'Vue d\'ensemble de vos formations'
      },
      {
        id: 'my-courses',
        label: 'Mes cours',
        path: '/mes-cours',
        icon: 'GraduationCap',
        description: 'Cours en cours et terminés'
      },
      {
        id: 'progress',
        label: 'Progression',
        path: '/progression',
        icon: 'TrendingUp',
        description: 'Suivre vos progrès'
      }
    ]
  }
];

const getAdminNavigation = (): NavMenu[] => [
  {
    id: 'administration',
    title: 'Administration',
    adminOnly: true,
    items: [
      {
        id: 'admin-dashboard',
        label: 'Tableau de bord',
        path: '/admin-dashboard',
        icon: 'BarChart3',
        description: 'Métriques et analytics',
        adminOnly: true
      },
      {
        id: 'user-management',
        label: 'Utilisateurs',
        path: '/user-management-admin',
        icon: 'Users',
        description: 'Gestion des comptes',
        adminOnly: true
      },
      {
        id: 'content-management',
        label: 'Contenu',
        path: '/cms',
        icon: 'FileText',
        description: 'Cours et ressources',
        adminOnly: true
      },
      {
        id: 'analytics',
        label: 'Analytics',
        path: '/admin/analytics',
        icon: 'PieChart',
        description: 'Rapports détaillés',
        adminOnly: true
      }
    ]
  }
];

/* ================================
   COMPOSANT NAVIGATION ITEM
   ================================ */

interface NavigationItemProps {
  item: NavItem;
  isActive: boolean;
  className?: string;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ item, isActive, className }) => {
  return (
    <Link
      to={item.path}
      className={cn(
        'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
        'hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        isActive 
          ? 'bg-primary text-white'
          : 'text-text-primary hover:text-text-primary',
        className
      )}
      title={item.description}
    >
      <Icon
        name={item.icon as IconName}
        size={16}
        className={cn(
          'transition-colors',
          isActive ? 'text-white' : 'text-text-secondary'
        )}
        aria-hidden="true"
      />
      <span>{item.label}</span>
    </Link>
  );
};

/* ================================
   COMPOSANT NAVIGATION MENU
   ================================ */

interface NavigationMenuProps {
  menu: NavMenu;
  currentPath: string;
  userRole: 'guest' | 'user' | 'admin';
  className?: string;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ 
  menu, 
  currentPath, 
  userRole, 
  className 
}) => {
  // Filtrer les items selon les permissions
  const filteredItems = menu.items.filter(item => {
    if (item.adminOnly && userRole !== 'admin') return false;
    if (item.guestHidden && userRole === 'guest') return false;
    return true;
  });

  if (filteredItems.length === 0) return null;

  return (
    <nav className={cn('flex items-center space-x-1', className)} role="navigation">
      {filteredItems.map((item) => {
        const isActive = currentPath === item.path;
        return (
          <NavigationItem
            key={item.id}
            item={item}
            isActive={isActive}
          />
        );
      })}
    </nav>
  );
};

/* ================================
   COMPOSANT PRINCIPAL
   ================================ */

export interface HorizontalNavigationProps {
  className?: string;
}

export const HorizontalNavigation: React.FC<HorizontalNavigationProps> = ({ className }) => {
  const { userProfile } = useAuth();
  const location = useLocation();
  
  // Déterminer le rôle utilisateur
  const userRole: 'guest' | 'user' | 'admin' = 
    !userProfile ? 'guest' : 
    userProfile.is_admin ? 'admin' : 'user';

  // Obtenir les configurations de navigation
  const standardMenus = getStandardNavigation();
  const adminMenus = getAdminNavigation();

  // Filtrer les menus selon les permissions
  const visibleStandardMenus = standardMenus.filter(menu => {
    if (menu.adminOnly && userRole !== 'admin') return false;
    if (menu.guestHidden && userRole === 'guest') return false;
    return true;
  });

  const visibleAdminMenus = userRole === 'admin' ? adminMenus : [];

  return (
    <div className={cn('flex items-center space-x-8', className)}>
      {/* Navigation Standard */}
      {visibleStandardMenus.map((menu) => (
        <NavigationMenu
          key={menu.id}
          menu={menu}
          currentPath={location.pathname}
          userRole={userRole}
        />
      ))}
      
      {/* Séparateur si admin et utilisateur connecté */}
      {visibleAdminMenus.length > 0 && visibleStandardMenus.length > 0 && (
        <div className="h-6 w-px bg-border" aria-hidden="true" />
      )}
      
      {/* Navigation Admin */}
      {visibleAdminMenus.map((menu) => (
        <NavigationMenu
          key={menu.id}
          menu={menu}
          currentPath={location.pathname}
          userRole={userRole}
          className="border-l border-border pl-8"
        />
      ))}
    </div>
  );
};

export default HorizontalNavigation;