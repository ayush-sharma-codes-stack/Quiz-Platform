import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { getPublishedQuizzes, getPublicQuizDetail } from '../controllers/quiz.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Optional auth context if user is logged in
router.get('/', asyncHandler(getPublishedQuizzes));

// Express route for getting detailed quiz preview (with question list)
router.get('/:id', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return requireAuth(req, res, () => getPublicQuizDetail(req, res));
  }
  return asyncHandler(getPublicQuizDetail)(req, res, next);
});

export default router;
