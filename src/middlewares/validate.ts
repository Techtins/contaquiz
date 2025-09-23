import { ZodObject, ZodError } from 'zod';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const validate = (schema: ZodObject<any>): RequestHandler => {
    return (req, res, next) => {
        try {
            schema.parse({ body: req.body, query: req.query, params: req.params });
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                res.status(400).json({ message: 'Erro de validação', errors: err.issues });
                return; // <- termina a função sem retornar Response
            }
            next(err as any);
        }
    };
};