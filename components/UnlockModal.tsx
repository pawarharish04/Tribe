import React from 'react';

type UnlockModalProps = {
    isOpen: boolean;
    onClose: () => void;
    matchUsername: string;
};

export default function UnlockModal({ isOpen, onClose, matchUsername }: UnlockModalProps) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(11, 12, 16, 0.8)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
            <div className="glass-card animate-fade-in" style={{ textAlign: 'center', maxWidth: '400px', width: '90%' }}>
                <h2 style={{ fontSize: '2rem', color: 'var(--accent-color)', marginBottom: '1rem' }}>Match Unlocked!</h2>
                <p style={{ marginBottom: '2rem' }}>You and @{matchUsername} have signaled each other. Chat is now enabled.</p>
                <button className="primary" onClick={onClose} style={{ width: '100%' }}>Awesome</button>
            </div>
        </div>
    );
}
