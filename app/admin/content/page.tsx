'use client';
import { useState } from 'react';

const sections = [
    { id: 'hero', label: 'Homepage – Hero', visible: true, text: 'Building Political Power for Women Across Africa.' },
    { id: 'gap', label: 'Homepage – Strategic Gap', visible: true, text: 'Women across emerging democracies remain underrepresented...' },
    { id: 'services', label: 'Homepage – Services', visible: true, text: 'Institutional-grade tools for modern political leadership.' },
    { id: 'index', label: 'Homepage – Readiness Index', visible: true, text: 'A structured assessment evaluating your communication clarity...' },
    { id: 'partnerships', label: 'Homepage – Partnerships', visible: true, text: 'We collaborate with NGOs, political parties, and democracy organizations...' },
    { id: 'mission', label: 'Mission Page', visible: true, text: 'Redefining Political Leadership Through Strategic Communication.' },
    { id: 'footer', label: 'Footer', visible: true, text: 'The leading political branding partner for women leaders.' },
];

export default function ContentPage() {
    const [activeSection, setActiveSection] = useState(sections[0].id);
    const [sectionData, setSectionData] = useState(
        Object.fromEntries(sections.map((s) => [s.id, { text: s.text, visible: s.visible }]))
    );
    const [saved, setSaved] = useState(false);

    const active = sections.find((s) => s.id === activeSection)!;

    return (
        <div>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.6rem', color: '#111', marginBottom: '0.25rem' }}>Content Management</h1>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#9ca3af' }}>Edit and manage all public-facing website content</p>
                </div>
                <button className="btn-primary" style={{ fontSize: '0.82rem' }} onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
                    {saved ? '✓ Published!' : 'Save & Publish'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>
                {/* Section List */}
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f3f4f6', fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>Page Sections</div>
                    {sections.map((s) => (
                        <div
                            key={s.id}
                            onClick={() => setActiveSection(s.id)}
                            style={{
                                padding: '1rem 1.25rem', cursor: 'pointer', borderBottom: '1px solid #f3f4f6',
                                background: activeSection === s.id ? '#f0fdf4' : '#fff',
                                borderLeft: `3px solid ${activeSection === s.id ? '#1F6F3E' : 'transparent'}`,
                                transition: 'all 0.2s',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}
                        >
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: activeSection === s.id ? 600 : 400, color: activeSection === s.id ? '#1F6F3E' : '#374151' }}>{s.label}</span>
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSectionData({ ...sectionData, [s.id]: { ...sectionData[s.id], visible: !sectionData[s.id].visible } });
                                }}
                                style={{
                                    width: 32, height: 18, borderRadius: 9, position: 'relative', cursor: 'pointer',
                                    background: sectionData[s.id].visible ? '#1F6F3E' : '#d1d5db', transition: 'background 0.2s',
                                }}
                            >
                                <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: sectionData[s.id].visible ? 16 : 2, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Editor */}
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.75rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.1rem', color: '#111' }}>Editing: {active.label}</h3>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button style={{ padding: '6px 12px', background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Preview</button>
                            <button style={{ padding: '6px 12px', background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Duplicate</button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>Section Heading / Headline</label>
                        <input
                            type="text"
                            value={sectionData[activeSection].text}
                            onChange={(e) => setSectionData({ ...sectionData, [activeSection]: { ...sectionData[activeSection], text: e.target.value } })}
                            style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5e0d6', borderRadius: 4, fontFamily: 'Cinzel, serif', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', color: '#111' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>Body Content</label>
                        <textarea rows={10} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e5e0d6', borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', lineHeight: 1.7, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} defaultValue={`Content for the ${active.label} section. Edit this text to update the live website.`} />
                    </div>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>Section Image</label>
                        <div style={{ border: '2px dashed #e5e0d6', borderRadius: 6, padding: '2rem', textAlign: 'center', cursor: 'pointer' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>🖼</div>
                            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#9ca3af' }}>Upload section image (PNG, JPG, WebP)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
