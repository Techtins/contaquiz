import { Router } from 'express';
import { ah } from '../middlewares/asyncHelper';
import { validate } from '../middlewares/validate';
import { z } from 'zod';
import {
    submitQuiz,
    getQuizResultById,
    getStudentHistory,
    toggleQuestionFavoriteByUser,
    getFavoriteQuestionIds,
} from '../services/quiz.service';
import { authenticate, optionalAuthenticate, AuthRequest } from '../middlewares/auth';
import { studentHistoryFiltersSchema } from '../dtos/quiz.dto';

const router = Router();

const submitQuizSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({
        answers: z.record(z.string(), z.number().int()).default({}),
        timeSpentInSeconds: z.number().int().nonnegative().optional(),
    }),
});

router.post('/quizzes/:id/submit', authenticate, validate(submitQuizSchema), ah(async (req: AuthRequest, res) => {
    if (!req.userId) {
        res.status(401).json({ error: 'Usuario nao autenticado' });
        return;
    }
    const result = await submitQuiz(req.params.id, req.body.answers, req.body.timeSpentInSeconds, req.userId);
    res.status(201).json({ data: result });
}));

router.get('/quizzes/resultados/:resultId', optionalAuthenticate, validate(z.object({ params: z.object({ resultId: z.string().min(1) }) })), ah(async (req: AuthRequest, res) => {
    const result = await getQuizResultById(req.params.resultId, req.userId);
    res.json({ data: result });
}));

router.get('/quiz-results/:resultId', optionalAuthenticate, validate(z.object({ params: z.object({ resultId: z.string().min(1) }) })), ah(async (req: AuthRequest, res) => {
    const result = await getQuizResultById(req.params.resultId, req.userId);
    res.json({ data: result });
}));

router.get('/historico', authenticate, validate(studentHistoryFiltersSchema), ah(async (req: AuthRequest, res) => {
    if (!req.userId) {
        res.status(401).json({ error: 'Usuario nao autenticado' });
        return;
    }
    const history = await getStudentHistory(req.userId, req.query as any);
    res.json({ data: history });
}));

router.get('/question-favorites', authenticate, ah(async (req: AuthRequest, res) => {
    if (!req.userId) {
        res.status(401).json({ error: 'Usuario nao autenticado' });
        return;
    }

    const questionIds = typeof req.query.questionIds === 'string'
        ? req.query.questionIds.split(',').map((item) => item.trim()).filter(Boolean)
        : Array.isArray(req.query.questionIds)
            ? req.query.questionIds.map((item) => String(item)).filter(Boolean)
            : undefined;

    const favorites = await getFavoriteQuestionIds(req.userId, questionIds);
    res.json({ data: favorites });
}));

router.post('/questions/:questionId/favorite', authenticate, ah(async (req: AuthRequest, res) => {
    if (!req.userId) {
        res.status(401).json({ error: 'Usuario nao autenticado' });
        return;
    }

    const result = await toggleQuestionFavoriteByUser(req.userId, req.params.questionId);
    res.json({ data: result });
}));

export default router;
