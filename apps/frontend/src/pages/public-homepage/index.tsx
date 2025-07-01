import React, { useState, useEffect } from 'react';

import HeroSection from './components/HeroSection';
import DataVisualization from './components/DataVisualization';
import ProgramOverview from './components/ProgramOverview';
import TestimonialsCarousel from './components/TestimonialsCarousel';
import BenefitsSection from './components/BenefitsSection';
import Footer from './components/Footer';
import CookieNotice from './components/CookieNotice';

interface PublicHomepageProps {}

const PublicHomepage: React.FC<PublicHomepageProps> = () => {
  const [showCookieNotice, setShowCookieNotice] = useState(true);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (cookiesAccepted) {
      setShowCookieNotice(false);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowCookieNotice(false);
  };

  return (
    <div className='min-h-screen bg-background'>
      <main className='pt-16'>
        <HeroSection />
        <DataVisualization />
        <ProgramOverview />
        <TestimonialsCarousel />
        <BenefitsSection />
      </main>

      <Footer />

      {showCookieNotice && <CookieNotice onAccept={handleAcceptCookies} />}
    </div>
  );
};

export default PublicHomepage;
