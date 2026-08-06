import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import {
  calculateXpEarned,
  calculateLevel,
  updateStreak,
  evaluateBadgesToAward,
} from '../utils/gamification';

export async function startAttempt(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { quizId } = req.body;

  if (!quizId) {
    return res.status(400).json({ success: false, message: 'quizId is required' });
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        select: { id: true },
      },
    },
  });

  if (!quiz || quiz.status !== 'PUBLISHED') {
    return res.status(404).json({ success: false, message: 'Quiz not found or not available.' });
  }

  // Check if user already has an active IN_PROGRESS attempt for this quiz
  const existingAttempt = await prisma.attempt.findFirst({
    where: {
      userId,
      quizId,
      status: 'IN_PROGRESS',
    },
  });

  if (existingAttempt) {
    // Check if existing attempt has expired
    const elapsedSeconds = (Date.now() - new Date(existingAttempt.startedAt).getTime()) / 1000;
    if (elapsedSeconds <= quiz.timeLimitSeconds + 15) {
      return res.status(200).json({
        success: true,
        message: 'Resuming existing active attempt',
        attempt: existingAttempt,
      });
    } else {
      // Mark past attempt as ABANDONED
      await prisma.attempt.update({
        where: { id: existingAttempt.id },
        data: { status: 'ABANDONED' },
      });
    }
  }

  const newAttempt = await prisma.attempt.create({
    data: {
      quizId,
      userId,
      startedAt: new Date(),
      status: 'IN_PROGRESS',
    },
  });

  return res.status(201).json({
    success: true,
    message: 'Quiz attempt started!',
    attempt: newAttempt,
  });
}

export async function saveAttemptAnswer(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { id: attemptId } = req.params;
  const { questionId, selectedOptionIds } = req.body;

  const attempt = await prisma.attempt.findFirst({
    where: { id: attemptId, userId },
    include: { quiz: true },
  });

  if (!attempt) {
    return res.status(404).json({ success: false, message: 'Attempt not found.' });
  }

  if (attempt.status !== 'IN_PROGRESS') {
    return res.status(400).json({
      success: false,
      message: 'This attempt has already been completed or finalized.',
    });
  }

  // Check time limit with a 15-second grace period for latency
  const elapsedSeconds = (Date.now() - new Date(attempt.startedAt).getTime()) / 1000;
  if (elapsedSeconds > attempt.quiz.timeLimitSeconds + 15) {
    return res.status(400).json({
      success: false,
      message: 'Time limit exceeded for this quiz attempt.',
    });
  }

  const selectedOptionsStr = JSON.stringify(selectedOptionIds);

  const answer = await prisma.attemptAnswer.upsert({
    where: {
      attemptId_questionId: {
        attemptId,
        questionId,
      },
    },
    update: {
      selectedOptionIds: selectedOptionsStr,
    },
    create: {
      attemptId,
      questionId,
      selectedOptionIds: selectedOptionsStr,
    },
  });

  return res.status(200).json({
    success: true,
    answer,
  });
}

