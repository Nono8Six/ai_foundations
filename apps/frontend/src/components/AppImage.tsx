import React from 'react';
import { log } from '@/logger';

export interface AppImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  className?: string;
}

const Image: React.FC<AppImageProps> = ({ src, alt = 'Image Name', className = '', ...props }) => {
  // Ensure src is a valid URL
  const getValidImageUrl = (url: string | undefined) => {
    if (!url) return '/assets/images/no_image.png';

    if (url.startsWith('/')) return url;

    // Return if the url is absolute (http/https) or a data URI
    if (/^(https?:|data:)/.test(url)) return url;

    return '/assets/images/no_image.png';
  };

  return (
    <img
      src={getValidImageUrl(src)}
      alt={alt}
      className={className}
      onError={e => {
        log.warn('Image load error for:', src);
        (e.target as HTMLImageElement).src = '/assets/images/no_image.png';
      }}
      {...props}
    />
  );
};

export default Image;
