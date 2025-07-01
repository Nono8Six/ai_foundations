import { createContext, useContext, type ReactNode } from 'react';
import { log } from '@libs/logger';
import type { AppError } from '@frontend/types/app-error';

export type ErrorLogger = (error: AppError) => void;

const ErrorContext = createContext<ErrorLogger>(() => {});

// Wrapper pour adapter la signature de log.error au type ErrorLogger
const errorLogger: ErrorLogger = (error: AppError) => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  log.error(errorMessage);
};

let externalLogger: ErrorLogger = errorLogger;

export interface ErrorProviderProps {
  children: ReactNode;
  logger?: ErrorLogger;
}

export const ErrorProvider = ({ children, logger = errorLogger }: ErrorProviderProps) => {
  externalLogger = logger;
  return <ErrorContext.Provider value={logger}>{children}</ErrorContext.Provider>;
};

export const useErrorLogger = (): ErrorLogger => useContext(ErrorContext);

export const logError = (error: AppError): void => {
  externalLogger(error);
};

export default ErrorContext;
