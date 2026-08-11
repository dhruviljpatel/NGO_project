import { Request, Response } from 'express';
import * as projectService from '../services/project.service';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/response';

export const createProject = catchAsync(async (req: Request, res: Response) => {
  const project = await projectService.createProject(req.body);
  sendResponse(res, 201, project, 'Project created successfully');
});

export const getProjects = catchAsync(async (req: Request, res: Response) => {
  const result = await projectService.getProjects(req.query);
  sendResponse(res, 200, result.projects, 'Projects fetched successfully', result.meta);
});

export const getProjectById = catchAsync(async (req: Request, res: Response) => {
  const project = await projectService.getProjectById((req.params.id as string));
  sendResponse(res, 200, project, 'Project fetched successfully');
});

export const updateProject = catchAsync(async (req: Request, res: Response) => {
  const project = await projectService.updateProject((req.params.id as string), req.body);
  sendResponse(res, 200, project, 'Project updated successfully');
});

export const assignVolunteer = catchAsync(async (req: Request, res: Response) => {
  const assignment = await projectService.assignVolunteer((req.params.id as string), req.body.volunteerId);
  sendResponse(res, 201, assignment, 'Volunteer assigned to project successfully');
});

export const assignBeneficiary = catchAsync(async (req: Request, res: Response) => {
  const assignment = await projectService.assignBeneficiary((req.params.id as string), req.body.beneficiaryId);
  sendResponse(res, 201, assignment, 'Beneficiary assigned to project successfully');
});
