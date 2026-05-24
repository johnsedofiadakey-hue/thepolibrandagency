import { NextResponse } from 'next/server';
import { describePersistenceError, getPersistenceHealth } from '@/lib/db';
import { requireAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const unauthorized = await requireAdmin(request);
    if (unauthorized) return unauthorized;

    try {
        const health = await getPersistenceHealth();
        const ready = health.firestoreConfigured && health.contentWritable && health.settingsWritable;
        return NextResponse.json(
            {
                ready,
                ...health,
            },
            { status: ready ? 200 : 503 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                ready: false,
                error: describePersistenceError(error, 'Firebase persistence'),
            },
            { status: 503 }
        );
    }
}
