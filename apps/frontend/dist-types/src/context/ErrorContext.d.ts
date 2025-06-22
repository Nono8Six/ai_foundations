import React, { type ReactNode } from 'react';
export type ErrorLogger = (error: unknown) => void;
declare const ErrorContext: React.Context<ErrorLogger>;
export interface ErrorProviderProps {
    children: ReactNode;
    logger?: ErrorLogger;
}
export declare const ErrorProvider: ({ children, logger }: ErrorProviderProps) => import("react/jsx-runtime").JSX.Element;
export declare const useErrorLogger: () => ErrorLogger;
export declare const logError: (error: unknown) => void;
export default ErrorContext;
