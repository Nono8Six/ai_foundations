import pino from 'pino';

// Logger configuration
const options = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  base: {
    env: process.env.NODE_ENV || 'development',
    app: 'backend',
  },
};

// Create and export the logger
export const log = pino(options);
