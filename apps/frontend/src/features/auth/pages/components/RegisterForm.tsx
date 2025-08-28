import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Icon from '@shared/components/AppIcon';
import { useAuth } from '@features/auth/contexts/AuthContext';
import { log } from '@libs/logger';
import PasswordStrengthIndicator from '@shared/components/PasswordStrengthIndicator';
import PasswordConfirmationIndicator from '@shared/components/PasswordConfirmationIndicator';
import { checkEmailExists } from '@shared/services/userService';

export interface RegisterFormProps {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ isLoading, setIsLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<FormValues>();
  const { signUp } = useAuth();
  const [authError, setAuthError] = useState('');
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setAuthError('');

    try {
      // First, check if email already exists
      log.debug('Checking if email exists:', data.email);
      const emailExists = await checkEmailExists(data.email);
      
      if (emailExists) {
        setAuthError('Cette adresse email est déjà utilisée. Essayez de vous connecter ou utilisez "Mot de passe oublié".');
        setIsLoading(false);
        return;
      }

      const result = await signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      // Check for errors in result
      if (result?.error) {
        log.error('Registration error:', result.error.message);
        setAuthError(result.error.message);
        
        // Si c'est une erreur d'email existant, clear les champs pour permettre une nouvelle tentative
        if (result.error.message.includes('email est déjà utilisé') || result.error.message.includes('Cette adresse email est déjà utilisée')) {
          setTimeout(() => {
            reset({
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
              terms: false,
            });
            // Focus sur le champ email pour une nouvelle tentative
            const emailInput = document.getElementById('email') as HTMLInputElement;
            if (emailInput) {
              emailInput.focus();
            }
          }, 100);
        }
        
        setIsLoading(false);
        return;
      }

      // Check if we got a valid response
      if (result?.data) {
        localStorage.setItem('pendingEmail', data.email);
        window.location.href = '/verify-email';
      } else {
        // This should not happen, but handle gracefully
        log.error('No result data from signUp');
        setAuthError("Erreur inattendue lors de l'inscription. Veuillez réessayer.");
        setIsLoading(false);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      log.error('Registration error:', error.message);
      setIsLoading(false);
      setAuthError(error.message || "Erreur lors de l'inscription");
    }
  };

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
              <Icon aria-hidden='true' name='User' size={18} className='text-text-secondary' />
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
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby='firstName-error'
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
            <p id='firstName-error' role='alert' className='mt-1 text-sm text-error flex items-center'>
              <Icon aria-hidden='true' name='AlertCircle' size={16} className='mr-1' />
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
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby='lastName-error'
            className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
              errors.lastName
                ? 'border-error bg-error-50 text-error-700'
                : 'border-border bg-surface text-text-primary hover:border-primary-300'
            }`}
            placeholder='Dubois'
            disabled={isLoading}
          />
          {errors.lastName && (
            <p id='lastName-error' role='alert' className='mt-1 text-sm text-error flex items-center'>
              <Icon aria-hidden='true' name='AlertCircle' size={16} className='mr-1' />
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
            <Icon aria-hidden='true' name='Mail' size={18} className='text-text-secondary' />
          </div>
          <input
            id='email'
            type='email'
            autoComplete='email'
            {...register('email', {
              required: "L'adresse email est requise",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Adresse email invalide',
              },
            })}
            aria-invalid={Boolean(errors.email)}
            aria-describedby='email-error'
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
          <p id='email-error' role='alert' className='mt-1 text-sm text-error flex items-center'>
            <Icon aria-hidden='true' name='AlertCircle' size={16} className='mr-1' />
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
            <Icon aria-hidden='true' name='Lock' size={18} className='text-text-secondary' />
          </div>
          <input
            id='password'
            type='password'
            autoComplete='new-password'
            {...register('password', {
              required: 'Le mot de passe est requis',
              minLength: {
                value: 8,
                message: 'Le mot de passe doit contenir au moins 8 caractères',
              },
              validate: (value) => {
                if (!value) return 'Le mot de passe est requis';
                if (value.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères';
                
                const hasLower = /[a-z]/.test(value);
                const hasUpper = /[A-Z]/.test(value);
                const hasNumber = /\d/.test(value);
                const hasSpecial = /[@$!%*?&]/.test(value);
                
                if (!hasLower) return 'Le mot de passe doit contenir au moins une minuscule';
                if (!hasUpper) return 'Le mot de passe doit contenir au moins une majuscule';
                if (!hasNumber) return 'Le mot de passe doit contenir au moins un chiffre';
                if (!hasSpecial) return 'Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&)';
                
                return true;
              },
            })}
            aria-invalid={Boolean(errors.password)}
            aria-describedby='password-error'
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
          <p id='password-error' role='alert' className='mt-1 text-sm text-error flex items-center'>
            <Icon aria-hidden='true' name='AlertCircle' size={16} className='mr-1' />
            {errors.password.message}
          </p>
        )}
        <PasswordStrengthIndicator password={password || ''} />
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
            <Icon aria-hidden='true' name='Lock' size={18} className='text-text-secondary' />
          </div>
          <input
            id='confirmPassword'
            type='password'
            autoComplete='new-password'
            {...register('confirmPassword', {
              required: 'La confirmation du mot de passe est requise',
              validate: value => value === password || 'Les mots de passe ne correspondent pas',
            })}
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby='confirmPassword-error'
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
          <p id='confirmPassword-error' role='alert' className='mt-1 text-sm text-error flex items-center'>
            <Icon aria-hidden='true' name='AlertCircle' size={16} className='mr-1' />
            {errors.confirmPassword.message}
          </p>
        )}
        <PasswordConfirmationIndicator 
          password={password || ''} 
          confirmPassword={confirmPassword || ''}
        />
      </div>

      {/* Auth Error Message */}
      {authError && (
        <div className='p-3 bg-error-50 border border-error-200 rounded-lg'>
          <p className='text-sm text-error-700 flex items-center'>
            <Icon
              aria-hidden='true'
              name='AlertTriangle'
              size={16}
              className='mr-2 flex-shrink-0'
            />
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
            aria-invalid={Boolean(errors.terms)}
            aria-describedby='terms-error'
            className='h-4 w-4 text-primary focus:ring-primary border-border rounded'
            disabled={isLoading}
          />
        </div>
        <div className='ml-3 text-sm'>
          <label htmlFor='terms' className='text-text-secondary'>
            J&rsquo;accepte les{' '}
            <a
              href='#'
              className='text-primary hover:text-primary-700 transition-colors duration-200'
            >
              conditions d&rsquo;utilisation
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
            <p id='terms-error' role='alert' className='mt-1 text-error flex items-center'>
              <Icon aria-hidden='true' name='AlertCircle' size={16} className='mr-1' />
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
            <Icon aria-hidden='true' name='UserPlus' size={18} className='mr-2' />
            Créer mon compte
          </>
        )}
      </button>
    </form>
  );
};

export default RegisterForm;
