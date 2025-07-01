export type AppError = Error | string;

export function normalizeError(err: AppError): Error {
  return typeof err === 'string' ? new Error(err) : err;
}
