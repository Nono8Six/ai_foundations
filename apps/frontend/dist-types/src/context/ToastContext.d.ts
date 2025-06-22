import { type ReactNode } from 'react';
export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error';
}
export interface ToastContextValue {
    addToast: (message: string, type?: Toast['type']) => void;
}
export declare const ToastProvider: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useToast: () => ToastContextValue;
