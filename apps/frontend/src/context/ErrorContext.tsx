import React, { createContext, useContext, type ReactNode } from 'react';
import { log } from '@/logger';

export type ErrorLogger = (error: unknown) => void;

const ErrorContext = createContext<ErrorLogger>(() => {});

let externalLogger: ErrorLogger = log.error;

export interface ErrorProviderProps {
  children: ReactNode;
  logger?: ErrorLogger;
}

export const ErrorProvider = ({ children, logger = log.error }: ErrorProviderProps) => {
  externalLogger = logger;
  return <ErrorContext.Provider value={logger}>{children}</ErrorContext.Provider>;
};

export const useErrorLogger = (): ErrorLogger => useContext(ErrorContext);

export const logError = (error: unknown): void => {
  externalLogger(error);
};

export default ErrorContext;
