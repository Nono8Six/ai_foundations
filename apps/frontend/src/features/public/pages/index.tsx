import React, { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import BenefitsSection from './components/BenefitsSection';
import ProgramOverview from './components/ProgramOverview';
import TestimonialsCarousel from './components/TestimonialsCarousel';
import DataVisualization from './components/DataVisualization';
import Footer from './components/Footer';
import CookieNotice from './components/CookieNotice';

/**
 * Page d'accueil publique
 * Présente les fonctionnalités principales, programmes et témoignages
 */
const PublicHomepage: React.FC = () => {
  const [showCookieNotice, setShowCookieNotice] = useState(false);

  // Vérifier si l'utilisateur a déjà accepté les cookies
  useEffect(() => {
    const cookiesAccepted = localStorage.getItem('cookies-accepted');
    if (!cookiesAccepted) {
      setShowCookieNotice(true);
    }
  }, []);

  // Gérer l'acceptation des cookies
  const handleAcceptCookies = () => {
    localStorage.setItem('cookies-accepted', 'true');
    setShowCookieNotice(false);
  };

  // Gérer les paramètres de cookies (pour l'instant, simple acceptation)
  const handleCookieSettings = () => {
    // Pour l'instant, on accepte simplement les cookies
    // Plus tard, on peut ajouter une modal de paramètres détaillés
    handleAcceptCookies();
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Section Hero */}
      <HeroSection />
      
      {/* Section Bénéfices */}
      <BenefitsSection />
      
      {/* Aperçu des programmes */}
      <ProgramOverview />
      
      {/* Visualisation des données */}
      <DataVisualization />
      
      {/* Témoignages */}
      <TestimonialsCarousel />
      
      {/* Footer */}
      <Footer />
      
      {/* Notice de cookies - seulement si pas encore accepté */}
      {showCookieNotice && (
        <CookieNotice 
          onAccept={handleAcceptCookies} 
          onOpenSettings={handleCookieSettings}
        />
      )}
    </div>
  );
};

export default PublicHomepage;