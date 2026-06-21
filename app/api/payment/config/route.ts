import { NextResponse } from 'next/server';
import { getIntegrations } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const integrations = await getIntegrations();
    const publicKey = (integrations?.paystack?.publicKey as string) || '';
    return NextResponse.json(
      { paystackPublicKey: publicKey, configured: !!publicKey },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json({ paystackPublicKey: '', configured: false });
  }
}
