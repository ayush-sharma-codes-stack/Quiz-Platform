import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { validate } from '../middleware/validate';
import {
  createQuizSchema,
  updateQuizSchema,
  createQuestionSchema,
  updateQuestionSchema,
  bulkImportSchema,
} from '../schemas/quiz.schema';
import {
  listQuizzes,
  createQuiz,
  getQuizDetail,
  updateQuiz,
  deleteQuiz,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  bulkImportQuestions,
} from '../controllers/adminQuiz.controller';
import {
  listUsers,
  updateUserStatus,
  updateUserRole,
  resetUserPassword,
} from '../controllers/adminUser.controller';
import {
  getOverviewAnalytics,
  getQuizAnalytics,
} from '../controllers/adminAnalytics.controller';

const router = Router();

// Protect all admin routes with authentication and ADMIN role check
router.use(requireAuth, requireRole('ADMIN'));

// Admin Quiz CRUD
router.get('/quizzes', asyncHandler(listQuizzes));
router.post('/quizzes', validate(createQuizSchema), asyncHandler(createQuiz));
router.get('/quizzes/:id', asyncHandler(getQuizDetail));
router.put('/quizzes/:id', validate(updateQuizSchema), asyncHandler(updateQuiz));
router.delete('/quizzes/:id', asyncHandler(deleteQuiz));

// Admin Question CRUD & Bulk import
router.post('/quizzes/:quizId/questions', validate(createQuestionSchema), asyncHandler(createQuestion));
router.put('/quizzes/:quizId/questions/:questionId', validate(updateQuestionSchema), asyncHandler(updateQuestion));
router.delete('/quizzes/:quizId/questions/:questionId', asyncHandler(deleteQuestion));
router.post('/quizzes/:quizId/bulk-import', validate(bulkImportSchema), asyncHandler(bulkImportQuestions));

// Admin User Management
router.get('/users', asyncHandler(listUsers));
router.patch('/users/:userId/status', asyncHandler(updateUserStatus));
router.patch('/users/:userId/role', asyncHandler(updateUserRole));
router.post('/users/:userId/reset-password', asyncHandler(resetUserPassword));

// Admin Analytics
router.get('/analytics/overview', asyncHandler(getOverviewAnalytics));
router.get('/analytics/quizzes/:id', asyncHandler(getQuizAnalytics));

export default router;
