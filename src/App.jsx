import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes";
import Header from './components/Header';
import { AuthProvider } from "./context/AuthContext";
import { CourseProvider } from "./context/CourseContext";
import { ToastProvider, useToast } from "./context/ToastContext"; // Assurez-vous d'exporter useToast
import { ErrorProvider } from "./context/ErrorContext";

// Un composant pour lier les deux contextes
const AppWithErrorToasts = () => {
  const { addToast } = useToast();

  // Créer un logger personnalisé qui affiche un toast
  const errorLoggerWithToast = (error) => {
    // Ne pas logger les erreurs d'authentification attendues dans la console
    const isExpectedAuthError = error?.code === 'invalid_credentials' || 
                               error?.message?.includes('Invalid login credentials') ||
                               error?.message?.includes('Les identifiants fournis sont incorrects');
    
    if (!isExpectedAuthError) {
      console.error("Error logged:", error); // Log seulement les erreurs inattendues
    }
    
    // Toujours afficher le toast pour informer l'utilisateur
    if (error?.message) {
      addToast(error.message, 'error');
    } else {
      addToast('An unexpected error occurred', 'error');
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
          {/* ToastProvider doit englober ce qui utilise les toasts */}
          <ToastProvider>
            <AppWithErrorToasts />
          </ToastProvider>
        </CourseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;