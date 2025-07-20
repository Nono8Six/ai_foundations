/**
 * AI Foundations LMS - Accessibility Hooks
 * Comprehensive accessibility utilities for keyboard navigation and focus management
 */

import { useEffect, useRef, useCallback, MutableRefObject } from 'react';

/* ================================
   KEYBOARD NAVIGATION HOOKS
   ================================ */

export interface KeyboardHandlers {
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onEnter?: () => void;
  onEscape?: () => void;
  onSpace?: () => void;
  onHome?: () => void;
  onEnd?: () => void;
  onTab?: () => void;
  onShiftTab?: () => void;
}

/**
 * Hook for keyboard navigation in sidebar and menus
 * Implements ARIA keyboard navigation patterns
 */
export const useKeyboardNavigation = (
  handlers: KeyboardHandlers,
  options: {
    enabled?: boolean;
    preventDefault?: boolean;
    stopPropagation?: boolean;
  } = {}
) => {
  const { enabled = true, preventDefault = true, stopPropagation = false } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const { key, shiftKey, metaKey, ctrlKey } = event;
      
      // Don't interfere with system shortcuts
      if (metaKey || ctrlKey) return;

      let handled = false;

      switch (key) {
        case 'ArrowUp':
          handlers.onArrowUp?.();
          handled = true;
          break;
        case 'ArrowDown':
          handlers.onArrowDown?.();
          handled = true;
          break;
        case 'ArrowLeft':
          handlers.onArrowLeft?.();
          handled = true;
          break;
        case 'ArrowRight':
          handlers.onArrowRight?.();
          handled = true;
          break;
        case 'Enter':
          handlers.onEnter?.();
          handled = true;
          break;
        case 'Escape':
          handlers.onEscape?.();
          handled = true;
          break;
        case ' ':
          handlers.onSpace?.();
          handled = true;
          break;
        case 'Home':
          handlers.onHome?.();
          handled = true;
          break;
        case 'End':
          handlers.onEnd?.();
          handled = true;
          break;
        case 'Tab':
          if (shiftKey) {
            handlers.onShiftTab?.();
          } else {
            handlers.onTab?.();
          }
          break;
      }

      if (handled && preventDefault) {
        event.preventDefault();
      }
      
      if (handled && stopPropagation) {
        event.stopPropagation();
      }
    },
    [handlers, enabled, preventDefault, stopPropagation]
  );

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, enabled]);
};

/**
 * Hook for roving tabindex navigation in lists and menus
 * Implements ARIA authoring practices for composite widgets
 */
export const useRovingTabIndex = <T extends HTMLElement,>(
  itemsLength: number,
  options: {
    enabled?: boolean;
    loop?: boolean;
    orientation?: 'horizontal' | 'vertical';
    defaultIndex?: number;
  } = {}
) => {
  const { enabled = true, loop = true, orientation = 'vertical', defaultIndex = 0 } = options;
  const currentIndex = useRef(defaultIndex);
  const itemRefs = useRef<(T | null)[]>([]);

  const setItemRef = useCallback((index: number) => (ref: T | null) => {
    itemRefs.current[index] = ref;
  }, []);

  const focusItem = useCallback((index: number) => {
    if (index >= 0 && index < itemsLength) {
      currentIndex.current = index;
      itemRefs.current[index]?.focus();
    }
  }, [itemsLength]);

  const moveNext = useCallback(() => {
    let nextIndex = currentIndex.current + 1;
    if (nextIndex >= itemsLength) {
      nextIndex = loop ? 0 : itemsLength - 1;
    }
    focusItem(nextIndex);
  }, [focusItem, itemsLength, loop]);

  const movePrevious = useCallback(() => {
    let prevIndex = currentIndex.current - 1;
    if (prevIndex < 0) {
      prevIndex = loop ? itemsLength - 1 : 0;
    }
    focusItem(prevIndex);
  }, [focusItem, itemsLength, loop]);

  const moveFirst = useCallback(() => {
    focusItem(0);
  }, [focusItem]);

  const moveLast = useCallback(() => {
    focusItem(itemsLength - 1);
  }, [focusItem, itemsLength]);

  const keyboardHandlers: KeyboardHandlers = {
    onArrowUp: orientation === 'vertical' ? movePrevious : undefined,
    onArrowDown: orientation === 'vertical' ? moveNext : undefined,
    onArrowLeft: orientation === 'horizontal' ? movePrevious : undefined,
    onArrowRight: orientation === 'horizontal' ? moveNext : undefined,
    onHome: moveFirst,
    onEnd: moveLast,
  };

  useKeyboardNavigation(keyboardHandlers, { enabled });

  return {
    currentIndex: currentIndex.current,
    setItemRef,
    focusItem,
    moveNext,
    movePrevious,
    moveFirst,
    moveLast,
  };
};

/* ================================
   FOCUS MANAGEMENT HOOKS
   ================================ */

/**
 * Hook to trap focus within a container (modals, dropdowns, etc.)
 * Implements WCAG focus management patterns
 */
