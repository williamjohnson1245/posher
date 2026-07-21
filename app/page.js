import { redirect } from 'next/navigation';
import MagicLinkForm from '@/components/MagicLinkForm';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }) {
  const session = await getSession();
  if (session) redirect('/success');

  const params = await searchParams;
  const error = params?.error;
  const errorMessage =
    error === 'verification_failed'
      ? 'This magic link is invalid, expired, already used, or was opened in a different browser.'
      : error === 'missing_token'
        ? 'The magic-link token is missing. Request a new email.'
        : error === 'session_required'
          ? 'Your session is missing or expired. Request a new magic link.'
          : '';

  return (
    <main className="pageShell">
      <section className="authCard" aria-labelledby="page-title">
        <div className="brandMark" aria-hidden="true">S</div>
        <p className="eyebrow">Secure access</p>
        <h1 id="page-title">Sign in with email</h1>
        <p className="intro">Enter your email and we’ll send you a one-time magic link.</p>
        {errorMessage && <div className="errorBanner">{errorMessage}</div>}
        <MagicLinkForm />
        <div className="securityLine">
          <span aria-hidden="true">◉</span>
          Protected by Scalekit passwordless authentication
        </div>
      </section>
    </main>
  );
}
