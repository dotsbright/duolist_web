import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebaseAdmin';

const SECRET = process.env.ADMIN_CONSOLE_SECRET;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim().toLowerCase();
    const secret = req.headers.get('x-admin-secret') || '';

    if (!SECRET || secret !== SECRET) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    if (!q || q.length < 2) {
      return NextResponse.json({ users: [] });
    }

    const usersRef = db.collection('users');
    const start = q;
    const end = q + '\uf8ff';
    const snap = await usersRef
      .where('email', '>=', start)
      .where('email', '<=', end)
      .limit(20)
      .get();

    const users = snap.docs.map((d) => {
      const data = d.data() as any;
      return {
        uid: d.id,
        email: data.email || null,
        display: data.display_name || data.name || null,
        nick: data.nick_name || data.nick || null,
      };
    });

    return NextResponse.json({ users });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'error' }, { status: 500 });
  }
}
