import { NextResponse } from 'next/server';
import { getFirebaseAdmin, getFirebaseStorageBucket } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { randomUUID } from 'crypto';

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

        if (!firebase?.bucket || !bucketName) {
            return NextResponse.json({ error: 'Firebase Storage is not configured on this server.' }, { status: 503 });
        }

        const safeName = String(filename).replace(/[^a-z0-9.]/gi, '_').toLowerCase();
        const storagePath = `uploads/${Date.now()}_${safeName}`;
        const downloadToken = randomUUID();

        // Signed URL that lets the browser PUT directly to GCS — bypasses Cloud Run 32 MB body limit
        const [signedUrl] = await firebase.bucket.file(storagePath).getSignedUrl({
            action: 'write',
            expires: Date.now() + 20 * 60 * 1000, // 20-minute window
            contentType,
            extensionHeaders: {
                // GCS will store this as object metadata; Firebase uses it as the download token
                'x-goog-meta-firebasestoragedownloadtokens': downloadToken,
            },
        });

        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(storagePath)}?alt=media&token=${downloadToken}`;

        return NextResponse.json({ signedUrl, publicUrl, downloadToken, storagePath });
    } catch (err: any) {
        console.error('Signed URL generation failed:', err);
        return NextResponse.json({ error: err.message || 'Failed to generate upload URL' }, { status: 500 });
    }
}
