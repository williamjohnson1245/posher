import { NextResponse } from 'next/server';
import { getScalekit } from '@/lib/scalekit';
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from '@/lib/session';

export const runtime = 'nodejs';

export async function GET(request) {
  const linkToken = request.nextUrl.searchParams.get('link_token');
  const authRequestId = request.nextUrl.searchParams.get('auth_request_id') || undefined;

  if (!linkToken) {
    return NextResponse.redirect(new URL('/?error=missing_token', request.url));
  }

  try {
    const verified = await getScalekit().passwordless.verifyPasswordlessEmail(
      { linkToken },
      authRequestId,
    );

    if (!verified?.email) {
      throw new Error('Scalekit verification response did not contain an email');
    }

    const sessionToken = await createSessionToken(verified.email);
    const response = NextResponse.redirect(new URL('/success', request.url));
    response.cookies.set(SESSION_COOKIE, sessionToken, sessionCookieOptions);
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    console.error('Magic-link verification failed:', error);
    return NextResponse.redirect(new URL('/?error=verification_failed', request.url));
  }
}
