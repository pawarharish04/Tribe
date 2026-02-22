"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, username, password }),
            });

            if (res.ok) {
                router.push('/onboarding');
            } else {
                const data = await res.json();
                setError(data.message || 'Registration failed');
            }
        } catch {
            setError('An error occurred');
        }
    };

    return (
        <div className="auth-container">
            <h1>Join Tribe</h1>
            {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label>Email (Private)</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Pseudonym (Unique Username)</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="primary" style={{ width: '100%' }}>Register</button>
            </form>
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                Already have an account? <a href="/login">Login</a>
            </p>
        </div>
    );
}
