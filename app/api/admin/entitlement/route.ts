import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebaseAdmin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

const SECRET = process.env.ADMIN_CONSOLE_SECRET;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = (searchParams.get('uid') || '').trim();
    const secret = req.headers.get('x-admin-secret') || '';

    if (!SECRET || secret !== SECRET) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    if (!uid) return NextResponse.json({ error: 'uid required' }, { status: 400 });

    const doc = await db.collection('entitlements').doc(uid).get();
    if (!doc.exists) return NextResponse.json({ entitlement: null });
    return NextResponse.json({ entitlement: doc.data() });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const secret = req.headers.get('x-admin-secret') || '';
    if (!SECRET || secret !== SECRET) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const uid = (body?.uid || '').trim();
    const action = (body?.action || '').trim();
    const expiresAt: number | undefined = body?.expiresAt;
    if (!uid || !action) return NextResponse.json({ error: 'uid and action required' }, { status: 400 });

    const ref = db.collection('entitlements').doc(uid);

    if (action === 'grant') {
      const data: any = {
        plan: 'pro',
        source: 'admin',
        grantedBy: 'admin_console',
        updatedAt: FieldValue.serverTimestamp(),
      };
      if (expiresAt && Number.isFinite(expiresAt)) {
        data.expiresAt = Timestamp.fromMillis(Number(expiresAt));
      } else {
        data.expiresAt = null;
      }
      // set with merge to preserve createdAt if present
      await ref.set({ createdAt: FieldValue.serverTimestamp(), ...data }, { merge: true });
      return NextResponse.json({ ok: true, action: 'grant' });
    } else if (action === 'revoke') {
      await ref.set({ plan: 'free', source: 'admin', updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      return NextResponse.json({ ok: true, action: 'revoke' });
    } else {
      return NextResponse.json({ error: 'invalid action' }, { status: 400 });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'error' }, { status: 500 });
  }
}
