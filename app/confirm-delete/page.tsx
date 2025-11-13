"use client";
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Card from '../components/ui/Card';

export const dynamic = 'force-dynamic';

function ConfirmDeleteInner() {
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
    <div className="space-y-4">
      <Card title="Confirm account deletion">
        {!token && <p className="text-red-500">Missing or invalid link.</p>}
        {token && (
          <>
            <p>
              This will permanently delete your Duolist account and associated data (lists you own, partner links, and shared spaces).
              This action cannot be undone.
            </p>
            <button className="btn" onClick={onConfirm} disabled={busy}>{busy ? 'Deleting…' : 'Confirm delete'}</button>
          </>
        )}
        {msg && <p className="mt-3 text-green-500 text-sm">{msg}</p>}
        {err && <p className="mt-3 text-red-500 text-sm">{err}</p>}
      </Card>
    </div>
  );
}

export default function ConfirmDeletePage() {
  return (
    <Suspense fallback={<div className="space-y-4"><div className="card"><p>Loading…</p></div></div>}>
      <ConfirmDeleteInner />
    </Suspense>
  );
}
