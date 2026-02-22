"use client";

import { useState } from 'react';
import ProfileCard from '@/components/ProfileCard';
import InterestSelector from '@/components/InterestSelector';
import { PublicProfile } from '@/types/user';

export default function ProfileClient({ profile, changesRemaining }: { profile: PublicProfile, changesRemaining: number }) {
    const [editing, setEditing] = useState(false);
    const [selectedInterests, setSelectedInterests] = useState(profile.interests.map(i => i.interest.id));
    const [loading, setLoading] = useState(false);
    const [remains, setRemains] = useState(changesRemaining);

    const ALL_INTERESTS = [
        { id: '1', name: 'Coding' },
        { id: '2', name: 'Coffee' },
        { id: '3', name: 'Hiking' },
        { id: '4', name: 'Gaming' },
        { id: '5', name: 'Reading' },
        { id: '6', name: 'Music' },
        { id: '7', name: 'Art' },
        { id: '8', name: 'Travel' }
    ];

    const handleSave = async () => {
        if (selectedInterests.length < 5 || selectedInterests.length > 8) {
            alert('Select 5-8 interests.');
            return;
        }

        if (remains <= 0) {
            alert('You have no interest changes remaining this week.');
            setEditing(false);
            return;
        }

        setLoading(true);
        try {
            const payload = {
                action: 'changeInterests',
                newInterests: selectedInterests.map(id => ({ interestId: id, strength: 'CURIOUS' }))
            };

            const res = await fetch('/api/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Interests updated!');
                setRemains(r => r - 1);
                setEditing(false);
                window.location.reload(); // Quick refresh to clear cache and update props
            } else {
                const data = await res.json();
                alert(data.message || 'Error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            {!editing ? (
                <>
                    <ProfileCard profile={profile} onSignal={() => alert('This is your own profile view.')} />

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            Interest changes remaining this week: <strong style={{ color: 'var(--accent-color)' }}>{remains}</strong>
                        </p>
                        <button className="primary" onClick={() => setEditing(true)} disabled={remains <= 0}>
                            Edit Interests
                        </button>
                        {remains <= 0 && <p style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: '0.5rem' }}>You can change interests again next week.</p>}
                    </div>
                </>
            ) : (
                <div className="glass-card">
                    <h2 style={{ marginBottom: '1rem' }}>Edit Interests</h2>
                    <InterestSelector
                        interests={ALL_INTERESTS}
                        selectedInterests={selectedInterests}
                        onChange={setSelectedInterests}
                        maxSelections={8}
                    />
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button className="primary" style={{ flex: 1 }} onClick={handleSave} disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button style={{ flex: 1 }} onClick={() => setEditing(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}
