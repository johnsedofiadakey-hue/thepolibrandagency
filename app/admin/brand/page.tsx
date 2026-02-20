"use client";
import React, { useState } from "react";

const typographyPresets = [
    { id: 'institutional', label: 'Institutional', headline: 'Cinzel', body: 'Inter' },
    { id: 'modern', label: 'Modern', headline: 'Playfair Display', body: 'Inter' },
    { id: 'classic', label: 'Classic', headline: 'Cinzel', body: 'Georgia' },
];

export default function BrandSettingsPage() {
    const [colors, setColors] = useState({
        primary: '#1F6F3E',
        secondary: '#C9A227',
        accent: '#B22222',
        background: '#F9F6F1',
        text: '#111111',
    });
    const [typography, setTypography] = useState('institutional');
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load settings from API
    React.useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                setColors(data.theme);
                setTypography(data.typography);
                setLoading(false);
            });
    }, []);

    // Save settings to API
    const handleSave = async () => {
        setSaved(true);
        await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ theme: colors, typography }),
        });
        setTimeout(() => setSaved(false), 2000);
    } 

    const presetColors: Record<string, { primary: string; secondary: string; accent: string; background: string; text: string }> = {
        polibrand: { primary: '#1F6F3E', secondary: '#C9A227', accent: '#B22222', background: '#F9F6F1', text: '#111111' },
        midnight: { primary: '#1e3a5f', secondary: '#d4af37', accent: '#c0392b', background: '#f0f4f8', text: '#0f172a' },
        royal: { primary: '#4a235a', secondary: '#d4ac0d', accent: '#922b21', background: '#fdf9f0', text: '#1a1a2e' },
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.6rem', color: '#111', marginBottom: '0.25rem' }}>Brand Settings</h1>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#9ca3af' }}>Customize the platform visual identity</p>
                </div>
                <button
                    onClick={handleSave}
                    className="btn-primary"
                    style={{ background: saved ? '#16a34a' : undefined }}
                >
                    {saved ? '✓ Saved!' : 'Save Changes'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Color Settings */}
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.75rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.05rem', color: '#111', marginBottom: '1.5rem' }}>Color Palette</h3>

                    {/* Quick presets */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>QUICK PRESETS</p>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {Object.entries(presetColors).map(([key, preset]) => (
                                <button
                                    key={key}
                                    onClick={() => setColors(preset)}
                                    style={{
                                        padding: '6px 14px', borderRadius: 4, border: '1.5px solid #e5e0d6',
                                        background: preset.primary, color: '#fff', cursor: 'pointer',
                                        fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600,
                                        letterSpacing: '0.5px', textTransform: 'capitalize',
                                    }}
                                >
                                    {key}
                                </button>
                            ))}
                        </div>
                    </div>

                    {Object.entries(colors).map(([key, value]) => (
                        <div key={key} style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ position: 'relative' }}>
                                <div style={{ width: 44, height: 44, borderRadius: 6, background: value, border: '2px solid #e5e0d6', cursor: 'pointer', position: 'relative' }}>
                                    <input
                                        type="color"
                                        value={value}
                                        onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                                    />
                                </div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 600, color: '#374151', textTransform: 'capitalize', display: 'block', marginBottom: 4 }}>
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                                </label>
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#111', border: '1.5px solid #e5e0d6', borderRadius: 4, padding: '6px 10px', width: '100%' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Live Preview + Typography */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Preview */}
                    <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.75rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.05rem', color: '#111', marginBottom: '1.25rem' }}>Live Preview</h3>
                        <div style={{ background: colors.background, borderRadius: 8, padding: '1.5rem', border: '1px solid #e5e0d6' }}>
                            {/* Mini nav */}
                            <div style={{ background: colors.primary, padding: '0.75rem 1rem', borderRadius: 4, marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '0.75rem', color: colors.secondary }}>POLIBRAND AGENCY</span>
                                <div style={{ background: colors.secondary, padding: '4px 10px', borderRadius: 2 }}>
                                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', fontWeight: 700, color: '#000' }}>APPLY</span>
                                </div>
                            </div>
                            {/* Mini hero */}
                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                                <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1rem', color: colors.text, marginBottom: '0.5rem' }}>Building Political Power for Women.</h2>
                                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                    <div style={{ background: colors.primary, color: '#fff', padding: '6px 14px', borderRadius: 2, fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', fontWeight: 600 }}>
                                        Apply for Fellowship
                                    </div>
                                    <div style={{ border: `2px solid ${colors.secondary}`, color: colors.secondary, padding: '6px 14px', borderRadius: 2, fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', fontWeight: 600 }}>
                                        Partner With Us
                                    </div>
                                </div>
                            </div>
                            {/* Accent bar */}
                            <div style={{ height: 3, background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`, borderRadius: 2, marginTop: '1rem' }} />
                        </div>
                    </div>

                    {/* Typography */}
                    <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.75rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.05rem', color: '#111', marginBottom: '1.25rem' }}>Typography Preset</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {typographyPresets.map((preset) => (
                                <label key={preset.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '1rem', borderRadius: 6, border: `2px solid ${typography === preset.id ? '#1F6F3E' : '#e5e0d6'}`, background: typography === preset.id ? '#f0fdf4' : '#fff', cursor: 'pointer', transition: 'all 0.2s' }}>
                                    <input type="radio" name="typography" value={preset.id} checked={typography === preset.id} onChange={() => setTypography(preset.id)} style={{ display: 'none' }} />
                                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${typography === preset.id ? '#1F6F3E' : '#ccc'}`, background: typography === preset.id ? '#1F6F3E' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {typography === preset.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.85rem', color: '#111', marginBottom: 2 }}>{preset.label}</div>
                                        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#9ca3af' }}>Headlines: {preset.headline} · Body: {preset.body}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Logo Upload */}
                    <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.75rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.05rem', color: '#111', marginBottom: '1.25rem' }}>Logo & Favicon</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {['Logo (PNG/SVG)', 'Favicon (32×32 ICO)'].map((label) => (
                                <div key={label} style={{ border: '2px dashed #e5e0d6', borderRadius: 8, padding: '1.5rem', textAlign: 'center', cursor: 'pointer' }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#1F6F3E'; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#e5e0d6'; }}>
                                    <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>📁</div>
                                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#6b7280', marginBottom: '0.5rem' }}>{label}</div>
                                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: '#9ca3af' }}>Click to upload</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
