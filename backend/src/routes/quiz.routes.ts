import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { ah } from '../middlewares/asyncHelper';
import { createQuizSchema, generateQuizSchema, listQuizzesSchema, updateQuizSchema } from '../dtos/quiz.dto';
import { getByIdSchema } from '../dtos/default.dto';
import {
    createQuiz,
    deleteQuiz,
    generateQuiz,
    getQuizById,
    listQuizzes,
    updateQuiz,
} from '../services/quiz.service';
import { authenticate, authorize, optionalAuthenticate, AuthRequest } from '../middlewares/auth';
import { UserSystemRole } from '../models/User';
import { QuizVisibility } from '../models/QuizEntity';

const router = Router();

router.get('/', optionalAuthenticate, validate(listQuizzesSchema), ah(async (req, res) => {
    const q = req.query as any;
    const result = await listQuizzes(q, (req as AuthRequest).userId);
    res.json({ data: result });
}));

router.get('/:id', optionalAuthenticate, validate(getByIdSchema), ah(async (req, res) => {
    const doc = await getQuizById(req.params.id, (req as AuthRequest).userId);
    res.json({ data: doc });
}));

router.post('/', authenticate, authorize(UserSystemRole.ADMIN), validate(createQuizSchema), ah(async (req: AuthRequest, res) => {
    const created = await createQuiz(req.body, req.userId);
    res.status(201).json({ data: created });
}));

router.post('/generate', authenticate, validate(generateQuizSchema), ah(async (req: AuthRequest, res) => {
    if (!req.userId) {
        res.status(401).json({ error: 'Usuario nao autenticado' });
        return;
    }

    const visibility = req.userRole === UserSystemRole.ADMIN ? QuizVisibility.PUBLIC : QuizVisibility.PRIVATE;
    const generated = await generateQuiz(req.body, req.userId, visibility);
    res.status(201).json({ data: generated });
}));

router.put('/:id', validate(updateQuizSchema), ah(async (req, res) => {
    const updated = await updateQuiz(req.params.id, req.body);
    res.json({ data: updated });
}));

router.delete('/:id', validate(getByIdSchema), ah(async (req, res) => {
    await deleteQuiz(req.params.id);
    res.status(204).send();
}));

export default router;
