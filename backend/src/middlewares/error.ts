import { NextFunction, Request, Response } from 'express';

export function notFound(_req: Request, res: Response) {
    res.status(404).json({ error: 'Route not found' });
}

export function errorHandler(err: any, _req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) return next(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
}

export function httpError(status: number, message: string) {
    const e: any = new Error(message);
    e.status = status;
    return e;
}