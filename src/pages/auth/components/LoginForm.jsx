// src/pages/authentication-login-register/components/LoginForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../context/AuthContext';

const LoginForm = ({ onSuccess, isLoading, setIsLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const { signIn } = useAuth();
  const [authError, setAuthError] = useState('');

  const onSubmit = async data => {
    setIsLoading(true);
    setAuthError('');

    try {
      const { session } = await signIn({
        email: data.email,
        password: data.password,
      });

      // Call the onSuccess callback with the user data
      if (session?.user) {
        onSuccess({
          id: session.user.id,
          email: session.user.email,
          role: session.user.user_metadata?.role || 'student',
          name: session.user.user_metadata?.full_name || 'User',
        });
      }
    } catch (error) {
      console.error('Login error:', error.message);
      setIsLoading(false);
      setAuthError(error.message || 'Email ou mot de passe incorrect');
      setError('email', { type: 'manual' });
      setError('password', { type: 'manual' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      {/* Email Field */}
      <div>
        <label htmlFor='email' className='block text-sm font-medium text-text-primary mb-2'>
          Adresse email
        </label>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Icon name='Mail' size={18} className='text-text-secondary' />
          </div>
          <input
            id='email'
            type='email'
            {...register('email', {
              required: "L'adresse email est requise",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Adresse email invalide',
              },
            })}
            className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
              errors.email
                ? 'border-error bg-error-50 text-error-700'
                : 'border-border bg-surface text-text-primary hover:border-primary-300'
            }`}
            placeholder='votre@email.com'
            disabled={isLoading}
          />
        </div>
        {errors.email && (
          <p className='mt-1 text-sm text-error flex items-center'>
            <Icon name='AlertCircle' size={16} className='mr-1' />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor='password' className='block text-sm font-medium text-text-primary mb-2'>
          Mot de passe
        </label>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Icon name='Lock' size={18} className='text-text-secondary' />
          </div>
          <input
            id='password'
            type='password'
            {...register('password', {
              required: 'Le mot de passe est requis',
              minLength: {
                value: 6,
                message: 'Le mot de passe doit contenir au moins 6 caractères',
              },
            })}
            className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
              errors.password
                ? 'border-error bg-error-50 text-error-700'
                : 'border-border bg-surface text-text-primary hover:border-primary-300'
            }`}
            placeholder='••••••••'
            disabled={isLoading}
          />
        </div>
        {errors.password && (
          <p className='mt-1 text-sm text-error flex items-center'>
            <Icon name='AlertCircle' size={16} className='mr-1' />
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Auth Error Message */}
      {authError && (
        <div className='p-3 bg-error-50 border border-error-200 rounded-lg'>
          <p className='text-sm text-error-700 flex items-center'>
            <Icon name='AlertTriangle' size={16} className='mr-2 flex-shrink-0' />
            {authError}
          </p>
        </div>
      )}

      {/* Remember Me */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <input
            id='remember'
            type='checkbox'
            {...register('remember')}
            className='h-4 w-4 text-primary focus:ring-primary border-border rounded'
            disabled={isLoading}
          />
          <label htmlFor='remember' className='ml-2 block text-sm text-text-secondary'>
            Se souvenir de moi
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type='submit'
        disabled={isLoading}
        className='w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-subtle text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
      >
        {isLoading ? (
          <>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
            Connexion...
          </>
        ) : (
          <>
            <Icon name='LogIn' size={18} className='mr-2' />
            Se connecter
          </>
        )}
      </button>
    </form>
  );
};

export default LoginForm;