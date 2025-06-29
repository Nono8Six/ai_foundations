import pino, { LoggerOptions } from 'pino';

// Logger options
const options: LoggerOptions = {
  browser: {
    asObject: true,
  },
  level: import.meta.env.MODE === 'production' ? 'info' : 'debug',
  base: {
    env: import.meta.env.MODE,
    app: 'frontend',
  },
};

// Create and export the logger
export const log = pino(options);
