import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const application = await request.json();
        const timestamp = new Date().toISOString();
        const appWithMeta = { ...application, id: Date.now(), timestamp };

        // Save to Redis if available
        const redis = await getRedis();
        if (redis) {
            await redis.lpush('poli:applications', JSON.stringify(appWithMeta));
        }

        // Local fallback (append to a file for dev)
        const localAppsPath = path.join(process.cwd(), 'data', 'applications.json');
        let apps = [];
        try {
            if (fs.existsSync(localAppsPath)) {
                apps = JSON.parse(fs.readFileSync(localAppsPath, 'utf-8'));
            }
        } catch (e) {}
        
        apps.unshift(appWithMeta);
        
        try {
            fs.writeFileSync(localAppsPath, JSON.stringify(apps, null, 2));
        } catch (e) {}

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to submit application:', error);
        return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
    }
}
