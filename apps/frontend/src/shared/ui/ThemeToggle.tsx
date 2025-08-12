/**
 * AI Foundations LMS - Theme Toggle Component
 * Accessible theme switcher with smooth animations
 */

import React, { useRef } from 'react';
import { useTheme } from '@shared/hooks/useTheme';
import { useScreenReaderAnnouncer } from '@shared/hooks/useAccessibility';
import { Dropdown, DropdownItem } from './Dropdown';
import Icon from '@shared/components/AppIcon';
import { cn } from '@shared/utils/utils';

export interface ThemeToggleProps {
  variant?: 'button' | 'dropdown' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'button',
  size = 'md',
  showLabel = true,
  className,
}) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const { announce } = useScreenReaderAnnouncer();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
  };

  const getThemeIcon = (themeType: string) => {
    switch (themeType) {
      case 'light':
        return 'Sun';
      case 'dark':
        return 'Moon';
      case 'system':
        return 'Monitor';
      default:
        return 'Sun';
    }
  };

  const getThemeLabel = (themeType: string) => {
    switch (themeType) {
      case 'light':
        return 'Thème clair';
      case 'dark':
        return 'Thème sombre';
      case 'system':
        return 'Thème système';
      default:
        return 'Thème clair';
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    announce(`Thème changé vers ${getThemeLabel(newTheme)}`, 'polite');
  };

  // Simple toggle button variant
  if (variant === 'icon') {
    return (
      <button
        ref={buttonRef}
        onClick={toggleTheme}
        className={cn(
          'inline-flex items-center justify-center rounded-lg border border-border',
          'bg-surface hover:bg-surface-hover transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          'touch-target',
          sizeClasses[size],
          className
        )}
        aria-label={`Basculer vers ${resolvedTheme === 'dark' ? 'thème clair' : 'thème sombre'}`}
        title={`Basculer vers ${resolvedTheme === 'dark' ? 'thème clair' : 'thème sombre'}`}
      >
        <Icon
          name={getThemeIcon(resolvedTheme)}
          size={size === 'sm' ? 16 : size === 'md' ? 20 : 24}
          className="transition-transform duration-200 hover:scale-110"
          aria-hidden="true"
        />
      </button>
    );
  }

  // Button with label variant
  if (variant === 'button') {
    return (
      <button
        ref={buttonRef}
        onClick={toggleTheme}
        className={cn(
          'inline-flex items-center space-x-2 px-3 py-2 rounded-lg border border-border',
          'bg-surface hover:bg-surface-hover transition-colors text-sm font-medium',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          'text-text-primary touch-target',
          className
        )}
        aria-label={`Thème actuel: ${getThemeLabel(theme)}. Cliquer pour changer.`}
      >
        <Icon
          name={getThemeIcon(resolvedTheme)}
          size={16}
          className="transition-transform duration-200"
          aria-hidden="true"
        />
        {showLabel && (
          <span className="hidden sm:inline">{getThemeLabel(theme)}</span>
        )}
      </button>
    );
  }

  // Dropdown variant with all options
  const dropdownItems: DropdownItem[] = [
    {
      id: 'light',
      label: 'Thème clair',
      icon: 'Sun',
      onClick: () => handleThemeChange('light'),
    },
    {
      id: 'dark',
      label: 'Thème sombre',
      icon: 'Moon',
      onClick: () => handleThemeChange('dark'),
    },
    {
      id: 'system',
      label: 'Thème système',
      icon: 'Monitor',
      description: 'Suit les préférences du système',
      onClick: () => handleThemeChange('system'),
    },
  ];

  const trigger = (
    <button
      className={cn(
        'inline-flex items-center space-x-2 px-3 py-2 rounded-lg border border-border',
        'bg-surface hover:bg-surface-hover transition-colors text-sm font-medium',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        'text-text-primary touch-target',
        className
      )}
      aria-label={`Thème actuel: ${getThemeLabel(theme)}. Cliquer pour changer.`}
    >
      <Icon
        name={getThemeIcon(resolvedTheme)}
        size={16}
        className="transition-transform duration-200"
        aria-hidden="true"
      />
      {showLabel && (
        <>
          <span className="hidden sm:inline">{getThemeLabel(theme)}</span>
          <Icon
            name="ChevronDown"
            size={14}
            className="transition-transform duration-200"
            aria-hidden="true"
          />
        </>
      )}
    </button>
  );

  return (
    <Dropdown
      trigger={trigger}
      items={dropdownItems}
      placement="bottom-end"
      className={className || ''}
    />
  );
};

/* ================================
   THEME TOGGLE VARIANTS
   ================================ */

/**
 * Minimal theme toggle for header/toolbar
 */
export const HeaderThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <ThemeToggle
      variant="icon"
      size="md"
      className={className || ''}
    />
  );
};

/**
 * Theme toggle with full labels for settings page
 */
export const SettingsThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <ThemeToggle
      variant="dropdown"
      size="md"
      showLabel={true}
      className={className || ''}
    />
  );
};

/**
 * Compact theme toggle for sidebar
 */
export const SidebarThemeToggle: React.FC<{ 
  collapsed?: boolean; 
  className?: string; 
}> = ({ collapsed = false, className }) => {
  if (collapsed) {
    return (
      <ThemeToggle
        variant="icon"
        size="sm"
        className={className || ''}
      />
    );
  }

  return (
    <ThemeToggle
      variant="button"
      size="sm"
      showLabel={true}
      className={className || ''}
    />
  );
};

/* ================================
   THEME STATUS INDICATOR
   ================================ */

/**
 * Visual indicator of current theme (for debugging/status)
 */
export const ThemeStatusIndicator: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, resolvedTheme, systemTheme } = useTheme();

  return (
    <div className={cn('text-xs text-text-tertiary font-mono', className)}>
      <div>Theme: {theme}</div>
      <div>Resolved: {resolvedTheme}</div>
      <div>System: {systemTheme}</div>
    </div>
  );
};

/* ================================
   THEME TRANSITION WRAPPER
   ================================ */

/**
 * Wrapper that adds smooth transitions for theme changes
 */
export interface ThemeTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const ThemeTransition: React.FC<ThemeTransitionProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div
      className={cn(
        'transition-colors duration-200 ease-out',
        className
      )}
      style={{
        colorScheme: 'light dark', // Enables browser native dark mode styles
      }}
    >
      {children}
    </div>
  );
};

export default ThemeToggle;