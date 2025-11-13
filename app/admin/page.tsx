import React from 'react';
import { cookies } from 'next/headers';
import { db } from '../../lib/firebaseAdmin';
import Card from '../components/ui/Card';
import { logoutAction, grantAction, revokeAction, setPlanFilterAction } from './actions';
import { redirect } from 'next/navigation';

const SECRET = process.env.ADMIN_CONSOLE_SECRET || '';

export default async function AdminPage({ searchParams }: { searchParams: { q?: string; limit?: string; after?: string; stack?: string } }) {
  const cookie = cookies().get('admin_secret')?.value || '';
  const authed = SECRET && cookie === SECRET;

  if (!authed) {
    redirect('/admin/login');
  }

  const q = (searchParams.q || '').trim().toLowerCase();
  const limitNum = (() => {
    const n = Number(searchParams.limit || 10);
    if (!Number.isFinite(n)) return 20;
    return Math.min(50, Math.max(5, Math.floor(n)));
  })();
  const after = (searchParams.after || '').trim();
  const stackRaw = (searchParams.stack || '').trim();
  const stack = stackRaw ? stackRaw.split('|').filter(Boolean) : [];
  const effectiveAfter = after || (stack.length ? stack[stack.length - 1] : '');
  const planCookie = cookies().get('admin_plan_filter')?.value || 'all';
  const allowedPlans = new Set(['all', 'free', 'basic']);
  const planFilter = allowedPlans.has(planCookie) ? planCookie : 'all';
  const effectivePlan = q ? 'all' : planFilter; // search ignores plan filter
  const users: Array<{
    uid: string;
    email: string | null;
    display: string | null;
    nick: string | null;
    level?: number | null;
    level_admin?: number | null;
  }> = [];

  let nextCursor: string | null = null;
  if (q && q.length >= 2) {
    const start = q;
    const end = q + '\uf8ff';
    const snap = await db
      .collection('users')
      .where('email', '>=', start)
      .where('email', '<=', end)
      .orderBy('email')
      .limit(limitNum)
      .get();

    for (const d of snap.docs) {
      const data = d.data() as any;
      users.push({
        uid: d.id,
        email: data.email || null,
        display: data.display_name || data.name || null,
        nick: data.nick_name || data.nick || null,
        level: typeof data.level === 'number' ? data.level : Number.parseInt(String(data.level || '0')) || 0,
        level_admin:
          typeof data.level_admin === 'number' ? data.level_admin : Number.parseInt(String(data.level_admin || '0')) || 0,
      });
    }
  } else {
    if (effectivePlan === 'all') {
      let qref = db.collection('users').orderBy('email').limit(limitNum);
      if (effectiveAfter) qref = qref.startAfter(effectiveAfter);
      const snap = await qref.get();
      for (const d of snap.docs) {
        const data = d.data() as any;
        users.push({
          uid: d.id,
          email: data.email || null,
          display: data.display_name || data.name || null,
          nick: data.nick_name || data.nick || null,
          level: typeof data.level === 'number' ? data.level : Number.parseInt(String(data.level || '0')) || 0,
          level_admin:
            typeof data.level_admin === 'number' ? data.level_admin : Number.parseInt(String(data.level_admin || '0')) || 0,
        });
      }
      if (snap.docs.length === limitNum) {
        const last = snap.docs[snap.docs.length - 1];
        nextCursor = (last.data() as any)?.email || null;
      }
    } else if (effectivePlan === 'free') {
      let qref = db
        .collection('users')
        .where('level', '==', 0)
        .where('level_admin', '==', 0)
        .orderBy('email')
        .limit(limitNum);
      if (effectiveAfter) qref = qref.startAfter(effectiveAfter);
      const snap = await qref.get();
      for (const d of snap.docs) {
        const data = d.data() as any;
        users.push({
          uid: d.id,
          email: data.email || null,
          display: data.display_name || data.name || null,
          nick: data.nick_name || data.nick || null,
          level: typeof data.level === 'number' ? data.level : Number.parseInt(String(data.level || '0')) || 0,
          level_admin:
            typeof data.level_admin === 'number' ? data.level_admin : Number.parseInt(String(data.level_admin || '0')) || 0,
        });
      }
      if (snap.docs.length === limitNum) {
        const last = snap.docs[snap.docs.length - 1];
        nextCursor = (last.data() as any)?.email || null;
      }
    } else {
      // basic = any Pro (Play or Admin). Combine two queries.
      let q1 = db.collection('users').where('level', '==', 1).orderBy('email').limit(limitNum);
      if (effectiveAfter) q1 = q1.startAfter(effectiveAfter);
      let q2 = db.collection('users').where('level_admin', '==', 1).orderBy('email').limit(limitNum);
      if (effectiveAfter) q2 = q2.startAfter(effectiveAfter);
      const [s1, s2] = await Promise.all([q1.get(), q2.get()]);
      const map = new Map<string, any>();
      for (const d of s1.docs) map.set(d.id, d);
      for (const d of s2.docs) map.set(d.id, d);
      const merged = Array.from(map.values()).sort((a, b) => {
        const ea = String((a.data() as any)?.email || '').toLowerCase();
        const eb = String((b.data() as any)?.email || '').toLowerCase();
        return ea.localeCompare(eb);
      });
      const page = merged.slice(0, limitNum);
      for (const d of page) {
        const data = d.data() as any;
        users.push({
          uid: d.id,
          email: data.email || null,
          display: data.display_name || data.name || null,
          nick: data.nick_name || data.nick || null,
          level: typeof data.level === 'number' ? data.level : Number.parseInt(String(data.level || '0')) || 0,
          level_admin:
            typeof data.level_admin === 'number' ? data.level_admin : Number.parseInt(String(data.level_admin || '0')) || 0,
        });
      }
      if (merged.length >= limitNum) {
        const last = page[page.length - 1];
        nextCursor = ((last.data() as any)?.email || '').toLowerCase();
      }
    }
  }

  return (
    <section className="px-4 md:px-6 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-lg">Admin Console</h1>
        <form action={logoutAction}>
          <button type="submit" className="btn-neutral">Sign out</button>
        </form>
      </header>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <form method="get" className="flex gap-2">
            <input
              type="search"
              name="q"
              placeholder="Search user by email (min 2 chars)"
              defaultValue={q}
              className="flex-1 input"
            />
            {/* Reset cursor stack when submitting a new query */}
            <input type="hidden" name="limit" value={String(limitNum)} />
            <input type="hidden" name="stack" value="" />
            <button type="submit" className="btn">Search</button>
          </form>
          <form action={setPlanFilterAction} className="flex items-center gap-2">
            <label className="small">Filter</label>
            <select name="plan" defaultValue={planFilter} className="input max-w-[180px]">
              <option value="all">All</option>
              <option value="free">Free</option>
              <option value="basic">Basic</option>
            </select>
            <button type="submit" className="btn-neutral">Apply</button>
          </form>
        </div>
        {q && q.length < 2 && <p className="small mt-2">Enter at least 2 characters.</p>}
      </Card>

      {users.length > 0 ? (
        <Card className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[var(--surface)]">
              <tr>
                <th className="text-left p-2.5">Email</th>
                <th className="text-left p-2.5">Name</th>
                <th className="text-left p-2.5">UID</th>
                <th className="text-left p-2.5">Level</th>
                <th className="text-left p-2.5">Admin</th>
                <th className="text-left p-2.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.uid} className="border-t border-[var(--border)]">
                  <td className="p-2.5">{u.email}</td>
                  <td className="p-2.5">{u.display || u.nick || '—'}</td>
                  <td className="p-2.5 font-mono">{u.uid}</td>
                  <td className="p-2.5">{u.level === 1 ? 'Pro' : 'Basic'}</td>
                  <td className="p-2.5">{u.level_admin === 1 ? 'Pro' : 'Basic'}</td>
                  <td className="p-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      {u.level_admin === 1 ? (
                        <form action={revokeAction}>
                          <input type="hidden" name="uid" value={u.uid} />
                          <button type="submit" className="btn-neutral">Revoke</button>
                        </form>
                      ) : (
                        <form action={grantAction} className="flex items-center gap-2">
                          <input type="hidden" name="uid" value={u.uid} />
                          <input
                            type="datetime-local"
                            name="expiresAt"
                            aria-label="Expiry"
                            className="text-[12px] input max-w-[220px]"
                          />
                          <button type="submit" className="btn-neutral">Grant Pro</button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!q && (
            <div className="mt-3 flex items-center justify-between">
              {/* Prev */}
              <form method="get" className="flex items-center gap-2">
                <input type="hidden" name="limit" value={String(limitNum)} />
                {stack.length > 0 ? (
                  <>
                    {/* For prev, pop last cursor and use the one before it */}
                    <input type="hidden" name="stack" value={stack.slice(0, -1).join('|')} />
                    <input type="hidden" name="after" value={stack.slice(0, -1).slice(-1)[0] || ''} />
                    <button className="btn-neutral" type="submit">Prev</button>
                  </>
                ) : (
                  <button className="btn-neutral opacity-50 cursor-not-allowed" type="button" disabled>Prev</button>
                )}
              </form>

              {/* Next */}
              <form method="get" className="flex items-center gap-2">
                <input type="hidden" name="limit" value={String(limitNum)} />
                {nextCursor ? (
                  <>
                    <input type="hidden" name="after" value={nextCursor} />
                    <input type="hidden" name="stack" value={[...stack, nextCursor].join('|')} />
                    <button className="btn-neutral" type="submit">Next</button>
                  </>
                ) : (
                  <button className="btn-neutral opacity-50 cursor-not-allowed" type="button" disabled>Next</button>
                )}
              </form>
            </div>
          )}
        </Card>
      ) : q ? (
        <p>No users found.</p>
      ) : (
        <p>Search for a user by email to manage admin access.</p>
      )}
    </section>
  );
}
