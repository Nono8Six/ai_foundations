/**
 * AI Foundations LMS - Dropdown Component
 * Accessible dropdown menu with keyboard navigation and positioning
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useKeyboardNavigation, useRovingTabIndex, generateAccessibleId } from '@frontend/hooks/useAccessibility';
import Icon, { IconName } from '@frontend/components/AppIcon';
import { cn } from '@frontend/lib/utils';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: IconName;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
  description?: string;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'right-start' | 'left-start';
  offset?: number;
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
  onOpenChange?: (open: boolean) => void;
  closeOnItemClick?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  placement = 'bottom-start',
  offset = 8,
  disabled = false,
  className,
  menuClassName,
  onOpenChange,
  closeOnItemClick = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useRef(generateAccessibleId('dropdown-menu')).current;
  
  const visibleItems = items.filter(item => !item.separator);
  const {
    currentIndex,
    setItemRef,
    focusItem,
    moveNext,
    movePrevious,
    moveFirst,
    moveLast,
  } = useRovingTabIndex<HTMLButtonElement>(visibleItems.length, {
    enabled: isOpen,
    defaultIndex: 0,
  });

  // Calculate menu position
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !isOpen) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const menuWidth = 256; // Approximate menu width
    const menuHeight = items.length * 40; // Approximate item height

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'bottom-start':
        top = triggerRect.bottom + offset;
        left = triggerRect.left;
        break;
      case 'bottom-end':
        top = triggerRect.bottom + offset;
        left = triggerRect.right - menuWidth;
        break;
      case 'top-start':
        top = triggerRect.top - menuHeight - offset;
        left = triggerRect.left;
        break;
      case 'top-end':
        top = triggerRect.top - menuHeight - offset;
        left = triggerRect.right - menuWidth;
        break;
      case 'right-start':
        top = triggerRect.top;
        left = triggerRect.right + offset;
        break;
      case 'left-start':
        top = triggerRect.top;
        left = triggerRect.left - menuWidth - offset;
        break;
    }

    // Adjust for viewport boundaries
    if (left + menuWidth > viewportWidth) {
      left = viewportWidth - menuWidth - 16;
    }
    if (left < 16) {
      left = 16;
    }
    if (top + menuHeight > viewportHeight) {
      top = triggerRect.top - menuHeight - offset;
    }
    if (top < 16) {
      top = 16;
    }

    setPosition({ top, left });
  }, [isOpen, placement, offset, items.length]);

  // Handle open/close
  const handleToggle = () => {
    if (disabled) return;
    const newOpen = !isOpen;
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onOpenChange?.(false);
    triggerRef.current?.focus();
  }, [onOpenChange]);

  // Handle item selection
  const handleItemClick = (item: DropdownItem): void => {
    if (item.disabled) {
      return; // Ne rien faire si l'élément est désactivé
    }
    
    // Appeler le gestionnaire d'événement de l'élément s'il existe
    if (item.onClick) {
      item.onClick();
    }
    
    // Fermer le menu si nécessaire
    if (closeOnItemClick) {
      handleClose();
    }
    
    // Si l'élément a un href, la navigation sera gérée par le navigateur
  };

  const handleItemKeyDown = (event: React.KeyboardEvent, item: DropdownItem): void => {
    // Ne traiter que les touches Entrée et Espace
    if (event.key !== 'Enter' && event.key !== ' ') {
      return; // Sortir si ce n'est pas une touche d'activation
    }
    
    event.preventDefault();
    event.stopPropagation();
    handleItemClick(item);
  };

  // Keyboard navigation
  useKeyboardNavigation({
    onEscape: handleClose,
    onArrowUp: movePrevious,
    onArrowDown: moveNext,
    onHome: moveFirst,
    onEnd: moveLast,
    onEnter: () => {
      const item = visibleItems[currentIndex];
      if (item) handleItemClick(item);
    },
  }, { enabled: isOpen });

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        menuRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !menuRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, handleClose]);

  // Update position when menu opens or window resizes
  useEffect(() => {
    if (!isOpen) {
      return undefined; // Retourner explicitement undefined si le menu n'est pas ouvert
    }
    
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen, updatePosition]);

  // Focus first item when menu opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => focusItem(0), 0);
    }
  }, [isOpen, focusItem]);

  const renderMenu = (): React.ReactPortal | null => {
    if (!isOpen) return null;

    let visibleItemIndex = 0;

    const menuContent = (
      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-labelledby="dropdown-trigger"
        className={cn(
          'fixed z-50 min-w-[16rem] bg-surface border border-border rounded-lg shadow-lg',
          'animate-scale-in py-1',
          menuClassName
        )}
        style={{
          top: position.top,
          left: position.left,
        }}
      >
        {items.map((item) => {
          if (item.separator) {
            return (
              <div
                key={item.id}
                role="separator"
                className="my-1 border-t border-border"
                aria-hidden="true"
              />
            );
          }

          const itemRef = setItemRef(visibleItemIndex);
          const isCurrentItem = visibleItemIndex === currentIndex;
          visibleItemIndex++;

          return (
            <button
              key={item.id}
              ref={itemRef}
              role="menuitem"
              disabled={item.disabled}
              tabIndex={isCurrentItem ? 0 : -1}
              className={cn(
                'w-full flex items-center px-3 py-2 text-sm text-left',
                'hover:bg-surface-hover focus:bg-surface-hover focus:outline-none',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'touch-target transition-colors',
                item.danger && 'text-error hover:bg-error-50 focus:bg-error-50',
                isCurrentItem && 'bg-surface-hover'
              )}
              onClick={() => handleItemClick(item)}
              onKeyDown={(e) => handleItemKeyDown(e, item)}
            >
              {item.icon && (
                <Icon
                  name={item.icon}
                  size={16}
                  className="mr-3 flex-shrink-0"
                  aria-hidden="true"
                />
              )}
              
              <div className="flex-1 min-w-0">
                <div className="font-medium">{item.label}</div>
                {item.description && (
                  <div className="text-xs text-text-tertiary mt-0.5">
                    {item.description}
                  </div>
                )}
              </div>

              {item.href && (
                <Icon
                  name="ExternalLink"
                  size={14}
                  className="ml-2 flex-shrink-0 text-text-tertiary"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    );

    return createPortal(menuContent, document.body);
  };

  // Gestion améliorée du clic pour le trigger
  const enhancedTrigger = React.cloneElement(trigger as React.ReactElement, {
    ref: (node: HTMLElement | null) => {
      // Stocker la référence au nœud DOM
      if (node) {
        (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    id: 'dropdown-trigger',
    'aria-haspopup': 'menu',
    'aria-expanded': isOpen,
    'aria-controls': isOpen ? menuId : undefined,
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleToggle();
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleToggle();
      }
    },
    tabIndex: 0,
    role: 'button',
    'data-dropdown-trigger': 'true',
    ...(disabled ? { 'aria-disabled': true } : {})
  });

  return (
    <div 
      className={cn('relative inline-block', className)}
      onClick={(e) => e.stopPropagation()}
    >
      {enhancedTrigger}
      {renderMenu()}
    </div>
  );
};

/* ================================
   DROPDOWN VARIANTS
   ================================ */

export interface DropdownButtonProps extends Omit<DropdownProps, 'trigger'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconName;
  showChevron?: boolean;
}

export const DropdownButton: React.FC<DropdownButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  showChevron = true,
  className,
  ...dropdownProps
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-600 focus:ring-primary',
    secondary: 'bg-surface border border-border text-text-primary hover:bg-surface-hover focus:ring-primary',
    ghost: 'text-text-primary hover:bg-surface-hover focus:ring-primary',
  };

  const trigger = (
    <button
      className={cn(
        'inline-flex items-center rounded-lg font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'touch-target',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {icon && (
        <Icon name={icon} size={16} className="mr-2" aria-hidden="true" />
      )}
      
      <span>{children}</span>
      
      {showChevron && (
        <Icon
          name="ChevronDown"
          size={16}
          className="ml-2 transition-transform ui-open:rotate-180"
          aria-hidden="true"
        />
      )}
    </button>
  );

  return <Dropdown trigger={trigger} {...dropdownProps} />;
};

/* ================================
   DROPDOWN HOOKS
   ================================ */

/**
 * Hook to manage dropdown state
 */
export const useDropdown = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    onOpenChange: setIsOpen,
  };
};

export default Dropdown;