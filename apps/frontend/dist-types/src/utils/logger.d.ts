export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogFn = (...args: unknown[]) => void;
declare const logger: Record<LogLevel, LogFn>;
export default logger;
