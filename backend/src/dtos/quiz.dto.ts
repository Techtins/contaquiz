import { z } from 'zod';
import { listSchema } from './default.dto';
import { QuizVisibility } from '../models/QuizEntity';
import { DifficultyLevel } from '../models/Questao';

export const createQuizSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Titulo obrigatorio'),
        description: z.string().optional(),
        disciplineId: z.string().optional(),
        questionIds: z.array(z.string()).min(1, 'Ao menos 1 questao'),
        timeLimitSeconds: z.number().int().positive().optional(),
        score: z.number().int().nonnegative(),
        visibility: z.nativeEnum(QuizVisibility).optional(),
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
        visibility: z.nativeEnum(QuizVisibility).optional(),
        active: z.boolean().optional(),
    }),
});

export const listQuizzesSchema = listSchema.extend({
    query: (listSchema.shape.query as any).extend({
        disciplineId: z.string().optional(),
    }),
});

export const generateQuizSchema = z.object({
    body: z.object({
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        disciplineId: z.string().optional(),
        topicIds: z.union([z.string(), z.array(z.string().min(1))]).optional(),
        questionCount: z.number().int().positive().optional(),
        questionsPerTopic: z.number().int().positive().optional(),
        difficulty: z.nativeEnum(DifficultyLevel).optional(),
        mixedDifficulty: z.boolean().optional().default(false),
        timeLimitSeconds: z.number().int().positive().optional(),
        score: z.number().int().nonnegative().optional(),
        active: z.boolean().optional(),
        visibility: z.nativeEnum(QuizVisibility).optional(),
    }),
});

export type CreateQuizDTO = z.infer<typeof createQuizSchema>['body'];
export type UpdateQuizDTO = z.infer<typeof updateQuizSchema>['body'];
export type GenerateQuizDTO = z.infer<typeof generateQuizSchema>['body'];
export type ListQuizzesOptions = z.infer<typeof listQuizzesSchema>['query'];

export const studentHistoryFiltersSchema = z.object({
    query: z.object({
        disciplineId: z.string().optional(),
        visibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
        quizId: z.string().optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
        minScore: z.string().transform(Number).optional(),
        maxScore: z.string().transform(Number).optional(),
    }),
});

export type StudentHistoryFilters = z.infer<typeof studentHistoryFiltersSchema>['query'];

export interface IQuizAttemptItem {
    _id: string;
    resultId: string;
    quizId: string;
    title: string;
    discipline?: string;
    visibility?: 'PUBLIC' | 'PRIVATE';
    percentage: number;
    correctAnswers: number;
    wrongAnswers: number;
    totalQuestions: number;
    timeSpentInSeconds: number;
    passingScore: number;
    createdAt: Date;
    passed: boolean;
}

export interface IHistoryBreakdownItem {
    key: string;
    label: string;
    attempts: number;
    correctAnswers: number;
    averageScore: number;
    averageTime: number;
}

export interface IHistoryDifficultyItem {
    difficulty: string;
    attempts: number;
    correctAnswers: number;
    accuracy: number;
}

export interface IHistoryTimelineItem {
    resultId: string;
    quizId: string;
    title: string;
    createdAt: Date;
    percentage: number;
    timeSpentInSeconds: number;
}

export interface IHistoryAnalytics {
    timeline: IHistoryTimelineItem[];
    byDiscipline: IHistoryBreakdownItem[];
    byTopic: IHistoryBreakdownItem[];
    byDifficulty: IHistoryDifficultyItem[];
    comparison: Array<{
        quizId: string;
        title: string;
        attempts: Array<{
            attemptNumber: number;
            resultId: string;
            createdAt: Date;
            percentage: number;
        }>;
    }>;
    lowAreas: Array<{
        kind: 'DISCIPLINE' | 'TOPIC';
        key: string;
        label: string;
        averageScore: number;
        attempts: number;
    }>;
}

export interface IQuizHistoryItem {
    _id: string;
    quizId: string;
    title: string;
    discipline?: string;
    attempts: number;
    bestScore: number;
    lastAttemptDate: Date;
    totalTimeSpent: number; // em segundos
    averageTime: number; // em segundos
}

export interface IStudentHistory {
    totalQuizzesCompleted: number;
    averageScore: number;
    totalStudyTime: number; // em segundos
    quizzes: IQuizHistoryItem[];
    attempts: IQuizAttemptItem[];
    analytics: IHistoryAnalytics;
}
