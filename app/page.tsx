import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Home() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  if (token) {
    redirect('/discover');
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '10vh' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: 'var(--accent-color)' }}>
        Discover Your Tribe
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
        An anonymous, interest-based, location-aware discovery platform. Find people near you who care about what you care about.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link href="/login">
          <button style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Login</button>
        </Link>
        <Link href="/register">
          <button className="primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Register</button>
        </Link>
      </div>
    </div>
  );
}
