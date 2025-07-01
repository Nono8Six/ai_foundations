import React from 'react';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  className?: string;
}

export type Props = SpinnerProps;

const Spinner: React.FC<SpinnerProps> = ({ size = 16, className = '', ...props }) => {
  const style = { width: size, height: size };
  return (
    <div
      aria-hidden='true'
      className={`animate-spin rounded-full border-b-2 border-current ${className}`}
      style={style}
      {...props}
    />
  );
};

export default Spinner;
