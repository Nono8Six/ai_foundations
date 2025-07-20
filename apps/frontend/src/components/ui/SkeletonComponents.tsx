/**
 * AI Foundations LMS - Skeleton Component
 * Loading skeleton components with smooth animations
 */

import React from 'react';
import { cn } from '@frontend/lib/utils';

export interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'circular' | 'rounded' | 'text';
  width?: string | number;
  height?: string | number;
  lines?: number;
  animate?: boolean;
  children?: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'default',
  width,
  height,
  lines = 1,
  animate = true,
  children,
}) => {
  const baseClasses = cn(
    'bg-surface-hover',
    animate && 'animate-pulse',
    variant === 'circular' && 'rounded-full',
    variant === 'rounded' && 'rounded-lg',
    variant === 'text' && 'rounded h-4',
    variant === 'default' && 'rounded'
  );

  const style = {
    width: width,
    height: height,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              index === lines - 1 && 'w-3/4'
            )}
            style={{
              width: index === lines - 1 ? '75%' : width,
              height: height || '1rem',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn(baseClasses, className)} style={style}>
      {children}
    </div>
  );
};

export interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <Skeleton
      variant="circular"
      className={cn(sizeClasses[size], className)}
    />
  );
};

export interface SkeletonNavProps {
  items?: number;
  hasIcons?: boolean;
  collapsed?: boolean;
  className?: string;
}

export const SkeletonNav: React.FC<SkeletonNavProps> = ({
  items = 5,
  hasIcons = true,
  collapsed = false,
  className,
}) => {
  return (
    <div className={cn('space-y-2 p-3', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 p-2">
          {hasIcons && (
            <Skeleton variant="rounded" className="w-5 h-5 flex-shrink-0" />
          )}
          
          {!collapsed && (
            <Skeleton variant="text" className="flex-1 h-4" />
          )}
        </div>
      ))}
    </div>
  );
};

export default Skeleton;