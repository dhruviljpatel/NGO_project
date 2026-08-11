import { Request, Response } from 'express';
import * as eventService from '../services/event.service';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/response';

export const createEvent = catchAsync(async (req: Request, res: Response) => {
  const event = await eventService.createEvent(req.body);
  sendResponse(res, 201, event, 'Event created successfully');
});

export const getEvents = catchAsync(async (req: Request, res: Response) => {
  const result = await eventService.getEvents(req.query);
  sendResponse(res, 200, result.events, 'Events fetched successfully', result.meta);
});

export const getEventById = catchAsync(async (req: Request, res: Response) => {
  const event = await eventService.getEventById((req.params.id as string));
  sendResponse(res, 200, event, 'Event fetched successfully');
});

export const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const event = await eventService.updateEvent((req.params.id as string), req.body);
  sendResponse(res, 200, event, 'Event updated successfully');
});

export const registerForEvent = catchAsync(async (req: Request, res: Response) => {
  const targetVolunteerId = req.body.volunteerId;
  const registration = await eventService.registerForEvent((req.params.id as string), req.user!.id, targetVolunteerId);
  sendResponse(res, 201, registration, 'Registered for event successfully');
});

export const cancelRegistration = catchAsync(async (req: Request, res: Response) => {
  const targetVolunteerId = req.body.volunteerId;
  await eventService.cancelRegistration((req.params.id as string), req.user!.id, targetVolunteerId);
  sendResponse(res, 204, null, 'Registration cancelled successfully');
});
