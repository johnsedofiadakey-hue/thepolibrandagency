import { NextResponse } from 'next/server';
import { describePersistenceError, getIntegrations, setIntegrations } from '@/lib/db';
import { requireAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const data = await getIntegrations();
    // Mask secret key — show prefix + last 4 chars only
    const masked = { ...data };
    if (masked.paystack?.secretKey) {
      const sk = String(masked.paystack.secretKey);
      masked.paystack = {
        ...masked.paystack,
        secretKey: sk.length > 8
          ? `${sk.slice(0, 7)}${'•'.repeat(sk.length - 11)}${sk.slice(-4)}`
          : '••••••••',
      };
    }
    return NextResponse.json(masked, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({}, { headers: { 'Cache-Control': 'no-store' } });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const existing = await getIntegrations();

    // Preserve existing secret key if the incoming value is masked
    const incomingSecret = body?.paystack?.secretKey || '';
    const isMasked = incomingSecret.includes('•');

    const merged = {
      ...existing,
      ...body,
      paystack: {
        ...(existing?.paystack || {}),
        ...(body?.paystack || {}),
        secretKey: isMasked ? (existing?.paystack?.secretKey || '') : incomingSecret,
      },
    };

    await setIntegrations(merged);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: describePersistenceError(error, 'Integrations') }, { status: 503 });
  }
}
