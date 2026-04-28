import { Router } from 'express';
import { ah } from '../middlewares/asyncHelper';
import { validate } from '../middlewares/validate';
import { z } from 'zod';
import { submitQuiz, getQuizResultById } from '../services/quiz.service';

const router = Router();

const submitQuizSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({
        answers: z.record(z.string(), z.number().int()).default({}),
        timeSpentInSeconds: z.number().int().nonnegative().optional(),
    }),
});

router.post('/quizzes/:id/submit', validate(submitQuizSchema), ah(async (req, res) => {
    const result = await submitQuiz(req.params.id, req.body.answers, req.body.timeSpentInSeconds);
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

export default router;
