import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export async function getOverviewAnalytics(req: Request, res: Response) {
  const totalQuizzes = await prisma.quiz.count();
  const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
  const totalAttempts = await prisma.attempt.count({ where: { status: 'COMPLETED' } });

  const scoreAggregate = await prisma.attempt.aggregate({
    where: { status: 'COMPLETED' },
    _avg: { percentage: true },
  });

  const passedCount = await prisma.attempt.count({
    where: { status: 'COMPLETED', passed: true },
  });

  const averageScore = Math.round((scoreAggregate._avg.percentage || 0) * 10) / 10;
  const passRate = totalAttempts > 0 ? Math.round((passedCount / totalAttempts) * 100) : 0;

  const recentAttempts = await prisma.attempt.findMany({
    where: { status: 'COMPLETED' },
    take: 10,
    orderBy: { submittedAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      quiz: { select: { title: true, category: true } },
    },
  });

  // Calculate attempt counts over the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const attemptsLast7Days = await prisma.attempt.findMany({
    where: {
      status: 'COMPLETED',
      submittedAt: { gte: sevenDaysAgo },
    },
    select: { submittedAt: true, percentage: true },
  });

  // Map to date strings
  const dateMap: Record<string, { count: number; totalScore: number }> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    dateMap[dateStr] = { count: 0, totalScore: 0 };
  }

  attemptsLast7Days.forEach((att) => {
    if (att.submittedAt) {
      const dateStr = att.submittedAt.toISOString().split('T')[0];
      if (dateMap[dateStr]) {
        dateMap[dateStr].count += 1;
        dateMap[dateStr].totalScore += att.percentage;
      }
    }
  });

  const attemptsOverTime = Object.entries(dateMap).map(([date, data]) => ({
    date,
    attempts: data.count,
    avgScore: data.count > 0 ? Math.round(data.totalScore / data.count) : 0,
  }));

  return res.status(200).json({
    success: true,
    analytics: {
      totalQuizzes,
      totalStudents,
      totalAttempts,
      averageScore,
      passRate,
      recentAttempts,
      attemptsOverTime,
    },
  });
}

export async function getQuizAnalytics(req: Request, res: Response) {
  const { id } = req.params;

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });

  if (!quiz) {
    return res.status(404).json({ success: false, message: 'Quiz not found.' });
  }

  const attempts = await prisma.attempt.findMany({
    where: { quizId: id, status: 'COMPLETED' },
    include: {
      user: { select: { id: true, name: true, email: true } },
      answers: true,
    },
    orderBy: { submittedAt: 'desc' },
  });

  const totalAttempts = attempts.length;
  const passedAttempts = attempts.filter((a) => a.passed).length;
  const passRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;

  const totalScoreSum = attempts.reduce((acc, a) => acc + a.percentage, 0);
  const averageScore = totalAttempts > 0 ? Math.round((totalScoreSum / totalAttempts) * 10) / 10 : 0;

  // Calculate question difficulty (% correct per question)
  const questionStats = quiz.questions.map((q) => {
    let totalAnswered = 0;
    let correctCount = 0;

    attempts.forEach((att) => {
      const ans = att.answers.find((a) => a.questionId === q.id);
      if (ans) {
        totalAnswered += 1;
        if (ans.isCorrect) correctCount += 1;
      }
    });

    const percentCorrect = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

    return {
      questionId: q.id,
      text: q.text,
      points: q.points,
      totalAnswered,
      correctCount,
      percentCorrect,
      difficultyRating: percentCorrect > 75 ? 'Easy' : percentCorrect > 40 ? 'Medium' : 'Hard',
    };
  });

  return res.status(200).json({
    success: true,
    analytics: {
      quiz: {
        id: quiz.id,
        title: quiz.title,
        category: quiz.category,
        passingScore: quiz.passingScore,
      },
      totalAttempts,
      passedAttempts,
      passRate,
      averageScore,
      questionStats,
      attempts: attempts.map((a) => ({
        id: a.id,
        user: a.user,
        score: a.score,
        totalPoints: a.totalPoints,
        percentage: a.percentage,
        passed: a.passed,
        startedAt: a.startedAt,
        submittedAt: a.submittedAt,
      })),
    },
  });
}
