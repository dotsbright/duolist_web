import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import * as admin from 'firebase-admin';

const Body = z.object({ email: z.string().email() });

function baseUrl() {
  return process.env.BASE_URL || 'http://localhost:3000';
}

function ensureEnv(keys: string[]) {
  const missing = keys.filter(k => !process.env[k] || process.env[k] === '');
  if (missing.length) throw new Error(`Missing environment variables: ${missing.join(', ')}`);
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { email } = Body.parse(json);

    const secret = process.env.DELETE_JWT_SECRET;
    if (!secret) throw new Error('Server not configured (DELETE_JWT_SECRET).');

    // If Admin SDK is configured, validate that the email exists. Do not leak existence to the client.
    let emailExists = true;
    try {
      if (process.env.FIREBASE_ADMIN_JSON && admin.apps.length === 0) {
        const creds = JSON.parse(process.env.FIREBASE_ADMIN_JSON);
        admin.initializeApp({ credential: admin.credential.cert(creds) });
      }
      if (admin.apps.length) {
        await admin.auth().getUserByEmail(email);
        emailExists = true;
      }
    } catch {
      // User not found or admin not configured; treat as non-existent
      emailExists = false;
    }

    const token = jwt.sign({ email }, secret, { expiresIn: '24h' });
    const link = `${baseUrl()}/confirm-delete?token=${encodeURIComponent(token)}`;

    // SMTP config
    ensureEnv(['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM']);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: parseInt(process.env.SMTP_PORT!, 10),
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
    });

    const html = `
      <p>Hello,</p>
      <p>We received a request to delete your Duolist account for <b>${email}</b>.</p>
      <p>If you made this request, click the button below to confirm. This link expires in 24 hours.</p>
      <p><a href="${link}" style="background:#3b82f6;color:#fff;padding:10px 14px;border-radius:6px;text-decoration:none">Confirm deletion</a></p>
      <p>If you did not request this, you can ignore this email.</p>
      <p>— Duolist</p>
    `;

    if (emailExists) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM!,
        to: email,
        subject: 'Confirm your Duolist account deletion',
        html,
        text: `Open this link to confirm deletion: ${link}`,
      });
    }

    return NextResponse.json({ ok: true, message: 'If an account exists for this email, a confirmation link has been sent.' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 400 });
  }
}
