
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { ApiError } from '../utils/ApiError';

const buildToken = (user: { id: string; fullName: string; email: string; role: 'member' | 'manager' }) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ApiError(500, 'JWT_SECRET is not configured');
  }

  return jwt.sign(user, secret, { expiresIn: '7d' });
};

export const authController = {
  async register(req: Request, res: Response) {
    const { name, email, password } = req.body as { name: string; email: string; password: string };

    const existing = await UserModel.findOne({ email });
    if (existing) {
      throw new ApiError(409, 'Email already in use');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ fullName: name, email, passwordHash, role: 'member' });

    const token = buildToken({ id: user._id.toString(), fullName: user.fullName, email: user.email, role: user.role });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: user._id.toString(), fullName: user.fullName, email: user.email, role: user.role },
      },
    });
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.body as { email: string; password: string };
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const token = buildToken({
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      },
    });
  },

  async me(req: Request, res: Response) {
    res.status(200).json({ success: true, data: { user: req.user } });
  },
};
