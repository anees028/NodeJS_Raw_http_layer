import { Request, Response, NextFunction } from 'express';

export function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, age, gender, city, country } = req.body || {};
    const username = (req as any).user?.username || String(req.headers['username'] || '');

    const message = `Welcome, ${email}! Your age is ${age}, gender is ${gender}, city is ${city} and country is ${country}.`;

    const responseData = {
      username,
      message,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(responseData);
  } catch (err) {
    next(err);
  }
}
