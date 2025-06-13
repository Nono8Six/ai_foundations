const LEVELS = ['debug', 'info', 'warn', 'error'];
const envLevel = (import.meta.env?.VITE_LOG_LEVEL || 'info').toLowerCase();
const currentIndex = LEVELS.indexOf(envLevel);

const shouldLog = level => {
  const idx = LEVELS.indexOf(level);
  return idx >= 0 && (currentIndex === -1 ? true : idx >= currentIndex);
};

const logger = {
  debug: (...args) => shouldLog('debug') && console.debug(...args),
  info: (...args) => shouldLog('info') && console.info(...args),
  warn: (...args) => shouldLog('warn') && console.warn(...args),
  error: (...args) => shouldLog('error') && console.error(...args),
};

export default logger;
