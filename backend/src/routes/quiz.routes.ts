import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { ah } from '../middlewares/asyncHelper';
import { createQuizSchema, listQuizzesSchema, updateQuizSchema } from '../dtos/quiz.dto';
import { getByIdSchema } from '../dtos/default.dto';
import {
    createQuiz,
    deleteQuiz,
    getQuizById,
    listQuizzes,
    updateQuiz,
} from '../services/quiz.service';

const router = Router();

router.get('/', validate(listQuizzesSchema), ah(async (req, res) => {
    const q = req.query as any;
    const result = await listQuizzes(q);
    res.json({ data: result });
}));

router.get('/:id', validate(getByIdSchema), ah(async (req, res) => {
    const doc = await getQuizById(req.params.id);
    res.json({ data: doc });
}));

router.post('/', validate(createQuizSchema), ah(async (req, res) => {
    const created = await createQuiz(req.body);
    res.status(201).json({ data: created });
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
