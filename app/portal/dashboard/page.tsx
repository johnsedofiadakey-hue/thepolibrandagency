'use client';
import { useState } from 'react';
import Link from 'next/link';

const modules: any[] = [];

const discussions: any[] = [];

export default function PortalDashboard() {
    const [activeTab, setActiveTab] = useState<'materials' | 'progress' | 'forum'>('materials');
    const completed = modules.length ? modules.filter((m) => m.completed).length : 0;
    const progress = modules.length ? Math.round((completed / modules.length) * 100) : 0;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)', color: '#fff', padding: '0 2rem' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', paddingTop: '1.25rem', paddingBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                            <img src="/logo.png" alt="Logo" style={{ width: 44, height: 44, objectFit: 'contain' }} />
                            <div>
                                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.78rem', color: 'var(--color-secondary)' }}>FELLOWS PORTAL</div>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '1.5px' }}>THE POLIBRAND AGENCY</div>
                            </div>
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)' }}>Cohort 3 · Feb–May 2026</span>
                            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.88rem', color: '#111' }}>G</div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'end' }}>
                        <div>
                            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.25rem' }}>Welcome back,</p>
                            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.8rem', marginBottom: '0.5rem' }}>Grace Mutuku</h1>
                            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Leadership Branding Fellowship · 2026</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2rem', color: 'var(--color-secondary)' }}>{progress}%</div>
                            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)' }}>Program Complete</div>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 3, marginTop: '1.5rem' }}>
                        <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--color-secondary), color-mix(in srgb, var(--color-secondary), transparent 20%))', borderRadius: 3, transition: 'width 1s ease' }} />
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                        {[{ id: 'materials' as const, label: '📚 Course Materials' }, { id: 'progress' as const, label: '📊 Progress' }, { id: 'forum' as const, label: '💬 Discussion' }].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    padding: '8px 18px', borderRadius: '4px 4px 0 0', cursor: 'pointer', border: 'none',
                                    background: activeTab === tab.id ? 'var(--color-bg)' : 'transparent',
                                    color: activeTab === tab.id ? 'var(--color-primary)' : 'rgba(255,255,255,0.7)',
                                    fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s',
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
                {activeTab === 'materials' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                        <div>
                            {[1, 2, 3, 4].map((week) => {
                                const weekMods = modules.filter((m) => m.week === week);
                                if (!weekMods.length) return null;
                                return (
                                    <div key={week} style={{ marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: '#111', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>WEEK {week}</h3>
                                        {weekMods.map((mod) => (
                                            <div key={mod.id} style={{ background: '#fff', borderRadius: 6, border: '1px solid #e5e7eb', padding: '1rem 1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: mod.completed ? 'var(--color-primary)' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <span style={{ color: mod.completed ? '#fff' : '#9ca3af', fontSize: '0.75rem' }}>{mod.completed ? '✓' : '○'}</span>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.88rem', color: '#111' }}>{mod.title}</div>
                                                    <span className="badge badge-gray" style={{ marginTop: 4 }}>{mod.type}</span>
                                                </div>
                                                <button style={{ padding: '6px 14px', background: mod.completed ? 'color-mix(in srgb, var(--color-primary), white 90%)' : 'var(--color-primary)', color: mod.completed ? 'color-mix(in srgb, var(--color-primary), black 20%)' : '#fff', border: mod.completed ? '1px solid color-mix(in srgb, var(--color-primary), white 70%)' : 'none', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                                                    {mod.completed ? 'Review' : 'Start'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Sidebar */}
                        <div>
                            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: '#111', marginBottom: '1rem' }}>My Readiness Score</h3>
                                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2.5rem', color: 'var(--color-primary)' }}>85</div>
                                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: '#6b7280' }}>out of 100</div>
                                    <span className="badge badge-green" style={{ marginTop: 8, display: 'inline-block' }}>Competitive Stage</span>
                                </div>
                                <Link href="/assessment" style={{ display: 'block', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                                    Retake Assessment →
                                </Link>
                            </div>

                            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.5rem', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: '#111', marginBottom: '1rem' }}>Upcoming Sessions</h3>
                                {[].map((s: any) => (
                                    <div key={s.title} style={{ padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                                        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.82rem', color: '#111', marginBottom: 4 }}>{s.title}</div>
                                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#9ca3af' }}>{s.date} · {s.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'forum' && (
                    <div style={{ maxWidth: 700 }}>
                        {discussions.map((d, i) => (
                            <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.25rem', marginBottom: '0.75rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.78rem', flexShrink: 0 }}>
                                        {d.author.charAt(0)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.85rem', color: '#111' }}>{d.author}</span>
                                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#9ca3af' }}>{d.time}</span>
                                        </div>
                                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', color: '#374151', margin: 0, lineHeight: 1.6 }}>{d.msg}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                            <textarea placeholder="Share a thought with your cohort..." rows={3} style={{ width: '100%', border: '1.5px solid #e5e0d6', borderRadius: 4, padding: '10px 12px', fontFamily: 'var(--font-body)', fontSize: '0.88rem', outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: 10 }} />
                            <button className="btn-primary" style={{ fontSize: '0.82rem', padding: '10px 20px' }}>Post Comment</button>
                        </div>
                    </div>
                )}

                {activeTab === 'progress' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        {[
                            { label: 'Modules Complete', value: `${completed}/${modules.length}`, color: 'var(--color-primary)', icon: '📚' },
                            { label: 'Assignments Done', value: '0/0', color: 'var(--color-secondary)', icon: '✏️' },
                            { label: 'Days Remaining', value: 'N/A', color: 'var(--color-accent)', icon: '📅' },
                        ].map((s) => (
                            <div key={s.label} className="stat-widget" style={{ borderLeftColor: s.color, textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.75rem', color: '#111' }}>{s.value}</div>
                                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#9ca3af' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
