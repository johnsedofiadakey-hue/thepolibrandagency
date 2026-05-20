import { NextResponse } from 'next/server';
import { createApplication } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
    const limited = rateLimit(request, { scope: 'application-submit', limit: 5, windowMs: 60 * 60 * 1000 });
    if (limited) return limited;

    try {
        const application = await request.json();
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'country', 'program', 'role', 'essay'];
        const missingField = requiredFields.find((field) => {
            const value = application?.[field];
            return typeof value !== 'string' || value.trim().length === 0;
        });

        if (missingField) {
            return NextResponse.json({ error: `${missingField} is required.` }, { status: 400 });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(application.email)) {
            return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
        }

        const timestamp = new Date().toISOString();
        const appWithMeta = {
            ...application,
            firstName: application.firstName.trim(),
            lastName: application.lastName.trim(),
            email: application.email.toLowerCase().trim(),
            phone: application.phone.trim(),
            country: application.country.trim(),
            program: application.program.trim(),
            role: application.role.trim(),
            essay: application.essay.trim(),
            id: Date.now(),
            timestamp,
            status: application.status || 'Pending',
        };

        await createApplication(appWithMeta);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to submit application:', error);
        return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
    }
}
