import { Router } from 'express';
import * as volunteerController from '../controllers/volunteer.controller';
import { validate } from '../middleware/validate.middleware';
import { updateVolunteerSchema, volunteerQuerySchema } from '../schemas/volunteer.schema';
import { protect, requireRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Protect all volunteer routes
router.use(protect);

router.get(
  '/',
  requireRole([Role.ADMIN, Role.NGO_STAFF]),
  validate(volunteerQuerySchema),
  volunteerController.getVolunteers
);

router.get(
  '/:id',
  requireRole([Role.ADMIN, Role.NGO_STAFF, Role.VOLUNTEER]), // Volunteers can view their own profile (authorization logic could be added to check if it's them)
  volunteerController.getVolunteerById
);

router.patch(
  '/:id',
  requireRole([Role.ADMIN, Role.NGO_STAFF, Role.VOLUNTEER]),
  validate(updateVolunteerSchema),
  volunteerController.updateVolunteer
);

router.delete(
  '/:id',
  requireRole([Role.ADMIN, Role.NGO_STAFF]),
  volunteerController.deactivateVolunteer
);

export default router;
