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

router.use(protect);

router.post(
  '/',
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

router.patch(
  '/:id',
  requireRole([Role.ADMIN, Role.NGO_STAFF]),
  validate(updateProjectSchema),
  projectController.updateProject
);

router.post(
  '/:id/volunteers',
  requireRole([Role.ADMIN, Role.NGO_STAFF]),
  validate(assignVolunteerSchema),
  projectController.assignVolunteer
);

router.post(
  '/:id/beneficiaries',
  requireRole([Role.ADMIN, Role.NGO_STAFF]),
  validate(assignBeneficiarySchema),
  projectController.assignBeneficiary
);

export default router;
