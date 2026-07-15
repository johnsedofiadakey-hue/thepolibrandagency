import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/session';

const GCS_UPLOAD_PREFIX = 'https://storage.googleapis.com/upload/';

export async function POST(request: Request) {
    const unauthorized = await requireAdmin(request);
    if (unauthorized) return unauthorized;

    const { searchParams } = new URL(request.url);
    const sessionUri = searchParams.get('sessionUri');
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const totalSize = parseInt(searchParams.get('totalSize') || '0', 10);
    const isFinal = searchParams.get('isFinal') === 'true';

    if (!sessionUri || !sessionUri.startsWith(GCS_UPLOAD_PREFIX)) {
        return NextResponse.json({ error: 'Invalid or missing sessionUri' }, { status: 400 });
    }

    try {
        const chunkData = await request.arrayBuffer();
        const chunkSize = chunkData.byteLength;
        const end = offset + chunkSize - 1;

        // Content-Range tells GCS where this chunk sits within the total file
        const contentRange = isFinal
            ? `bytes ${offset}-${end}/${totalSize}`
            : `bytes ${offset}-${end}/*`;

        const gcsRes = await fetch(sessionUri, {
            method: 'PUT',
            headers: {
                'Content-Range': contentRange,
                'Content-Length': String(chunkSize),
            },
            body: chunkData,
        });

        // 308 = chunk accepted, more needed; 200/201 = upload complete
        if (gcsRes.status === 308) {
            return NextResponse.json({ bytesReceived: end + 1 });
        }
        if (gcsRes.status === 200 || gcsRes.status === 201) {
            return NextResponse.json({ done: true });
        }

        const errText = await gcsRes.text();
        console.error(`GCS chunk error ${gcsRes.status}:`, errText.slice(0, 300));
        return NextResponse.json({ error: `Storage error ${gcsRes.status}` }, { status: 500 });
    } catch (err: any) {
        console.error('Chunk proxy error:', err);
        return NextResponse.json({ error: err.message || 'Chunk upload failed' }, { status: 500 });
    }
}
