import os from 'os';
import { mongoPing, mongoState } from '../config/database';

export async function getHealth() {
    const dbOk = await mongoPing();
    return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptimeSec: Math.round(process.uptime()),
        node: process.version,
        pid: process.pid,
        host: os.hostname(),
        db: {
            state: mongoState(),
            ok: dbOk,
        },
    };
}

export async function getReadiness() {
    const dbOk = await mongoPing();
    return {
        ready: dbOk,
        dbState: mongoState(),
    };
}
