import { Request, Response } from 'express';
import * as volunteerService from '../services/volunteer.service';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/response';

export const getVolunteers = catchAsync(async (req: Request, res: Response) => {
  const result = await volunteerService.getVolunteers(req.query);
  sendResponse(res, 200, result.volunteers, 'Volunteers fetched successfully', result.meta);
});

export const getVolunteerById = catchAsync(async (req: Request, res: Response) => {
  const volunteer = await volunteerService.getVolunteerById((req.params.id as string));
  sendResponse(res, 200, volunteer, 'Volunteer fetched successfully');
});

export const updateVolunteer = catchAsync(async (req: Request, res: Response) => {
  const volunteer = await volunteerService.updateVolunteer((req.params.id as string), req.body);
  sendResponse(res, 200, volunteer, 'Volunteer updated successfully');
});

export const deactivateVolunteer = catchAsync(async (req: Request, res: Response) => {
  await volunteerService.deactivateVolunteer((req.params.id as string));
  sendResponse(res, 204, null, 'Volunteer deactivated successfully');
});
