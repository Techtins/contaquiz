import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { loginSchema, registerSchema } from '../dtos/auth.dto';
import { login, register } from '../services/auth.service';
import { authenticate, AuthRequest } from '../middlewares/auth';
import { ah } from '../middlewares/asyncHelper';

const router = Router();

router.post(
    '/login',
    validate(loginSchema),
    ah(async (req, res) => {
        const result = await login(req.body);
        res.json(result);
    })
);

router.post(
    '/register',
    validate(registerSchema),
    ah(async (req, res) => {
        const result = await register(req.body);
        res.status(201).json(result);
    })
);

router.get(
    '/me',
    authenticate,
    ah(async (req: AuthRequest, res) => {
        const UserModel = (await import('../models/User')).default;
        const user = await UserModel.findById(req.userId).select('-passwordHash');
        if (!user) {
            res.status(404).json({ error: 'Usuario nao encontrado' });
            return;
        }
        res.json({ data: user });
    })
);

export default router;
