import { z } from 'zod';

export const updateVolunteerSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    skills: z.array(z.string()).optional(),
    availability: z.string().optional(),
    location: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
});

export const volunteerQuerySchema = z.object({
  query: z.object({
    name: z.string().optional(),
    skill: z.string().optional(),
    location: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});
