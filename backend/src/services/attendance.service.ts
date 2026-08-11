import prisma from '../config/db';
import { AppError } from '../utils/AppError';
import { AttendanceStatus } from '@prisma/client';

export const markAttendance = async (registrationId: string, status: AttendanceStatus) => {
  return await prisma.$transaction(async (tx) => {
    const registration = await tx.eventRegistration.findUnique({
      where: { id: registrationId },
      include: {
        event: true,
        volunteer: true,
      },
    });

    if (!registration) {
      throw new AppError('Registration not found', 404);
    }

    const previousStatus = registration.attendanceStatus;
    const hoursToLog = (status === 'PRESENT' || status === 'LATE') ? registration.event.duration : 0;
    const previousHoursLogged = registration.hoursLogged;

    // Update the registration
    const updatedRegistration = await tx.eventRegistration.update({
      where: { id: registrationId },
      data: {
        attendanceStatus: status,
        hoursLogged: hoursToLog,
      },
    });

    // Calculate the difference in hours
    const hoursDifference = hoursToLog - previousHoursLogged;

    let eventsParticipatedDifference = 0;
    if (!previousStatus && (status === 'PRESENT' || status === 'LATE')) {
      eventsParticipatedDifference = 1;
    } else if ((previousStatus === 'PRESENT' || previousStatus === 'LATE') && status === 'ABSENT') {
      eventsParticipatedDifference = -1;
    } else if (!previousStatus && status === 'ABSENT') {
      eventsParticipatedDifference = 0;
    }

    // Update the volunteer profile's total hours and events participated
    await tx.volunteerProfile.update({
      where: { id: registration.volunteerId },
      data: {
        totalHours: {
          increment: hoursDifference,
        },
        eventsParticipated: {
          increment: eventsParticipatedDifference,
        },
      },
    });

    return updatedRegistration;
  });
};
