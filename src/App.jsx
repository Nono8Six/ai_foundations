import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes";
import Header from './components/Header';
import { AuthProvider } from "./context/AuthContext";
import { CourseProvider } from "./context/CourseContext";
import { AdminCourseProvider } from './context/AdminCourseContext';
import { ToastProvider, useToast } from "./context/ToastContext";
import { ErrorProvider } from "./context/ErrorContext";

// Un composant pour lier les deux contextes
const AppWithErrorToasts = () => {
  const { addToast } = useToast();

  // Créer un logger personnalisé qui affiche un toast
  const errorLoggerWithToast = (error) => {
    // Liste complète des erreurs d'authentification attendues à ne pas logger
    const isExpectedAuthError = 
      error?.code === 'invalid_credentials' || 
      error?.code === 'auth_error' ||
      error?.originalError?.code === 'invalid_credentials' ||
      error?.message?.includes('Invalid login credentials') ||
      error?.message?.includes('Les identifiants fournis sont incorrects') ||
      error?.message?.includes('Email ou mot de passe incorrect') ||
      error?.message?.includes('Aucun compte trouvé') ||
      error?.message?.includes('Mot de passe incorrect') ||
      error?.message?.includes('User not found') ||
      error?.message?.includes('Invalid password') ||
      error?.message?.includes('Email not confirmed') ||
      error?.message?.includes('Too many requests') ||
      error?.message?.includes('Trop de tentatives') ||
      error?.message?.includes('Veuillez confirmer votre email') ||
      // Vérifier aussi dans l'URL de la requête Supabase
      (error?.url && error?.url.includes('/auth/v1/token')) ||
      (error?.requestUrl && error?.requestUrl.includes('/auth/v1/token'));
    
    if (!isExpectedAuthError) {
      console.error("Error logged:", error);
    }
    
    // Toujours afficher le toast pour informer l'utilisateur (sauf si c'est une erreur technique)
    if (error?.message && !error?.message.includes('Supabase request failed')) {
      addToast(error.message, 'error');
    } else if (!isExpectedAuthError) {
      addToast('Une erreur inattendue s\'est produite', 'error');
    }
  };

  return (
    <ErrorProvider logger={errorLoggerWithToast}>
      <Header />
      <AppRoutes />
    </ErrorProvider>
  )
}

function App() {
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
}

export default App;