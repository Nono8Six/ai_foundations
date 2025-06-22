import React from 'react';
export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: number;
    className?: string;
}
declare const Spinner: React.FC<SpinnerProps>;
export default Spinner;
