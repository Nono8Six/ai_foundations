/**
 * AI Foundations LMS - Admin Layout
 * Layout dédié pour l'espace admin avec sous-menu élégant
 */

import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@frontend/context/AuthContext';
import { Navigate } from 'react-router-dom';
import Icon, { type IconName } from '@frontend/components/AppIcon';
import PerfectHeader from '@frontend/components/layout/PerfectHeader';
import { cn } from '@frontend/lib/utils';

/* ================================
   TYPES ET INTERFACES
   ================================ */

interface AdminNavItem {
  id: string;
  name: string;
  path: string;
  icon: IconName;
  description?: string;
}

export interface AdminLayoutProps {
  children: ReactNode;
  className?: string;
}

/* ================================
   CONFIGURATION NAVIGATION ADMIN
   ================================ */

const adminNavItems: AdminNavItem[] = [
  {
    id: 'dashboard',
    name: 'Tableau de bord',
    path: '/admin',
    icon: 'BarChart3',
    description: 'Vue d\'ensemble et métriques'
  },
  {
    id: 'users',
    name: 'Utilisateurs',
    path: '/admin/users',
    icon: 'Users',
    description: 'Gestion des comptes utilisateurs'
  },
  {
    id: 'content',
    name: 'Contenu',
    path: '/admin/content',
    icon: 'FileText',
    description: 'Gestion des cours et ressources'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    path: '/admin/analytics',
    icon: 'PieChart',
    description: 'Rapports et analyses détaillées'
  },
  {
    id: 'settings',
    name: 'Paramètres',
    path: '/admin/settings',
    icon: 'Settings',
    description: 'Configuration du système'
  }
];

/* ================================
   COMPOSANT SOUS-MENU ADMIN
   ================================ */

interface AdminSubMenuProps {
  className?: string;
}

const AdminSubMenu: React.FC<AdminSubMenuProps> = ({ className }) => {
  const location = useLocation();

  return (
    <div className={cn('bg-surface-elevated border-b border-border shadow-sm', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
              <Icon name="Shield" size={18} color="white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">Administration</h1>
              <p className="text-sm text-text-secondary">Gestion avancée du système</p>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <button className={cn(
              'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium',
              'text-text-secondary hover:text-text-primary hover:bg-surface-hover',
              'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
            )}>
              <Icon name="RefreshCw" size={16} />
              <span>Actualiser</span>
            </button>
            <button className={cn(
              'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium',
              'text-text-secondary hover:text-text-primary hover:bg-surface-hover',
              'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
            )}>
              <Icon name="Download" size={16} />
              <span>Exporter</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 pb-4" role="tablist">
          {adminNavItems.map((item) => {
            const isActive = location.pathname === item.path || 
                           (item.path === '/admin' && location.pathname === '/admin');
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  'group relative flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium',
                  'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                )}
                title={item.description}
                role="tab"
                aria-selected={isActive}
              >
                <Icon 
                  name={item.icon} 
                  size={18}
                  className={cn(
                    'transition-colors duration-200',
                    isActive ? 'text-white' : 'text-current group-hover:text-primary'
                  )}
                />
                <span>{item.name}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

/* ================================
   LAYOUT PRINCIPAL ADMIN
   ================================ */

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, className }) => {
  const { userProfile, loading } = useAuth();

  // Protection admin
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-text-secondary">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  if (!userProfile?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Header principal */}
      <PerfectHeader />
      
      {/* Sous-menu admin */}
      <AdminSubMenu />
      
      {/* Contenu principal */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Footer admin optionnel */}
      <footer className="bg-surface-elevated border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-text-secondary">
              <span>© 2024 AI Foundations Admin</span>
              <span>•</span>
              <span>Version 1.0.0</span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <Link 
                to="/admin/help" 
                className="text-text-secondary hover:text-primary transition-colors duration-200"
              >
                <Icon name="HelpCircle" size={16} className="inline mr-1" />
                Aide
              </Link>
              <Link 
                to="/admin/logs" 
                className="text-text-secondary hover:text-primary transition-colors duration-200"
              >
                <Icon name="FileText" size={16} className="inline mr-1" />
                Logs
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;