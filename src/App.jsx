// src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes"; // On utilise le composant qui contient les <Route>
import { AuthProvider } from "./context/AuthContext";
import { CourseProvider } from "./context/CourseContext";
import { ToastProvider } from "./context/ToastContext";
import Header from "./components/Header";

function App() {
  return (
    // Le SEUL <BrowserRouter> de l'application est ici.
    <BrowserRouter>
      {/* AuthProvider est maintenant à l'intérieur et peut utiliser les hooks de routage. */}
      <AuthProvider>
        <CourseProvider>
          <ToastProvider>
            <Header />
            <AppRoutes />
          </ToastProvider>
        </CourseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;