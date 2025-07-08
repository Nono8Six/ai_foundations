import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useRouteProgress } from '../hooks/useRouteProgress';

const RootLayout: React.FC = () => {
  // Le hook est maintenant appelé ici, à l'intérieur du contexte du routeur.
  useRouteProgress();

  return (
    <>
      <Header />
      <Outlet /> {/* Outlet rendra le composant de la route active */}
    </>
  );
};

export default RootLayout;