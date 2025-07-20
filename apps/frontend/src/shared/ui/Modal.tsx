/**
 * AI Foundations LMS - Modal Component
 * Accessible modal dialog with focus management and keyboard navigation
 */

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap, useScreenReaderAnnouncer } from '@shared/hooks/useAccessibility';
import Icon from '@shared/components/AppIcon';
import { cn } from '@shared/utils/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'danger' | 'success' | 'warning';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  initialFocus?: React.RefObject<HTMLElement>;
  finalFocus?: React.RefObject<HTMLElement>;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw] max-h-[95vh]',
};

const variantClasses = {
  default: 'border-border',
  danger: 'border-error',
  success: 'border-success',
  warning: 'border-warning',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  children,
  className,
  overlayClassName,
  contentClassName,
  initialFocus,
  finalFocus,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { announce } = useScreenReaderAnnouncer();
  
  // Set up focus trap
  const containerRef = useFocusTrap(isOpen, {
    restoreFocus: true,
    initialFocus: initialFocus?.current || undefined,
    finalFocus: finalFocus?.current || undefined,
  });

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Handle overlay click
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  // Announce modal opening/closing to screen readers
  useEffect(() => {
    if (isOpen) {
      announce(`Modal opened${title ? `: ${title}` : ''}`, 'polite');
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      announce('Modal closed', 'polite');
      // Restore body scroll
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, title, announce]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'animate-fade-in',
        overlayClassName
      )}
      style={{ backgroundColor: 'var(--backdrop)' }}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      <div
        ref={(node) => {
          if (node) {
            containerRef.current = node;
            modalRef.current = node;
          }
        }}
        className={cn(
          'relative w-full bg-surface rounded-xl shadow-xl border',
          'animate-scale-in overflow-hidden',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="min-w-0 flex-1">
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-text-primary truncate"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="modal-description"
                  className="mt-1 text-sm text-text-secondary"
                >
                  {description}
                </p>
              )}
            </div>
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className={cn(
                  'ml-4 p-2 rounded-lg transition-colors',
                  'hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-primary',
                  'touch-target'
                )}
                aria-label="Close modal"
                type="button"
              >
                <Icon name="X" size={20} aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={cn('p-6', contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );

  // Render in portal to ensure proper stacking
  return createPortal(modalContent, document.body);
};

/* ================================
   MODAL VARIANTS
   ================================ */

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'success' | 'warning';
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'default',
  isLoading = false,
}) => {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  const handleConfirm = () => {
    onConfirm();
    if (!isLoading) {
      onClose();
    }
  };

  const confirmButtonVariant = {
    default: 'bg-primary hover:bg-primary-600 text-white',
    danger: 'bg-error hover:bg-error-600 text-white',
    success: 'bg-success hover:bg-success-600 text-white',
    warning: 'bg-warning hover:bg-warning-600 text-white',
  }[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      variant={variant}
      initialFocus={confirmButtonRef}
      showCloseButton={false}
    >
      <div className="space-y-4">
        <p className="text-text-secondary">{message}</p>
        
        <div className="flex space-x-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg border',
              'border-border bg-surface text-text-primary',
              'hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'touch-target'
            )}
            type="button"
          >
            {cancelText}
          </button>
          
          <button
            ref={confirmButtonRef}
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'touch-target flex items-center space-x-2',
              confirmButtonVariant
            )}
            type="button"
          >
            {isLoading && (
              <Icon name="Loader" size={16} className="animate-spin" aria-hidden="true" />
            )}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

/* ================================
   MODAL HOOKS
   ================================ */

/**
 * Hook to manage modal state
 */
export const useModal = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = React.useState(initialState);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};

/**
 * Hook for confirm dialogs
 */
export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [config, setConfig] = React.useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'default' | 'danger' | 'success' | 'warning';
  } | null>(null);

  const confirm = React.useCallback((options: {
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'default' | 'danger' | 'success' | 'warning';
  }) => {
    setConfig(options);
    setIsOpen(true);
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
    setConfig(null);
  }, []);

  const ConfirmDialog = config ? (
    <ConfirmModal
      isOpen={isOpen}
      onClose={close}
      onConfirm={config.onConfirm}
      title={config.title}
      message={config.message}
      variant={config.variant}
    />
  ) : null;

  return {
    confirm,
    ConfirmDialog,
  };
};

export default Modal;