import { NextResponse } from 'next/server';
import {
    ADMIN_SESSION_COOKIE,
    ADMIN_SESSION_MAX_AGE_SECONDS,
    createAdminSessionToken,
    getExpectedAdminEmail,
    getExpectedAdminPassword,
} from '@/lib/session';
import { rateLimit } from '@/lib/rate-limit';
import { verifyFirebaseIdToken } from '@/lib/db';

function getAllowedAdminUids(): string[] {
    return (process.env.ADMIN_UIDS || '')
        .split(',')
        .map((uid) => uid.trim())
        .filter(Boolean);
}

export async function POST(request: Request) {
    const limited = rateLimit(request, { scope: 'admin-login', limit: 8, windowMs: 15 * 60 * 1000 });
    if (limited) return limited;

    const expectedEmail = getExpectedAdminEmail().trim().toLowerCase();
    const { email, password, idToken } = await request.json().catch(() => ({ email: '', password: '', idToken: '' }));
    let sessionEmail = String(email || '').trim().toLowerCase();

    if (idToken) {
        try {
            const decoded = await verifyFirebaseIdToken(String(idToken));
            const tokenEmail = decoded.email?.toLowerCase().trim();
            const isAdmin = decoded.admin === true || tokenEmail === expectedEmail || getAllowedAdminUids().includes(decoded.uid);
            if (!tokenEmail || !isAdmin) {
                return NextResponse.json({ error: 'Firebase user is not authorized as an admin.' }, { status: 403 });
            }
            sessionEmail = tokenEmail;
        } catch (error) {
            console.error('Firebase admin token verification failed:', error);
            return NextResponse.json({ error: 'Invalid Firebase authentication token.' }, { status: 401 });
        }
    } else {
        const expectedPassword = getExpectedAdminPassword();
        if (!expectedPassword) {
            return NextResponse.json(
                { error: 'Admin authentication is not configured.' },
                { status: 503 }
            );
        }

        if (sessionEmail !== expectedEmail || password !== expectedPassword) {
            return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
        }
    }

    const token = await createAdminSessionToken(sessionEmail);
    if (!token) {
        return NextResponse.json(
            { error: 'Admin session signing is not configured.' },
            { status: 503 }
        );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set({
        name: ADMIN_SESSION_COOKIE,
        value: token,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    });
    return response;
}

export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.set({
        name: ADMIN_SESSION_COOKIE,
        value: '',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0,
    });
    return response;
}
