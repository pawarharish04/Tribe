"use client";

import { useEffect, useState } from 'react';
import ProfileCard from '@/components/ProfileCard';
import UnlockModal from '@/components/UnlockModal';
import { PublicProfile } from '@/types/user';

export default function Discover() {
    const [users, setUsers] = useState<PublicProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [modalOpen, setModalOpen] = useState(false);
    const [matchedUser, setMatchedUser] = useState('');

    useEffect(() => {
        // 1. Get GPS, then fetch
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                // Update user location in DB (in actual app, throttle this)
                fetch('/api/users', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ latitude, longitude }),
                }).then(() => loadUsers(10)); // radius 10
            }, () => {
                setError('Location access denied. Please allow location to discover tribes.');
                setLoading(false);
            });
        } else {
            setError('Geolocation not supported by this browser.');
            setLoading(false);
        }
    }, []);

    const loadUsers = async (radius: number) => {
        try {
            const res = await fetch(`/api/discover?radius=${radius}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users || []);
            } else {
                setError('Failed to load users');
            }
        } catch {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    const handleSignal = async (toUserId: string) => {
        try {
            const res = await fetch('/api/interactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ toUserId, type: 'SIGNAL' }),
            });
            const data = await res.json();
            if (res.ok && data.matchUnlocked) {
                setMatchedUser(users.find(u => u.id === toUserId)?.username || 'User');
                setModalOpen(true);
            } else if (!res.ok) {
                alert(data.message || 'Failed to signal');
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Discovering nearby tribes...</div>;
    if (error) return <div style={{ color: 'var(--danger)', textAlign: 'center' }}>{error}</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Discover</h1>
            {users.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No one found nearby with similar interests.</p>
            ) : (
                <div className="grid">
                    {users.map(u => (
                        <ProfileCard key={u.id} profile={u} onSignal={handleSignal} />
                    ))}
                </div>
            )}
            <UnlockModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                matchUsername={matchedUser}
            />
        </div>
    );
}
