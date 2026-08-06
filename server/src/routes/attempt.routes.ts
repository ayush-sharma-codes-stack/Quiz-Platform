import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { validate } from '../middleware/validate';
import { submitAnswerSchema } from '../schemas/quiz.schema';
import {
  startAttempt,
  saveAttemptAnswer,
  finalizeAttempt,
  getAttemptHistory,
  getAttemptDetail,
} from '../controllers/attempt.controller';

const router = Router();

router.use(requireAuth);

router.post('/', asyncHandler(startAttempt));
router.post('/:id/answer', validate(submitAnswerSchema), asyncHandler(saveAttemptAnswer));
router.post('/:id/submit', asyncHandler(finalizeAttempt));
router.get('/history', asyncHandler(getAttemptHistory));
router.get('/:id', asyncHandler(getAttemptDetail));

export default router;
