import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export async function getGlobalLeaderboard(req: Request, res: Response) {
  const topUsers = await prisma.user.findMany({
    where: { status: 'ACTIVE' },
    orderBy: [{ xp: 'desc' }, { level: 'desc' }],
    take: 50,
    select: {
      id: true,
      name: true,
      role: true,
      xp: true,
      level: true,
      streak: true,
      createdAt: true,
      _count: { select: { attempts: { where: { status: 'COMPLETED' } } } },
    },
  });

  const formattedLeaderboard = topUsers.map((u, idx) => ({
    rank: idx + 1,
    id: u.id,
    name: u.name,
    role: u.role,
    xp: u.xp,
    level: u.level,
    streak: u.streak,
    quizzesCompleted: u._count.attempts,
    badge: idx === 0 ? 'GOLD' : idx === 1 ? 'SILVER' : idx === 2 ? 'BRONZE' : 'PLAYER',
  }));

  return res.status(200).json({
    success: true,
    leaderboard: formattedLeaderboard,
  });
}

export async function getQuizLeaderboard(req: Request, res: Response) {
  const { quizId } = req.params;

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: { id: true, title: true, passingScore: true },
  });

  if (!quiz) {
    return res.status(404).json({ success: false, message: 'Quiz not found.' });
  }

  // Get best completed attempt per user for this quiz
  const attempts = await prisma.attempt.findMany({
    where: { quizId, status: 'COMPLETED' },
    orderBy: [
      { score: 'desc' },
      { percentage: 'desc' },
      { submittedAt: 'asc' },
    ],
    include: {
      user: {
        select: { id: true, name: true, xp: true, level: true },
      },
    },
  });

  // Filter unique best attempt per user
  const userBestMap = new Map<string, typeof attempts[0]>();
  attempts.forEach((att) => {
    if (!userBestMap.has(att.userId)) {
      userBestMap.set(att.userId, att);
    }
  });

  const uniqueBestAttempts = Array.from(userBestMap.values()).slice(0, 30);

  const leaderboard = uniqueBestAttempts.map((att, idx) => {
    const timeTakenSeconds = att.submittedAt && att.startedAt
      ? Math.max(0, Math.round((new Date(att.submittedAt).getTime() - new Date(att.startedAt).getTime()) / 1000))
      : 0;

    return {
      rank: idx + 1,
      attemptId: att.id,
      user: att.user,
      score: att.score,
      totalPoints: att.totalPoints,
      percentage: att.percentage,
      passed: att.passed,
      timeTakenSeconds,
      submittedAt: att.submittedAt,
      badge: idx === 0 ? 'GOLD' : idx === 1 ? 'SILVER' : idx === 2 ? 'BRONZE' : 'PLAYER',
    };
  });

  return res.status(200).json({
    success: true,
    quiz,
    leaderboard,
  });
}
