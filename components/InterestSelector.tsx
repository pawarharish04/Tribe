import React from 'react';

type InterestSelectorProps = {
    interests: { id: string; name: string }[];
    selectedInterests: string[];
    onChange: (selectedIds: string[]) => void;
    maxSelections?: number;
};

export default function InterestSelector({ interests, selectedInterests, onChange, maxSelections = 8 }: InterestSelectorProps) {

    const toggleInterest = (id: string) => {
        if (selectedInterests.includes(id)) {
            onChange(selectedInterests.filter(i => i !== id));
        } else {
            if (selectedInterests.length < maxSelections) {
                onChange([...selectedInterests, id]);
            } else {
                alert(`You can only select up to ${maxSelections} interests.`);
            }
        }
    };

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.5rem' }}>
            {interests.map(interest => {
                const isSelected = selectedInterests.includes(interest.id);
                return (
                    <button
                        key={interest.id}
                        type="button"
                        className={`pill ${isSelected ? 'core' : ''}`}
                        style={{
                            borderColor: isSelected ? 'var(--accent-color)' : 'var(--border-color)',
                            color: isSelected ? 'var(--accent-color)' : '#fff',
                            background: isSelected ? 'rgba(102, 252, 241, 0.1)' : 'transparent',
                            padding: '0.5rem 1rem',
                            cursor: 'pointer'
                        }}
                        onClick={() => toggleInterest(interest.id)}
                    >
                        {interest.name}
                    </button>
                );
            })}
        </div>
    );
}
