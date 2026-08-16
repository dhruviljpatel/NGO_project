import { z } from '../utils/zod-openapi';

export const createDonationSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    paymentMethod: z.string().min(1, 'Payment method is required'),
    projectId: z.string().uuid().optional(),
  }),
});

export const updateDonationStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'SUCCESSFUL', 'FAILED', 'REFUNDED']),
    receiptUrl: z.string().url().optional(),
  }),
});

export const donationQuerySchema = z.object({
  query: z.object({
    projectId: z.string().uuid().optional(),
    status: z.enum(['PENDING', 'SUCCESSFUL', 'FAILED', 'REFUNDED']).optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});
