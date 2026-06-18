import { Router } from 'express';
import healthRouter from './health.routes';
import authRouter from './auth.routes';
import disciplinaRouter from './disciplina.routes'
import questaoRouter from './questao.routes'
import temaRouter from './tema.routes'
import quizRouter from './quiz.routes'
import quizResultsRouter from './quiz.results.routes'
import adminRouter from './admin.routes'

const router = Router();

router.use(healthRouter);        // /healthz e /readyz
router.use('/auth', authRouter)
router.use('/disciplinas', disciplinaRouter)
router.use('/questoes', questaoRouter)
router.use('/temas', temaRouter)
router.use('/quizzes', quizRouter)
router.use('/', quizResultsRouter)
router.use('/admin', adminRouter)

export default router;
