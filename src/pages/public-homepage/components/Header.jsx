import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, userProfile } = useAuth();

  const navigationItems = [
    { name: 'Accueil', path: '/public-homepage', icon: 'Home' },
    { name: 'Programmes', path: '/program-overview', icon: 'BookOpen' },
  ];

  const guestActions = [
    {
      name: 'Connexion',
      path: '/login',
    },
    {
      name: 'Rejoindre',
      path: '/register',
      primary: true,
    },
  ];

  if (user) {
    navigationItems.push(
      { name: 'Tableau de bord', path: '/user-dashboard', icon: 'LayoutDashboard' },
      { name: 'Profil', path: '/user-profile-management', icon: 'User' }
    );

    if (userProfile?.is_admin) {
      navigationItems.push({ name: 'Admin', path: '/admin-dashboard', icon: 'Settings' });
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/public-homepage" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-700 rounded-full flex items-center justify-center">
              <Icon name="Brain" size={24} color="white" />
            </div>
            <span className="text-xl font-bold text-text-primary hidden sm:block">
              AI Foundations
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.slice(0, 2).map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors duration-200"
              >
                <Icon name={item.icon} size={18} />
                <span>{item.name}</span>
              </Link>
            ))}
            {!user && (
              <>
                {guestActions.map((action) => (
                  <Link
                    key={action.name}
                    to={action.path}
                    className={
                      action.primary
                        ? 'bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium'
                        : 'text-text-secondary hover:text-primary transition-colors duration-200'
                    }
                  >
                    {action.name}
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsProfileOpen(false);
            }}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary-50 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <Icon name={isMenuOpen ? "X" : "Menu"} size={24} />
          </button>

          {/* Profile Dropdown */}
          {user && (
            <div className="hidden lg:block relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsMenuOpen(false);
                }}
                className="w-12 h-12 bg-gradient-to-br from-primary to-primary-700 rounded-full flex items-center justify-center hover:shadow-medium transition-all duration-200"
              >
                <Icon name="User" size={20} color="white" />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-surface rounded-lg shadow-medium border border-border py-2"
                  >
                    {navigationItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-text-secondary hover:bg-secondary-50 hover:text-primary transition-colors duration-200"
                      >
                        <Icon name={item.icon} size={18} />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-border mt-4 pt-4 pb-4"
            >
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-text-secondary hover:bg-secondary-50 hover:text-primary transition-colors duration-200 rounded-lg"
                  >
                    <Icon name={item.icon} size={18} />
                    <span>{item.name}</span>
                  </Link>
                ))}
                {!user && (
                  <div className="space-y-3 mt-4">
                    {guestActions.map((action) => (
                      <Link
                        key={action.name}
                        to={action.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={
                          action.primary
                            ? 'flex items-center justify-center space-x-2 bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium'
                            : 'flex items-center justify-center space-x-2 text-text-secondary hover:text-primary transition-colors duration-200'
                        }
                      >
                        <Icon name={action.primary ? 'UserPlus' : 'LogIn'} size={18} />
                        <span>{action.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;