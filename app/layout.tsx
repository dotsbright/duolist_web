import './globals.css';
import type { Metadata } from 'next';

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
      <body>
        <header>
          <a href="/" className="brand" aria-label="Duolist Home">
            <img src="/logo.svg" alt="Duolist logo" className="brand-logo" />
            <span className="brand-title">Duolist</span>
          </a>
          <p className="small">Minimal shared shopping list</p>
        </header>
        <main>{children}</main>
        <footer>
          <p className="small">© {new Date().getFullYear()} DotsBright • <a href="/privacy">Privacy</a> • <a href="/delete-account">Delete account</a></p>
        </footer>
      </body>
    </html>
  );
}
