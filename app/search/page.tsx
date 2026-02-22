"use client";

import { useState } from 'react';
import ProfileCard from '@/components/ProfileCard';
import RadiusSlider from '@/components/RadiusSlider';
import UnlockModal from '@/components/UnlockModal';
import { PublicProfile } from '@/types/user';

export default function Search() {
    const [keyword, setKeyword] = useState('');
    const [radius, setRadius] = useState(10);
    const [users, setUsers] = useState<PublicProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [modalOpen, setModalOpen] = useState(false);
    const [matchedUser, setMatchedUser] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const qs = new URLSearchParams({
                radius: String(radius),
                interestKeyword: keyword,
            }).toString();
            const res = await fetch(`/api/search?${qs}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users || []);
            } else {
                const data = await res.json();
                setError(data.message || 'Search failed');
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

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Search Tribes</h1>

            <div className="glass-card" style={{ marginBottom: '2rem' }}>
                <form onSubmit={handleSearch}>
                    <div className="form-group">
                        <label>Interest Keyword</label>
                        <input
                            type="text"
                            placeholder="e.g. Hiking, Coding..."
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                        />
                    </div>

                    <RadiusSlider radius={radius} onChange={setRadius} />

                    <button type="submit" className="primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>
            </div>

            {error && <p style={{ color: 'var(--danger)', textAlign: 'center' }}>{error}</p>}

            {!loading && users.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Try adjusting your radius or keyword.</p>
            )}

            <div className="grid">
                {users.map(u => (
                    <ProfileCard key={u.id} profile={u} onSignal={handleSignal} />
                ))}
            </div>

            <UnlockModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                matchUsername={matchedUser}
            />
        </div>
    );
}
