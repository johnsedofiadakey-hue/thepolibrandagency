import { NextResponse } from 'next/server';
import { getSettings, setSettings } from '@/lib/db';

/**
 * Logo upload endpoint.
 * Converts the uploaded file to a base64 data URL and stores it
 * directly in the settings object in Upstash Redis.
 * This approach avoids the filesystem entirely, so it works on Vercel.
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

        // Max 2MB
        if (file.size > 2 * 1024 * 1024) {
            return NextResponse.json({ error: 'Image must be under 2MB' }, { status: 400 });
        }

        // Convert to base64 data URL
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;

        // Store in Redis settings
        const currentSettings = await getSettings();
        const updatedSettings = {
            ...currentSettings,
            theme: {
                ...currentSettings.theme,
                logo: dataUrl,
            },
        };
        await setSettings(updatedSettings);

        return NextResponse.json({ success: true, url: dataUrl });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
