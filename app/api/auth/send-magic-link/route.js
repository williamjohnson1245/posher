import { NextResponse } from 'next/server';
import { getAppOrigin, getMagicLinkExpiry, getScalekit } from '@/lib/scalekit';

export const runtime = 'nodejs';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    }

    const origin = getAppOrigin(request);
    const expiresIn = getMagicLinkExpiry();

    await getScalekit().passwordless.sendPasswordlessEmail(email, {
      template: 'SIGNIN',
      expiresIn,
      state: crypto.randomUUID(),
      magiclinkAuthUri: `${origin}/api/auth/verify`,
    });

    return NextResponse.json({ ok: true, expiresIn });
  } catch (error) {
    console.error('Magic-link send failed:', error);
    return NextResponse.json(
      { error: 'The sign-in email could not be sent. Check the Vercel environment variables and try again.' },
      { status: 500 },
    );
  }
}
