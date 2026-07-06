import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';

type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: 'member' | 'manager';
};

const extractToken = (req: Request) => {
  const bearerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : undefined;

  return bearerToken ?? req.cookies?.token;
};

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const token = extractToken(req);

  if (!token) {
    return next(new ApiError(401, 'Authentication required'));
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(new ApiError(500, 'JWT_SECRET is not configured'));
  }

  try {
    const payload = jwt.verify(token, secret) as AuthUser;
    req.user = payload;
    return next();
  } catch {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
};

export const requireRole = (...allowedRoles: Array<'member' | 'manager'>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden'));
    }

    return next();
  };
};
