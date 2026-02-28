"use client";
import React, { useState, useContext } from "react";
import { PoliSettingsContext } from '@/components/SettingsProvider';

const typographyPresets = [
    { id: 'institutional', label: 'Institutional', headline: 'Cinzel', body: 'Inter' },
    { id: 'modern', label: 'Modern', headline: 'Playfair Display', body: 'Inter' },
    { id: 'classic', label: 'Classic', headline: 'Cinzel', body: 'Georgia' },
];

export default function BrandPage() {
    const { theme, typography: contextTypography, updateSettings } = useContext(PoliSettingsContext) as any;
    const [colors, setColors] = useState(theme);
    const [typography, setTypography] = useState(contextTypography || 'institutional');
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);

    // Save settings to API and Context
    const handleSave = async (updatedColors = colors, updatedTypography = typography) => {
        setSaved(true);
        const newSettings = { theme: updatedColors, typography: updatedTypography };

        await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSettings),
        });

        // Update global context instantly
        updateSettings(newSettings);

        setTimeout(() => setSaved(false), 2000);
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'heroImage') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(type);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                const newColors = { ...colors, [type === 'logo' ? 'logo' : 'heroImage']: data.url };
                setColors(newColors);
                handleSave(newColors);
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(null);
        }
    }

    const presetColors: Record<string, { primary: string; secondary: string; accent: string; background: string; text: string; logo: string; heroImage: string }> = {
        polibrand: { primary: '#1F6F3E', secondary: '#C9A227', accent: '#B22222', background: '#F9F6F1', text: '#111111', logo: '/logo.png', heroImage: '' },
        midnight: { primary: '#1e3a5f', secondary: '#d4af37', accent: '#c0392b', background: '#f0f4f8', text: '#0f172a', logo: '/logo.png', heroImage: '' },
        royal: { primary: '#4a235a', secondary: '#d4ac0d', accent: '#922b21', background: '#fdf9f0', text: '#1a1a2e', logo: '/logo.png', heroImage: '' },
    };

    return (
        <div style={{ background: colors.background, minHeight: '100vh', padding: '2rem' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                        <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.4rem', color: '#111', marginBottom: '0.15rem' }}>Brand Settings</h1>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#9ca3af' }}>Customize visual identity</p>
                    </div>
                    <button
                        onClick={() => handleSave()}
                        className="btn-primary"
                        style={{ background: saved ? colors.primary : colors.secondary, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                    >
                        {saved ? '✓ Saved!' : 'Save Changes'}
                    </button>
                </div>

                <div className="grid-cols-2-mobile-1" style={{ gap: '1.5rem' }}>
                    {/* Color Settings */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ background: '#fff', borderRadius: 8, border: `1px solid #e5e0d6`, padding: '1.75rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.05rem', color: '#111', marginBottom: '1.5rem' }}>Color Palette</h3>

                            {/* Quick presets */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>QUICK PRESETS</p>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {Object.entries(presetColors).map(([key, preset]) => (
                                        <button
                                            key={key}
                                            onClick={() => { setColors(preset); handleSave(preset); }}
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

                            {Object.entries(colors).filter(([key]) => !['heroImage', 'logo'].includes(key)).map(([key, value]) => (
                                <div key={key} style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 6, background: value as string, border: '2px solid #e5e0d6', cursor: 'pointer', position: 'relative' }}>
                                            <input
                                                type="color"
                                                value={value as string}
                                                onChange={(e) => {
                                                    const newColors = { ...colors, [key]: e.target.value };
                                                    setColors(newColors);
                                                }}
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
                                            value={value as string}
                                            onChange={(e) => {
                                                const newColors = { ...colors, [key]: e.target.value };
                                                setColors(newColors);
                                            }}
                                            style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#111', border: '1.5px solid #e5e0d6', borderRadius: 4, padding: '6px 10px', width: '100%' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Typography */}
                        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.75rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.05rem', color: '#111', marginBottom: '1.25rem' }}>Typography Preset</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {typographyPresets.map((preset) => (
                                    <label key={preset.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '1rem', borderRadius: 6, border: `2px solid ${typography === preset.id ? colors.primary : '#e5e0d6'}`, background: typography === preset.id ? `${colors.primary}05` : '#fff', cursor: 'pointer', transition: 'all 0.2s' }}>
                                        <input type="radio" name="typography" value={preset.id} checked={typography === preset.id} onChange={() => { setTypography(preset.id); handleSave(colors, preset.id); }} style={{ display: 'none' }} />
                                        <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${typography === preset.id ? colors.primary : '#ccc'}`, background: typography === preset.id ? colors.primary : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    </div>

                    {/* Live Preview + Media */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Preview */}
                        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.75rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.05rem', color: '#111', marginBottom: '1.25rem' }}>Live Preview</h3>
                            <div style={{
                                background: colors.background,
                                borderRadius: 8,
                                padding: '1.5rem',
                                border: '1px solid #e5e0d6',
                                position: 'relative',
                                overflow: 'hidden',
                                minHeight: '200px'
                            }}>
                                {colors.heroImage && (
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        backgroundImage: `url(${colors.heroImage})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        opacity: 0.3
                                    }} />
                                )}
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    {/* Mini nav */}
                                    <div style={{ background: colors.primary, padding: '0.75rem 1rem', borderRadius: 4, marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <img src={colors.logo} alt="Logo" style={{ height: 20, width: 20, objectFit: 'contain' }} />
                                            <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '0.65rem', color: colors.secondary }}>POLIBRAND</span>
                                        </div>
                                        <div style={{ background: colors.secondary, padding: '4px 10px', borderRadius: 2 }}>
                                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.55rem', fontWeight: 700, color: '#000' }}>APPLY</span>
                                        </div>
                                    </div>
                                    {/* Mini hero */}
                                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                                        <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1rem', color: colors.text, marginBottom: '0.5rem' }}>Building Political Power for Women.</h2>
                                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                            <div style={{ background: colors.primary, color: '#fff', padding: '6px 14px', borderRadius: 2, fontFamily: 'Inter, sans-serif', fontSize: '0.6rem', fontWeight: 600 }}>
                                                Apply
                                            </div>
                                            <div style={{ border: `2px solid ${colors.secondary}`, color: colors.secondary, padding: '6px 14px', borderRadius: 2, fontFamily: 'Inter, sans-serif', fontSize: '0.6rem', fontWeight: 600 }}>
                                                Partner
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Media Uploads */}
                        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.75rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.05rem', color: '#111', marginBottom: '1.25rem' }}>Assets & Media</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {[
                                    { label: 'Brand Logo', type: 'logo' as const },
                                    { label: 'Hero Background', type: 'heroImage' as const }
                                ].map((item) => (
                                    <div key={item.type} style={{ position: 'relative' }}>
                                        <input
                                            type="file"
                                            id={`upload-${item.type}`}
                                            onChange={(e) => handleFileUpload(e, item.type)}
                                            style={{ display: 'none' }}
                                            accept="image/*"
                                        />
                                        <label
                                            htmlFor={`upload-${item.type}`}
                                            style={{
                                                display: 'block',
                                                border: '2px dashed #e5e0d6',
                                                borderRadius: 8,
                                                padding: '1.25rem',
                                                textAlign: 'center',
                                                cursor: uploading === item.type ? 'wait' : 'pointer',
                                                background: uploading === item.type ? '#f9fafb' : '#fff',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                                                {uploading === item.type ? '⌛' : '📸'}
                                            </div>
                                            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563' }}>{item.label}</div>
                                            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', color: '#9ca3af', marginTop: 4 }}>
                                                {uploading === item.type ? 'Uploading...' : 'Click to change'}
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
