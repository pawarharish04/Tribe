import React from 'react';

type RadiusSliderProps = {
    radius: number;
    onChange: (value: number) => void;
    maxRadiusProps?: number;
};

export default function RadiusSlider({ radius, onChange, maxRadiusProps = 100 }: RadiusSliderProps) {
    return (
        <div style={{ marginBottom: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ color: 'var(--text-secondary)' }}>Search Radius</label>
                <span style={{ color: 'var(--accent-color)' }}>{radius} km</span>
            </div>
            <input
                type="range"
                min="1"
                max={maxRadiusProps}
                value={radius}
                onChange={(e) => onChange(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', appearance: 'auto', background: 'transparent' }}
            />
        </div>
    );
}
