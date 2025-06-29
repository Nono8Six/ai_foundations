import { createContext, useContext, type ReactNode } from 'react';
import { log } from '@/logger';

export type ErrorLogger = (error: unknown) => void;

const ErrorContext = createContext<ErrorLogger>(() => {});

// Wrapper pour adapter la signature de log.error au type ErrorLogger
const errorLogger: ErrorLogger = (error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
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

export const logError = (error: unknown): void => {
  externalLogger(error);
};

export default ErrorContext;
