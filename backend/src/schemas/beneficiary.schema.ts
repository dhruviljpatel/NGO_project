import { z } from '../utils/zod-openapi';

export const beneficiaryQuerySchema = z.object({
  query: z.object({
    name: z.string().optional().openapi({ description: 'Filter by name' }),
    location: z.string().optional(),
    program: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});

export const updateBeneficiarySchema = z.object({
  body: z.object({
    name: z.string().optional().openapi({ example: 'John Doe' }),
    age: z.number().int().nonnegative().optional().openapi({ example: 30 }),
    gender: z.string().optional().openapi({ example: 'Male' }),
    location: z.string().optional().openapi({ example: 'New York' }),
    contact: z.string().optional().openapi({ example: '+1234567890' }),
    familySize: z.number().int().positive().optional().openapi({ example: 4 }),
    program: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
});
