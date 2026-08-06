import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { getMyProfile, getMyBadges } from '../controllers/user.controller';

const router = Router();

router.use(requireAuth);

router.get('/me', asyncHandler(getMyProfile));
router.get('/me/badges', asyncHandler(getMyBadges));

export default router;
