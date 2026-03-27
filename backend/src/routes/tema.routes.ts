import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../middlewares/validate';
import {
    createTopicSchema,
    updateTopicSchema,
    listTopicsSchema
} from '../dtos/tema.dto';
import { getByIdSchema, listSchema } from '../dtos/default.dto';
import {
    createTopic,
    getTopicById,
    listTopics,
    updateTopic,
    deleteTopic,
} from '../services/tema.service';
import { ah } from '../middlewares/asyncHelper';

const router = Router();

// LIST
router.get(
    '/',
    validate(listTopicsSchema),
    ah(async (req, res) => {
        const { page, limit, filter, active, disciplineId } = req.query as any;
        const result = await listTopics({
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            filter,
            active, // já vem boolean pelo schema (se usar o validate)
            disciplineId
        });
        res.json(result);
    })
);

// GET BY ID
router.get(
    '/:id',
    validate(getByIdSchema),
    ah(async (req, res) => {
        const doc = await getTopicById(req.params.id);
        res.json({ data: doc });
    })
);

// CREATE
router.post(
    '/',
    validate(createTopicSchema),
    ah(async (req, res) => {
        const created = await createTopic(req.body);
        res.status(201).json({ data: created });
    })
);

// UPDATE
router.put(
    '/:id',
    validate(updateTopicSchema),
    ah(async (req, res) => {
        const updated = await updateTopic(req.params.id, req.body);
        res.json({ data: updated });
    })
);

// DELETE
router.delete(
    '/:id',
    validate(getByIdSchema),
    ah(async (req, res) => {
        await deleteTopic(req.params.id);
        res.status(204).send();
    })
);

export default router;
