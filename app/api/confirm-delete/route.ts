import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import * as admin from 'firebase-admin';

function baseUrl() {
  return process.env.BASE_URL || 'http://localhost:3000';
}

function ensureEnv(keys: string[]) {
  const missing = keys.filter(k => !process.env[k] || process.env[k] === '');
  if (missing.length) throw new Error(`Missing environment variables: ${missing.join(', ')}`);
}

function initAdminOnce() {
  // Initialise Admin SDK once per server process
  if (admin.apps.length > 0) return;
  const json = process.env.FIREBASE_ADMIN_JSON;
  if (!json) return; // optional: if missing, we will only notify support
  const creds = JSON.parse(json);
  admin.initializeApp({ credential: admin.credential.cert(creds) });
}

async function sendMail(to: string, subject: string, text: string, html?: string) {
  if (!process.env.SMTP_HOST) return; // allow running without SMTP (e.g., local dev)
  ensureEnv(['SMTP_HOST', 'SMTP_PORT']);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT!, 10),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    auth: process.env.SMTP_USER && process.env.SMTP_PASS ? { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! } : undefined,
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@duolist.app',
    to,
    subject,
    text,
    html,
  });
}

async function deleteUserData(uid: string) {
  const db = admin.firestore();

  // 1) Delete user subtree: users/{uid}/prefs/*, shared_refs/*, spaces/* (+ items/*), then users/{uid}
  const userRef = db.collection('users').doc(uid);

  const prefsSnap = await userRef.collection('prefs').get();
  for (const d of prefsSnap.docs) await d.ref.delete();

  const legacyRefsSnap = await userRef.collection('shared_refs').get();
  for (const d of legacyRefsSnap.docs) await d.ref.delete();

  const spacesSnap = await userRef.collection('spaces').get();
  for (const space of spacesSnap.docs) {
    const itemsSnap = await space.ref.collection('items').get();
    for (const itm of itemsSnap.docs) await itm.ref.delete();
    await space.ref.delete();
  }

  // Finally delete the user doc
  const userDoc = await userRef.get();
  if (userDoc.exists) await userRef.delete();

  // 2) Delete partner docs involving this user and their shared_spaces
  const partnersCol = db.collection('partners');
  const aQ = await partnersCol.where('aUid', '==', uid).get();
  const bQ = await partnersCol.where('bUid', '==', uid).get();
  const toDelete = new Map<string, FirebaseFirestore.DocumentSnapshot>();
  for (const d of aQ.docs) toDelete.set(d.id, d);
  for (const d of bQ.docs) toDelete.set(d.id, d);
  for (const d of toDelete.values()) {
    const sharedSpaces = await d.ref.collection('shared_spaces').get();
    for (const s of sharedSpaces.docs) await s.ref.delete();
    await d.ref.delete();
  }
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) throw new Error('Missing token');

    const secret = process.env.DELETE_JWT_SECRET;
    if (!secret) throw new Error('Server not configured (DELETE_JWT_SECRET).');

    const decoded = jwt.verify(token, secret) as { email?: string; iat?: number; exp?: number };
    const email = decoded.email;
    if (!email) throw new Error('Invalid token');

    initAdminOnce();
    if (!admin.apps.length) {
      return NextResponse.json({ error: 'Server not fully configured (Admin). Please try again later.' }, { status: 500 });
    }

    // Lookup user, delete data, then delete auth user
    let uid: string | undefined;
    try {
      const user = await admin.auth().getUserByEmail(email);
      uid = user.uid;
    } catch {
      // Treat as success to avoid user enumeration
      await sendMail(email, 'Duolist account deletion confirmed', 'Your account deletion has been confirmed.');
      if (process.env.SUPPORT_TO) await sendMail(process.env.SUPPORT_TO, 'Duolist deletion confirmed (web)', `Email: ${email}`);
      return NextResponse.json({ ok: true, message: 'Deletion confirmed.' });
    }

    // Disable sign-in immediately
    await admin.auth().updateUser(uid!, { disabled: true });

    // Firestore cleanup
    await deleteUserData(uid!);

    // Delete auth user last
    await admin.auth().deleteUser(uid!);

    // Notify
    await sendMail(email, 'Duolist account deletion confirmed', 'Your account has been deleted.');
    if (process.env.SUPPORT_TO) await sendMail(process.env.SUPPORT_TO, 'Duolist deletion confirmed (web)', `Email: ${email}\nUID: ${uid}`);

    return NextResponse.json({ ok: true, message: 'Account and related data deleted.' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 400 });
  }
}
