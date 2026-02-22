"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push('/discover');
            } else {
                const data = await res.json();
                setError(data.message || 'Login failed');
            }
        } catch {
            setError('An error occurred');
        }
    };

    return (
        <div className="auth-container">
            <h1>Login to Tribe</h1>
            {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="primary" style={{ width: '100%' }}>Login</button>
            </form>
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                Don't have an account? <a href="/register">Register</a>
            </p>
        </div>
    );
}
