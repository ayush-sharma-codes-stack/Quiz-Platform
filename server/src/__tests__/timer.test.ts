import { describe, it, expect } from 'vitest';

function isTimerExpired(startedAt: Date, timeLimitSeconds: number, graceSeconds: number = 15): boolean {
  const elapsed = (Date.now() - new Date(startedAt).getTime()) / 1000;
  return elapsed > timeLimitSeconds + graceSeconds;
}

describe('Server Timer Expiry Engine', () => {
  it('validates attempt submission within allowed time limit', () => {
    const startedAt = new Date(Date.now() - 30000); // Started 30s ago
    const timeLimitSeconds = 60; // 1-minute limit
    expect(isTimerExpired(startedAt, timeLimitSeconds)).toBe(false);
  });

  it('rejects attempt submission when time limit is exceeded', () => {
    const startedAt = new Date(Date.now() - 120000); // Started 2 mins ago
    const timeLimitSeconds = 60; // 1-minute limit
    expect(isTimerExpired(startedAt, timeLimitSeconds)).toBe(true);
  });
});
