import { z } from 'zod';
import { listSchema } from './default.dto';

export const createTopicSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Nome muito curto"),
        disciplineId: z.string().min(1, "DisciplineId é obrigatório"),
        parentTopicId: z.string().optional().nullable(),
        active: z.boolean().optional().default(true),
    }),
});

export const updateTopicSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Id do tópico é obrigatório"),
    }),
    body: z.object({
        name: z.string().min(2).optional(),
        disciplineId: z.string().optional(),
        parentTopicId: z.string().optional().nullable(),
        active: z.boolean().optional(),
    }),
});

// Listagem com filtros opcionais para temas
export const listTopicsSchema = listSchema.extend({
    query: listSchema.shape.query.extend({
        disciplineId: z.string().optional(),
    }),
});

export type ListTopicsOptions = z.infer<typeof listTopicsSchema>['query'];
export type CreateTopicDTO = z.infer<typeof createTopicSchema>['body'];
export type UpdateTopicDTO = z.infer<typeof updateTopicSchema>['body'];