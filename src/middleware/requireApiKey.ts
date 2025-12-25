import { Request, Response, NextFunction } from 'express';
import { API_KEY } from '../config/env';

export function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = String(req.headers['api-key'] || '');
  if (apiKey && apiKey === API_KEY) return next();
  return res.status(403).json({ error: 'Forbidden: Invalid API Key' });
}
