import { Request, Response, NextFunction } from 'express';

// Simple header-based credentials check (keeps parity with original example)
export function credentialsAuth(req: Request, res: Response, next: NextFunction) {
  const username = String(req.headers['username'] || '');
  const password = String(req.headers['password'] || '');

  if (username === 'admin' && password === '12345') {
    // Attach a user object for downstream handlers if needed
    (req as any).user = { username };
    return next();
  }

  return res.status(401).json({ error: 'Unauthorized: Invalid credentials' });
}
