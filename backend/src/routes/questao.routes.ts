import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../middlewares/validate';
import {
    createQuestionSchema,
    listQuestionsSchema,
    updateQuestionSchema,
} from '../dtos/questao.dto';
import { getByIdSchema, listSchema } from '../dtos/default.dto';
import {
    createQuestion,
    getQuestionById,
    listQuestions,
    updateQuestion,
    deleteQuestion,
} from '../services/questao.service';
import { ah } from '../middlewares/asyncHelper';

const router = Router();

// LIST
router.get(
    '/',
    validate(listQuestionsSchema),
    ah(async (req, res) => {
        const { page, limit, filter, active, disciplineId, topicIds, difficulty, type } = req.query as any;
        const result = await listQuestions({
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            filter,
            active, // já vem boolean pelo schema (se usar o validate)
            disciplineId,
            topicIds,
            difficulty,
            type
        });
        res.json(result);
    })
);

// GET BY ID
router.get(
    '/:id',
    validate(getByIdSchema),
    ah(async (req, res) => {
        const doc = await getQuestionById(req.params.id);
        res.json({ data: doc });
    })
);

// CREATE
router.post(
    '/',
    validate(createQuestionSchema),
    ah(async (req, res) => {
        const created = await createQuestion(req.body);
        res.status(201).json({ data: created });
    })
);

// UPDATE
router.put(
    '/:id',
    validate(updateQuestionSchema),
    ah(async (req, res) => {
        const updated = await updateQuestion(req.params.id, req.body);
        res.json({ data: updated });
    })
);

// DELETE
router.delete(
    '/:id',
    validate(getByIdSchema),
    ah(async (req, res) => {
        await deleteQuestion(req.params.id);
        res.status(204).send();
    })
);

export default router;
