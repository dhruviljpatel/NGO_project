import prisma from '../config/db';
import { AppError } from '../utils/AppError';
import { EventStatus, Role } from '@prisma/client';

export const createEvent = async (data: any) => {
  return await prisma.event.create({
    data: {
      ...data,
      date: new Date(data.date),
    },
  });
};

export const getEvents = async (query: any) => {
  const { status, projectId, page = '1', limit = '10' } = query;
  
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const skip = (pageNumber - 1) * pageSize;

  const where: any = {};
  if (status) where.status = status as EventStatus;
  if (projectId) where.projectId = projectId;

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    }),
    prisma.event.count({ where }),
  ]);

  return { events, meta: { page: pageNumber, limit: pageSize, total } };
};

export const getEventById = async (id: string) => {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      project: true,
      registrations: {
        include: {
          volunteer: {
            select: { id: true, name: true, phone: true }
          }
        }
      }
    }
  });

  if (!event) throw new AppError('Event not found', 404);
  return event;
};

export const updateEvent = async (id: string, data: any) => {
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) throw new AppError('Event not found', 404);

  const updatedData = { ...data };
  if (data.date) updatedData.date = new Date(data.date);

  // If status is CANCELLED, we should ideally notify volunteers (part of business rule)
  const updatedEvent = await prisma.event.update({
    where: { id },
    data: updatedData,
  });

  if (updatedData.status === 'CANCELLED' && event.status !== 'CANCELLED') {
    // Notify all registered volunteers
    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId: id },
      include: { volunteer: { select: { userId: true } } }
    });

    const notifications = registrations.map(reg => ({
      userId: reg.volunteer.userId,
      message: `The event "${event.name}" has been cancelled.`,
      type: 'EVENT_CANCELLED'
    }));

    if (notifications.length > 0) {
      await prisma.notification.createMany({ data: notifications });
    }
  }

  return updatedEvent;
};

export const registerForEvent = async (eventId: string, userId: string, targetVolunteerId?: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { volunteerProfile: true } });
  
  let volunteerId = targetVolunteerId;
  
  if (user?.role === Role.VOLUNTEER) {
    if (!user.volunteerProfile) throw new AppError('Volunteer profile not found', 404);
    volunteerId = user.volunteerProfile.id;
  }
  
  if (!volunteerId) throw new AppError('Volunteer ID required', 400);

  return await prisma.$transaction(async (tx) => {
    const event = await tx.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { registrations: true } } }
    });

    if (!event) throw new AppError('Event not found', 404);
    
    if (event.status !== 'OPEN_FOR_REGISTRATION') {
      throw new AppError('Event is not open for registration', 400);
    }

    if (event._count.registrations >= event.capacity) {
      // Mark as FULL if it reached capacity exactly now (though ideally done immediately after registration)
      throw new AppError('Event is at full capacity', 400);
    }

    const existingReg = await tx.eventRegistration.findUnique({
      where: { eventId_volunteerId: { eventId, volunteerId } }
    });

    if (existingReg) {
      throw new AppError('You are already registered for this event', 400);
    }

    const registration = await tx.eventRegistration.create({
      data: {
        eventId,
        volunteerId
      }
    });

    // Check if event should be marked as full
    if (event._count.registrations + 1 >= event.capacity) {
      await tx.event.update({
        where: { id: eventId },
        data: { status: 'FULL' }
      });
    }

    // Send Notification
    await tx.notification.create({
      data: {
        userId: user!.id,
        message: `You have successfully registered for ${event.name}.`,
        type: 'EVENT_REGISTERED'
      }
    });

    return registration;
  });
};

export const cancelRegistration = async (eventId: string, userId: string, targetVolunteerId?: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { volunteerProfile: true } });
  
  let volunteerId = targetVolunteerId;
  if (user?.role === Role.VOLUNTEER) {
    if (!user.volunteerProfile) throw new AppError('Volunteer profile not found', 404);
    volunteerId = user.volunteerProfile.id;
  }
  
  if (!volunteerId) throw new AppError('Volunteer ID required', 400);

  const registration = await prisma.eventRegistration.findUnique({
    where: { eventId_volunteerId: { eventId, volunteerId } }
  });

  if (!registration) {
    throw new AppError('Registration not found', 404);
  }

  await prisma.eventRegistration.delete({
    where: { id: registration.id }
  });

  // Check if we need to open the event again
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { _count: { select: { registrations: true } } }
  });

  if (event && event.status === 'FULL' && event._count.registrations < event.capacity) {
    await prisma.event.update({
      where: { id: eventId },
      data: { status: 'OPEN_FOR_REGISTRATION' }
    });
  }

  return null;
};
