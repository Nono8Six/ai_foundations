import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`bg-surface rounded-lg shadow-medium border border-border ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
