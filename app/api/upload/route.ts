import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

/**
 * Global upload endpoint.
 * Uses Vercel Blob for persistent storage in production.
 * Falls back to local filesystem in development if no token is provided.
 */
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
        }

        // Max 5MB for general uploads
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'Image must be under 5MB' }, { status: 400 });
        }

        const filename = `${Date.now()}_${file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase()}`;

        // IF Vercel Blob is configured, use it!
        if (process.env.BLOB_READ_WRITE_TOKEN) {
            const blob = await put(filename, file, {
                access: 'public',
            });
            return NextResponse.json({ success: true, url: blob.url });
        }

        // --- LOCAL FALLBACK (Development/Local) ---
        // If we reach here, Vercel Blob isn't configured.
        console.warn('Vercel Blob token not set. Falling back to local storage (data will persist only locally).');
        
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        const filePath = path.join(uploadDir, filename);

        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(filePath, buffer);

        return NextResponse.json({ success: true, url: `/uploads/${filename}` });

    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
    }
}
