import pino, { Logger, type LoggerOptions } from 'pino';

// Type augmentation for import.meta
interface ImportMetaEnv {
  VITE_LOG_LEVEL?: string;
  [key: string]: string | undefined;
}

interface ImportMeta {
  env: ImportMetaEnv;
}

// Type for the global window object
declare global {
  interface Window {
    __ENV__?: {
      LOG_LEVEL?: string;
    };
  }
}

const isBrowser = typeof window !== 'undefined';

// Get log level from environment variables
const getLogLevel = (): string => {
  if (isBrowser) {
    // In browser, check for Vite's import.meta.env or window.__ENV__
    return (
      (import.meta as ImportMeta).env?.VITE_LOG_LEVEL ??
      window.__ENV__?.LOG_LEVEL ??
      (process.env.NODE_ENV === 'production' ? 'warn' : 'info')
    );
  }
  // In Node.js, use process.env
  return process.env.LOG_LEVEL ?? (process.env.NODE_ENV === 'production' ? 'warn' : 'info');
};

const options: LoggerOptions = {
  level: getLogLevel(),
  ...(isBrowser && { browser: { asObject: true } }),
  ...(!isBrowser || process.env.NODE_ENV !== 'production'
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
      }
    : {}),
  base: {
    env: process.env.NODE_ENV,
    ...(isBrowser && { browser: true }),
  },
};

export const log: Logger = pino(options);

// Add browser error handling
if (isBrowser) {
  // Error event handler
  const handleError = (event: ErrorEvent | Event) => {
    const error = 'error' in event ? event.error : event;
    log.error({
      type: 'unhandled_error',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  };

  // Unhandled promise rejection handler
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    log.error({
      type: 'unhandled_rejection',
      reason: event.reason instanceof Error 
        ? { message: event.reason.message, stack: event.reason.stack }
        : event.reason,
    });
  };

  // Add event listeners
  window.addEventListener('error', handleError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
}
