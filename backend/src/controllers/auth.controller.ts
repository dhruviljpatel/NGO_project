import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/response';

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);
  sendResponse(res, 201, result, 'User registered successfully');
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);
  sendResponse(res, 200, result, 'User logged in successfully');
});

export const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, 200, req.user, 'Current user fetched successfully');
});
