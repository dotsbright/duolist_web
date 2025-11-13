"use server";

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { db } from '../../lib/firebaseAdmin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { redirect } from 'next/navigation';

const SECRET = process.env.ADMIN_CONSOLE_SECRET || '';

export async function loginAction(formData: FormData) {
  const provided = String(formData.get('secret') || '');
  if (SECRET && provided === SECRET) {
    cookies().set('admin_secret', provided, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }
  redirect('/admin');
}

export async function logoutAction() {
  cookies().set('admin_secret', '', { httpOnly: true, sameSite: 'lax', secure: true, path: '/', maxAge: 0 });
  redirect('/admin/login');
}

export async function grantAction(formData: FormData) {
  const cookie = cookies().get('admin_secret')?.value || '';
  if (!SECRET || cookie !== SECRET) return;
  const uid = String(formData.get('uid') || '').trim();
  const expiresAtStr = String(formData.get('expiresAt') || '').trim();
  if (!uid) return;
  let ts: Timestamp | null = null;
  if (expiresAtStr) {
    const ms = Number.isFinite(Number(expiresAtStr)) ? Number(expiresAtStr) : Date.parse(expiresAtStr);
    if (!Number.isNaN(ms) && ms > 0) ts = Timestamp.fromMillis(ms);
  }
  // Update user doc: level_admin = 1
  await db.collection('users').doc(uid).set(
    { level_admin: 1, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );
  // Write entitlement with numeric plan = 1
  const ref = db.collection('entitlements').doc(uid);
  const data: any = {
    plan: 1,
    source: 'admin',
    grantedBy: 'admin_console',
    updatedAt: FieldValue.serverTimestamp(),
    expiresAt: ts ?? null,
  };
  await ref.set({ createdAt: FieldValue.serverTimestamp(), ...data }, { merge: true });
  revalidatePath('/admin');
}

export async function revokeAction(formData: FormData) {
  const cookie = cookies().get('admin_secret')?.value || '';
  if (!SECRET || cookie !== SECRET) return;
  const uid = String(formData.get('uid') || '').trim();
  if (!uid) return;
  // Update user doc: level_admin = 0
  await db.collection('users').doc(uid).set(
    { level_admin: 0, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );
  // Update entitlement with numeric plan = 0
  await db.collection('entitlements').doc(uid).set(
    { plan: 0, source: 'admin', updatedAt: FieldValue.serverTimestamp(), expiresAt: null },
    { merge: true }
  );
  revalidatePath('/admin');
}

export async function setPlanFilterAction(formData: FormData) {
  const value = String(formData.get('plan') || 'all');
  const allowed = new Set(['all', 'free', 'basic']);
  const plan = allowed.has(value) ? value : 'all';
  cookies().set('admin_plan_filter', plan, {
    httpOnly: false,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  redirect('/admin');
}
