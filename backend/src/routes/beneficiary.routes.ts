import { Router } from 'express';
import * as beneficiaryController from '../controllers/beneficiary.controller';
import { validate } from '../middleware/validate.middleware';
import { beneficiaryQuerySchema, updateBeneficiarySchema } from '../schemas/beneficiary.schema';
import { protect, requireRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(protect);

router.post(
  '/',
  requireRole([Role.ADMIN, Role.NGO_STAFF]),
  beneficiaryController.createBeneficiary
);

router.get(
  '/',
  requireRole([Role.ADMIN, Role.NGO_STAFF]),
  validate(beneficiaryQuerySchema),
  beneficiaryController.getBeneficiaries
);

router.get(
  '/:id',
  requireRole([Role.ADMIN, Role.NGO_STAFF, Role.BENEFICIARY]),
  beneficiaryController.getBeneficiaryById
);

router.put(
  '/:id',
  requireRole([Role.ADMIN, Role.NGO_STAFF]),
  validate(updateBeneficiarySchema),
  beneficiaryController.updateBeneficiary
);

router.delete(
  '/:id',
  requireRole([Role.ADMIN, Role.NGO_STAFF]),
  beneficiaryController.deactivateBeneficiary
);

export default router;
