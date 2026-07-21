import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

function safeDestination() {
  const raw = process.env.DESTINATION_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

export default async function SuccessPage() {
  const session = await getSession();
  if (!session) redirect('/?error=session_required');

  const destination = safeDestination();

  return (
    <main className="pageShell">
      <section className="successCard" aria-labelledby="success-title">
        <div className="successIcon" aria-hidden="true">
          <svg viewBox="0 0 52 52" role="img">
            <circle cx="26" cy="26" r="24" />
            <path d="M15 27.5 22.5 35 38 18.5" />
          </svg>
        </div>
        <p className="eyebrow">Verification complete</p>
        <h1 id="success-title">You’re successfully signed in</h1>
        <p className="intro">
          The email address <strong>{session.email}</strong> has been verified.
        </p>
        <div className="successActions">
          {destination ? (
            <a className="primaryButton linkButton" href={destination} rel="noreferrer">
              Continue
            </a>
          ) : (
            <a className="primaryButton linkButton" href="/api/logout">
              Finish
            </a>
          )}
          <a className="textLink" href="/api/logout">Sign out</a>
        </div>
      </section>
    </main>
  );
}
