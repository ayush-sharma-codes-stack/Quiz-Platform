export function calculateLevel(xp: number): number {
  if (xp <= 0) return 1;
  return Math.floor(Math.sqrt(xp / 50)) + 1;
}

export function calculateXpEarned(score: number, totalPoints: number, passed: boolean, streak: number): number {
  if (!passed) return 10; // Encouraging minimal XP even on fail
  
  let base = score * 2;
  const isPerfect = score === totalPoints && totalPoints > 0;
  if (isPerfect) {
    base += 100;
  }
  const streakBonus = Math.min(streak * 15, 150);
  return base + streakBonus;
}

export function updateStreak(lastAttemptAt: Date | null, currentStreak: number): number {
  const now = new Date();
  if (!lastAttemptAt) {
    return 1;
  }

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOfAttempt = new Date(lastAttemptAt.getFullYear(), lastAttemptAt.getMonth(), lastAttemptAt.getDate());

  if (startOfAttempt.getTime() === startOfToday.getTime()) {
    return currentStreak > 0 ? currentStreak : 1;
  } else if (startOfAttempt.getTime() === startOfYesterday.getTime()) {
    return currentStreak + 1;
  } else {
    return 1;
  }
}

export interface BadgeCheckContext {
  totalCompletedAttempts: number;
  percentage: number;
  streak: number;
  level: number;
}

export function evaluateBadgesToAward(existingBadgeNames: string[], context: BadgeCheckContext): string[] {
  const newBadges: string[] = [];

  const check = (name: string, condition: boolean) => {
    if (condition && !existingBadgeNames.includes(name)) {
      newBadges.push(name);
    }
  };

  check('First Step', context.totalCompletedAttempts >= 1);
  check('Quiz Master', context.totalCompletedAttempts >= 5);
  check('Sharpshooter', context.percentage >= 100);
  check('On Fire', context.streak >= 3);
  check('Overachiever', context.level >= 5);

  return newBadges;
}
