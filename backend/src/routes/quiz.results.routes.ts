import { Router } from 'express';
import { ah } from '../middlewares/asyncHelper';
import { validate } from '../middlewares/validate';
import { z } from 'zod';
import { submitQuiz, getQuizResultById, getStudentHistory } from '../services/quiz.service';
import { authenticate, AuthRequest } from '../middlewares/auth';

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

router.get('/quizzes/resultados/:resultId', validate(z.object({ params: z.object({ resultId: z.string().min(1) }) })), ah(async (req, res) => {
    const result = await getQuizResultById(req.params.resultId);
    res.json({ data: result });
}));

router.get('/quiz-results/:resultId', validate(z.object({ params: z.object({ resultId: z.string().min(1) }) })), ah(async (req, res) => {
    const result = await getQuizResultById(req.params.resultId);
    res.json({ data: result });
}));

router.get('/historico', authenticate, ah(async (req: AuthRequest, res) => {
    if (!req.userId) {
        res.status(401).json({ error: 'Usuario nao autenticado' });
        return;
    }
    const history = await getStudentHistory(req.userId);
    res.json({ data: history });
}));

export default router;