export const useFocusTrap = (
  active: boolean,
  options: {
    restoreFocus?: boolean;
    initialFocus?: HTMLElement | null;
    finalFocus?: HTMLElement | null;
  } = {}
) => {
  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const { restoreFocus = true, initialFocus, finalFocus } = options;

  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]',
      'audio[controls]',
      'video[controls]',
      'iframe',
      'embed',
      'object',
      'area[href]',
    ].join(',');

    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
    ).filter((element) => {
      // Check if element is actually focusable
      const style = window.getComputedStyle(element);
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        !element.hasAttribute('disabled') &&
        element.tabIndex !== -1
      );
    });
  }, []);

  const handleTabKey = useCallback(
    (event: KeyboardEvent) => {
      if (!active || event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab: moving backwards
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: moving forwards
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    },
    [active, getFocusableElements]
  );

  useEffect(() => {
    if (active) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Focus initial element
      const focusableElements = getFocusableElements();
      const elementToFocus = initialFocus || focusableElements[0];
      
      if (elementToFocus) {
        // Delay focus to ensure the element is rendered
        setTimeout(() => elementToFocus.focus(), 0);
      }

      // Add event listener for tab trapping
      document.addEventListener('keydown', handleTabKey);

      return () => {
        document.removeEventListener('keydown', handleTabKey);

        // Restore focus to previous element
        if (restoreFocus && previousActiveElement.current) {
          const elementToRestore = finalFocus || previousActiveElement.current;
          setTimeout(() => elementToRestore.focus(), 0);
        }
      };
    }
  }, [active, handleTabKey, getFocusableElements, initialFocus, finalFocus, restoreFocus]);

  return containerRef;
};

/**
 * Hook to manage focus restoration when component unmounts
 */
export const useFocusRestore = () => {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousActiveElement.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      restoreFocus();
    };
  }, [restoreFocus]);

  return { saveFocus, restoreFocus };
};

/* ================================
   ANNOUNCE HOOKS
   ================================ */

/**
 * Hook to announce messages to screen readers
 * Uses aria-live regions for polite or assertive announcements
 */
export const useScreenReaderAnnouncer = () => {
  const politeRegionRef = useRef<HTMLDivElement | null>(null);
  const assertiveRegionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create aria-live regions if they don't exist
    if (!politeRegionRef.current) {
      const politeRegion = document.createElement('div');
      politeRegion.setAttribute('aria-live', 'polite');
      politeRegion.setAttribute('aria-atomic', 'true');
      politeRegion.className = 'sr-only';
      document.body.appendChild(politeRegion);
      politeRegionRef.current = politeRegion;
    }

    if (!assertiveRegionRef.current) {
      const assertiveRegion = document.createElement('div');
      assertiveRegion.setAttribute('aria-live', 'assertive');
      assertiveRegion.setAttribute('aria-atomic', 'true');
      assertiveRegion.className = 'sr-only';
      document.body.appendChild(assertiveRegion);
      assertiveRegionRef.current = assertiveRegion;
    }

    return () => {
      // Cleanup on unmount
      if (politeRegionRef.current) {
        document.body.removeChild(politeRegionRef.current);
      }
      if (assertiveRegionRef.current) {
        document.body.removeChild(assertiveRegionRef.current);
      }
    };
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const region = priority === 'polite' ? politeRegionRef.current : assertiveRegionRef.current;
    
    if (region) {
      // Clear previous message
      region.textContent = '';
      
      // Add new message after a brief delay to ensure it's announced
      setTimeout(() => {
        region.textContent = message;
      }, 100);
    }
  }, []);

  return { announce };
};

/* ================================
   SKIP LINKS HOOK
   ================================ */

/**
 * Hook to manage skip links for keyboard navigation
 */
export const useSkipLinks = (links: Array<{ id: string; label: string }>) => {
  const skipLinkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSkipLinkClick = (event: Event) => {
      const target = event.target as HTMLAnchorElement;
      const targetId = target.getAttribute('href')?.substring(1);
      
      if (targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          event.preventDefault();
          targetElement.focus();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    if (skipLinkRef.current) {
      skipLinkRef.current.addEventListener('click', handleSkipLinkClick);
    }

    return () => {
      if (skipLinkRef.current) {
        skipLinkRef.current.removeEventListener('click', handleSkipLinkClick);
      }
    };
  }, []);

  const SkipLinks = () => (
    <div
      ref={skipLinkRef}
      className="absolute top-0 left-0 z-[100] bg-surface border border-border rounded-md shadow-lg p-2 -translate-y-full focus-within:translate-y-0 transition-transform"
      role="navigation"
      aria-label="Skip links"
    >
      {links.map((link) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          className="block px-3 py-2 text-sm font-medium text-primary hover:bg-primary-50 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {link.label}
        </a>
      ))}
    </div>
  );

  return { SkipLinks };
};

/* ================================
   ACCESSIBILITY UTILITIES
   ================================ */

/**
 * Utility to check if an element is visible to screen readers
 */
export const isElementAccessible = (element: HTMLElement): boolean => {
  const style = window.getComputedStyle(element);
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    !element.hasAttribute('aria-hidden') &&
    element.getAttribute('aria-hidden') !== 'true'
  );
};

/**
 * Utility to generate unique IDs for accessibility
 */
let idCounter = 0;
export const generateAccessibleId = (prefix: string = 'accessible'): string => {
  return `${prefix}-${++idCounter}`;
};