import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

/**
 * General purpose upload endpoint.
 * Saves the uploaded file to the local filesystem (public/uploads/).
 * This allows for 'total control' media management in the local workspace.
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

        // Generate clean filename
        const buffer = Buffer.from(await file.arrayBuffer());
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
        const filename = `${timestamp}_${safeName}`;
        
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        const filePath = path.join(uploadDir, filename);

        // Ensure directory exists (redundant but safe)
        await fs.mkdir(uploadDir, { recursive: true });
        
        // Write file to public/uploads
        await fs.writeFile(filePath, buffer);

        const dataUrl = `/uploads/${filename}`;

        return NextResponse.json({ success: true, url: dataUrl });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
