/**
 * AI Foundations LMS - Compact Admin Layout
 * Layout admin compact et responsive
 */

import React, { ReactNode, useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@features/auth/contexts/AuthContext';
import Icon, { type IconName } from '@shared/components/AppIcon';
import PerfectHeader from '@shared/layouts/PerfectHeader';
import { cn } from '@shared/utils/utils';

/* ================================
   TYPES ET INTERFACES
   ================================ */

interface AdminNavItem {
  id: string;
  name: string;
  path: string;
  icon: IconName;
  shortName?: string;
}

export interface CompactAdminLayoutProps {
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
    shortName: 'Dashboard',
    path: '/admin',
    icon: 'BarChart3'
  },
  {
    id: 'users',
    name: 'Utilisateurs',
    shortName: 'Users',
    path: '/admin/users',
    icon: 'Users'
  },
  {
    id: 'content',
    name: 'Contenu',
    shortName: 'Content',
    path: '/admin/content',
    icon: 'FileText'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    shortName: 'Stats',
    path: '/admin/analytics',
    icon: 'PieChart'
  }
];

/* ================================
   COMPOSANT SOUS-MENU ADMIN COMPACT
   ================================ */

interface CompactAdminMenuProps {
  className?: string;
}

const CompactAdminMenu: React.FC<CompactAdminMenuProps> = ({ className }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={cn('bg-orange-50 border-b border-orange-200', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header compact */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center">
              <Icon name="Shield" size={14} color="white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-orange-900">Admin</h1>
            </div>
          </div>
          
          {/* Menu mobile toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-orange-700 hover:bg-orange-100 transition-colors"
          >
            <Icon name={isMenuOpen ? 'X' : 'Menu'} size={18} />
          </button>
        </div>

        {/* Navigation desktop */}
        <nav className="hidden md:flex space-x-1 pb-3" role="navigation">
          {adminNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
                  isActive
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-orange-700 hover:text-orange-900 hover:bg-orange-100'
                )}
              >
                <Icon 
                  name={item.icon} 
                  size={16}
                  className="transition-colors duration-200"
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Navigation mobile */}
        {isMenuOpen && (
          <div className="md:hidden pb-3 space-y-1">
            {adminNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
                    isActive
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-orange-700 hover:text-orange-900 hover:bg-orange-100'
                  )}
                >
                  <Icon name={item.icon} size={18} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/* ================================
   LAYOUT PRINCIPAL ADMIN COMPACT
   ================================ */

const CompactAdminLayout: React.FC<CompactAdminLayoutProps> = ({ children, className }) => {
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
      
      {/* Sous-menu admin compact */}
      <CompactAdminMenu />
      
      {/* Contenu principal */}
      <main className="flex-1 min-h-[calc(100vh-8rem)]">
        {children}
      </main>
    </div>
  );
};

export default CompactAdminLayout;