import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { projectController } from '../controllers/projectController';
import { projectCreateSchema, projectUpdateSchema } from '../validators/projectValidators';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(projectController.list));
router.post('/', requireRole('manager'), validate(projectCreateSchema), asyncHandler(projectController.create));
router.put('/:id', requireRole('manager'), validate(projectUpdateSchema), asyncHandler(projectController.update));
router.delete('/:id', requireRole('manager'), asyncHandler(projectController.remove));

export default router;
