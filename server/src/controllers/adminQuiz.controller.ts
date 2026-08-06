import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export async function listQuizzes(req: Request, res: Response) {
  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: { select: { name: true, email: true } },
      _count: { select: { questions: true, attempts: true } },
    },
  });

  return res.status(200).json({
    success: true,
    quizzes,
  });
}

export async function createQuiz(req: Request, res: Response) {
  const adminId = req.user!.userId;
  const { title, description, category, difficulty, timeLimitSeconds, passingScore, thumbnail, status } = req.body;

  const quiz = await prisma.quiz.create({
    data: {
      title,
      description,
      category,
      difficulty: difficulty || 'MEDIUM',
      timeLimitSeconds: timeLimitSeconds || 600,
      passingScore: passingScore || 70,
      thumbnail: thumbnail || null,
      status: status || 'DRAFT',
      createdById: adminId,
    },
  });

  return res.status(201).json({
    success: true,
    message: 'Quiz created successfully',
    quiz,
  });
}

export async function getQuizDetail(req: Request, res: Response) {
  const { id } = req.params;

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { order: 'asc' },
        include: { options: true },
      },
      createdBy: { select: { name: true, email: true } },
      _count: { select: { attempts: true } },
    },
  });

  if (!quiz) {
    return res.status(404).json({
      success: false,
      message: 'Quiz not found.',
    });
  }

  return res.status(200).json({
    success: true,
    quiz,
  });
}

export async function updateQuiz(req: Request, res: Response) {
  const { id } = req.params;

  const existingQuiz = await prisma.quiz.findUnique({ where: { id } });
  if (!existingQuiz) {
    return res.status(404).json({ success: false, message: 'Quiz not found.' });
  }

  const updatedQuiz = await prisma.quiz.update({
    where: { id },
    data: req.body,
  });

  return res.status(200).json({
    success: true,
    message: 'Quiz updated successfully',
    quiz: updatedQuiz,
  });
}

export async function deleteQuiz(req: Request, res: Response) {
  const { id } = req.params;

  const existingQuiz = await prisma.quiz.findUnique({ where: { id } });
  if (!existingQuiz) {
    return res.status(404).json({ success: false, message: 'Quiz not found.' });
  }

  await prisma.quiz.delete({ where: { id } });

  return res.status(200).json({
    success: true,
    message: 'Quiz deleted successfully',
  });
}

export async function createQuestion(req: Request, res: Response) {
  const { quizId } = req.params;
  const { type, text, points, explanation, order, options } = req.body;

  const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
  if (!quiz) {
    return res.status(404).json({ success: false, message: 'Quiz not found.' });
  }

  // Validate at least one correct option
  const hasCorrect = options.some((opt: any) => opt.isCorrect === true);
  if (!hasCorrect) {
    return res.status(400).json({
      success: false,
      message: 'Question must have at least one correct option.',
    });
  }

  const question = await prisma.question.create({
    data: {
      quizId,
      type: type || 'SINGLE_CHOICE',
      text,
      points: points || 10,
      explanation: explanation || null,
      order: order || 0,
      options: {
        create: options.map((opt: any) => ({
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
      },
    },
    include: { options: true },
  });

  return res.status(201).json({
    success: true,
    message: 'Question added successfully',
    question,
  });
}

export async function updateQuestion(req: Request, res: Response) {
  const { questionId } = req.params;
  const { type, text, points, explanation, order, options } = req.body;

  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) {
    return res.status(404).json({ success: false, message: 'Question not found.' });
  }

  if (options) {
    const hasCorrect = options.some((opt: any) => opt.isCorrect === true);
    if (!hasCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Question must have at least one correct option.',
      });
    }

    // Delete existing options and re-create
    await prisma.option.deleteMany({ where: { questionId } });
    await prisma.option.createMany({
      data: options.map((opt: any) => ({
        questionId,
        text: opt.text,
        isCorrect: opt.isCorrect,
      })),
    });
  }

  const updatedQuestion = await prisma.question.update({
    where: { id: questionId },
    data: {
      ...(type && { type }),
      ...(text && { text }),
      ...(points !== undefined && { points }),
      ...(explanation !== undefined && { explanation }),
      ...(order !== undefined && { order }),
    },
    include: { options: true },
  });

  return res.status(200).json({
    success: true,
    message: 'Question updated successfully',
    question: updatedQuestion,
  });
}

export async function deleteQuestion(req: Request, res: Response) {
  const { questionId } = req.params;

  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) {
    return res.status(404).json({ success: false, message: 'Question not found.' });
  }

  await prisma.question.delete({ where: { id: questionId } });

  return res.status(200).json({
    success: true,
    message: 'Question deleted successfully',
  });
}

export async function bulkImportQuestions(req: Request, res: Response) {
  const { quizId } = req.params;
  const { questions } = req.body;

  const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
  if (!quiz) {
    return res.status(404).json({ success: false, message: 'Quiz not found.' });
  }

  const rowErrors: { row: number; message: string }[] = [];

  // Row-level validation before performing any DB insertions (atomic check)
  questions.forEach((q: any, index: number) => {
    const rowNum = index + 1;
    if (!q.text || q.text.trim().length < 3) {
      rowErrors.push({ row: rowNum, message: 'Question text must be at least 3 characters long.' });
    }
    if (!Array.isArray(q.options) || q.options.length < 2) {
      rowErrors.push({ row: rowNum, message: 'Must contain at least 2 options.' });
    } else {
      const hasCorrect = q.options.some((opt: any) => opt.isCorrect === true);
      if (!hasCorrect) {
        rowErrors.push({ row: rowNum, message: 'Must contain at least 1 correct option.' });
      }
    }
  });

  if (rowErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Bulk import failed due to ${rowErrors.length} validation error(s). No questions were imported.`,
      errors: rowErrors,
    });
  }

  // Insert questions transactionally or sequentially
  const createdQuestions = [];
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const created = await prisma.question.create({
      data: {
        quizId,
        type: q.type || 'SINGLE_CHOICE',
        text: q.text,
        points: q.points || 10,
        explanation: q.explanation || null,
        order: i,
        options: {
          create: q.options.map((opt: any) => ({
            text: opt.text,
            isCorrect: Boolean(opt.isCorrect),
          })),
        },
      },
      include: { options: true },
    });
    createdQuestions.push(created);
  }

  return res.status(201).json({
    success: true,
    message: `Successfully imported ${createdQuestions.length} questions!`,
    questions: createdQuestions,
  });
}
