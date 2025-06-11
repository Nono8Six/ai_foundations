import React from 'react';

function Image({ src, alt = 'Image Name', className = '', ...props }) {
  // Ensure src is a valid URL
  const getValidImageUrl = (url) => {
    if (!url) return '/assets/images/no_image.png';
    
    // Check if it's a data URL (for file uploads)
    if (url.startsWith('data:')) return url;
    
    // Check if it's a relative path
    if (url.startsWith('/')) return url;
    
    // Check if it's already a valid URL with protocol
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    
    // If it's a URL without protocol, add https://
    if (url.includes('unsplash.com') || url.includes('pexels.com') || 
        url.includes('pixabay.com') || url.includes('ui-avatars.com')) {
      return `https://${url}`;
    }
    
    // Default fallback
    return '/assets/images/no_image.png';
  };

  return (
    <img
      src={getValidImageUrl(src)}
      alt={alt}
      className={className}
      onError={e => {
        console.log('Image load error for:', src);
        e.target.src = '/assets/images/no_image.png';
      }}
      {...props}
    />
  );
}

export default Image;