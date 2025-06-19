import React from 'react';

export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`bg-surface rounded-lg shadow-medium border border-border ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
