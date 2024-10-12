import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";

export interface IJwtPayload {
  id: number;
  username: string;
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers['authorization'];

  if (!token) {
    res.status(403).json({ error: 'Token is required' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (error, decoded) => {
    if (error) {
      res.status(403).json({ error: 'Invalid token' });
    }

    if (decoded){
      req.body.user = decoded as IJwtPayload;
      next();
    } else {
      res.status(403).json({ error: 'failed to decode token' });
    }
  });
}


