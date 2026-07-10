import { NextResponse } from 'next/server';
import { describePersistenceError, uploadImageToStorage } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import path from 'path';
import fs from 'fs/promises';

const ACCEPTED_TYPES = ['video/mp4', 'video/quicktime', 'video/webm', 'video/mov'];
const MAX_SIZE = 100 * 1024 * 1024; // 100 MB

export async function POST(request: Request) {
    const unauthorized = await requireAdmin(request);
    if (unauthorized) return unauthorized;

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        if (!ACCEPTED_TYPES.includes(file.type) && !file.type.startsWith('video/')) {
            return NextResponse.json({ error: 'File must be a video (MP4, MOV, WebM)' }, { status: 400 });
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: 'Video must be under 100MB' }, { status: 400 });
        }

        try {
            // uploadImageToStorage is generic — works for any file type
            const url = await uploadImageToStorage(file);
            return NextResponse.json({ success: true, url });
        } catch (error) {
            if (process.env.NODE_ENV === 'production') throw error;
            console.error('Firebase Storage upload failed; using local dev fallback:', error);
        }

        // Local dev fallback
        const filename = `${Date.now()}_${file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase()}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        const filePath = path.join(uploadDir, filename);

        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(filePath, buffer);

        return NextResponse.json({ success: true, url: `/uploads/${filename}` });
    } catch (error: any) {
        console.error('Video upload error:', error);
        return NextResponse.json({ error: describePersistenceError(error, 'Firebase Storage') }, { status: 503 });
    }
}
