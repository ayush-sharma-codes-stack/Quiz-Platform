import { z } from 'zod';

export const createQuizSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(5, 'Description must be at least 5 characters'),
    category: z.string().min(2, 'Category is required'),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
    timeLimitSeconds: z.number().int().min(10, 'Time limit must be at least 10 seconds').max(7200, 'Max 2 hours'),
    passingScore: z.number().int().min(1, 'Passing score percentage must be 1-100').max(100),
    thumbnail: z.string().url('Thumbnail must be a valid URL').optional().or(z.literal('')),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  }),
});

export const updateQuizSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Quiz ID'),
  }),
  body: createQuizSchema.shape.body.partial(),
});

export const createQuestionSchema = z.object({
  params: z.object({
    quizId: z.string().uuid('Invalid Quiz ID'),
  }),
  body: z.object({
    type: z.enum(['SINGLE_CHOICE', 'MULTI_CHOICE', 'TRUE_FALSE']),
    text: z.string().min(3, 'Question text must be at least 3 characters'),
    points: z.number().int().min(1, 'Points must be at least 1').default(10),
    explanation: z.string().optional(),
    order: z.number().int().optional().default(0),
    options: z
      .array(
        z.object({
          text: z.string().min(1, 'Option text cannot be empty'),
          isCorrect: z.boolean(),
        })
      )
      .min(2, 'Must provide at least 2 options'),
  }),
});

export const updateQuestionSchema = z.object({
  params: z.object({
    quizId: z.string().uuid('Invalid Quiz ID'),
    questionId: z.string().uuid('Invalid Question ID'),
  }),
  body: z.object({
    type: z.enum(['SINGLE_CHOICE', 'MULTI_CHOICE', 'TRUE_FALSE']).optional(),
    text: z.string().min(3, 'Question text must be at least 3 characters').optional(),
    points: z.number().int().min(1).optional(),
    explanation: z.string().optional(),
    order: z.number().int().optional(),
    options: z
      .array(
        z.object({
          text: z.string().min(1, 'Option text cannot be empty'),
          isCorrect: z.boolean(),
        })
      )
      .min(2, 'Must provide at least 2 options')
      .optional(),
  }),
});

export const bulkImportSchema = z.object({
  params: z.object({
    quizId: z.string().uuid('Invalid Quiz ID'),
  }),
  body: z.object({
    questions: z.array(
      z.object({
        type: z.enum(['SINGLE_CHOICE', 'MULTI_CHOICE', 'TRUE_FALSE']),
        text: z.string().min(3, 'Question text required'),
        points: z.number().int().optional().default(10),
        explanation: z.string().optional(),
        options: z
          .array(
            z.object({
              text: z.string().min(1, 'Option text required'),
              isCorrect: z.boolean(),
            })
          )
          .min(2, 'At least 2 options required'),
      })
    ),
  }),
});

export const submitAnswerSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Attempt ID'),
  }),
  body: z.object({
    questionId: z.string().uuid('Invalid Question ID'),
    selectedOptionIds: z.array(z.string().uuid('Invalid Option ID')).min(1, 'Select at least one option'),
  }),
});
