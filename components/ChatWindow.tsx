"use client";

import React, { useState } from 'react';

type Message = {
    id: string;
    senderId: string;
    content: string;
};

type ChatWindowProps = {
    matchId: string;
    currentUserId: string;
    matchUsername: string;
    initialMessages: Message[];
    onSendMessage: (content: string) => Promise<Message | null>;
};

export default function ChatWindow({ currentUserId, matchUsername, initialMessages, onSendMessage }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const tempMsg: Message = { id: Date.now().toString(), senderId: currentUserId, content: input };
        setMessages(prev => [...prev, tempMsg]);
        setInput('');

        // API call to send message
        const newMsg = await onSendMessage(tempMsg.content);
        if (newMsg) {
            setMessages(prev => prev.map(m => m.id === tempMsg.id ? newMsg : m));
        }
    };

    return (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '600px', maxWidth: '800px', margin: '0 auto' }}>
            <h3 style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                Chat with @{matchUsername}
            </h3>
            <div className="chat-messages" style={{ flexGrow: 1, overflowY: 'auto' }}>
                {messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.senderId === currentUserId ? 'sent' : 'received'}`}>
                        {msg.content}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type a message..."
                    style={{ flexGrow: 1 }}
                />
                <button type="submit" className="primary">Send</button>
            </form>
        </div>
    );
}
