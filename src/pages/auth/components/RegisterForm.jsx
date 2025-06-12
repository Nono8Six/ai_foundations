import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../context/AuthContext';

const RegisterForm = ({ onSuccess, isLoading, setIsLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const { signUp } = useAuth();
  const [authError, setAuthError] = useState('');
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const password = watch('password');

  const onSubmit = async data => {
    setIsLoading(true);
    setAuthError('');

    try {
      const result = await signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      // Handle successful registration
      if (result) {
        setRegistrationComplete(true);
        // Don't call onSuccess here as we want to show the verification message
      }
    } catch (error) {
      console.error('Registration error:', error.message);
      setIsLoading(false);
      setAuthError(error.message || "Erreur lors de l'inscription");
    }
  };

  if (registrationComplete) {
    return (
      <div className="p-6 bg-success-50 border border-success-200 rounded-lg">
        <div className="flex items-center mb-4">
          <Icon name="CheckCircle" size={24} className="text-success mr-3" />
          <h3 className="text-lg font-medium text-success-700">Inscription réussie !</h3>
        </div>
        <p className="text-success-600 mb-4">
          Votre compte a été créé avec succès. Veuillez vérifier votre boîte de réception pour confirmer votre adresse email.
        </p>
        <p className="text-success-600 mb-4">
          Une fois votre email confirmé, vous pourrez vous connecter à votre compte.
        </p>
        <button
          onClick={() => window.location.href = '/login'}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-subtle text-sm font-medium text-white bg-success hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success transition-all duration-200"
        >
          <Icon name="LogIn" size={18} className="mr-2" />
          Aller à la page de connexion
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      {/* Name Fields */}
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label htmlFor='firstName' className='block text-sm font-medium text-text-primary mb-2'>
            Prénom
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <Icon name='User' size={18} className='text-text-secondary' />
            </div>
            <input
              id='firstName'
              type='text'
              {...register('firstName', {
                required: 'Le prénom est requis',
                minLength: {
                  value: 2,
                  message: 'Le prénom doit contenir au moins 2 caractères',
                },
              })}
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                errors.firstName
                  ? 'border-error bg-error-50 text-error-700'
                  : 'border-border bg-surface text-text-primary hover:border-primary-300'
              }`}
              placeholder='Marie'
              disabled={isLoading}
            />
          </div>
          {errors.firstName && (
            <p className='mt-1 text-sm text-error flex items-center'>
              <Icon name='AlertCircle' size={16} className='mr-1' />
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor='lastName' className='block text-sm font-medium text-text-primary mb-2'>
            Nom
          </label>
          <input
            id='lastName'
            type='text'
            {...register('lastName', {
              required: 'Le nom est requis',
              minLength: {
                value: 2,
                message: 'Le nom doit contenir au moins 2 caractères',
              },
            })}
            className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
              errors.lastName
                ? 'border-error bg-error-50 text-error-700'
                : 'border-border bg-surface text-text-primary hover:border-primary-300'
            }`}
            placeholder='Dubois'
            disabled={isLoading}
          />
          {errors.lastName && (
            <p className='mt-1 text-sm text-error flex items-center'>
              <Icon name='AlertCircle' size={16} className='mr-1' />
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

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
            placeholder='marie.dubois@email.com'
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
                value: 8,
                message: 'Le mot de passe doit contenir au moins 8 caractères',
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message:
                  'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
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

      {/* Confirm Password Field */}
      <div>
        <label
          htmlFor='confirmPassword'
          className='block text-sm font-medium text-text-primary mb-2'
        >
          Confirmer le mot de passe
        </label>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Icon name='Lock' size={18} className='text-text-secondary' />
          </div>
          <input
            id='confirmPassword'
            type='password'
            {...register('confirmPassword', {
              required: 'La confirmation du mot de passe est requise',
              validate: value => value === password || 'Les mots de passe ne correspondent pas',
            })}
            className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
              errors.confirmPassword
                ? 'border-error bg-error-50 text-error-700'
                : 'border-border bg-surface text-text-primary hover:border-primary-300'
            }`}
            placeholder='••••••••'
            disabled={isLoading}
          />
        </div>
        {errors.confirmPassword && (
          <p className='mt-1 text-sm text-error flex items-center'>
            <Icon name='AlertCircle' size={16} className='mr-1' />
            {errors.confirmPassword.message}
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

      {/* Terms and Conditions */}
      <div className='flex items-start'>
        <div className='flex items-center h-5'>
          <input
            id='terms'
            type='checkbox'
            {...register('terms', {
              required: "Vous devez accepter les conditions d'utilisation",
            })}
            className='h-4 w-4 text-primary focus:ring-primary border-border rounded'
            disabled={isLoading}
          />
        </div>
        <div className='ml-3 text-sm'>
          <label htmlFor='terms' className='text-text-secondary'>
            J'accepte les{' '}
            <a
              href='#'
              className='text-primary hover:text-primary-700 transition-colors duration-200'
            >
              conditions d'utilisation
            </a>{' '}
            et la{' '}
            <a
              href='#'
              className='text-primary hover:text-primary-700 transition-colors duration-200'
            >
              politique de confidentialité
            </a>
          </label>
          {errors.terms && (
            <p className='mt-1 text-error flex items-center'>
              <Icon name='AlertCircle' size={16} className='mr-1' />
              {errors.terms.message}
            </p>
          )}
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
            Création du compte...
          </>
        ) : (
          <>
            <Icon name='UserPlus' size={18} className='mr-2' />
            Créer mon compte
          </>
        )}
      </button>
    </form>
  );
};

export default RegisterForm;