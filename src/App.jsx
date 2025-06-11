// src/App.jsx
import React from "react";
// On importe BrowserRouter ici, au plus haut niveau.
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes"; // On utilise le composant qui contient les <Route>
import { AuthProvider } from "./context/AuthContext";
import { CourseProvider } from "./context/CourseContext";

function App() {
  return (
    // Le SEUL <BrowserRouter> de l'application est ici.
    <BrowserRouter>
      {/* AuthProvider est maintenant à l'intérieur et peut utiliser les hooks de routage. */}
      <AuthProvider>
        <CourseProvider>
          <AppRoutes />
        </CourseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
