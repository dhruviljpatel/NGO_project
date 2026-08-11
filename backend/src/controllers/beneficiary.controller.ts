import { Request, Response } from 'express';
import * as beneficiaryService from '../services/beneficiary.service';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/response';
import { Role } from '@prisma/client';

export const getBeneficiaries = catchAsync(async (req: Request, res: Response) => {
  const result = await beneficiaryService.getBeneficiaries(req.query);
  sendResponse(res, 200, result.beneficiaries, 'Beneficiaries fetched successfully', result.meta);
});

export const getBeneficiaryById = catchAsync(async (req: Request, res: Response) => {
  const beneficiary = await beneficiaryService.getBeneficiaryById((req.params.id as string));

  // If the user is a beneficiary, they can only view their own profile
  if (req.user!.role === Role.BENEFICIARY) {
    if (beneficiary.userId !== req.user!.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
  }

  sendResponse(res, 200, beneficiary, 'Beneficiary fetched successfully');
});

export const updateBeneficiary = catchAsync(async (req: Request, res: Response) => {
  const beneficiary = await beneficiaryService.updateBeneficiary((req.params.id as string), req.body);
  sendResponse(res, 200, beneficiary, 'Beneficiary updated successfully');
});

export const deactivateBeneficiary = catchAsync(async (req: Request, res: Response) => {
  await beneficiaryService.deactivateBeneficiary((req.params.id as string));
  sendResponse(res, 204, null, 'Beneficiary deactivated successfully');
});
