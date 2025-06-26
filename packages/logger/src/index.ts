export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
const LEVELS: LogLevel[] = ['debug', 'info', 'warn', 'error'];

function getEnvLevel(): LogLevel {
  const env =
    (typeof process !== 'undefined' && process.env) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env) ||
    {};
  const lvl =
    (env.LOG_LEVEL || env.VITE_LOG_LEVEL || 'info')
      .toString()
      .toLowerCase();
  return LEVELS.includes(lvl as LogLevel) ? (lvl as LogLevel) : 'info';
}

const currentIndex = LEVELS.indexOf(getEnvLevel());

function shouldLog(level: LogLevel): boolean {
  const idx = LEVELS.indexOf(level);
  return idx >= 0 && (currentIndex === -1 ? true : idx >= currentIndex);
}

export type LogFunction = (...args: unknown[]) => void;
export interface Logger {
  debug: LogFunction;
  info: LogFunction;
  warn: LogFunction;
  error: LogFunction;
}

const logger: Logger = {
  debug: (...args) => { if (shouldLog('debug')) console.debug(...args); },
  info: (...args) => { if (shouldLog('info')) console.info(...args); },
  warn: (...args) => { if (shouldLog('warn')) console.warn(...args); },
  error: (...args) => { if (shouldLog('error')) console.error(...args); },
};

export default logger;
