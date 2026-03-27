import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes/index';
import { connectToDatabase } from './config/database';
import { notFound, errorHandler } from './middlewares/error';

async function bootstrap() {
    const PORT = process.env.PORT || 5000;
    await connectToDatabase();

    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use('/api', routes);

    app.use(notFound);
    app.use(errorHandler);

    app.listen(PORT, () =>
        console.log(`[CONTAQUIZ-API] running on port ${PORT}`)
    );
}

bootstrap().catch((err) => {
    console.error('Boot error:', err);
    process.exit(1);
});
