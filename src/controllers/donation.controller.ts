import { Request, Response } from 'express';
import * as donationService from '../services/donation.service';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/response';

export const createDonation = catchAsync(async (req: Request, res: Response) => {
  const donation = await donationService.createDonation(req.user!.id, req.body);
  sendResponse(res, 201, donation, 'Donation created successfully');
});

export const updateDonationStatus = catchAsync(async (req: Request, res: Response) => {
  const { status, receiptUrl } = req.body;
  const donation = await donationService.updateDonationStatus((req.params.id as string), status, receiptUrl);
  sendResponse(res, 200, donation, 'Donation status updated successfully');
});

export const getDonations = catchAsync(async (req: Request, res: Response) => {
  const result = await donationService.getDonations(req.query, req.user!.id, req.user!.role);
  sendResponse(res, 200, result.donations, 'Donations fetched successfully', result.meta);
});

export const getDonationById = catchAsync(async (req: Request, res: Response) => {
  const donation = await donationService.getDonationById((req.params.id as string), req.user!.id, req.user!.role);
  sendResponse(res, 200, donation, 'Donation fetched successfully');
});
