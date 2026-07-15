import { NextResponse } from 'next/server';
import { getFirebaseAdmin, getFirebaseStorageBucket } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
    const unauthorized = await requireAdmin(request);
    if (unauthorized) return unauthorized;

    try {
        const { storagePath, bucketName } = await request.json();
        if (!storagePath || !bucketName) {
            return NextResponse.json({ error: 'Missing storagePath or bucketName' }, { status: 400 });
        }

        const firebase = getFirebaseAdmin();
        if (!firebase?.bucket) {
            return NextResponse.json({ error: 'Firebase Storage is not configured.' }, { status: 503 });
        }

        const downloadToken = randomUUID();

        // Set the download token as object metadata so Firebase Storage serves it with a token URL
        await firebase.bucket.file(storagePath).setMetadata({
            metadata: { firebasestoragedownloadtokens: downloadToken },
        });

        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(storagePath)}?alt=media&token=${downloadToken}`;
        return NextResponse.json({ publicUrl });
    } catch (err: any) {
        console.error('Video finalize error:', err);
        return NextResponse.json({ error: err.message || 'Failed to finalize upload' }, { status: 500 });
    }
}
