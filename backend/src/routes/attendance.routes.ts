import { Router } from 'express';
import * as attendanceController from '../controllers/attendance.controller';
import { validate } from '../middleware/validate.middleware';
import { markAttendanceSchema } from '../schemas/attendance.schema';
import { protect, requireRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(protect);

router.patch(
  '/:registrationId',
  requireRole([Role.ADMIN, Role.NGO_STAFF]),
  validate(markAttendanceSchema),
  attendanceController.markAttendance
);

export default router;
