import { z } from 'zod';

export const createEventSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    date: z.string().datetime(),
    location: z.string().min(1, 'Location is required'),
    capacity: z.number().positive(),
    description: z.string(),
    duration: z.number().positive(),
    projectId: z.string().uuid().optional(),
    status: z.enum(['UPCOMING', 'OPEN_FOR_REGISTRATION', 'FULL', 'COMPLETED', 'CANCELLED']).optional(),
  }),
});

export const updateEventSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    date: z.string().datetime().optional(),
    location: z.string().optional(),
    capacity: z.number().positive().optional(),
    description: z.string().optional(),
    duration: z.number().positive().optional(),
    projectId: z.string().uuid().optional(),
    status: z.enum(['UPCOMING', 'OPEN_FOR_REGISTRATION', 'FULL', 'COMPLETED', 'CANCELLED']).optional(),
  }),
});

export const eventQuerySchema = z.object({
  query: z.object({
    status: z.enum(['UPCOMING', 'OPEN_FOR_REGISTRATION', 'FULL', 'COMPLETED', 'CANCELLED']).optional(),
    projectId: z.string().uuid().optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});

export const registerEventSchema = z.object({
  body: z.object({
    volunteerId: z.string().uuid(),
  }),
});
