import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lead Manager',
  description: 'Public lead form + internal leads list',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#f7f7f9', color: '#111' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '24px 20px' }}>
          <header style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <a href="/" style={{ fontWeight: 800, fontSize: 22, letterSpacing: 0.3 }}>alma</a>
            <nav style={{ marginLeft: 'auto' }}>
              <a href="/login"><button className="secondary">Admin</button></a>
            </nav>
          </header>
          <main>{children}</main>
          <footer style={{ marginTop: 48, opacity: 0.6, fontSize: 12 }}>
            Demo app • Next.js App Router • Zod validation
          </footer>
        </div>
      </body>
    </html>
  );
}
