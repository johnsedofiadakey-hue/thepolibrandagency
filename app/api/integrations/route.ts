import { NextResponse } from 'next/server';
import { describePersistenceError, getIntegrations, setIntegrations } from '@/lib/db';
import { requireAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const data = await getIntegrations();
    // Mask secret key in response — only show last 4 chars
    const masked = { ...data };
    if (masked.paystack?.secretKey) {
      const sk = String(masked.paystack.secretKey);
      masked.paystack = {
        ...masked.paystack,
        secretKey: sk.length > 8 ? `${sk.slice(0, 7)}${'•'.repeat(sk.length - 11)}${sk.slice(-4)}` : '••••••••',
      };
    }
    return NextResponse.json(masked, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('Failed to load integrations:', error);
    return NextResponse.json({}, { headers: { 'Cache-Control': 'no-store' } });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    // If secret key is masked (all bullets), preserve the existing one
    const existing = await getIntegrations();
    const incomingSecret = body?.paystack?.secretKey || '';
    const isSecretMasked = incomingSecret.includes('•');

    const merged = {
      ...existing,
      ...body,
      paystack: {
        ...(existing?.paystack || {}),
        ...(body?.paystack || {}),
        secretKey: isSecretMasked
          ? (existing?.paystack?.secretKey || '')
          : incomingSecret,
      },
    };

    await setIntegrations(merged);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save integrations:', error);
    return NextResponse.json({ error: describePersistenceError(error, 'Integrations') }, { status: 503 });
  }
}
