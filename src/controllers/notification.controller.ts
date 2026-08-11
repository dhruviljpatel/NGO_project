import { Request, Response } from 'express';
import * as notificationService from '../services/notification.service';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/response';

export const getNotifications = catchAsync(async (req: Request, res: Response) => {
  const result = await notificationService.getNotifications(req.user!.id, req.query);
  sendResponse(res, 200, result.notifications, 'Notifications fetched successfully', result.meta);
});

export const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const notification = await notificationService.markAsRead((req.params.id as string), req.user!.id);
  sendResponse(res, 200, notification, 'Notification marked as read');
});
