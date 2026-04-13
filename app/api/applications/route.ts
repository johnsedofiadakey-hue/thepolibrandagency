import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/db';
import fs from 'fs';
import path from 'path';

const APPS_KEY = 'poli:applications';
const localAppsPath = path.join(process.cwd(), 'data', 'applications.json');

export async function GET() {
    try {
        let applications = [];
        let hasRedisData = false;

        try {
            const redis = await getRedis();
            if (redis) {
                const rawApps = await redis.lrange(APPS_KEY, 0, -1);
                applications = rawApps.map((a: string) => JSON.parse(a));
                hasRedisData = true;
            }
        } catch (err) {
            console.error('Redis applications GET error:', err);
        }

        if (!hasRedisData) {
            if (fs.existsSync(localAppsPath)) {
                applications = JSON.parse(fs.readFileSync(localAppsPath, 'utf-8'));
            }
        }

        return NextResponse.json(applications);
    } catch (error) {
        console.error('Failed to fetch applications:', error);
        return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const { id, status } = await request.json();
        let updatedInRedis = false;

        try {
            const redis = await getRedis();
            if (redis) {
                const rawApps = await redis.lrange(APPS_KEY, 0, -1);
                const applications = rawApps.map((a: string) => JSON.parse(a));
                const index = applications.findIndex((a: any) => Number(a.id) === Number(id));
                
                if (index !== -1) {
                    applications[index].status = status;
                    await redis.del(APPS_KEY);
                    for (const app of applications.reverse()) {
                        await redis.lpush(APPS_KEY, JSON.stringify(app));
                    }
                    updatedInRedis = true;
                }
            }
        } catch (err) {
            console.error('Redis applications PATCH error:', err);
        }

        // Local fallback (always update local if possible, or only if redis failed)
        try {
            if (fs.existsSync(localAppsPath)) {
                const applications = JSON.parse(fs.readFileSync(localAppsPath, 'utf-8'));
                const index = applications.findIndex((a: any) => Number(a.id) === Number(id));
                if (index !== -1) {
                    applications[index].status = status;
                    fs.writeFileSync(localAppsPath, JSON.stringify(applications, null, 2));
                }
            }
        } catch (e) {}

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to update application:', error);
        return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
    }
}
