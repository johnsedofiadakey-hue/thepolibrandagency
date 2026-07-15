import { NextResponse } from 'next/server';
import { getFirebaseAdmin, getFirebaseStorageBucket } from '@/lib/db';
import { requireAdmin } from '@/lib/session';

const ACCEPTED = ['video/mp4', 'video/quicktime', 'video/webm'];
const MAX_BYTES = 500 * 1024 * 1024; // 500 MB

export async function POST(request: Request) {
    const unauthorized = await requireAdmin(request);
    if (unauthorized) return unauthorized;

    try {
        const { filename, contentType, size } = await request.json();

        if (!ACCEPTED.includes(contentType) && !String(contentType).startsWith('video/')) {
            return NextResponse.json({ error: 'File must be a video (MP4, MOV, WebM)' }, { status: 400 });
        }
        if (size > MAX_BYTES) {
            return NextResponse.json({ error: 'Video must be under 500 MB' }, { status: 400 });
        }

        const firebase = getFirebaseAdmin();
        const bucketName = getFirebaseStorageBucket();

        if (!firebase?.app || !bucketName) {
            return NextResponse.json({ error: 'Firebase Storage is not configured on this server.' }, { status: 503 });
        }

        const safeName = String(filename).replace(/[^a-z0-9.]/gi, '_').toLowerCase();
        const storagePath = `uploads/${Date.now()}_${safeName}`;

        // Get an OAuth access token from whatever credential firebase-admin has
        // (service account key if available, else Cloud Run ADC — both work here)
        const tokenResult = await (firebase.app.options.credential as any).getAccessToken();
        const accessToken = tokenResult.access_token;

        // Initiate a GCS resumable upload session — no signBlob permission needed,
        // just a standard OAuth write token. The session URI is self-authenticating
        // for the duration of the upload.
        const initRes = await fetch(
            `https://storage.googleapis.com/upload/storage/v1/b/${encodeURIComponent(bucketName)}/o?uploadType=resumable&name=${encodeURIComponent(storagePath)}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-Upload-Content-Type': contentType,
                    'X-Upload-Content-Length': String(size),
                },
                body: JSON.stringify({ contentType }),
            }
        );

        if (!initRes.ok) {
            const errText = await initRes.text();
            console.error('GCS resumable upload initiation failed:', errText);
            return NextResponse.json({ error: `Could not start upload session: ${initRes.status}` }, { status: 500 });
        }

        const sessionUri = initRes.headers.get('location');
        if (!sessionUri) {
            return NextResponse.json({ error: 'GCS did not return a session URI' }, { status: 500 });
        }

        return NextResponse.json({ sessionUri, storagePath, bucketName });
    } catch (err: any) {
        console.error('Upload session initiation failed:', err);
        return NextResponse.json({ error: err.message || 'Failed to start upload session' }, { status: 500 });
    }
}
