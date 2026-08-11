import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';
import { Role } from '@prisma/client';
import { AppError } from '../utils/AppError';

export const registerUser = async (data: any) => {
  const { email, password, role, name, phone } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError('Email is already in use', 400);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // We use a transaction to ensure both user and profile are created
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email,
        passwordHash,
        role,
      },
    });

    if (role === Role.VOLUNTEER) {
      await tx.volunteerProfile.create({
        data: {
          userId: newUser.id,
          name,
          phone,
          skills: [],
        },
      });
    } else if (role === Role.DONOR) {
      await tx.donorProfile.create({
        data: {
          userId: newUser.id,
          name,
        },
      });
    } else if (role === Role.BENEFICIARY) {
      await tx.beneficiaryProfile.create({
        data: {
          userId: newUser.id,
          name,
          age: 0,
          gender: 'Not Specified',
          location: 'Not Specified',
          familySize: 1,
          program: 'Default',
        },
      });
    }
    return newUser;
  });

  const token = generateToken(user.id);
  return { user, token };
};

export const loginUser = async (data: any) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(user.id);
  return { user, token };
};

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
  });
};
