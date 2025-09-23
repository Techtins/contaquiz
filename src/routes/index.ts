import { Router } from 'express';
import healthRouter from './health.routes';
import disciplinaRouter from './disciplina.routes'
import questaoRouter from './questao.routes'
import temaRouter from './tema.routes'

const router = Router();

router.use(healthRouter);        // /healthz e /readyz
router.use('/disciplinas', disciplinaRouter)
router.use('/questoes', questaoRouter)
router.use('/temas', temaRouter)

export default router;
