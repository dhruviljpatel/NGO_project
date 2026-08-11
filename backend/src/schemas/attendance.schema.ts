import { z } from 'zod';

export const markAttendanceSchema = z.object({
  body: z.object({
    status: z.enum(['PRESENT', 'ABSENT', 'LATE']),
  }),
});
