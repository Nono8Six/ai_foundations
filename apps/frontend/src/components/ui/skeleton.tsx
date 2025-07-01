import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export type Props = SkeletonProps;

const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return <div className={cn('animate-pulse bg-gray-200', className)} {...props} />;
};
Skeleton.displayName = 'Skeleton';

export { Skeleton };
