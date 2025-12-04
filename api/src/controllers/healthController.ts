import { Request, Response } from 'express';

export const getHealth = (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'CommutePodder API is running',
    timestamp: new Date().toISOString(),
  });
};
