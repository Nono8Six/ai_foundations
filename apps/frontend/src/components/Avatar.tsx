import React from 'react';
import { Avatar as AvatarRoot, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export interface UserAvatarProps {
  src?: string | null;
  name?: string;
  size?: number;
}

const getInitials = (name?: string): string => {
  if (!name) return '';
  const [first = '', last = ''] = name.split(' ');
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
};

const Avatar: React.FC<UserAvatarProps> = ({ src, name, size = 40 }) => {
  return (
    <AvatarRoot
      style={{ width: size, height: size }}
      className='rounded-full bg-gradient-to-br from-primary to-primary-700 text-white flex items-center justify-center'
    >
      {src ? (
        <AvatarImage src={src} alt={`Avatar de ${name ?? 'utilisateur'}`} />
      ) : (
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      )}
    </AvatarRoot>
  );
};

export default Avatar;
