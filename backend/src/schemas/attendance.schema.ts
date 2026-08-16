import { z } from '../utils/zod-openapi';

export const markAttendanceSchema = z.object({
  body: z.object({
    status: z.enum(['PRESENT', 'ABSENT', 'LATE']),
  }),
});
