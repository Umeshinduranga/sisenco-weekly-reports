import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireAuth, requireRole } from '../middleware/auth';
import { dashboardController } from '../controllers/dashboardController';

const router = Router();

router.use(requireAuth);
router.use(requireRole('manager'));

router.get('/summary', asyncHandler(dashboardController.summary));
router.get('/submission-status', asyncHandler(dashboardController.submissionStatus));
router.get('/workload', asyncHandler(dashboardController.workload));
router.get('/project-breakdown', asyncHandler(dashboardController.projectBreakdown));

export default router;
