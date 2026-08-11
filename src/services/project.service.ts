import prisma from '../config/db';
import { AppError } from '../utils/AppError';
import { ProjectStatus } from '@prisma/client';

export const createProject = async (data: any) => {
  return await prisma.project.create({
    data: {
      ...data,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
  });
};

export const getProjects = async (query: any) => {
  const { status, page = '1', limit = '10' } = query;
  
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const skip = (pageNumber - 1) * pageSize;

  const where: any = {};
  if (status) where.status = status as ProjectStatus;

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        _count: {
          select: { volunteers: true, beneficiaries: true, donations: true },
        },
      },
    }),
    prisma.project.count({ where }),
  ]);

  return { projects, meta: { page: pageNumber, limit: pageSize, total } };
};

export const getProjectById = async (id: string) => {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      volunteers: {
        include: { volunteer: true }
      },
      beneficiaries: {
        include: { beneficiary: true }
      },
      events: true,
      donations: true,
    }
  });

  if (!project) throw new AppError('Project not found', 404);
  return project;
};

export const updateProject = async (id: string, data: any) => {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new AppError('Project not found', 404);

  const updatedData = { ...data };
  if (data.startDate) updatedData.startDate = new Date(data.startDate);
  if (data.endDate) updatedData.endDate = new Date(data.endDate);

  return await prisma.project.update({
    where: { id },
    data: updatedData,
  });
};

export const assignVolunteer = async (projectId: string, volunteerId: string) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new AppError('Project not found', 404);

  const volunteer = await prisma.volunteerProfile.findUnique({ where: { id: volunteerId } });
  if (!volunteer) throw new AppError('Volunteer not found', 404);

  return await prisma.projectVolunteer.create({
    data: {
      projectId,
      volunteerId,
    },
  });
};

export const assignBeneficiary = async (projectId: string, beneficiaryId: string) => {
  return await prisma.$transaction(async (tx) => {
    const project = await tx.project.findUnique({ where: { id: projectId } });
    if (!project) throw new AppError('Project not found', 404);

    const beneficiary = await tx.beneficiaryProfile.findUnique({ where: { id: beneficiaryId } });
    if (!beneficiary) throw new AppError('Beneficiary not found', 404);

    const assignment = await tx.projectBeneficiary.create({
      data: {
        projectId,
        beneficiaryId,
      },
    });

    await tx.project.update({
      where: { id: projectId },
      data: {
        currentBeneficiaries: { increment: 1 }
      }
    });

    return assignment;
  });
};
