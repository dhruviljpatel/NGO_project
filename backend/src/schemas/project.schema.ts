import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    goal: z.number().positive().optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime().optional(),
    targetBeneficiaries: z.number().int().positive(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    goal: z.number().positive().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    targetBeneficiaries: z.number().int().positive().optional(),
    status: z.enum(['ACTIVE', 'COMPLETED']).optional(),
  }),
});

export const projectQuerySchema = z.object({
  query: z.object({
    status: z.enum(['ACTIVE', 'COMPLETED']).optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});

export const assignVolunteerSchema = z.object({
  body: z.object({
    volunteerId: z.string().uuid(),
  }),
});

export const assignBeneficiarySchema = z.object({
  body: z.object({
    beneficiaryId: z.string().uuid(),
  }),
});
