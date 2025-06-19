import React from 'react';

export default function Spinner({ size = 16, className = '' }) {
  const style = { width: size, height: size };
  return (
    <div
      aria-hidden='true'
      className={`animate-spin rounded-full border-b-2 border-current ${className}`}
      style={style}
    />
  );
}
