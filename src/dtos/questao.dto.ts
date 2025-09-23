import { z } from 'zod';
import { DifficultyLevel, QuestionType } from '../models/Questao';
import { listSchema } from './default.dto';

const questionOptionSchema = z.object({
    text: z.string().min(1, "O texto da opção é obrigatório"),
    isCorrect: z.boolean().default(false),
});

export const createQuestionSchema = z.object({
    body: z.object({
        statement: z.string().min(5, "O enunciado é obrigatório e deve ter no mínimo 5 caracteres"),
        type: z.enum(QuestionType).default(QuestionType.MULTIPLA_ESCOLHA),
        disciplineId: z.string().optional(),
        topicIds: z.array(z.string().min(1)).optional(),
        difficulty: z.enum(DifficultyLevel).default(DifficultyLevel.MEDIO),
        options: z.array(questionOptionSchema).min(2, "A questão deve ter no mínimo 2 opções"),
        explanation: z.string().optional(),
        active: z.boolean().optional().default(true),
    }),
});

export const updateQuestionSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Id da questão é obrigatório"),
    }),
    body: z.object({
        statement: z.string().min(5).optional(),
        type: z.enum(QuestionType).optional(),
        disciplineId: z.string().optional(),
        topicIds: z.array(z.string().min(1)).optional(),
        difficulty: z.enum(DifficultyLevel).optional(),
        options: z.array(questionOptionSchema).min(2).optional(),
        explanation: z.string().optional(),
        active: z.boolean().optional(),
    }),
});

// Listagem com filtros opcionais para questões
export const listQuestionsSchema = listSchema.extend({
    query: listSchema.shape.query.extend({
        disciplineId: z.string().optional(),
        topicIds: z.array(z.string().min(1)).min(1).optional(),
        difficulty: z.enum(DifficultyLevel).optional(),
        type: z.enum(QuestionType).optional(),
    }),
});

export type ListQuestionsOptions = z.infer<typeof listQuestionsSchema>['query'];
export type CreateQuestionDTO = z.infer<typeof createQuestionSchema>['body'];
export type UpdateQuestionDTO = z.infer<typeof updateQuestionSchema>['body'];