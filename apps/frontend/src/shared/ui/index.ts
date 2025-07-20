/**
 * AI Foundations LMS - UI Components Index
 * Centralized exports for all UI components
 */

// Core UI Components
export { default as Modal, ConfirmModal, useModal, useConfirmModal } from './Modal';
export type { ModalProps, ConfirmModalProps } from './Modal';

export { default as Dropdown, DropdownButton, useDropdown } from './Dropdown';
export type { DropdownProps, DropdownButtonProps, DropdownItem } from './Dropdown';

export { 
  default as Skeleton, 
  SkeletonAvatar, 
  SkeletonNav 
} from './SkeletonComponents';
export type { 
  SkeletonProps, 
  SkeletonAvatarProps, 
  SkeletonNavProps 
} from './SkeletonComponents';

// Theme Components
export { 
  default as ThemeToggle, 
  HeaderThemeToggle, 
  SettingsThemeToggle, 
  SidebarThemeToggle,
  ThemeStatusIndicator,
  ThemeTransition
} from './ThemeToggle';
export type { ThemeToggleProps, ThemeTransitionProps } from './ThemeToggle';

// Re-export theme hooks for convenience
export { 
  useTheme, 
  ThemeProvider,
  useThemeValue,
  useThemeClasses,
  usePrefersReducedMotion,
  usePrefersHighContrast,
  themeUtils
} from '../../hooks/useTheme';
export type { 
  Theme, 
  ResolvedTheme, 
  ThemeContextValue, 
  ThemeProviderProps 
} from '../../hooks/useTheme';

// Re-export accessibility hooks for convenience
export {
  useKeyboardNavigation,
  useRovingTabIndex,
  useFocusTrap,
  useFocusRestore,
  useScreenReaderAnnouncer,
  useSkipLinks,
  generateAccessibleId,
  isElementAccessible
} from '../../hooks/useAccessibility';
export type {
  KeyboardHandlers
} from '../../hooks/useAccessibility';