import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-main' });

export const metadata = {
  title: 'Tribe | Anonymous Interest Discovery',
  description: 'Discover people near you based on mutual interests, anonymously.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <nav className="nav-bar">
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-color)' }}>TRIBE</div>
          <div className="nav-links">
            <a href="/discover">Discover</a>
            <a href="/search">Search</a>
            <a href="/chat">Chat</a>
            <a href="/profile">Profile</a>
          </div>
        </nav>
        <main className="container animate-fade-in">
          {children}
        </main>
      </body>
    </html>
  );
}
