import { Router } from 'express';
import * as eventController from '../controllers/event.controller';
import { validate } from '../middleware/validate.middleware';
import { createEventSchema, updateEventSchema, eventQuerySchema, registerEventSchema } from '../schemas/event.schema';
import { protect, requireRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.post(
  '/',
  protect,
  requireRole([Role.ADMIN, Role.NGO_STAFF]),
  validate(createEventSchema),
  eventController.createEvent
);

router.get(
  '/',
  validate(eventQuerySchema),
  eventController.getEvents
);

router.get('/:id', eventController.getEventById);

router.patch(
  '/:id',
  protect,
  requireRole([Role.ADMIN, Role.NGO_STAFF]),
  validate(updateEventSchema),
  eventController.updateEvent
);

router.post(
  '/:id/register',
  protect,
  requireRole([Role.ADMIN, Role.NGO_STAFF, Role.VOLUNTEER]),
  eventController.registerForEvent
);

router.delete(
  '/:id/register',
  protect,
  requireRole([Role.ADMIN, Role.NGO_STAFF, Role.VOLUNTEER]),
  eventController.cancelRegistration
);

export default router;
