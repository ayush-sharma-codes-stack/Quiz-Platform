import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { getGlobalLeaderboard, getQuizLeaderboard } from '../controllers/leaderboard.controller';

const router = Router();

router.get('/global', asyncHandler(getGlobalLeaderboard));
router.get('/:quizId', asyncHandler(getQuizLeaderboard));

export default router;
