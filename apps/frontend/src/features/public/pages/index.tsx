import React from 'react';
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
      
      {/* Notice de cookies */}
      <CookieNotice />
    </div>
  );
};

export default PublicHomepage;