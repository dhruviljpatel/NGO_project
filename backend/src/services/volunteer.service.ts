import prisma from '../config/db';
import { AppError } from '../utils/AppError';
import { VolunteerStatus, Role } from '@prisma/client';

export const getVolunteers = async (query: any) => {
  const { name, skill, location, status, page = '1', limit = '10' } = query;
  
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const skip = (pageNumber - 1) * pageSize;

  const where: any = {};
  
  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }
  if (skill) {
    where.skills = { has: skill };
  }
  if (location) {
    where.location = { contains: location, mode: 'insensitive' };
  }
  if (status) {
    where.status = status as VolunteerStatus;
  }

  const [volunteers, total] = await Promise.all([
    prisma.volunteerProfile.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        user: {
          select: { email: true, createdAt: true },
        },
      },
    }),
    prisma.volunteerProfile.count({ where }),
  ]);

  return {
    volunteers,
    meta: { page: pageNumber, limit: pageSize, total },
  };
};

export const getVolunteerById = async (id: string) => {
  const volunteer = await prisma.volunteerProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: { email: true },
      },
      registrations: {
        include: { event: true },
      },
    },
  });

  if (!volunteer) {
    throw new AppError('Volunteer not found', 404);
  }

  return volunteer;
};

export const updateVolunteer = async (id: string, data: any) => {
  const volunteer = await prisma.volunteerProfile.findUnique({ where: { id } });
  if (!volunteer) {
    throw new AppError('Volunteer not found', 404);
  }

  const updatedVolunteer = await prisma.volunteerProfile.update({
    where: { id },
    data,
  });

  return updatedVolunteer;
};

export const deactivateVolunteer = async (id: string) => {
  const volunteer = await prisma.volunteerProfile.findUnique({ where: { id } });
  if (!volunteer) {
    throw new AppError('Volunteer not found', 404);
  }

  await prisma.volunteerProfile.update({
    where: { id },
    data: { status: 'INACTIVE' },
  });

  return null;
};
