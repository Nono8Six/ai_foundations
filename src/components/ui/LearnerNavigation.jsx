// src/components/ui/LearnerNavigation.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import { useAuth } from '../../context/AuthContext';

const LearnerNavigation = () => {
  const location = useLocation();
  const { user, userProfile, signOut } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Tableau de bord', path: '/user-dashboard', icon: 'LayoutDashboard' },
    { label: 'Programme', path: '/program-overview', icon: 'BookOpen' },
    { label: 'Profil', path: '/user-profile-management', icon: 'User' }
  ];

  // Add admin link if user is admin
  if (userProfile?.is_admin) {
    navItems.push({ label: 'Administration', path: '/admin-dashboard', icon: 'Settings' });
  }

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await signOut();
      // Navigation will be handled by auth state change
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-700 rounded-full flex items-center justify-center">
                <Icon name="GraduationCap" size={20} color="white" />
              </div>
              <span className="ml-2 text-lg font-semibold text-text-primary">
                AI Foundations
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${isActive(item.path) ? 'text-primary bg-primary-50' : 'text-text-secondary hover:text-primary hover:bg-primary-50'}`}
              >
                <Icon name={item.icon} size={18} className="mr-1.5" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Profile Dropdown */}
          <div className="ml-3 relative flex items-center">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <div className="relative">
                {userProfile?.avatar_url ? (
                  <img
                    className="h-9 w-9 rounded-full object-cover border border-border"
                    src={userProfile.avatar_url}
                    alt="User avatar"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium border border-primary-200">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 border border-white"></span>
              </div>
              <div className="ml-2 hidden md:block text-left">
                <div className="text-sm font-medium text-text-primary">
                  {userProfile?.full_name || user?.email?.split('@')[0] || 'Utilisateur'}
                </div>
                <div className="text-xs text-text-secondary">
                  {userProfile?.is_admin ? 'Administrateur' : 'Apprenant'}
                </div>
              </div>
              <Icon name="ChevronDown" size={16} className="ml-1 text-text-secondary" />
            </button>

            {/* Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="origin-top-right absolute right-0 mt-2 top-full w-48 rounded-md shadow-lg py-1 bg-surface border border-border ring-1 ring-black ring-opacity-5">
                <Link
                  to="/user-profile-management"
                  className="block px-4 py-2 text-sm text-text-primary hover:bg-primary-50 hover:text-primary flex items-center"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Icon name="User" size={16} className="mr-2" />
                  Profil
                </Link>
                <Link
                  to="/user-dashboard"
                  className="block px-4 py-2 text-sm text-text-primary hover:bg-primary-50 hover:text-primary flex items-center"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Icon name="LayoutDashboard" size={16} className="mr-2" />
                  Tableau de bord
                </Link>
                {userProfile?.is_admin && (
                  <Link
                    to="/admin-dashboard"
                    className="block px-4 py-2 text-sm text-text-primary hover:bg-primary-50 hover:text-primary flex items-center"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <Icon name="Settings" size={16} className="mr-2" />
                    Administration
                  </Link>
                )}
                <hr className="my-1 border-border" />
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-error-50 flex items-center"
                >
                  <Icon name="LogOut" size={16} className="mr-2" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-primary hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
              <Icon name="Menu" size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      <div className="sm:hidden hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive(item.path) ? 'border-primary text-primary bg-primary-50' : 'border-transparent text-text-secondary hover:bg-primary-50 hover:border-primary-300 hover:text-primary'}`}
            >
              <div className="flex items-center">
                <Icon name={item.icon} size={18} className="mr-2" />
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default LearnerNavigation;
