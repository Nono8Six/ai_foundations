import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes";
import { AuthProvider } from "./context/AuthContext";
import { CourseProvider } from "./context/CourseContext";
import { ToastProvider, useToast } from "./context/ToastContext"; // Assurez-vous d'exporter useToast
import { ErrorProvider } from "./context/ErrorContext";

// Un composant pour lier les deux contextes
const AppWithErrorToasts = () => {
  const { addToast } = useToast();

  // Créer un logger personnalisé qui affiche un toast
  const errorLoggerWithToast = (error) => {
    console.error("Error logged:", error); // Log original
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
