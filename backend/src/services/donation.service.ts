import prisma from '../config/db';
import { AppError } from '../utils/AppError';
import { DonationStatus, Role } from '@prisma/client';

export const createDonation = async (userId: string, data: any) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { donorProfile: true } });
  
  if (user?.role !== Role.DONOR || !user.donorProfile) {
    throw new AppError('Only registered donors can make donations through this endpoint', 403);
  }

  const donation = await prisma.donation.create({
    data: {
      ...data,
      donorId: user.donorProfile.id,
      status: 'PENDING', // Initial status is always pending until confirmed
    },
  });

  return donation;
};

export const updateDonationStatus = async (donationId: string, status: DonationStatus, receiptUrl?: string) => {
  return await prisma.$transaction(async (tx) => {
    const donation = await tx.donation.findUnique({ where: { id: donationId } });
    if (!donation) throw new AppError('Donation not found', 404);

    if (donation.status === status) {
      return donation;
    }

    const updatedDonation = await tx.donation.update({
      where: { id: donationId },
      data: { status, receiptUrl },
    });

    // If changing to SUCCESSFUL from anything else
    if (status === 'SUCCESSFUL' && donation.status !== 'SUCCESSFUL') {
      await tx.donorProfile.update({
        where: { id: donation.donorId },
        data: { totalDonated: { increment: donation.amount } },
      });

      if (donation.projectId) {
        await tx.project.update({
          where: { id: donation.projectId },
          data: { totalDonations: { increment: donation.amount } },
        });
      }
    } 
    // If changing FROM SUCCESSFUL to anything else (e.g. REFUNDED)
    else if (donation.status === 'SUCCESSFUL' && status !== 'SUCCESSFUL') {
      await tx.donorProfile.update({
        where: { id: donation.donorId },
        data: { totalDonated: { decrement: donation.amount } },
      });

      if (donation.projectId) {
        await tx.project.update({
          where: { id: donation.projectId },
          data: { totalDonations: { decrement: donation.amount } },
        });
      }
    }

    // Send notification for successful donation
    if (status === 'SUCCESSFUL') {
      const donor = await tx.donorProfile.findUnique({ where: { id: donation.donorId } });
      if (donor) {
        await tx.notification.create({
          data: {
            userId: donor.userId,
            message: `Your donation of $${donation.amount} has been successfully processed. Thank you!`,
            type: 'DONATION_SUCCESS'
          }
        });
      }
    }

    return updatedDonation;
  });
};

export const getDonations = async (query: any, userId: string, role: Role) => {
  const { projectId, status, page = '1', limit = '10' } = query;
  
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const skip = (pageNumber - 1) * pageSize;

  const where: any = {};
  if (projectId) where.projectId = projectId;
  if (status) where.status = status as DonationStatus;

  // Donors can only see their own donations
  if (role === Role.DONOR) {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { donorProfile: true } });
    if (user?.donorProfile) {
      where.donorId = user.donorProfile.id;
    } else {
      return { donations: [], meta: { page: pageNumber, limit: pageSize, total: 0 } };
    }
  }

  const [donations, total] = await Promise.all([
    prisma.donation.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        donor: { select: { name: true } },
        project: { select: { name: true } }
      },
    }),
    prisma.donation.count({ where }),
  ]);

  return { donations, meta: { page: pageNumber, limit: pageSize, total } };
};

export const getDonationById = async (id: string, userId: string, role: Role) => {
  const donation = await prisma.donation.findUnique({
    where: { id },
    include: {
      donor: true,
      project: true,
    }
  });

  if (!donation) throw new AppError('Donation not found', 404);

  // If user is donor, ensure it's their donation
  if (role === Role.DONOR) {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { donorProfile: true } });
    if (!user?.donorProfile || donation.donorId !== user.donorProfile.id) {
      throw new AppError('Access denied', 403);
    }
  }

  return donation;
};
