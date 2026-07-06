import { z } from 'zod';

export const reportCreateSchema = z
  .object({
    projectId: z.string().length(24, 'Invalid project ID'),
    weekStart: z.coerce.date(),
    weekEnd: z.coerce.date(),
    tasksCompleted: z.string().min(1, 'Tasks completed is required'),
    tasksPlanned: z.string().min(1, 'Tasks planned is required'),
    blockers: z.string().max(1000).optional().default(''),
    hoursWorked: z.number().min(0).max(168).optional(),
    notes: z.string().max(1000).optional().default(''),
  })
  .strict();

export const reportUpdateSchema = reportCreateSchema.partial().strict();

export type ReportCreateInput = z.infer<typeof reportCreateSchema>;
export type ReportUpdateInput = z.infer<typeof reportUpdateSchema>;
