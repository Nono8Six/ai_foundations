/**
 * AI Foundations LMS - Layout Components Index
 * Centralized exports for all layout components
 */

// Main Layout Components
export { default as TopHeader } from './TopHeader';
export type { TopHeaderProps } from './TopHeader';

// Re-export UI components for convenience
export {
  ThemeProvider,
  useTheme,
  Modal,
  Dropdown,
  Skeleton,
  HeaderThemeToggle,
  SidebarThemeToggle,
} from '../ui';

// Re-export accessibility hooks
export {
  useKeyboardNavigation,
  useFocusTrap,
  useScreenReaderAnnouncer,
} from '../../hooks/useAccessibility';