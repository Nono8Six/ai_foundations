import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';

export default function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = typeof err === 'object' && err && 'status' in err ? (err as any).status : 500;
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  logger.error('Request failed', { status, message });
  res.status(status).json({ error: message });
}
