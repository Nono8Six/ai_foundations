import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';

interface ErrorWithStatus {
  status?: number;
  message?: string;
}

export default function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  void _next;
  const status =
    typeof err === 'object' && err && 'status' in err
      ? (err as ErrorWithStatus).status ?? 500
      : 500;
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  logger.error('Request failed', { status, message });
  res.status(status).json({ error: message });
}
