import { Router } from 'express';
import * as projectController from '../controllers/project.controller';
import { validate } from '../middleware/validate.middleware';
import { 
  createProjectSchema, updateProjectSchema, projectQuerySchema, 
  assignVolunteerSchema, assignBeneficiarySchema 
} from '../schemas/project.schema';
import { protect, requireRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.post(
  '/',
  protect,
  requireRole([Role.ADMIN, Role.NGO_STAFF]),
  validate(createProjectSchema),
  projectController.createProject
);

router.get(
  '/',
  validate(projectQuerySchema),
  projectController.getProjects
);

router.get('/:id', projectController.getProjectById);

router.put(
  '/:id',
  protect,
  requireRole([Role.ADMIN, Role.NGO_STAFF]),
  validate(updateProjectSchema),
  projectController.updateProject
);

router.post(
  '/:id/assign-volunteer',
  protect,
  requireRole([Role.ADMIN, Role.NGO_STAFF]),
  validate(assignVolunteerSchema),
  projectController.assignVolunteer
);

router.post(
  '/:id/assign-beneficiary',
  protect,
  requireRole([Role.ADMIN, Role.NGO_STAFF]),
  validate(assignBeneficiarySchema),
  projectController.assignBeneficiary
);

export default router;
