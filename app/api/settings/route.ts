import { NextResponse } from 'next/server';
import { getSettings, setSettings, SiteSettings } from '@/lib/db';
import { requireAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getSettings();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('Safe fallback for settings API:', error);
    const data = await getSettings();
    return NextResponse.json(data);
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body: SiteSettings = await request.json();
    await setSettings(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
