import { NextResponse } from 'next/server';
import { getApplications, updateApplicationStatus } from '@/lib/db';
import { requireAdmin } from '@/lib/session';

export async function GET(request: Request) {
    const unauthorized = await requireAdmin(request);
    if (unauthorized) return unauthorized;

    try {
        const applications = await getApplications();
        return NextResponse.json(applications);
    } catch (error) {
        console.error('Failed to fetch applications:', error);
        return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const unauthorized = await requireAdmin(request);
    if (unauthorized) return unauthorized;

    try {
        const { id, status } = await request.json();
        if (!id || typeof status !== 'string') {
            return NextResponse.json({ error: 'id and status are required.' }, { status: 400 });
        }

        const updated = await updateApplicationStatus(id, status);
        if (!updated) {
            return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to update application:', error);
        return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
    }
}
