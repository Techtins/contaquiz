import { z } from 'zod';

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('E-mail invalido'),
        password: z.string().min(1, 'Senha obrigatoria'),
    }),
});

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Nome muito curto'),
        email: z.string().email('E-mail invalido'),
        password: z.string().min(6, 'A senha deve ter no minimo 6 caracteres'),
    }),
});

export type LoginDTO = z.infer<typeof loginSchema>['body'];
export type RegisterDTO = z.infer<typeof registerSchema>['body'];
