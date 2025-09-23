import { Router } from 'express';
import healthRouter from './health.routes';
import disciplinaRouter from './disciplina.routes'
import questaoRouter from './questao.routes'

const router = Router();

router.use(healthRouter);        // /healthz e /readyz
router.use('/disciplinas', disciplinaRouter)
router.use('/questoes', questaoRouter)

export default router;
