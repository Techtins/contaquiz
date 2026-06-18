import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.service';
import { UserSystemRole } from '../models/User';

export interface AuthRequest extends Request {
    userId?: string;
    userRole?: string;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Token nao fornecido' });
        return;
    }

    try {
        const payload = verifyToken(header.slice(7));
        req.userId = payload.sub;
        req.userRole = payload.role;
        next();
    } catch {
        res.status(401).json({ error: 'Token invalido ou expirado' });
    }
}

export function optionalAuthenticate(req: AuthRequest, _res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        next();
        return;
    }

    try {
        const payload = verifyToken(header.slice(7));
        req.userId = payload.sub;
        req.userRole = payload.role;
    } catch {
        // Ignore invalid optional tokens so public listings still work.
    }

    next();
}

export function authorize(...roles: UserSystemRole[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.userRole || !roles.includes(req.userRole as UserSystemRole)) {
            res.status(403).json({ error: 'Acesso negado' });
            return;
        }
        next();
    };
}
