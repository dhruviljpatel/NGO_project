import prisma from '../config/db';
import { AppError } from '../utils/AppError';
import { BeneficiaryStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const createBeneficiary = async (data: any) => {
  const dummyEmail = `beneficiary_${crypto.randomUUID()}@ngo.local`;
  const passwordHash = await bcrypt.hash(crypto.randomUUID(), 10);

  return await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email: dummyEmail,
        passwordHash,
        role: 'BENEFICIARY',
      },
    });

    const statusMap: Record<string, BeneficiaryStatus> = {
      'Active': 'ACTIVE',
      'Supported': 'ACTIVE',
      'Completed': 'INACTIVE',
      'Pending': 'INACTIVE',
      'In Progress': 'ACTIVE'
    };

    const newBeneficiary = await tx.beneficiaryProfile.create({
      data: {
        userId: newUser.id,
        name: data.name,
        location: data.location || 'Not Specified',
        program: data.program || data.needs || 'Default',
        age: data.age || 0,
        gender: data.gender || 'Not Specified',
        familySize: data.familySize || 1,
        status: statusMap[data.status] || 'ACTIVE',
      },
    });

    if (data.projectId) {
      await tx.projectBeneficiary.create({
        data: {
          projectId: data.projectId,
          beneficiaryId: newBeneficiary.id,
        }
      });
    }

    return newBeneficiary;
  });
};

export const getBeneficiaries = async (query: any) => {
  const { name, location, program, status, page = '1', limit = '10' } = query;
  
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const skip = (pageNumber - 1) * pageSize;

  const where: any = {};
  if (name) where.name = { contains: name, mode: 'insensitive' };
  if (location) where.location = { contains: location, mode: 'insensitive' };
  if (program) where.program = { contains: program, mode: 'insensitive' };
  if (status) where.status = status as BeneficiaryStatus;

  const [beneficiaries, total] = await Promise.all([
    prisma.beneficiaryProfile.findMany({
      where,
      skip,
      take: pageSize,
    }),
    prisma.beneficiaryProfile.count({ where }),
  ]);

  return { beneficiaries, meta: { page: pageNumber, limit: pageSize, total } };
};

export const getBeneficiaryById = async (id: string) => {
  const beneficiary = await prisma.beneficiaryProfile.findUnique({
    where: { id },
  });

  if (!beneficiary) {
    throw new AppError('Beneficiary not found', 404);
  }

  return beneficiary;
};

export const updateBeneficiary = async (id: string, data: any) => {
  const beneficiary = await prisma.beneficiaryProfile.findUnique({ where: { id } });
  if (!beneficiary) throw new AppError('Beneficiary not found', 404);

  return await prisma.beneficiaryProfile.update({
    where: { id },
    data,
  });
};

export const deactivateBeneficiary = async (id: string) => {
  const beneficiary = await prisma.beneficiaryProfile.findUnique({ where: { id } });
  if (!beneficiary) throw new AppError('Beneficiary not found', 404);

  return await prisma.beneficiaryProfile.update({
    where: { id },
    data: { status: 'INACTIVE' },
  });
};
