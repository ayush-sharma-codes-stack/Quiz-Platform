import { describe, it, expect } from 'vitest';
import {
  calculateLevel,
  calculateXpEarned,
  updateStreak,
  evaluateBadgesToAward,
} from '../utils/gamification';

describe('Gamification Engine', () => {
  it('calculates player level dynamically based on total XP', () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(50)).toBe(2);
    expect(calculateLevel(200)).toBe(3);
    expect(calculateLevel(450)).toBe(4);
    expect(calculateLevel(800)).toBe(5);
  });

  it('calculates XP gain including streak and perfect score bonuses', () => {
    // Fail attempt (10 consolation XP)
    expect(calculateXpEarned(40, 100, false, 1)).toBe(10);

    // Standard pass: score = 80, total = 100, streak = 2
    // base = 80*2 = 160, streak bonus = 2*15 = 30 -> Total 190
    expect(calculateXpEarned(80, 100, true, 2)).toBe(190);

    // Perfect score pass: score = 100, total = 100, streak = 3
    // base = 200, perfect bonus = 100, streak bonus = 45 -> Total 345
    expect(calculateXpEarned(100, 100, true, 3)).toBe(345);
  });

  it('updates daily streak correctly based on last attempt timestamp', () => {
    const now = new Date();
    
    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    expect(updateStreak(yesterday, 2)).toBe(3);

    // Today (same day)
    expect(updateStreak(now, 3)).toBe(3);

    // 3 days ago (broken streak)
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    expect(updateStreak(threeDaysAgo, 5)).toBe(1);
  });

  it('evaluates and awards new badges when criteria are met', () => {
    const existingBadges: string[] = [];
    const context = {
      totalCompletedAttempts: 1,
      percentage: 100,
      streak: 3,
      level: 5,
    };

    const newBadges = evaluateBadgesToAward(existingBadges, context);
    expect(newBadges).toContain('First Step');
    expect(newBadges).toContain('Sharpshooter');
    expect(newBadges).toContain('On Fire');
    expect(newBadges).toContain('Overachiever');
    expect(newBadges).not.toContain('Quiz Master'); // Requires 5 completed attempts
  });
});
