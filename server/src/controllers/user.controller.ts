import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { calculateLevel } from '../utils/gamification';

export async function getMyProfile(req: Request, res: Response) {
  const userId = req.user!.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userBadges: {
        include: {
          badge: true,
        },
        orderBy: { earnedAt: 'desc' },
      },
      _count: {
        select: {
          attempts: { where: { status: 'COMPLETED' } },
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  // Calculate XP threshold for current level and next level
  const currentLevel = calculateLevel(user.xp);
  const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 50;
  const xpForNextLevel = Math.pow(currentLevel, 2) * 50;
  const xpInCurrentLevel = Math.max(0, user.xp - xpForCurrentLevel);
  const xpNeededForNextLevel = Math.max(1, xpForNextLevel - xpForCurrentLevel);
  const levelProgressPercentage = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100));

  // Recent 5 attempts
  const recentAttempts = await prisma.attempt.findMany({
    where: { userId, status: 'COMPLETED' },
    take: 5,
    orderBy: { submittedAt: 'desc' },
    include: {
      quiz: { select: { title: true, category: true, passingScore: true } },
    },
  });

  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      xp: user.xp,
      level: currentLevel,
      streak: user.streak,
      lastAttemptAt: user.lastAttemptAt,
      createdAt: user.createdAt,
      totalCompletedQuizzes: user._count.attempts,
      badges: user.userBadges.map((ub) => ({
        id: ub.badge.id,
        name: ub.badge.name,
        description: ub.badge.description,
        icon: ub.badge.icon,
        earnedAt: ub.earnedAt,
      })),
      levelProgress: {
        currentLevel,
        xpInCurrentLevel,
        xpNeededForNextLevel,
        percentage: levelProgressPercentage,
      },
      recentAttempts,
    },
  });
}

export async function getMyBadges(req: Request, res: Response) {
  const userId = req.user!.userId;

  const allBadges = await prisma.badge.findMany();
  const userBadges = await prisma.userBadge.findMany({
    where: { userId },
    include: { badge: true },
  });

  const earnedBadgeIds = new Set(userBadges.map((ub) => ub.badgeId));

  const badges = allBadges.map((badge) => {
    const userBadge = userBadges.find((ub) => ub.badgeId === badge.id);
    return {
      id: badge.id,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      isEarned: earnedBadgeIds.has(badge.id),
      earnedAt: userBadge ? userBadge.earnedAt : null,
    };
  });

  return res.status(200).json({
    success: true,
    badges,
  });
}