export async function finalizeAttempt(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { id: attemptId } = req.params;

  const attempt = await prisma.attempt.findFirst({
    where: { id: attemptId, userId },
    include: {
      quiz: {
        include: {
          questions: {
            include: {
              options: true,
            },
          },
        },
      },
      answers: true,
    },
  });

  if (!attempt) {
    return res.status(404).json({ success: false, message: 'Attempt not found.' });
  }

  // Idempotency: if already scored, return existing attempt state
  if (attempt.status === 'COMPLETED') {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return res.status(200).json({
      success: true,
      message: 'Attempt already finalized.',
      attempt,
      user,
      newBadges: [],
    });
  }

  const questions = attempt.quiz.questions;
  let totalScore = 0;
  let totalMaxPoints = 0;

  // Grade each question
  for (const q of questions) {
    totalMaxPoints += q.points;

    const userAns = attempt.answers.find((a) => a.questionId === q.id);
    let selectedOptionIds: string[] = [];
    if (userAns) {
      try {
        selectedOptionIds = JSON.parse(userAns.selectedOptionIds);
      } catch (e) {
        selectedOptionIds = [];
      }
    }

    const correctOptionIds = q.options.filter((o) => o.isCorrect).map((o) => o.id);
    let isCorrect = false;

    if (q.type === 'SINGLE_CHOICE' || q.type === 'TRUE_FALSE') {
      isCorrect =
        selectedOptionIds.length === 1 &&
        correctOptionIds.length === 1 &&
        selectedOptionIds[0] === correctOptionIds[0];
    } else if (q.type === 'MULTI_CHOICE') {
      isCorrect =
        selectedOptionIds.length === correctOptionIds.length &&
        selectedOptionIds.every((id) => correctOptionIds.includes(id));
    }

    const pointsAwarded = isCorrect ? q.points : 0;
    totalScore += pointsAwarded;

    // Update AttemptAnswer with evaluation result
    if (userAns) {
      await prisma.attemptAnswer.update({
        where: { id: userAns.id },
        data: {
          isCorrect,
          pointsAwarded,
        },
      });
    }
  }

  const percentage = totalMaxPoints > 0 ? Math.round((totalScore / totalMaxPoints) * 1000) / 10 : 0;
  const passed = percentage >= attempt.quiz.passingScore;

  // Fetch current user for gamification updates
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { userBadges: { include: { badge: true } } },
  });

  if (!currentUser) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const newStreak = updateStreak(currentUser.lastAttemptAt, currentUser.streak);
  const xpEarned = calculateXpEarned(totalScore, totalMaxPoints, passed, newStreak);
  const updatedXp = currentUser.xp + xpEarned;
  const newLevel = calculateLevel(updatedXp);

  // Finalize attempt in DB
  const updatedAttempt = await prisma.attempt.update({
    where: { id: attemptId },
    data: {
      score: totalScore,
      totalPoints: totalMaxPoints,
      percentage,
      passed,
      xpEarned,
      status: 'COMPLETED',
      submittedAt: new Date(),
    },
    include: {
      quiz: { select: { title: true, category: true, passingScore: true } },
    },
  });

  // Count user's total completed attempts
  const completedAttemptsCount = await prisma.attempt.count({
    where: { userId, status: 'COMPLETED' },
  });

  // Evaluate badges to unlock
  const existingBadgeNames = currentUser.userBadges.map((ub) => ub.badge.name);
  const newBadgeNames = evaluateBadgesToAward(existingBadgeNames, {
    totalCompletedAttempts: completedAttemptsCount,
    percentage,
    streak: newStreak,
    level: newLevel,
  });

  const newlyAwardedBadges = [];
  for (const bName of newBadgeNames) {
    const badge = await prisma.badge.findUnique({ where: { name: bName } });
    if (badge) {
      await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
        },
      });
      newlyAwardedBadges.push(badge);
    }
  }

  // Update user stats
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      xp: updatedXp,
      level: newLevel,
      streak: newStreak,
      lastAttemptAt: new Date(),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      xp: true,
      level: true,
      streak: true,
    },
  });

  return res.status(200).json({
    success: true,
    message: passed ? 'Quiz Passed! Congratulations!' : 'Quiz Attempt Submitted.',
    attempt: updatedAttempt,
    user: updatedUser,
    xpEarned,
    newBadges: newlyAwardedBadges,
  });
}

export async function getAttemptHistory(req: Request, res: Response) {
  const userId = req.user!.userId;

  const attempts = await prisma.attempt.findMany({
    where: { userId, status: 'COMPLETED' },
    orderBy: { submittedAt: 'desc' },
    include: {
      quiz: {
        select: {
          id: true,
          title: true,
          category: true,
          difficulty: true,
          passingScore: true,
          thumbnail: true,
        },
      },
    },
  });

  return res.status(200).json({
    success: true,
    attempts,
  });
}

export async function getAttemptDetail(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  const attempt = await prisma.attempt.findFirst({
    where: { id },
    include: {
      quiz: {
        include: {
          questions: {
            orderBy: { order: 'asc' },
            include: {
              options: true,
            },
          },
        },
      },
      answers: true,
      user: {
        select: { id: true, name: true, role: true },
      },
    },
  });

  if (!attempt) {
    return res.status(404).json({ success: false, message: 'Attempt not found.' });
  }

  // Only allow owner or admin to see details
  if (attempt.userId !== userId && req.user!.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }

  return res.status(200).json({
    success: true,
    attempt,
  });
}
