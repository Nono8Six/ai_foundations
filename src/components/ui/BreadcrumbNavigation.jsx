import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BreadcrumbNavigation = ({ customBreadcrumbs = null }) => {
  const location = useLocation();

  // Default breadcrumb mapping based on routes
  const routeBreadcrumbs = {
    '/public-homepage': [
      { label: 'Accueil', path: '/public-homepage' }
    ],
    '/program-overview': [
      { label: 'Accueil', path: '/public-homepage' },
      { label: 'Programmes', path: '/program-overview' }
    ],
    '/authentication-login-register': [
      { label: 'Accueil', path: '/public-homepage' },
      { label: 'Connexion', path: '/authentication-login-register' }
    ],
    '/user-dashboard': [
      { label: 'Tableau de bord', path: '/user-dashboard' }
    ],
    '/lesson-viewer': [
      { label: 'Tableau de bord', path: '/user-dashboard' },
      { label: 'Mes cours', path: '/lesson-viewer' }
    ],
    '/user-profile-management': [
      { label: 'Tableau de bord', path: '/user-dashboard' },
      { label: 'Mon profil', path: '/user-profile-management' }
    ],
    '/admin-dashboard': [
      { label: 'Administration', path: '/admin-dashboard' }
    ],
    '/content-management-courses-modules-lessons': [
      { label: 'Administration', path: '/admin-dashboard' },
      { label: 'Gestion du contenu', path: '/content-management-courses-modules-lessons' }
    ],
    '/user-management-admin': [
      { label: 'Administration', path: '/admin-dashboard' },
      { label: 'Gestion des utilisateurs', path: '/user-management-admin' }
    ]
  };

  // Use custom breadcrumbs if provided, otherwise use route-based breadcrumbs
  const breadcrumbs = customBreadcrumbs || routeBreadcrumbs[location.pathname] || [];

  // Don't render if no breadcrumbs or only one item
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isFirst = index === 0;

          return (
            <li key={crumb.path} className="flex items-center">
              {!isFirst && (
                <Icon 
                  name="ChevronRight" 
                  size={16} 
                  className="text-text-secondary mx-2 flex-shrink-0" 
                />
              )}
              
              {isLast ? (
                <span className="text-text-primary font-medium truncate max-w-xs">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-text-secondary hover:text-primary transition-colors duration-200 truncate max-w-xs"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadcrumbNavigation;