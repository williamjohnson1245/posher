'use client';

import { useState } from 'react';

export default function MagicLinkForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [expiresIn, setExpiresIn] = useState(600);

  async function submit(event) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/auth/send-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to send the email.');
      }

      setExpiresIn(data.expiresIn || 600);
      setStatus('sent');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unable to send the email.');
    }
  }

  if (status === 'sent') {
    return (
      <div className="sentBox" role="status">
        <div className="mailIcon" aria-hidden="true">✉</div>
        <h2>Check your inbox</h2>
        <p>
          We sent a secure sign-in link to <strong>{email}</strong>. The link expires in{' '}
          {Math.round(expiresIn / 60)} minute{Math.round(expiresIn / 60) === 1 ? '' : 's'}.
        </p>
        <button className="secondaryButton" type="button" onClick={() => setStatus('idle')}>
          Use another email
        </button>
      </div>
    );
  }

  return (
    <form className="authForm" onSubmit={submit}>
      <label htmlFor="email">Email address</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        placeholder="name@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        disabled={status === 'loading'}
      />
      <button className="primaryButton" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending…' : 'Send magic link'}
      </button>
      {status === 'error' && <p className="errorText">{message}</p>}
      <p className="formHint">No password required. The link can be used only once.</p>
    </form>
  );
}
