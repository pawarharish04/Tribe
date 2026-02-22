"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InterestSelector from '@/components/InterestSelector';

export default function Onboarding() {
    const router = useRouter();

    // Dummy static data for MVP, ideally fetched from an API
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

    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [prompts, setPrompts] = useState<{ id: string; answer: string }[]>([
        { id: 'p1', answer: '' },
        { id: 'p2', answer: '' }
    ]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Request location access initially
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(() => { }, () => {
                alert("Location access is recommended for the best experience.");
            });
        }
    }, []);

    const handleComplete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedInterests.length < 5 || selectedInterests.length > 8) {
            alert('Please select between 5 and 8 interests.');
            return;
        }

        setLoading(true);

        // Save to server
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
                router.push('/discover');
            } else {
                const data = await res.json();
                alert(data.message || 'Error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card" style={{ maxWidth: '600px', margin: '4rem auto' }}>
            <h1 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>Welcome to Tribe</h1>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                Set up your anonymous profile to connect with people nearby.
            </p>

            <form onSubmit={handleComplete}>
                <div style={{ marginBottom: '2rem' }}>
                    <h3>Select Interests (5-8)</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        What are you passionate about?
                    </p>
                    <InterestSelector
                        interests={ALL_INTERESTS}
                        selectedInterests={selectedInterests}
                        onChange={setSelectedInterests}
                        maxSelections={8}
                    />
                    <p style={{ fontSize: '0.85rem', color: 'var(--accent-color)' }}>
                        Selected: {selectedInterests.length}/8
                    </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3>Prompts</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        Add some personality to your profile
                    </p>
                    <div className="form-group">
                        <label>My favorite weekend activity is...</label>
                        <input
                            type="text"
                            value={prompts[0].answer}
                            onChange={e => {
                                const newP = [...prompts];
                                newP[0].answer = e.target.value;
                                setPrompts(newP);
                            }}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>A belief I recently changed my mind about...</label>
                        <input
                            type="text"
                            value={prompts[1].answer}
                            onChange={e => {
                                const newP = [...prompts];
                                newP[1].answer = e.target.value;
                                setPrompts(newP);
                            }}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Saving...' : 'Complete Profile & Discover'}
                </button>
            </form>
        </div>
    );
}
