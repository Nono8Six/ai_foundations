import React from 'react';

function Image({ src, alt = 'Image Name', className = '', ...props }) {
  // Ensure src is a valid URL
  const getValidImageUrl = (url) => {
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
        console.log('Image load error for:', src);
        e.target.src = '/assets/images/no_image.png';
      }}
      {...props}
    />
  );
}

export default Image;