"use client";

import React, { useState } from 'react';
import PromptBlock from './PromptBlock';
import type { PublicProfile } from '@/types/user';

type ProfileCardProps = {
    profile: PublicProfile;
    onSignal: (userId: string) => void;
};

export default function ProfileCard({ profile, onSignal }: ProfileCardProps) {
    const [signaled, setSignaled] = useState(false);

    const handleSignal = () => {
        setSignaled(true);
        onSignal(profile.id);
    };

    return (
        <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>@{profile.username}</h2>
                {profile.score !== undefined && (
                    <div className="pill core">Match Score: {profile.score}</div>
                )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Interests</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {profile.interests.map((interest, idx) => (
                        <span key={idx} className={`pill ${interest.strength.toLowerCase()}`}>
                            {interest.interest.name}
                        </span>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Prompts</h3>
                {profile.prompts.map((p, idx) => (
                    <PromptBlock key={idx} question={p.prompt.question} answer={p.answer} />
                ))}
            </div>

            <button
                className="primary"
                style={{ width: '100%' }}
                onClick={handleSignal}
                disabled={signaled}
            >
                {signaled ? 'Signal Sent' : 'Send Signal'}
            </button>
        </div>
    );
}
