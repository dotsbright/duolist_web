import './globals.scss';
import type { Metadata } from 'next';
import BodyChrome from './BodyChrome';

export const metadata: Metadata = {
  title: 'Duolist – Minimal shared shopping list',
  description: 'Duolist is a minimal, shared shopping list app for two people. Real-time sync, clean UI.',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="theme-dark min-h-screen flex flex-col">
        <BodyChrome>{children}</BodyChrome>
      </body>
    </html>
  );
}
