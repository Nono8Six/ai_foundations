// src/pages/auth/components/LoginForm.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, type FieldError } from 'react-hook-form';
import { isAuthErrorWithCode } from '@frontend/utils/auth';
import { toast } from 'sonner';
import Icon from '@frontend/components/AppIcon';
import Button from '@frontend/components/ui/Button';
import TextInput from '@frontend/components/ui/TextInput';
import { useAuth } from '@frontend/context/AuthContext';
import { log } from '@libs/logger';

// Types
interface UserData {
  id: string;
  email: string;
  role: string;
  name: string;
}

type LoginFormFields = {
  email: string;
  password: string;
  remember?: boolean;
};

export interface LoginFormProps {
  onSuccess: (user: UserData) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, isLoading, setIsLoading }) => {
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
    watch,
    clearErrors,
    getValues,
  } = useForm<LoginFormFields>();
  
  const { signIn, resendVerificationEmail, authError, clearAuthError } = useAuth();

  // Clear auth error on mount/unmount
  useEffect(() => {
    clearAuthError();
    return () => {
      clearAuthError();
    };
  }, []);

  const emailValue = watch('email');
  const passwordValue = watch('password');

  // Clear error when user edits fields
  useEffect(() => {
    if (errors.email) {
      clearErrors('email');
    }
    if (errors.password) {
      clearErrors('password');
    }
    if (authError) {
      clearAuthError();
    }
  }, [emailValue, passwordValue]);

  const getErrorMessage = (error: unknown): string | undefined => {
    if (!error) return undefined;
    if (typeof error === 'string') return error;
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as Record<string, unknown>).message === 'string'
    ) {
      return (error as FieldError).message;
    }
    return undefined;
  };

  const onSubmit = async (data: LoginFormFields) => {
    setIsLoading(true);
    clearAuthError();

    try {
      const result = await signIn({
        email: data.email,
        password: data.password,
      });

      if (!result) {
        throw new Error('Aucune réponse du serveur');
      }

      if (result.error) {
        throw result.error;
      }

      if (result.data?.session?.user) {
        onSuccess({
          id: result.data.session.user.id,
          email: result.data.session.user.email ?? '',
          role: result.data.session.user.user_metadata?.role || 'student',
          name: result.data.session.user.user_metadata?.full_name || 'User',
        });
      } else {
        throw new Error('Aucune session utilisateur valide');
      }
    } catch (error) {
      log.error({ msg: 'Login error', error });

      // Set form field errors
      setFormError('email', {
        type: 'manual',
        message: 'Vérifiez votre email'
      });
      setFormError('password', {
        type: 'manual',
        message: 'Vérifiez votre mot de passe'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      {/* Email Field */}
      <TextInput
        id='email'
        type='email'
        label='Adresse email'
        placeholder='votre@email.com'
        error={getErrorMessage(errors.email)}
        disabled={isLoading}
        autoComplete='email'
        {...register('email', {
          required: "L'adresse email est requise",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Adresse email invalide',
          },
        })}
      />

      {/* Password Field */}
      <TextInput
        id='password'
        type='password'
        label='Mot de passe'
        placeholder='••••••••'
        error={getErrorMessage(errors.password)}
        disabled={isLoading}
        autoComplete='current-password'
        {...register('password', {
          required: 'Le mot de passe est requis',
          minLength: {
            value: 6,
            message: 'Le mot de passe doit contenir au moins 6 caractères',
          },
        })}
      />

      {/* Auth Error Message */}
      {authError && (
        <div className='p-4 bg-error-50 border border-error-200 rounded-lg'>
          <div className='flex items-start'>
            <Icon name='AlertTriangle' className='h-5 w-5 text-error-400 mr-3' />
            <div className='flex-1'>
              <p className='text-sm font-medium text-error-800'>{authError.message}</p>
              {isAuthErrorWithCode(authError) && authError.code === 'email_not_confirmed' && (
                <div className='mt-2'>
                  <button
  type='button'
  disabled={isResending}
  onClick={async (e) => {
    e.preventDefault();
    setIsResending(true);
    try {
      const email = getValues('email')?.trim();
      if (!email) {
        toast.error("Veuillez d'abord entrer votre adresse email");
        return;
      }
      await resendVerificationEmail(email);
      toast.success("Email de vérification envoyé avec succès !");
    } catch (error) {
      const errorMessage = getErrorMessage(error) || "Erreur lors de l'envoi de l'email de vérification";
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  }}
  className='text-sm text-blue-600 hover:text-blue-500 mt-1 flex items-center gap-2'
>
  {isResending && (
    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></span>
  )}
  Renvoyer l&rsquo;email de vérification
</button>
                </div>
              )}
            </div>
          </div>
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
        <div className='text-sm'>
          <button
            type='button'
            className='font-medium text-primary hover:text-primary-700 transition-colors duration-200'
            disabled={isLoading}
            onClick={() => {
              navigate('/forgot-password');
            }}
          >
            Mot de passe oublié ?
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type='submit'
        className='w-full flex justify-center items-center'
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
            Connexion...
          </>
        ) : (
          <>
            <Icon aria-hidden='true' name='LogIn' size={18} className='mr-2' />
            Se connecter
          </>
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
