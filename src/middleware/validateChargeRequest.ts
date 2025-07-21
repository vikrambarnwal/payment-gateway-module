import { Request, Response, NextFunction } from 'express';

export function validateChargeRequest(req: Request, res: Response, next: NextFunction) {
  const { amount, currency, source, email } = req.body;
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Invalid or missing amount (must be a positive number)' });
  }
  if (typeof currency !== 'string' || !currency.trim()) {
    return res.status(400).json({ error: 'Invalid or missing currency' });
  }
  if (typeof source !== 'string' || !source.trim()) {
    return res.status(400).json({ error: 'Invalid or missing source' });
  }
  if (typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid or missing email' });
  }
  next();
} 