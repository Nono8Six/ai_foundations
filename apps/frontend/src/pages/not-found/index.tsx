import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '@frontend/components/AppIcon';

interface NotFoundProps {}

const NotFound: React.FC<NotFoundProps> = () => {
  return (
    <div className='min-h-screen bg-background flex items-center justify-center px-4'>
      <div className='max-w-md w-full text-center'>
        {/* Logo */}
        <div className='flex justify-center mb-8'>
          <div className='w-16 h-16 bg-gradient-to-br from-primary to-primary-700 rounded-full flex items-center justify-center'>
            <Icon aria-hidden='true' name='GraduationCap' size={32} color='white' />
          </div>
        </div>

        {/* 404 Content */}
        <div className='mb-8'>
          <h1 className='text-6xl font-bold text-primary mb-4'>404</h1>
          <h2 className='text-2xl font-semibold text-text-primary mb-4'>Page non trouvée</h2>
          <p className='text-text-secondary mb-8'>
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        {/* Action Buttons */}
        <div className='space-y-4'>
          <Link
            to='/'
            className='inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-subtle hover:shadow-medium'
          >
            <Icon aria-hidden='true' name='Home' size={20} className='mr-2' />
            Retour à l'accueil
          </Link>

          <button
            onClick={() => window.history.back()}
            className='inline-flex items-center justify-center w-full px-6 py-3 border border-border text-base font-medium rounded-lg text-text-secondary bg-surface hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200'
          >
            <Icon aria-hidden='true' name='ArrowLeft' size={20} className='mr-2' />
            Page précédente
          </button>
        </div>

        {/* Help Links */}
        <div className='mt-8 pt-8 border-t border-border'>
          <p className='text-sm text-text-secondary mb-4'>
            Besoin d'aide ? Consultez nos ressources :
          </p>
          <div className='flex justify-center space-x-6'>
            <Link
              to='/programmes'
              className='text-sm text-primary hover:text-primary-700 transition-colors duration-200'
            >
              Programmes
            </Link>
            <Link
              to='/login'
              className='text-sm text-primary hover:text-primary-700 transition-colors duration-200'
            >
              Connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
