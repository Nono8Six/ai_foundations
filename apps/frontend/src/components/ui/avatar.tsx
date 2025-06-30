import React, { forwardRef } from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(({ className = '', ...props }, ref) => {
  return <div ref={ref} className={`relative flex overflow-hidden rounded-full ${className}`} {...props} />;
});
Avatar.displayName = 'Avatar';

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(({ className = '', ...props }, ref) => {
  return <img ref={ref} className={`object-cover w-full h-full ${className}`} {...props} />;
});
AvatarImage.displayName = 'AvatarImage';

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const AvatarFallback = forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`flex items-center justify-center w-full h-full ${className}`} {...props} />
    );
  }
);
AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };
