import { NextResponse } from 'next/server';
import { uploadImageToStorage } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: Request) {
    const unauthorized = await requireAdmin(request);
    if (unauthorized) return unauthorized;

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
        }

        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'Image must be under 5MB' }, { status: 400 });
        }

        try {
            const url = await uploadImageToStorage(file);
            return NextResponse.json({ success: true, url });
        } catch (error) {
            if (process.env.NODE_ENV === 'production') throw error;
            console.error('Firebase Storage upload failed; using local dev fallback:', error);
        }

        const filename = `${Date.now()}_${file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase()}`;
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
