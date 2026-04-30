import { Router } from 'express';
import { ah } from '../middlewares/asyncHelper';
import { authenticate, authorize, AuthRequest } from '../middlewares/auth';
import { UserSystemRole } from '../models/User';
import { getAdminStats } from '../services/admin.service';

const router = Router();

router.get('/stats', authenticate, authorize(UserSystemRole.ADMIN), ah(async (req: AuthRequest, res) => {
    const stats = await getAdminStats();
    res.json({ data: stats });
}));

export default router;
