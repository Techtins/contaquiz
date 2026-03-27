import 'dotenv/config';
import mongoose from 'mongoose';

export async function connectToDatabase() {
    mongoose.set('strictQuery', true);
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error('MONGO_URI não definida no .env');
    }

    await mongoose.connect(uri);
    console.log('MongoDB conectado');
    return mongoose.connection;
}

export function mongoState(): string {
    const map: Record<number, string> = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
    };
    return map[mongoose.connection.readyState] ?? 'unknown';
}

export async function mongoPing(): Promise<boolean> {
    try {
        // só funciona após connect()
        await mongoose.connection.db?.admin().ping();
        return true;
    } catch {
        return false;
    }
}
