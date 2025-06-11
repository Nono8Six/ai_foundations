// src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom"; // <-- Importer BrowserRouter ici
import Routes from "./Routes";
import { AuthProvider } from "./context/AuthContext";
import { CourseProvider } from "./context/CourseContext";

function App() {
  return (
    // On enveloppe TOUT dans le BrowserRouter
    <BrowserRouter>
      <AuthProvider>
        <CourseProvider>
          <Routes />
        </CourseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;