export const ADMIN_SESSION_COOKIE = '__session';
export const PORTAL_SESSION_COOKIE = '__session';
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
export const PORTAL_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

type SessionPayload = {
    email: string;
    role: 'admin' | 'portal';
    exp: number;
};

function getSigningSecret(): string | null {
    const secret = process.env.AUTH_SECRET || process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
    if (secret) return secret;
    return process.env.NODE_ENV === 'production' ? null : 'local-dev-admin-session-secret';
}

export function getExpectedAdminEmail(): string {
    return process.env.ADMIN_EMAIL || 'admin@polibrand.co';
}

export function getExpectedAdminPassword(): string | null {
    const password = process.env.ADMIN_PASSWORD;
    if (password) return password;
    return process.env.NODE_ENV === 'production' ? null : 'admin';
}

export function getExpectedPortalAccessCode(): string | null {
    const code = process.env.CLIENT_PORTAL_ACCESS_CODE;
    if (code) return code;
    return process.env.NODE_ENV === 'production' ? null : 'demo';
}

function toHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
}

function textToHex(value: string): string {
    return Array.from(new TextEncoder().encode(value))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
}

function hexToText(value: string): string {
    const bytes = value.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || [];
    return new TextDecoder().decode(new Uint8Array(bytes));
}

async function sign(value: string): Promise<string | null> {
    const secret = getSigningSecret();
    if (!secret) return null;

    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
    return toHex(signature);
}

function safeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}

export async function createAdminSessionToken(email: string): Promise<string | null> {
    const payload: SessionPayload = {
        email,
        role: 'admin',
        exp: Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000,
    };
    const encodedPayload = textToHex(JSON.stringify(payload));
    const signature = await sign(encodedPayload);
    if (!signature) return null;
    return `${encodedPayload}.${signature}`;
}

async function createPortalSessionToken(email: string): Promise<string | null> {
    const payload: SessionPayload = {
        email,
        role: 'portal',
        exp: Date.now() + PORTAL_SESSION_MAX_AGE_SECONDS * 1000,
    };
    const encodedPayload = textToHex(JSON.stringify(payload));
    const signature = await sign(encodedPayload);
    if (!signature) return null;
    return `${encodedPayload}.${signature}`;
}

async function verifySessionToken(token: string | null | undefined, role: SessionPayload['role']): Promise<SessionPayload | null> {
    if (!token) return null;

    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return null;

    const expectedSignature = await sign(encodedPayload);
    if (!expectedSignature || !safeEqual(signature, expectedSignature)) return null;

    try {
        const payload = JSON.parse(hexToText(encodedPayload)) as SessionPayload;
        if (payload.role !== role) return null;
        if (!payload.email) return null;
        if (!payload.exp || payload.exp < Date.now()) return null;
        return payload;
    } catch {
        return null;
    }
}

export async function verifyAdminSessionToken(token?: string | null): Promise<SessionPayload | null> {
    return verifySessionToken(token, 'admin');
}

export async function verifyPortalSessionToken(token?: string | null): Promise<SessionPayload | null> {
    return verifySessionToken(token, 'portal');
}

export { createPortalSessionToken };

export async function isAdminRequest(request: Request): Promise<boolean> {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
    const sessionCookie = cookies.find((cookie) => cookie.startsWith(`${ADMIN_SESSION_COOKIE}=`));
    const token = sessionCookie?.slice(ADMIN_SESSION_COOKIE.length + 1);
    return !!(await verifyAdminSessionToken(token));
}

export async function requireAdmin(request: Request): Promise<Response | null> {
    if (await isAdminRequest(request)) return null;
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function getPortalSession(request: Request): Promise<SessionPayload | null> {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
    const sessionCookie = cookies.find((cookie) => cookie.startsWith(`${PORTAL_SESSION_COOKIE}=`));
    const token = sessionCookie?.slice(PORTAL_SESSION_COOKIE.length + 1);
    return verifyPortalSessionToken(token);
}

export async function requirePortal(request: Request, email?: string | null): Promise<Response | null> {
    const session = await getPortalSession(request);
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    if (email && session.email.toLowerCase().trim() !== email.toLowerCase().trim()) {
        return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    return null;
}
