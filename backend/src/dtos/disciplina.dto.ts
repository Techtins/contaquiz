import { z } from 'zod';

export const createDisciplineSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Nome muito curto'),
        description: z.string().optional(),
        active: z.boolean().optional(),
    }),
});

export const updateDisciplineSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({
        name: z.string().min(2).optional(),
        description: z.string().optional(),
        active: z.boolean().optional(),
    }),
});

export type CreateDisciplineDTO = z.infer<typeof createDisciplineSchema>['body'];
export type UpdateDisciplineDTO = z.infer<typeof updateDisciplineSchema>['body'];