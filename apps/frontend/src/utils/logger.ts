export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVELS: LogLevel[] = ['debug', 'info', 'warn', 'error'];
const envLevel = (import.meta.env?.VITE_LOG_LEVEL || 'info').toLowerCase() as LogLevel;
const currentIndex = LEVELS.indexOf(envLevel);

const shouldLog = (level: LogLevel): boolean => {
  const idx = LEVELS.indexOf(level);
  return idx >= 0 && (currentIndex === -1 ? true : idx >= currentIndex);
};

type LogFn = (...args: unknown[]) => void;

const logger: Record<LogLevel, LogFn> = {
  debug: (...args: unknown[]) => { if (shouldLog('debug')) console.debug(...args); },
  info: (...args: unknown[]) => { if (shouldLog('info')) console.info(...args); },
  warn: (...args: unknown[]) => { if (shouldLog('warn')) console.warn(...args); },
  error: (...args: unknown[]) => { if (shouldLog('error')) console.error(...args); },
};

export default logger;
