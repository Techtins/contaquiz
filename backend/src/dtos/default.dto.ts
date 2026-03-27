import { z } from 'zod';

// Esquemas genéricos reutilizáveis

export const paginationSchema = z.object({
    page: z.string().transform(Number).optional(),
    limit: z.string().transform(Number).optional(),
});

export const getByIdSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
});

// Esquema genérico para listagem com paginação, filtro por string e filtro por ativo/inativo
export const listSchema = z.object({
    query: paginationSchema.extend({
        filter: z.string().optional(),
        active: z
            .enum(['true', 'false'])
            .transform((v) => v === 'true')
            .optional(),
    }),
});

export type ListOptions = z.infer<typeof listSchema>['query'];
export type IdParam = z.infer<typeof getByIdSchema>['params'];