import { NextResponse } from 'next/server';
import { getContent, setContent } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const data = await getContent();
        return NextResponse.json(data, {
            headers: { 'Cache-Control': 'no-store, max-age=0' },
        });
    } catch (error) {
        console.error('Failed to read content:', error);
        return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await setContent(body);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to save content:', error);
        return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
    }
}
