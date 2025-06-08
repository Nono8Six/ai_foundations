import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const PublicHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { label: 'Accueil', path: '/public-homepage', icon: 'Home' },
    { label: 'Programmes', path: '/program-overview', icon: 'BookOpen' },
  ];

  const isActivePath = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-header bg-surface border-b border-border shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/public-homepage" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-700 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <Icon name="GraduationCap" size={24} color="white" />
              </div>
              <span className="text-xl font-semibold text-text-primary group-hover:text-primary transition-colors duration-200">
                EduTech
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActivePath(item.path)
                    ? 'text-primary bg-primary-50 border border-primary-100' :'text-text-secondary hover:text-primary hover:bg-secondary-50'
                }`}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/authentication-login-register"
              className="text-sm font-medium text-text-secondary hover:text-primary transition-colors duration-200"
            >
              Connexion
            </Link>
            <Link
              to="/authentication-login-register"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-subtle hover:shadow-medium"
            >
              Commencer
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-all duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActivePath(item.path)
                    ? 'text-primary bg-primary-50 border border-primary-100' :'text-text-secondary hover:text-primary hover:bg-secondary-50'
                }`}
              >
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-border">
            <div className="flex items-center px-5 space-y-3 flex-col">
              <Link
                to="/authentication-login-register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors duration-200"
              >
                Connexion
              </Link>
              <Link
                to="/authentication-login-register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-subtle"
              >
                Commencer
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;