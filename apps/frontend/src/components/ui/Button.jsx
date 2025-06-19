import React from 'react';

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-700',
    secondary: 'bg-secondary text-white hover:bg-secondary-700',
    outline:
      'border border-border bg-surface text-text-primary hover:bg-secondary-50',
    danger: 'bg-error text-white hover:bg-error-600',
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantClass = variantClasses[variant] || variant;
  const sizeClass = sizeClasses[size] || size;

  return (
    <button className={`${base} ${variantClass} ${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
