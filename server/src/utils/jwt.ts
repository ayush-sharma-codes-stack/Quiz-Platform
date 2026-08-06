import jwt, { Secret } from 'jsonwebtoken';
import { env } from '../config/env';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  type?: 'access' | 'refresh' | 'reset';
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(
    { ...payload, type: 'access' },
    env.JWT_ACCESS_SECRET as Secret,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN as any }
  );
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(
    { ...payload, type: 'refresh' },
    env.JWT_REFRESH_SECRET as Secret,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any }
  );
}

export function generateResetToken(payload: TokenPayload): string {
  return jwt.sign(
    { ...payload, type: 'reset' },
    env.JWT_ACCESS_SECRET as Secret,
    { expiresIn: '15m' }
  );
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET as Secret) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET as Secret) as TokenPayload;
}

export function verifyResetToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET as Secret) as TokenPayload;
}
