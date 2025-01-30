import { Request, Response } from 'express';

export const errorHandler = (err: any, _req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
};
