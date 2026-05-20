import { NextResponse } from 'next/server';
import { getApplications, verifyFirebaseIdToken } from '@/lib/db';
import {
    PORTAL_SESSION_COOKIE,
    PORTAL_SESSION_MAX_AGE_SECONDS,
    createPortalSessionToken,
    getExpectedPortalAccessCode,
} from '@/lib/session';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
    const limited = rateLimit(request, { scope: 'portal-login', limit: 10, windowMs: 15 * 60 * 1000 });
    if (limited) return limited;

    const { email, password, idToken } = await request.json().catch(() => ({ email: '', password: '', idToken: '' }));
    let cleanEmail = String(email || '').toLowerCase().trim();

    if (idToken) {
        try {
            const decoded = await verifyFirebaseIdToken(String(idToken));
            const tokenEmail = decoded.email?.toLowerCase().trim();
            if (!tokenEmail) {
                return NextResponse.json({ error: 'Firebase account must have an email address.' }, { status: 401 });
            }
            cleanEmail = tokenEmail;
        } catch (error) {
            console.error('Firebase portal token verification failed:', error);
            return NextResponse.json({ error: 'Invalid Firebase authentication token.' }, { status: 401 });
        }
    } else {
        const accessCode = getExpectedPortalAccessCode();
        if (!accessCode) {
            return NextResponse.json(
                { error: 'Client portal authentication is not configured.' },
                { status: 503 }
            );
        }

        if (!cleanEmail || password !== accessCode) {
            return NextResponse.json({ error: 'Invalid email or access code.' }, { status: 401 });
        }
    }

    const applications = await getApplications();
    const app = applications.find((item: any) => item.email?.toLowerCase().trim() === cleanEmail);
    if (!app || app.status !== 'Approved') {
        return NextResponse.json({ error: 'No approved enrollment found for this email.' }, { status: 403 });
    }

    const token = await createPortalSessionToken(cleanEmail);
    if (!token) {
        return NextResponse.json(
            { error: 'Client portal session signing is not configured.' },
            { status: 503 }
        );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set({
        name: PORTAL_SESSION_COOKIE,
        value: token,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: PORTAL_SESSION_MAX_AGE_SECONDS,
    });
    return response;
}

export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.set({
        name: PORTAL_SESSION_COOKIE,
        value: '',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0,
    });
    return response;
}
