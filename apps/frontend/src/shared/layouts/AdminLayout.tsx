import React, { useState, createContext, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon, { IconName } from '@shared/components/AppIcon';
import Image from '@shared/components/AppImage';

interface SidebarContextValue {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);
export const useAdminSidebar = (): SidebarContextValue => {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error('useAdminSidebar must be used within an AdminLayout');
  }
  return ctx;
};

interface NavItem {
  name: string;
  path: string;
  icon: IconName;
}

const navigationItems: NavItem[] = [
  { name: 'Tableau de bord', path: '/admin-dashboard', icon: 'LayoutDashboard' },
  { name: 'Gestion utilisateurs', path: '/user-management-admin', icon: 'Users' },
  { name: 'Gestion contenu', path: '/cms', icon: 'BookOpen' },
  { name: "Vue d'ensemble", path: '/programmes', icon: 'GraduationCap' },
  { name: 'Profil utilisateur', path: '/profile', icon: 'User' },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <SidebarContext.Provider value={{ setSidebarOpen }}>
      <div className='min-h-screen bg-background pt-16'>
        {sidebarOpen && (
          <div
            className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`fixed top-16 left-0 z-50 w-64 bg-surface shadow-medium transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:static lg:translate-x-0 lg:inset-0 flex flex-col h-[calc(100vh-4rem)]`}
        >
          <div className='flex items-center justify-between h-16 px-6 border-b border-border'>
            <div className='flex items-center space-x-3'>
              <div className='w-8 h-8 bg-gradient-to-br from-primary to-primary-700 rounded-full flex items-center justify-center'>
                <Icon aria-hidden='true' name='GraduationCap' size={20} color='white' />
              </div>
              <span className='text-lg font-semibold text-text-primary'>AI Foundations</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className='lg:hidden p-1 rounded-md hover:bg-secondary-100 transition-colors'
            >
              <Icon name='X' size={20} aria-label='Fermer le menu' />
            </button>
          </div>

          <nav className='mt-6 px-3'>
            <div className='space-y-1'>
              {navigationItems.map(item => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:bg-secondary-100 hover:text-text-primary'
                  }`}
                >
                  <Icon aria-hidden='true' name={item.icon} size={18} className='mr-3' />
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          <div className='absolute bottom-6 left-3 right-3'>
            <div className='bg-secondary-50 rounded-lg p-4'>
              <div className='flex items-center space-x-3 mb-2'>
                <Image
                  src='https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=ffffff'
                  alt='Admin Avatar'
                  className='w-8 h-8 rounded-full object-cover'
                />
                <div>
                  <p className='text-sm font-medium text-text-primary'>Admin User</p>
                  <p className='text-xs text-text-secondary'>Administrateur</p>
                </div>
              </div>
              <Link
                to='/profile'
                className='text-xs text-primary hover:text-primary-700 transition-colors'
              >
                Voir le profil
              </Link>
            </div>
          </div>
        </div>

        <div className='lg:pl-64'>{children}</div>
      </div>
    </SidebarContext.Provider>
  );
};

export default AdminLayout;
