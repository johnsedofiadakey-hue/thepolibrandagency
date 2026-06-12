import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_SESSION_COOKIE = '__session';

function hexToBytes(hex: string): Uint8Array {
  const pairs = hex.match(/.{1,2}/g) || [];
  return new Uint8Array(pairs.map((b) => parseInt(b, 16)));
}

async function isValidAdminToken(token: string): Promise<boolean> {
  const secret =
    process.env.AUTH_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    (process.env.NODE_ENV !== 'production' ? 'local-dev-admin-session-secret' : null);

  if (!secret) return false;

  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return false;

  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      hexToBytes(signature),
      new TextEncoder().encode(encodedPayload)
    );

    if (!valid) return false;

    const payload = JSON.parse(
      new TextDecoder().decode(hexToBytes(encodedPayload))
    );

    return payload.role === 'admin' && typeof payload.exp === 'number' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/admin') &&
    pathname !== '/admin' &&
    pathname !== '/admin/login'
  ) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

    if (!token || !(await isValidAdminToken(token))) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path+'],
};
