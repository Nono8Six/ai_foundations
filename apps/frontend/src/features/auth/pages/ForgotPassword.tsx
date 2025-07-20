import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuth } from '@shared/contexts/AuthContext';
import TextInput from '@shared/ui/TextInput';
import Button from '@shared/ui/Button';
import Card from '@shared/ui/Card';
import { log } from '@libs/logger';

interface ForgotPasswordFields {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFields>();

  const onSubmit = async ({ email }: ForgotPasswordFields) => {
    const trimmed = email.trim();
    try {
      await resetPassword(trimmed);
      toast.success(
        'Si un compte existe, un email de r\xE9initialisation a \xE9t\xE9 envoy\xE9.'
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erreur lors de l'envoi de la demande";
      log.error('Error requesting password reset', { error });
      toast.error(message);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-4'>
      <div className='w-full max-w-md'>
        <Card className='p-6 space-y-4'>
          <h1 className='text-xl font-bold text-text-primary text-center'>
            R\xE9initialiser le mot de passe
          </h1>
          <p className='text-sm text-text-secondary text-center'>
            Entrez votre adresse email pour recevoir un lien de r\xE9initialisation.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <TextInput
              id='email'
              type='email'
              label='Adresse email'
              placeholder='vous@example.com'
              autoComplete='email'
              error={errors.email?.message}
              {...register('email', {
                required: "L'adresse email est requise",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Adresse email invalide',
                },
              })}
            />
            <Button type='submit' className='w-full'>
              Envoyer le lien
            </Button>
          </form>
          <div className='text-center'>
            <Link
              to='/login'
              className='text-primary hover:text-primary-700 text-sm'
            >
              Retour \xE0 la connexion
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
