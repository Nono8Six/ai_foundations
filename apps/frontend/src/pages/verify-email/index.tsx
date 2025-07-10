import React from 'react';
import { useAuth } from '@frontend/context/AuthContext';
import Icon from '@frontend/components/AppIcon';

const VerifyEmail: React.FC = () => {
  const { resendVerificationEmail } = useAuth();
  const pendingEmail = localStorage.getItem('pendingEmail');

  const handleResend = async () => {
    if (pendingEmail) {
      await resendVerificationEmail(pendingEmail);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-4'>
      <div className='bg-surface p-6 rounded-lg shadow-medium max-w-md w-full text-center'>
        <Icon aria-hidden='true' name='Mail' size={40} className='mx-auto text-primary mb-4' />
        <h1 className='text-xl font-bold text-text-primary mb-2'>Vérifiez votre email</h1>
        <p className='text-text-secondary mb-4'>
          Un lien de vérification a été envoyé à votre adresse email. Cliquez dessus pour activer
          votre compte.
        </p>
        {pendingEmail && (
          <button onClick={handleResend} className='text-primary underline text-sm'>
              Renvoyer l&apos;email de vérification
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
