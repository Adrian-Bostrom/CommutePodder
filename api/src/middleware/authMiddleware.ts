import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

interface JWTPayload {
  userId: string;
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.__session;

  if (!token) {
    console.log('No JWT token found');
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    (req as any).userId = decoded.userId;
    next();
  } catch (error) {
    console.log('JWT verification failed:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const optionalAuthenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.__session;

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    (req as any).userId = decoded.userId;
  } catch (error) {
    // Ignore error for optional auth
    console.log('Optional JWT verification failed:', error);
  }
  next();
};

