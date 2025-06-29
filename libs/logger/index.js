import pino from 'pino';
const isBrowser = typeof window !== 'undefined';
const level = (import.meta?.env?.VITE_LOG_LEVEL) ?? process.env.LOG_LEVEL ?? 'info';
export const log = pino({
  level,
  browser: isBrowser ? { asObject: true } : undefined,
  transport: {
    target: 'pino-pretty',
    options: { colorize: true, translateTime: true },
  },
});
if (isBrowser) {
  window.addEventListener('error', e => log.error(e.error ?? e.message));
  window.addEventListener('unhandledrejection', e => log.error(e.reason));
}
