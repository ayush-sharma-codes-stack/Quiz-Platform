import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyRefreshToken,
  verifyResetToken,
} from '../utils/jwt';

export async function signup(req: Request, res: Response) {
  const { name, email, password, role } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'An account with this email address already exists.',
    });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role || 'STUDENT',
      xp: 0,
      level: 1,
      streak: 0,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      xp: true,
      level: true,
      streak: true,
      createdAt: true,
    },
  });

  const tokenPayload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json({
    success: true,
    message: 'User registered successfully!',
    user,
    accessToken,
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password credentials.',
    });
  }

  if (user.status === 'DEACTIVATED') {
    return res.status(403).json({
      success: false,
      message: 'Your account has been deactivated. Please contact an admin.',
    });
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password credentials.',
    });
  }

  const tokenPayload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: 'Login successful!',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
    },
    accessToken,
  });
}

export async function refreshToken(req: Request, res: Response) {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token is missing.',
    });
  }

  try {
    const payload = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, role: true, status: true },
    });

    if (!user || user.status === 'DEACTIVATED') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token or deactivated user.',
      });
    }

    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    const newAccessToken = generateAccessToken(tokenPayload);

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token.',
    });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('refreshToken');
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    // Return success to avoid email enumeration security risk
    return res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been generated.',
    });
  }

  const resetToken = generateResetToken({ userId: user.id, email: user.email, role: user.role });

  return res.status(200).json({
    success: true,
    message: 'Password reset token generated successfully.',
    resetToken, // Returned in API for easy demo testing
  });
}

export async function resetPassword(req: Request, res: Response) {
  const { token, newPassword } = req.body;

  try {
    const payload = verifyResetToken(token);
    if (payload.type !== 'reset') {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset token type.',
      });
    }

    const newHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: payload.userId },
      data: { passwordHash: newHash },
    });

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully! You can now log in.',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token.',
    });
  }
}
