export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVELS: LogLevel[] = ['debug', 'info', 'warn', 'error'];
const envLevel = (process.env.LOG_LEVEL || 'info').toLowerCase() as LogLevel;
const currentIndex = LEVELS.indexOf(envLevel);

const shouldLog = (level: LogLevel): boolean => {
  const idx = LEVELS.indexOf(level);
  return idx >= 0 && (currentIndex === -1 ? true : idx >= currentIndex);
};

const log = (level: LogLevel, ...args: unknown[]): void => {
  if (!shouldLog(level)) return;
  const message = args.map(a =>
    typeof a === 'object' ? JSON.stringify(a) : String(a)
  ).join(' ');
  const payload = {
    level,
    timestamp: new Date().toISOString(),
    message,
  };
  if (level === 'error') {
    console.error(JSON.stringify(payload));
  } else {
    console.log(JSON.stringify(payload));
  }
};

export default {
  debug: (...args: unknown[]) => log('debug', ...args),
  info: (...args: unknown[]) => log('info', ...args),
  warn: (...args: unknown[]) => log('warn', ...args),
  error: (...args: unknown[]) => log('error', ...args),
};
