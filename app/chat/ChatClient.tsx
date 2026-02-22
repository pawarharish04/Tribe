"use client";

import { useState } from 'react';
import ChatWindow from '@/components/ChatWindow';

type Match = {
    id: string;
    partnerId: string;
    partnerUsername: string;
    messages: { id: string; content: string; senderId: string; }[];
};

export default function ChatClient({ currentUserId, initialMatches }: { currentUserId: string, initialMatches: Match[] }) {
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

    const handleSendMessage = async (content: string) => {
        if (!selectedMatch) return null;
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ matchId: selectedMatch.id, content })
            });
            if (res.ok) {
                const data = await res.json();
                return data.message;
            }
            return null;
        } catch {
            return null;
        }
    };

    return (
        <div style={{ display: 'flex', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div className="glass-card" style={{ flex: '0 0 300px', padding: '1rem' }}>
                <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Your Matches</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {initialMatches.map(m => (
                        <li
                            key={m.id}
                            style={{
                                padding: '0.75rem',
                                marginBottom: '0.5rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                background: selectedMatch?.id === m.id ? 'rgba(102, 252, 241, 0.1)' : 'transparent',
                                border: '1px solid',
                                borderColor: selectedMatch?.id === m.id ? 'var(--accent-color)' : 'transparent'
                            }}
                            onClick={() => setSelectedMatch(m)}
                        >
                            @{m.partnerUsername}
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ flex: '1', minHeight: '500px' }}>
                {selectedMatch ? (
                    <ChatWindow
                        key={selectedMatch.id}
                        matchId={selectedMatch.id}
                        currentUserId={currentUserId}
                        matchUsername={selectedMatch.partnerUsername}
                        initialMessages={selectedMatch.messages}
                        onSendMessage={handleSendMessage}
                    />
                ) : (
                    <div className="glass-card" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>Select a match to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}
