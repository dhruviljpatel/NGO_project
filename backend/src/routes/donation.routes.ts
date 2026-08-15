import { Router } from 'express';
import * as donationController from '../controllers/donation.controller';
import { validate } from '../middleware/validate.middleware';
import { createDonationSchema, updateDonationStatusSchema, donationQuerySchema } from '../schemas/donation.schema';
import { protect, requireRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(protect);

router.post(
  '/',
  requireRole([Role.DONOR]), // Only donors can create donations through this flow
  validate(createDonationSchema),
  donationController.createDonation
);

router.get(
  '/',
  requireRole([Role.ADMIN, Role.NGO_STAFF, Role.DONOR]),
  validate(donationQuerySchema),
  donationController.getDonations
);

router.get(
  '/:id',
  requireRole([Role.ADMIN, Role.NGO_STAFF, Role.DONOR]),
  donationController.getDonationById
);

router.put(
  '/:id',
  requireRole([Role.ADMIN, Role.NGO_STAFF]), // Only staff can confirm/fail donations
  validate(updateDonationStatusSchema),
  donationController.updateDonationStatus
);

export default router;
