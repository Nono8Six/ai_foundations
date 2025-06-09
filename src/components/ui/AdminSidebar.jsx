import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navigationSections = [
    {
      title: 'Tableau de bord',
      items: [
        { label: 'Vue d\'ensemble', path: '/admin-dashboard', icon: 'LayoutDashboard' },
        { label: 'Analytiques', path: '/admin-dashboard', icon: 'BarChart3' },
      ]
    },
    {
      title: 'Gestion du contenu',
      items: [
        { label: 'Cours et modules', path: '/content-management-courses-modules-lessons', icon: 'BookOpen' },
        { label: 'Leçons', path: '/content-management-courses-modules-lessons', icon: 'FileText' },
        { label: 'Ressources', path: '/content-management-courses-modules-lessons', icon: 'FolderOpen' },
      ]
    },
    {
      title: 'Gestion des utilisateurs',
      items: [
        { label: 'Utilisateurs', path: '/user-management-admin', icon: 'Users' },
        { label: 'Rôles et permissions', path: '/user-management-admin', icon: 'Shield' },
        { label: 'Groupes', path: '/user-management-admin', icon: 'UserCheck' },
      ]
    },
    {
      title: 'Paramètres',
      items: [
        { label: 'Configuration', path: '/admin-dashboard', icon: 'Settings' },
        { label: 'Intégrations', path: '/admin-dashboard', icon: 'Plug' },
        { label: 'Sécurité', path: '/admin-dashboard', icon: 'Lock' },
      ]
    }
  ];

  const isActivePath = (path) => location.pathname === path;

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-overlay lg:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-modal lg:hidden p-2 rounded-lg bg-surface border border-border shadow-medium text-text-secondary hover:text-primary transition-all duration-200"
      >
        <Icon name="Menu" size={20} />
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-surface border-r border-border z-sidebar transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <Link to="/admin-dashboard" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-700 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <Icon name="GraduationCap" size={20} color="white" />
              </div>
              <span className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors duration-200">
                Admin
              </span>
            </Link>
          )}
          
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-secondary-50 transition-all duration-200"
          >
            <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {navigationSections.map((section) => (
            <div key={section.title}>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={`
                        flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                        ${isActivePath(item.path)
                          ? 'text-primary bg-primary-50 border border-primary-100' :'text-text-secondary hover:text-primary hover:bg-secondary-50'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                      title={isCollapsed ? item.label : ''}
                    >
                      <Icon 
                        name={item.icon} 
                        size={18} 
                        className={`flex-shrink-0 ${isActivePath(item.path) ? 'text-primary' : 'text-text-secondary group-hover:text-primary'}`}
                      />
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border">
          <div className={`flex items-center space-x-3 p-3 rounded-lg bg-secondary-50 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-700 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-white">AD</span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">Admin User</p>
                <p className="text-xs text-text-secondary truncate">admin@edutech.com</p>
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <div className="mt-3 space-y-1">
              <Link
                to="/user-profile-management"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-primary hover:bg-secondary-50 transition-all duration-200"
              >
                <Icon name="Settings" size={16} />
                <span>Paramètres</span>
              </Link>
              <Link
                to="/login"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-primary hover:bg-secondary-50 transition-all duration-200"
              >
                <Icon name="LogOut" size={16} />
                <span>Déconnexion</span>
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Spacer */}
      <div className={`hidden lg:block transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`} />
    </>
  );
};

export default AdminSidebar;