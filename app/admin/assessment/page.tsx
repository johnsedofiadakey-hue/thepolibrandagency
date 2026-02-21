'use client';
import { useState } from 'react';

const defaultQuestions = [
    { id: 1, category: 'Brand Clarity', text: 'How clearly can you articulate your core political message?', weight: 25 },
    { id: 2, category: 'Communication Strength', text: 'How confident are you in a live media interview?', weight: 25 },
    { id: 3, category: 'Public Visibility', text: 'How active and strategic is your social media presence?', weight: 20 },
    { id: 4, category: 'Fundraising Readiness', text: 'How developed is your donor network?', weight: 20 },
    { id: 5, category: 'Strategic Infrastructure', text: 'How structured is your political team?', weight: 10 },
];

const tiers = [
    { range: '0–40', label: 'Foundational Stage', color: '#B22222', recommendation: 'Focus on brand clarity and communication foundations. Enroll in the Leadership Branding Bootcamp.' },
    { range: '41–70', label: 'Development Stage', color: '#C9A227', recommendation: 'Build strategic infrastructure and media presence. Consider the Bootcamp + Fellowship pathway.' },
    { range: '71–90', label: 'Competitive Stage', color: '#1F6F3E', recommendation: 'Refine fundraising and media relationships. The Fellowship Program is your ideal next step.' },
    { range: '91–100', label: 'Leadership Ready', color: '#1F6F3E', recommendation: 'You are at the top tier. Advanced Political Strategy Fellowship will sharpen your competitive edge.' },
];

export default function AssessmentControlPage() {
    const [questions, setQuestions] = useState(defaultQuestions);
    const [tierData, setTierData] = useState(tiers);
    const [activeTab, setActiveTab] = useState<'questions' | 'tiers' | 'weights'>('questions');
    const [saved, setSaved] = useState(false);

    const totalWeight = questions.reduce((sum, q) => sum + q.weight, 0);

    return (
        <div>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                    <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.4rem', color: '#111', marginBottom: '0.15rem' }}>Readiness Index</h1>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#9ca3af' }}>Configure scoring and tiers</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button className="hide-mobile" style={{ padding: '9px 18px', background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: 4, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                        Export
                    </button>
                    <button className="btn-primary" style={{ fontSize: '0.75rem', padding: '8px 16px', whiteSpace: 'nowrap' }} onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
                        {saved ? '✓ Saved' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="scroll-tabs" style={{ marginBottom: '1.5rem', width: '100%', padding: '4px 0' }}>
                {(['questions', 'tiers', 'weights'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '10px 24px', borderRadius: 6, cursor: 'pointer',
                            background: activeTab === tab ? '#1F6F3E' : '#fff',
                            color: activeTab === tab ? '#fff' : '#6b7280',
                            fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 700,
                            textTransform: 'uppercase', transition: 'all 0.2s',
                            border: `1px solid ${activeTab === tab ? '#1F6F3E' : '#e5e7eb'}`,
                            boxShadow: activeTab === tab ? '0 4px 12px rgba(31, 111, 62, 0.2)' : 'none',
                            flex: '0 0 auto'
                        }}
                    >
                        {tab === 'questions' ? 'Questions' : tab === 'tiers' ? 'Score Tiers' : 'Weights'}
                    </button>
                ))}
            </div>

            {activeTab === 'questions' && (
                <div>
                    {questions.map((q, i) => (
                        <div key={q.id} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1rem', marginBottom: '0.75rem', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '0.9rem', color: '#e5e0d6' }}>Q{i + 1}</span>
                                    <span className="badge badge-green" style={{ fontSize: '0.6rem' }}>{q.category}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af' }}>{q.weight}%</span>
                                    <button style={{ padding: '4px 8px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 4, fontSize: '0.6rem', fontWeight: 700, cursor: 'pointer' }}>Del</button>
                                </div>
                            </div>
                            <input
                                type="text"
                                value={q.text}
                                onChange={(e) => setQuestions(questions.map((qq, qi) => qi === i ? { ...qq, text: e.target.value } : qq))}
                                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e5e0d6', borderRadius: 6, fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', outline: 'none', color: '#111', boxSizing: 'border-box' }}
                            />
                        </div>
                    ))}
                    <button className="btn-outline-dark" style={{ fontSize: '0.82rem', marginTop: '0.5rem' }}>+ Add Question</button>
                </div>
            )}

            {activeTab === 'tiers' && (
                <div>
                    {tierData.map((tier, i) => (
                        <div key={tier.range} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '0.75rem', boxShadow: '0 1px 8px rgba(0,0,0,0.04)', borderLeft: `4px solid ${tier.color}` }}>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                                <div style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1rem', color: tier.color }}>{tier.range}</div>
                                <input
                                    type="text"
                                    value={tier.label}
                                    onChange={(e) => setTierData(tierData.map((t, ti) => ti === i ? { ...t, label: e.target.value } : t))}
                                    style={{ padding: '6px 12px', border: '1.5px solid #e5e0d6', borderRadius: 4, fontFamily: 'Cinzel, serif', fontSize: '0.88rem', outline: 'none', fontWeight: 700, color: tier.color, width: 220 }}
                                />
                            </div>
                            <textarea
                                value={tier.recommendation}
                                onChange={(e) => setTierData(tierData.map((t, ti) => ti === i ? { ...t, recommendation: e.target.value } : t))}
                                rows={2}
                                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e5e0d6', borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                            />
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'weights' && (
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.75rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', background: totalWeight === 100 ? '#f0fdf4' : '#fef2f2', border: `1px solid ${totalWeight === 100 ? '#bbf7d0' : '#fecaca'}`, borderRadius: 6 }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600, color: totalWeight === 100 ? '#16a34a' : '#dc2626' }}>
                            {totalWeight === 100 ? '✓ Weights sum to 100% — valid configuration' : `⚠ Weights sum to ${totalWeight}% — must equal 100%`}
                        </span>
                    </div>
                    {['Brand Clarity', 'Communication Strength', 'Public Visibility', 'Fundraising Readiness', 'Strategic Infrastructure'].map((cat, i) => {
                        const catQ = questions.find((q) => q.category === cat);
                        const weight = catQ?.weight ?? 0;
                        return (
                            <div key={cat} style={{ marginBottom: '1.25rem', padding: '1rem', background: '#f9fafb', borderRadius: 6, border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.88rem', color: '#111', marginBottom: 8 }}>{cat}</div>
                                    <div style={{ height: 8, background: '#e5e7eb', borderRadius: 4 }}>
                                        <div style={{ height: '100%', width: `${weight}%`, background: '#1F6F3E', borderRadius: 4, transition: 'width 0.3s' }} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <input
                                        type="number" min={0} max={100} value={weight}
                                        onChange={(e) => setQuestions(questions.map((q) => q.category === cat ? { ...q, weight: parseInt(e.target.value) || 0 } : q))}
                                        style={{ width: 56, padding: '6px 10px', border: '1.5px solid #e5e0d6', borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 700, color: '#1F6F3E', outline: 'none', textAlign: 'center' }}
                                    />
                                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#aaa' }}>%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
