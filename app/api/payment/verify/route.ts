import { NextResponse } from 'next/server';
import { createApplication, describePersistenceError, getIntegrations } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const limited = rateLimit(request, { scope: 'payment-verify', limit: 10, windowMs: 60 * 60 * 1000 });
  if (limited) return limited;

  try {
    const body = await request.json();
    const { reference, ...applicationData } = body;

    if (!reference || typeof reference !== 'string' || !reference.trim()) {
      return NextResponse.json({ error: 'Payment reference is required.' }, { status: 400 });
    }

    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'country', 'program', 'role', 'essay'];
    const missingField = requiredFields.find((f) => {
      const v = applicationData?.[f];
      return typeof v !== 'string' || v.trim().length === 0;
    });
    if (missingField) {
      return NextResponse.json({ error: `${missingField} is required.` }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicationData.email)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    const integrations = await getIntegrations();
    const secretKey = (integrations?.paystack?.secretKey as string) || '';
    if (!secretKey) {
      return NextResponse.json({ error: 'Payment gateway is not configured. Contact the administrator.' }, { status: 503 });
    }

    // Verify with Paystack
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference.trim())}`,
      { headers: { Authorization: `Bearer ${secretKey}` }, cache: 'no-store' },
    );

    if (!verifyRes.ok) {
      return NextResponse.json({ error: 'Could not verify payment. Please contact support.' }, { status: 402 });
    }

    const { data: txn } = await verifyRes.json();

    if (txn?.status !== 'success') {
      return NextResponse.json(
        { error: `Payment was not successful (status: ${txn?.status || 'unknown'}). Please try again.` },
        { status: 402 },
      );
    }

    // 150 000 pesewas = ₵1 500 GHS
    if ((txn?.amount || 0) < 150000) {
      return NextResponse.json({ error: 'Payment amount is insufficient.' }, { status: 402 });
    }

    const timestamp = new Date().toISOString();
    await createApplication({
      ...applicationData,
      firstName: applicationData.firstName.trim(),
      lastName: applicationData.lastName.trim(),
      email: applicationData.email.toLowerCase().trim(),
      phone: applicationData.phone.trim(),
      country: applicationData.country.trim(),
      program: applicationData.program.trim(),
      role: applicationData.role.trim(),
      essay: applicationData.essay.trim(),
      id: Date.now(),
      timestamp,
      status: 'Pending',
      paymentRef: reference.trim(),
      paymentAmount: txn.amount / 100,
      paymentCurrency: txn.currency || 'GHS',
      paymentStatus: 'paid',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment verify error:', error);
    return NextResponse.json({ error: describePersistenceError(error, 'Payment verification') }, { status: 503 });
  }
}
