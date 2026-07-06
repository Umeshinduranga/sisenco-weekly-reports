import { Router } from 'express';
import { reportController } from '../controllers/reportController';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { reportCreateSchema, reportUpdateSchema } from '../validators/reportValidators';

const router = Router();

router.use(requireAuth);

router.get('/my', asyncHandler(reportController.getMyReports));
router.post('/', validate(reportCreateSchema), asyncHandler(reportController.create));
router.put('/:id', validate(reportUpdateSchema), asyncHandler(reportController.update));
router.patch('/:id/submit', asyncHandler(reportController.submit));
router.get('/all', requireRole('manager'), asyncHandler(reportController.getAll));

export default router;
