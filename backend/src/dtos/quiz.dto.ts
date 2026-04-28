import { z } from 'zod';
import { listSchema } from './default.dto';

export const createQuizSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Titulo obrigatorio'),
        description: z.string().optional(),
        disciplineId: z.string().optional(),
        questionIds: z.array(z.string()).min(1, 'Ao menos 1 questao'),
        timeLimitSeconds: z.number().int().positive().optional(),
        score: z.number().int().nonnegative(),
        active: z.boolean().optional(),
    }),
});

export const updateQuizSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        disciplineId: z.string().optional(),
        questionIds: z.array(z.string()).optional(),
        timeLimitSeconds: z.number().int().positive().optional().nullable(),
        score: z.number().int().nonnegative().optional(),
        active: z.boolean().optional(),
    }),
});

export const listQuizzesSchema = listSchema.extend({
    query: (listSchema.shape.query as any).extend({
        disciplineId: z.string().optional(),
    }),
});

export type CreateQuizDTO = z.infer<typeof createQuizSchema>['body'];
export type UpdateQuizDTO = z.infer<typeof updateQuizSchema>['body'];
export type ListQuizzesOptions = z.infer<typeof listQuizzesSchema>['query'];
