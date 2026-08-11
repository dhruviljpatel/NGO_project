import prisma from '../config/db';
import { AppError } from '../utils/AppError';
import { BeneficiaryStatus } from '@prisma/client';

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
