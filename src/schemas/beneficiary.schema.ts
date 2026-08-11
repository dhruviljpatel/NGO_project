import { z } from 'zod';

export const beneficiaryQuerySchema = z.object({
  query: z.object({
    name: z.string().optional(),
    location: z.string().optional(),
    program: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});

export const updateBeneficiarySchema = z.object({
  body: z.object({
    name: z.string().optional(),
    age: z.number().int().nonnegative().optional(),
    gender: z.string().optional(),
    location: z.string().optional(),
    contact: z.string().optional(),
    familySize: z.number().int().positive().optional(),
    program: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
});
