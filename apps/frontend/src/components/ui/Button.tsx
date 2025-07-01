// apps/frontend/src/components/ui/Button.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import type { Polymorphic } from '@/types/polymorphic';

export type ButtonProps<C extends React.ElementType> = Polymorphic<C, {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}>;

const Button = React.forwardRef(
  <C extends React.ElementType = 'button'>(
    {
      as,
      variant = 'primary',
      size = 'md',
      className = '',
      children,
      ...props
    }: ButtonProps<C>,
    ref: React.ComponentPropsWithRef<C>['ref']
  ) => {
    const Component = (as ?? 'button') as React.ElementType;

    const base =
      'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses: Record<ButtonProps<C>['variant'], string> = {
      primary: 'bg-primary text-white hover:bg-primary-700',
      secondary: 'bg-secondary text-white hover:bg-secondary-700',
      outline: 'border border-border bg-surface text-text-primary hover:bg-secondary-50',
      danger: 'bg-error text-white hover:bg-error-600',
    };

    const sizeClasses: Record<ButtonProps<C>['size'], string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    const variantClass = variantClasses[variant];
    const sizeClass = sizeClasses[size];

    return (
      <Component
        ref={ref}
        className={cn(base, variantClass, sizeClass, className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Button.displayName = 'Button';

export default Button;
