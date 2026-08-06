import { describe, it, expect } from 'vitest';
import { generateAccessToken, verifyAccessToken } from '../utils/jwt';

describe('Auth Token Flow', () => {
  it('generates and verifies JWT access tokens with correct payload', () => {
    const payload = {
      userId: 'test-user-id-123',
      email: 'test@example.com',
      role: 'STUDENT',
    };

    const token = generateAccessToken(payload);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(20);

    const verified = verifyAccessToken(token);
    expect(verified.userId).toBe(payload.userId);
    expect(verified.email).toBe(payload.email);
    expect(verified.role).toBe(payload.role);
    expect(verified.type).toBe('access');
  });
});
