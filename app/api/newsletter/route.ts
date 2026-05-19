import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
        }

        const timestamp = new Date().toISOString();
        const subscriber = { email, id: Date.now(), timestamp };

        // Save to Redis if available
        try {
            const redis = await getRedis();
            if (redis) {
                // Let's store subscribers in a list 'poli:subscribers'
                await redis.lpush('poli:subscribers', JSON.stringify(subscriber));
            }
        } catch (err) {
            console.error('Redis newsletter error:', err);
        }

        // Local fallback (append to a JSON file for development/fallback)
        const localSubsPath = path.join(process.cwd(), 'data', 'subscribers.json');
        
        // Ensure data directory exists
        const dataDir = path.dirname(localSubsPath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        let subscribers = [];
        try {
            if (fs.existsSync(localSubsPath)) {
                subscribers = JSON.parse(fs.readFileSync(localSubsPath, 'utf-8'));
            }
        } catch (e) {
            console.error('Failed to read local subscribers file:', e);
        }
        
        // Check if subscriber email is already present to prevent duplicate submissions locally
        const emailExists = subscribers.some((sub: any) => sub.email.toLowerCase() === email.toLowerCase());
        if (!emailExists) {
            subscribers.unshift(subscriber);
            try {
                fs.writeFileSync(localSubsPath, JSON.stringify(subscribers, null, 2));
            } catch (e) {
                console.error('Failed to write local subscribers file:', e);
            }
        }

        return NextResponse.json({ success: true, message: 'Successfully subscribed to our newsletter!' });
    } catch (error) {
        console.error('Failed to subscribe email:', error);
        return NextResponse.json({ error: 'Failed to complete subscription' }, { status: 500 });
    }
}

export async function GET() {
    try {
        let subscribers = [];
        let hasRedisData = false;

        try {
            const redis = await getRedis();
            if (redis) {
                const rawSubs = await redis.lrange('poli:subscribers', 0, -1);
                subscribers = rawSubs.map((s: string) => JSON.parse(s));
                hasRedisData = true;
            }
        } catch (err) {
            console.error('Redis subscribers GET error:', err);
        }

        if (!hasRedisData) {
            const localSubsPath = path.join(process.cwd(), 'data', 'subscribers.json');
            if (fs.existsSync(localSubsPath)) {
                subscribers = JSON.parse(fs.readFileSync(localSubsPath, 'utf-8'));
            }
        }

        return NextResponse.json(subscribers);
    } catch (error) {
        console.error('Failed to fetch subscribers:', error);
        return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
    }
}
