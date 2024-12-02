import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/userService';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;
    const user = await registerUser(email, password, name);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await loginUser(email, password);
    res.json({ user, accessToken, refreshToken });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: number };

    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    if (!user || user.refreshToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }

    const newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '15m' });

    res.json({ accessToken: newAccessToken });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};

