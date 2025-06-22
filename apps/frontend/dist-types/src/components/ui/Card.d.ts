import React from 'react';
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children?: React.ReactNode;
}
declare const Card: React.FC<CardProps>;
export default Card;
