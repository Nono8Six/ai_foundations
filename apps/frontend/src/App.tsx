import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './Routes';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import { AdminCourseProvider } from './context/AdminCourseContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { ErrorProvider, type ErrorLogger } from './context/ErrorContext';
import type { AuthErrorWithCode } from './types/auth';

// Un composant pour lier les deux contextes
const AppWithErrorToasts: React.FC = () => {
  const { addToast } = useToast();

  // Créer un logger personnalisé qui affiche un toast
  const errorLoggerWithToast: ErrorLogger = (error: unknown) => {
    const err = error as AuthErrorWithCode;
    // Liste complète des erreurs d'authentification attendues à ne pas logger
    const isExpectedAuthError =
      err?.code === 'invalid_credentials' ||
      err?.code === 'auth_error' ||
      err?.originalError?.code === 'invalid_credentials' ||
      err?.message?.includes('Invalid login credentials') ||
      err?.message?.includes('Les identifiants fournis sont incorrects') ||
      err?.message?.includes('Email ou mot de passe incorrect') ||
      err?.message?.includes('Aucun compte trouvé') ||
      err?.message?.includes('Mot de passe incorrect') ||
      err?.message?.includes('User not found') ||
      err?.message?.includes('Invalid password') ||
      err?.message?.includes('Email not confirmed') ||
      err?.message?.includes('Too many requests') ||
      err?.message?.includes('Trop de tentatives') ||
      err?.message?.includes('Veuillez confirmer votre email') ||
      // Vérifier aussi dans l'URL de la requête Supabase
      (err?.url && err?.url.includes('/auth/v1/token')) ||
      (err?.requestUrl && err?.requestUrl.includes('/auth/v1/token'));

    if (!isExpectedAuthError) {
      console.error('Error logged:', err);
    }

    // Toujours afficher le toast pour informer l'utilisateur (sauf si c'est une erreur technique)
    if (err?.message && !err?.message.includes('Supabase request failed')) {
      addToast(err.message, 'error');
    } else if (!isExpectedAuthError) {
      addToast("Une erreur inattendue s'est produite", 'error');
    }
  };

  return (
    <ErrorProvider logger={errorLoggerWithToast}>
      <Header />
      <AppRoutes />
    </ErrorProvider>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CourseProvider>
          <AdminCourseProvider>
            <ToastProvider>
              <AppWithErrorToasts />
            </ToastProvider>
          </AdminCourseProvider>
        </CourseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
