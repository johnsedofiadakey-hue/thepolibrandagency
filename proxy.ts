import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/session';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Forwarded so the root layout can tell whether the current request is an
    // /admin route (which must stay reachable during maintenance mode so the
    // toggle can be switched back off).
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', pathname);
    const next = () => NextResponse.next({ request: { headers: requestHeaders } });

    if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
        return next();
    }

    const session = await verifyAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
    if (session) {
        return next();
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png|manifest.json|api/).*)'],
};
