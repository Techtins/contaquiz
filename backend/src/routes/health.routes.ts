import { Router, Request, Response } from 'express';
import { getHealth, getReadiness } from '../services/health.service';

const router = Router();

/**
 * liveness — responde mesmo se o banco estiver fora, útil para orquestradores
 */
router.get('/healthz', async (req, res) => {
    const data = await getHealth();
    res.status(200).json(data);
});

router.get('/readyz', async (_req: Request, res: Response): Promise<void> => {
    const data = await getReadiness();
    res.status(data.ready ? 200 : 503).json(data);
});

export default router;
