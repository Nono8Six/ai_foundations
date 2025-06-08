import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { vi, afterEach } from 'vitest';

// Types
type AllTheProvidersProps = {
  children: ReactNode;
  routerProps?: MemoryRouterProps;
};

// Configuration pour les tests de composants
const AllTheProviders = ({ 
  children, 
  routerProps = {} 
}: AllTheProvidersProps) => (
  <MemoryRouter {...routerProps}>
    {children}
  </MemoryRouter>
);

// Options de rendu personnalisées
type CustomRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  routerProps?: MemoryRouterProps;
};

// Surcharge de la fonction render de RTL avec les providers nécessaires
const customRender = (
  ui: ReactElement,
  { 
    routerProps = {},
    ...renderOptions 
  }: CustomRenderOptions = {}
): RenderResult => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AllTheProviders routerProps={routerProps}>
      {children}
    </AllTheProviders>
  );

  return render(ui, { wrapper, ...renderOptions });
};

// Nettoyage après chaque test
afterEach(() => {
  vi.clearAllMocks();
});

// Réexporter tout depuis RTL
export * from '@testing-library/react';

export { customRender as render };

// Types utilitaires pour les tests
export type { CustomRenderOptions as RenderOptions };
