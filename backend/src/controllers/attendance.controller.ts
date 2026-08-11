import { Request, Response } from 'express';
import * as attendanceService from '../services/attendance.service';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/response';

export const markAttendance = catchAsync(async (req: Request, res: Response) => {
  const result = await attendanceService.markAttendance((req.params.registrationId as string), req.body.status);
  sendResponse(res, 200, result, 'Attendance marked successfully');
});
