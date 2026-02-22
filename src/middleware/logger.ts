import { Request, Response, NextFunction } from 'express';

export default function requestLogger(req: Request, res: Response, next: NextFunction) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - body=${JSON.stringify(req.body)} query=${JSON.stringify(req.query)}`);
  next();
}
