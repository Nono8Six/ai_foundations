/**
 * AI Foundations LMS - Theme Management Hook
 * Comprehensive theme system with localStorage persistence and system preference detection
 */

import { useEffect, useState, useCallback, useContext, createContext, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  systemTheme: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = 'ai-foundations-theme';
const THEME_ATTRIBUTE = 'data-theme';

/**
 * Detect system theme preference
 */
const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') return 'light';
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * Get stored theme preference or default to system
 */
const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'system';
  
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      return stored as Theme;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }
  
  return 'system';
};

/**
 * Store theme preference
 */
const storeTheme = (theme: Theme): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Failed to store theme in localStorage:', error);
  }
};

/**
 * Apply theme to document
 */
const applyTheme = (resolvedTheme: ResolvedTheme): void => {
  if (typeof document === 'undefined') return;
  
  document.documentElement.setAttribute(THEME_ATTRIBUTE, resolvedTheme);
  
  // Also set a class for compatibility with other libraries
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(resolvedTheme);
  
  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    const color = resolvedTheme === 'dark' ? '#0f172a' : '#ffffff'; // slate-900 : white
    metaThemeColor.setAttribute('content', color);
  }
};

/**
 * Theme Provider Component
 */
export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  storageKey?: string;
}

export const ThemeProvider = ({
  children,
  defaultTheme = 'system',
  enableSystem = true,
}) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  // Initialize theme from storage and system
  useEffect(() => {
    const storedTheme = getStoredTheme();
    const currentSystemTheme = getSystemTheme();
    
    setTheme(storedTheme);
    setSystemTheme(currentSystemTheme);
    
    const resolved = storedTheme === 'system' ? currentSystemTheme : storedTheme as ResolvedTheme;
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);
      
      // If current theme is 'system', update resolved theme
      if (theme === 'system') {
        setResolvedTheme(newSystemTheme);
        applyTheme(newSystemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, enableSystem]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    storeTheme(newTheme);
    
    const resolved = newTheme === 'system' ? systemTheme : newTheme as ResolvedTheme;
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, [systemTheme]);

  const toggleTheme = useCallback(() => {
    if (theme === 'system') {
      // If system, toggle to opposite of current system theme
      setTheme(systemTheme === 'dark' ? 'light' : 'dark');
    } else {
      // Toggle between light and dark
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  }, [theme, systemTheme, setTheme]);

  const value: ThemeContextValue = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    systemTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use theme context
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

/**
 * Hook for theme-aware media queries
 */
export const useThemeAwareMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};

/**
 * Hook to detect if user prefers reduced motion
 */
export const usePrefersReducedMotion = (): boolean => {
  return useThemeAwareMediaQuery('(prefers-reduced-motion: reduce)');
};

/**
 * Hook to detect if user prefers high contrast
 */
export const usePrefersHighContrast = (): boolean => {
  return useThemeAwareMediaQuery('(prefers-contrast: high)');
};

/**
 * Hook to get theme-specific values
 */
export const useThemeValue = <T,>(lightValue: T, darkValue: T): T => {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark' ? darkValue : lightValue;
};

/**
 * Hook to apply theme classes conditionally
 */
export const useThemeClasses = (lightClasses: string, darkClasses: string): string => {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark' ? darkClasses : lightClasses;
};

/* ================================
   THEME UTILITIES
   ================================ */

/**
 * Get CSS custom property value for current theme
 */
export const getThemeValue = (property: string): string => {
  if (typeof document === 'undefined') return '';
  
  return getComputedStyle(document.documentElement).getPropertyValue(property);
};

/**
 * Check if dark mode is currently active
 */
export const isDarkMode = (): boolean => {
  if (typeof document === 'undefined') return false;
  
  return document.documentElement.getAttribute(THEME_ATTRIBUTE) === 'dark';
};

/**
 * Programmatically trigger theme transition animation
 */
export const animateThemeTransition = (callback: () => void): void => {
  if (typeof document === 'undefined') {
    callback();
    return;
  }

  // Disable transitions temporarily
  const style = document.createElement('style');
  style.textContent = `
    *, *::before, *::after {
      transition: none !important;
      animation: none !important;
    }
  `;
  document.head.appendChild(style);

  // Apply theme change
  callback();

  // Re-enable transitions after a brief delay
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.head.removeChild(style);
    });
  });
};

/* ================================
   THEME DETECTION UTILITIES
   ================================ */

/**
 * Detect if device supports dark mode
 */
export const supportsDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-color-scheme: dark)').media !== 'not all';
};

/**
 * Get current system theme without hook
 */
export const getCurrentSystemTheme = (): ResolvedTheme => {
  return getSystemTheme();
};

/**
 * Export for external library compatibility
 */
export const themeUtils = {
  getThemeValue,
  isDarkMode,
  animateThemeTransition,
  supportsDarkMode,
  getCurrentSystemTheme,
};