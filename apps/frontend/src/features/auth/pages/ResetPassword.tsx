import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@core/supabase/client';
// import { supabaseImplicit } from '@core/supabase/implicitClient'; // REMOVED - causes JWT token issues
import Card from '@shared/ui/Card';
import Button from '@shared/ui/Button';
import TextInput from '@shared/ui/TextInput';
import { toast } from 'sonner';
import { ROUTES } from '@shared/constants/routes';
import { log } from '@libs/logger';
import PasswordStrengthIndicator from '@shared/components/PasswordStrengthIndicator';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [needsResend, setNeedsResend] = useState(false);
  const [email, setEmail] = useState<string>(() => {
    try {
      return localStorage.getItem('pendingResetEmail') || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    // Establish a session from URL (hash or code), then enable the form
    void (async () => {
      try {
        const url = window.location.href;
        const hasFragment = window.location.hash.includes('access_token');
        const params = new URLSearchParams(window.location.search);
        const hasCode = params.has('code');

        if (hasFragment) {
          // Parse tokens from hash: #access_token=...&refresh_token=...&type=recovery
          const fragment = new URLSearchParams(window.location.hash.substring(1));
          const access_token = fragment.get('access_token') || '';
          const refresh_token = fragment.get('refresh_token') || '';
          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({ access_token, refresh_token });
            if (error) throw error;
            // Clean hash from URL for a cleaner UX
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } else if (hasCode) {
          // PKCE/code exchange path (safety net)
          const { error } = await supabase.auth.exchangeCodeForSession(url);
          if (error) throw error;
          // Clean query from URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Validate session presence
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          // Pas de session: cas fréquent si le lien a été ouvert dans un autre navigateur / code_verifier indisponible
          setNeedsResend(true);
          toast.error('Lien invalide ou expiré. Renvoyez un lien ci-dessous.');
          setReady(false);
          return;
        }
        setReady(true);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        log.error('Failed to initialize recovery session', err);
        // Erreur typique PKCE: absence de code_verifier enregistré
        setNeedsResend(true);
        toast.error('Impossible de valider le lien. Renvoyez un lien ci-dessous.');
        setReady(false);
      }
    })();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    
    // Enhanced password validation
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);
    
    if (!hasLower || !hasUpper || !hasNumber || !hasSpecial) {
      toast.error('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial');
      return;
    }
    
    if (password !== confirm) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      try { 
        localStorage.removeItem('pendingResetEmail'); 
      } catch {
        // localStorage might not be available
      }
      toast.success('Mot de passe réinitialisé avec succès');
      navigate(ROUTES.postAuth);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      log.error('Reset password failed', err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-4'>
      <div className='w-full max-w-md'>
        <Card className='p-6 space-y-4'>
          <h1 className='text-xl font-bold text-text-primary text-center'>
            Réinitialiser votre mot de passe
          </h1>
          {!ready && !needsResend && (
            <p className='text-sm text-text-secondary text-center'>
              Validation du lien en cours...
            </p>
          )}
          {needsResend && (
            <div className='space-y-3'>
              <p className='text-sm text-text-secondary'>
                Le lien est invalide ou a expiré. Cela peut arriver si vous avez ouvert le lien dans un navigateur différent. Renseignez votre email pour recevoir un nouveau lien.
              </p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!email.trim()) {
                    toast.error('Entrez votre adresse email');
                    return;
                  }
                  setLoading(true);
                  try {
                    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                      redirectTo: `${window.location.origin}/reset-password`,
                    });
                    if (error) throw error;
                    try { 
                      localStorage.setItem('pendingResetEmail', email.trim()); 
                    } catch {
                      // localStorage might not be available
                    }
                    toast.success('Nouveau lien envoyé. Consultez votre boîte mail.');
                  } catch (err) {
                    const message = err instanceof Error ? err.message : String(err);
                    log.error('Resend recovery link failed', err);
                    toast.error(message);
                  } finally {
                    setLoading(false);
                  }
                }}
                className='space-y-3'
              >
                <TextInput
                  id='reset_email'
                  type='email'
                  label='Adresse email'
                  placeholder='vous@example.com'
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <Button type='submit' className='w-full' disabled={loading}>Renvoyer le lien</Button>
              </form>
            </div>
          )}
          <form onSubmit={onSubmit} className='space-y-4'>
            <div>
              <TextInput
                id='new_password'
                type='password'
                label='Nouveau mot de passe'
                placeholder='••••••••'
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                disabled={loading || !ready || needsResend}
                autoComplete='new-password'
              />
              <PasswordStrengthIndicator password={password} />
            </div>
            <TextInput
              id='confirm_password'
              type='password'
              label='Confirmer le mot de passe'
              placeholder='••••••••'
              value={confirm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value)}
              disabled={loading || !ready || needsResend}
              autoComplete='new-password'
            />
            <Button type='submit' className='w-full' disabled={loading || !ready || needsResend}>
              {loading ? 'Réinitialisation...' : 'Mettre à jour le mot de passe'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
