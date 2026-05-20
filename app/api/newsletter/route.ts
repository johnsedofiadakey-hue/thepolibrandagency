import { NextResponse } from 'next/server';
import { createSubscriber, getSubscribers } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
    const limited = rateLimit(request, { scope: 'newsletter-submit', limit: 6, windowMs: 60 * 60 * 1000 });
    if (limited) return limited;

    try {
        const body = await request.json();
        const { email } = body;

        if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
        }

        const cleanEmail = email.toLowerCase().trim();
        const subscriber = { email: cleanEmail, id: Date.now(), timestamp: new Date().toISOString() };
        await createSubscriber(subscriber);

        return NextResponse.json({ success: true, message: 'Successfully subscribed to our newsletter!' });
    } catch (error) {
        console.error('Failed to subscribe email:', error);
        return NextResponse.json({ error: 'Failed to complete subscription' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const unauthorized = await requireAdmin(request);
    if (unauthorized) return unauthorized;

    try {
        const subscribers = await getSubscribers();
        return NextResponse.json(subscribers);
    } catch (error) {
        console.error('Failed to fetch subscribers:', error);
        return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
    }
}
