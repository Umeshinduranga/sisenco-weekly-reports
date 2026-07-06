import { z } from 'zod';

export const projectCreateSchema = z
  .object({
    name: z.string().min(2).max(100),
    description: z.string().max(500).optional().default(''),
  })
  .strict();

export const projectUpdateSchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().max(500).optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
