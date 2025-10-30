"use client";
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ConfirmDeletePage() {
  const sp = useSearchParams();
  const token = sp.get('token') || '';
  const [msg, setMsg] = useState<string>('');
  const [err, setErr] = useState<string>('');
  const [busy, setBusy] = useState(false);

  async function onConfirm() {
    if (!token) return;
    setBusy(true); setMsg(''); setErr('');
    try {
      const res = await fetch('/api/confirm-delete', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed');
      setMsg(json.message || 'Your account has been deleted.');
    } catch (e: any) {
      setErr(e.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container">
      <h2>Confirm account deletion</h2>
      {!token && <p className="error">Missing or invalid link.</p>}
      {token && (
        <>
          <p>
            This will permanently delete your Duolist account and associated data (lists you own, partner links, and shared spaces).
            This action cannot be undone.
          </p>
          <button className="btn" onClick={onConfirm} disabled={busy}>{busy ? 'Deleting…' : 'Confirm delete'}</button>
        </>
      )}
      {msg && <p className="success" style={{marginTop:12}}>{msg}</p>}
      {err && <p className="error" style={{marginTop:12}}>{err}</p>}
    </div>
  );
}
