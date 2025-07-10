// src/pages/authentication-login-register/index.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@frontend/context/AuthContext';
import { toast } from 'sonner';

import Icon from '@frontend/components/AppIcon';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import GoogleAuthButton from './components/GoogleAuthButton';
import Card from '@frontend/components/ui/Card';

const AuthenticationLoginRegister: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Switch tab based on current path
  useEffect(() => {
    if (location.pathname === '/register' || location.pathname === '/signup') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
  }, [location.pathname]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/espace');
    }
  }, [user, navigate]);

  interface UserData {
    id: string;
    email: string;
    role: string;
    name: string;
  }

  const handleAuthSuccess = (userData: UserData) => {
    setIsLoading(true);

    // For login success, redirect to dashboard
    if (activeTab === 'login') {
      toast.success('Connexion réussie !');
      // Redirect based on user role
      if (userData.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/espace');
      }
    }
    // For registration, the success UI is handled in RegisterForm component

    setIsLoading(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-50 via-background to-accent-50 pt-16'>
      {/* Main Content */}
      <div className='flex items-center justify-center min-h-screen px-4 py-12'>
        <div className='w-full max-w-md'>
          {/* Welcome Section */}
          <div className='text-center mb-8'>
            <div className='w-20 h-20 bg-gradient-to-br from-primary to-primary-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-medium'>
              <Icon aria-hidden='true' name='Brain' size={40} color='white' />
            </div>
            <h1 className='text-3xl font-bold text-text-primary mb-2'>
              {activeTab === 'login' ? 'Bon retour !' : 'Rejoignez-nous'}
            </h1>
            <p className='text-text-secondary'>
              {activeTab === 'login'
                ? 'Connectez-vous pour continuer votre apprentissage IA'
                : "Commencez votre parcours d&rsquo;apprentissage IA dès aujourd&rsquo;hui"}
            </p>
          </div>

          {/* Authentication Card */}
          <Card className='rounded-2xl overflow-hidden'>
            {/* Tab Navigation */}
            <div className='flex border-b border-border'>
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 ${
                  activeTab === 'login'
                    ? 'text-primary bg-primary-50 border-b-2 border-primary'
                    : 'text-text-secondary hover:text-primary hover:bg-secondary-50'
                }`}
              >
                <Icon aria-hidden='true' name='LogIn' size={18} className='inline mr-2' />
                Connexion
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 ${
                  activeTab === 'register'
                    ? 'text-primary bg-primary-50 border-b-2 border-primary'
                    : 'text-text-secondary hover:text-primary hover:bg-secondary-50'
                }`}
              >
                <Icon aria-hidden='true' name='UserPlus' size={18} className='inline mr-2' />
                Inscription
              </button>
            </div>

            {/* Form Content */}
            <div className='p-6'>
              {/* Google Auth Button */}
              <GoogleAuthButton
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                disabled={isLoading}
              />

              {/* Divider */}
              <div className='relative my-6'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-border'></div>
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-4 bg-surface text-text-secondary'>
                    ou continuez avec votre email
                  </span>
                </div>
              </div>

              {/* Forms */}
              {activeTab === 'login' ? (
                <LoginForm
                  onSuccess={handleAuthSuccess}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              ) : (
                <RegisterForm isLoading={isLoading} setIsLoading={setIsLoading} />
              )}
            </div>
          </Card>

          {/* Footer Links */}
          <div className='text-center mt-6 space-y-3'>
            {activeTab === 'login' ? (
              <>
                <Link
                  to='/forgot-password'
                  className='block text-sm text-primary hover:text-primary-700 transition-colors duration-200'
                >
                  Mot de passe oublié ?
                </Link>
                <p className='text-sm text-text-secondary'>
                  Pas encore de compte ?{' '}
                  <button
                    onClick={() => setActiveTab('register')}
                    className='text-primary hover:text-primary-700 font-medium transition-colors duration-200'
                  >
                    Créer un compte
                  </button>
                </p>
              </>
            ) : (
              <p className='text-sm text-text-secondary'>
                Déjà un compte ?{' '}
                <button
                  onClick={() => setActiveTab('login')}
                  className='text-primary hover:text-primary-700 font-medium transition-colors duration-200'
                >
                  Se connecter
                </button>
              </p>
            )}
          </div>

          {/* Demo Info */}
          <div className='mt-8 p-4 bg-accent-50 border border-accent-200 rounded-lg'>
            <div className='flex items-start space-x-3'>
              <Icon
                aria-hidden='true'
                name='Info'
                size={20}
                className='text-accent flex-shrink-0 mt-0.5'
              />
              <div>
                <h4 className='text-sm font-medium text-accent-700 mb-1'>Information de test</h4>
                <p className='text-xs text-accent-600 mb-2'>
                  Pour tester l&rsquo;application, créez un compte ou utilisez Google OAuth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-modal'>
          <div className='bg-surface rounded-lg p-6 flex items-center space-x-4 shadow-medium'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
            <span className='text-text-primary font-medium'>Connexion en cours...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthenticationLoginRegister;
