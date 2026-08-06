import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export async function getPublishedQuizzes(req: Request, res: Response) {
  const { category, difficulty, search } = req.query;

  const where: any = {
    status: 'PUBLISHED',
  };

  if (category && category !== 'ALL') {
    where.category = String(category);
  }

  if (difficulty && difficulty !== 'ALL') {
    where.difficulty = String(difficulty).toUpperCase();
  }

  if (search) {
    where.OR = [
      { title: { contains: String(search) } },
      { description: { contains: String(search) } },
      { category: { contains: String(search) } },
    ];
  }

  const quizzes = await prisma.quiz.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: { select: { name: true } },
      _count: { select: { questions: true, attempts: true } },
    },
  });

  return res.status(200).json({
    success: true,
    quizzes,
  });
}

export async function getPublicQuizDetail(req: Request, res: Response) {
  const { id } = req.params;

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      createdBy: { select: { name: true } },
      questions: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          type: true,
          text: true,
          points: true,
          order: true,
          options: {
            select: {
              id: true,
              text: true,
              // Do NOT return isCorrect to prevent client-side answer inspection
            },
          },
        },
      },
      _count: { select: { attempts: true } },
    },
  });

  if (!quiz || quiz.status !== 'PUBLISHED') {
    return res.status(404).json({
      success: false,
      message: 'Quiz not found or is currently not published.',
    });
  }

  // Get user's best attempt if authenticated
  let bestAttempt = null;
  if (req.user) {
    bestAttempt = await prisma.attempt.findFirst({
      where: {
        quizId: id,
        userId: req.user.userId,
        status: 'COMPLETED',
      },
      orderBy: { score: 'desc' },
      select: {
        id: true,
        score: true,
        percentage: true,
        passed: true,
        submittedAt: true,
      },
    });
  }

  return res.status(200).json({
    success: true,
    quiz,
    bestAttempt,
  });
}
