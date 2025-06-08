// src/App.jsx
import React from "react";
import Routes from "./Routes";
import { AuthProvider } from "./context/AuthContext";
import { CourseProvider } from "./context/CourseContext";

function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <Routes />
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;
