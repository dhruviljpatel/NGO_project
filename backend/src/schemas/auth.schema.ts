import { z } from '../utils/zod-openapi';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['ADMIN', 'NGO_STAFF', 'VOLUNTEER', 'DONOR', 'BENEFICIARY']),
    name: z.string().min(1, 'Name is required'),
    // specific fields for profiles can be optional
    phone: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});
