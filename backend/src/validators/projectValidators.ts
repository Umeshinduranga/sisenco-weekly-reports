import { z } from 'zod';

export const projectCreateSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  description: z.string().optional(),
}).strict();

export const projectUpdateSchema = projectCreateSchema.partial().strict();