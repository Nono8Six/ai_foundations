// Type augmentation pour react-router-dom v7.7.0
declare module 'react-router-dom' {
  export * from 'react-router-dom/dist/index';
  
  // Réexport des types principaux pour garantir la compatibilité
  import type { ComponentType, ReactNode } from 'react';
  
  // Navigation et routing
  export interface NavigateFunction {
    (to: string | number, options?: NavigateOptions): void;
    (delta: number): void;
  }
  
  export interface NavigateOptions {
    replace?: boolean;
    state?: any;
    relative?: 'route' | 'path';
    preventScrollReset?: boolean;
    unstable_flushSync?: boolean;
  }
  
  export interface Location {
    pathname: string;
    search: string;
    hash: string;
    state: unknown;
    key: string;
  }
  
  // Hooks
  export function useNavigate(): NavigateFunction;
  export function useLocation(): Location;
  
  // Components
  export const BrowserRouter: ComponentType<{
    basename?: string;
    children?: ReactNode;
    window?: Window;
  }>;
  
  export const Routes: ComponentType<{
    children?: ReactNode;
    location?: Partial<Location> | string;
  }>;
  
  export const Route: ComponentType<{
    path?: string;
    element?: ReactNode;
    children?: ReactNode;
    index?: boolean;
    caseSensitive?: boolean;
    loader?: (...args: any[]) => any;
    action?: (...args: any[]) => any;
    errorElement?: ReactNode;
    shouldRevalidate?: (...args: any[]) => any;
    handle?: any;
    lazy?: () => Promise<any>;
  }>;
  
  export const Link: ComponentType<{
    to: string;
    replace?: boolean;
    state?: any;
    preventScrollReset?: boolean;
    relative?: 'route' | 'path';
    unstable_viewTransition?: boolean;
    children?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    [key: string]: any;
  }>;
  
  export const Navigate: ComponentType<{
    to: string;
    replace?: boolean;
    state?: any;
    relative?: 'route' | 'path';
  }>;
  
  export const Outlet: ComponentType<{
    context?: unknown;
  }>;
}