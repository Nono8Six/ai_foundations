/**
 * AI Foundations LMS - Simplified App Layout
 * Layout simple avec navigation horizontale uniquement (sans sidebar)
 */

import React, { ReactNode } from 'react';
import { ThemeProvider } from '@shared/hooks/useTheme';
import { useSkipLinks } from '@shared/hooks/useAccessibility';
import PerfectHeader from '@shared/layouts/PerfectHeader';
import { cn } from '@shared/utils/utils';

/* ================================
   LAYOUT CONTEXT (SIMPLIFIÉ)
   ================================ */

// Plus besoin de context complexe pour sidebar
export interface SimpleLayoutContextValue {
  // Peut être étendu plus tard si nécessaire
  version: string;
}

/* ================================
   MAIN APP LAYOUT COMPONENT
   ================================ */

export interface SimpleAppLayoutProps {
  children: ReactNode;
  className?: string;
}

const SimpleAppLayoutContent: React.FC<SimpleAppLayoutProps> = ({ children, className }) => {
  // Skip links configuration (simplifié)
  const skipLinks = [
    { id: 'main-content', label: 'Aller au contenu principal' },
    { id: 'top-navigation', label: 'Aller à la navigation principale' },
  ];

  const { SkipLinks } = useSkipLinks(skipLinks);

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Skip Links for Accessibility */}
      <SkipLinks />
      
      {/* Layout simple sans sidebar */}
      <div className="flex flex-col min-h-screen">
        {/* Perfect Header avec navigation intégrée */}
        <PerfectHeader />

        {/* Main content area */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto focus:outline-none"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

/**
 * Main App Layout with Theme Provider
 */
export const SimpleAppLayout: React.FC<SimpleAppLayoutProps> = (props) => {
  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      <SimpleAppLayoutContent {...props} />
    </ThemeProvider>
  );
};

export default SimpleAppLayout;