"use client";
import { useState } from 'react';

export default function DeleteAccount() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null); setError(null);
    try {
      const res = await fetch('/api/request-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to send email');
      setStatus('We\'ve sent a confirmation link to your email. Please check your inbox (and spam). The link expires in 24 hours.');
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    }
  }

  return (
    <div>
      <div className="card">
        <div className="prose prose-invert max-w-none">
          <h2>Delete my account</h2>
          <p className="small">Enter the email you used to sign up. We'll email you a confirmation link to verify ownership before deletion.</p>
        </div>
        <form onSubmit={onSubmit} className="mt-3">
          <input className="input" type="email" required placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
          <div className="h-3" />
          <button className="btn" type="submit">Send confirmation link</button>
        </form>
        {status && <p className="mt-3 text-green-500 text-sm">{status}</p>}
        {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
        <p className="small mt-4">Can't access your email? Contact <a href="mailto:contact@dotsbright.com">contact@dotsbright.com</a>.</p>
      </div>
    </div>
  );
}
