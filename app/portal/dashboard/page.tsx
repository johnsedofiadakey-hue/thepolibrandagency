'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Simple relative time formatter for premium dynamic feel
function formatRelativeTime(isoString: string): string {
    try {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        
        // Handle negative offset gracefully
        if (diffMs < 0) return 'just now';
        
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    } catch (e) {
        return 'recently';
    }
}

interface Module {
    id: string;
    title: string;
    type: string;
    week: number;
    completed: boolean;
}

interface Discussion {
    author: string;
    email: string;
    msg: string;
    timestamp: string;
}

export default function PortalDashboard() {
    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('Grace Mutuku');
    const [program, setProgram] = useState<string>('Leadership Branding Fellowship');
    const [score, setScore] = useState<number>(85);
    const [modules, setModules] = useState<Module[]>([]);
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    
    const [activeTab, setActiveTab] = useState<'materials' | 'progress' | 'forum'>('materials');
    const [loading, setLoading] = useState<boolean>(true);
    const [submittingComment, setSubmittingComment] = useState<boolean>(false);
    const [newComment, setNewComment] = useState<string>('');
    const [commentError, setCommentError] = useState<string | null>(null);

    const fetchProfileData = useCallback(async (targetEmail: string) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/portal/profile?email=${encodeURIComponent(targetEmail)}`);
            if (!res.ok) {
                // If the user's application was somehow deleted or changed, redirect to login
                localStorage.removeItem('fellowEmail');
                window.location.href = '/portal';
                return;
            }
            const data = await res.json();
            setName(data.name);
            setProgram(data.program);
            setScore(data.score);
            setModules(data.modules || []);
            setDiscussions(data.discussions || []);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load profile details:', err);
            setLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        const storedEmail = localStorage.getItem('fellowEmail');
        if (!storedEmail) {
            window.location.href = '/portal';
            return;
        }
        
        setEmail(storedEmail);
        fetchProfileData(storedEmail);
    }, [fetchProfileData]);

    const handleToggleModule = async (moduleId: string) => {
        try {
            // Optimistic update for fast visual response
            setModules(prev => prev.map(m => m.id === moduleId ? { ...m, completed: !m.completed } : m));

            const res = await fetch('/api/portal/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    action: 'toggleModule',
                    moduleId
                })
            });

            if (!res.ok) {
                // Revert on failure
                fetchProfileData(email);
                return;
            }

            const data = await res.json();
            if (data.success && data.completedModuleIds) {
                // Sync with actual response
                setModules(prev => prev.map(m => ({
                    ...m,
                    completed: data.completedModuleIds.includes(m.id)
                })));
            }
        } catch (err) {
            console.error('Failed to toggle module completion:', err);
            fetchProfileData(email);
        }
    };

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        setCommentError(null);

        const cleanComment = newComment.trim();
        if (!cleanComment) return;

        try {
            setSubmittingComment(true);
            const res = await fetch('/api/portal/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    action: 'postComment',
                    author: name,
                    msg: cleanComment
                })
            });

            if (!res.ok) {
                const data = await res.json();
                setCommentError(data.error || 'Failed to submit comment.');
                setSubmittingComment(false);
                return;
            }

            const data = await res.json();
            if (data.success && data.discussions) {
                setDiscussions(data.discussions);
                setNewComment('');
            }
            setSubmittingComment(false);
        } catch (err) {
            console.error('Failed to post comment:', err);
            setCommentError('Network error. Please try again.');
            setSubmittingComment(false);
        }
    };

    const handleLogout = () => {
        fetch('/api/portal/login', { method: 'DELETE' }).catch(() => {});
        localStorage.removeItem('fellowEmail');
        window.location.href = '/portal';
    };

    // Calculate completed stats
    const completed = modules.filter(m => m.completed).length;
    const totalModules = modules.length || 1;
    const progress = Math.round((completed / totalModules) * 100);

    // Group modules by week for beautiful list display
    const uniqueWeeks = Array.from(new Set(modules.map(m => m.week))).sort((a, b) => a - b);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: '#fcfbf7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
                <div style={{ textAlign: 'center' }}>
                    <img src="/logo.png" alt="Loading..." style={{ width: 60, height: 60, objectFit: 'contain', animation: 'pulse 1.8s infinite ease-in-out', marginBottom: '1rem' }} />
                    <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 600, fontSize: '1rem', color: '#1F6F3E', letterSpacing: '1px' }}>SYNCHRONIZING SYLLABUS...</h2>
                    <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: 4 }}>Loading personalized learning dashboard</p>
                </div>
                <style jsx global>{`
                    @keyframes pulse {
                        0%, 100% { opacity: 0.6; transform: scale(0.96); }
                        50% { opacity: 1; transform: scale(1.04); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#fcfbf7', fontFamily: 'Inter, sans-serif' }}>
            
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #0c3d1e 0%, #1F6F3E 100%)', color: '#fff', padding: '0 2rem' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', paddingTop: '1.5rem', paddingBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                            <img src="/logo.png" alt="Logo" style={{ width: 44, height: 44, objectFit: 'contain' }} />
                            <div>
                                <div style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '0.85rem', color: '#c9a227', letterSpacing: '0.5px' }}>FELLOWS PORTAL</div>
                                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.58rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '1.5px', fontWeight: 600 }}>THE POLIBRAND AGENCY</div>
                            </div>
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>Cohort 3 · Enrolled Fellow</span>
                            <button 
                                onClick={handleLogout}
                                style={{
                                    padding: '6px 14px',
                                    background: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: 4,
                                    color: '#fff',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4
                                }}
                                onMouseEnter={(e: any) => { e.target.style.background = 'rgba(239, 68, 68, 0.15)'; e.target.style.borderColor = 'rgba(239, 68, 68, 0.4)'; }}
                                onMouseLeave={(e: any) => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                            >
                                🚪 Log Out
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'end' }}>
                        <div>
                            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.25rem', fontWeight: 500 }}>Welcome back,</p>
                            <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.8rem', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>{name}</h1>
                            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{program} · Active 2026</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '2rem', color: '#c9a227' }}>{progress}%</div>
                            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500, letterSpacing: '0.5px' }}>Syllabus Complete</div>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 3, marginTop: '1.5rem', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #c9a227, #fdd85d)', borderRadius: 3, transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
                        {([
                            { id: 'materials' as const, label: '📚 Course Syllabus' }, 
                            { id: 'progress' as const, label: '📊 Metrics & Scorecard' }, 
                            { id: 'forum' as const, label: `💬 Cohort Forum (${discussions.length})` }
                        ] as const).map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    padding: '10px 20px', borderRadius: '4px 4px 0 0', cursor: 'pointer', border: 'none',
                                    background: activeTab === tab.id ? '#fcfbf7' : 'transparent',
                                    color: activeTab === tab.id ? '#1F6F3E' : 'rgba(255,255,255,0.75)',
                                    fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s',
                                    boxShadow: activeTab === tab.id ? '0 -4px 12px rgba(0,0,0,0.05)' : 'none'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content area */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 2rem' }}>
                
                {/* 1. SYLLABUS TAB */}
                {activeTab === 'materials' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                        <div>
                            {uniqueWeeks.map((week) => {
                                const weekMods = modules.filter(m => m.week === week);
                                if (!weekMods.length) return null;
                                return (
                                    <div key={week} style={{ marginBottom: '2rem' }}>
                                        <h3 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '0.9rem', color: '#111', marginBottom: '0.85rem', letterSpacing: '0.5px' }}>
                                            WEEK {week} · STRATEGIC TRAINING
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {weekMods.map((mod) => (
                                                <div 
                                                    key={mod.id} 
                                                    style={{ 
                                                        background: '#fff', 
                                                        borderRadius: 6, 
                                                        border: '1px solid #e5e7eb', 
                                                        padding: '1.25rem 1.5rem', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: '1.25rem', 
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                                                        transition: 'border-color 0.2s',
                                                        borderColor: mod.completed ? '#1F6F3E' : '#e5e7eb'
                                                    }}
                                                >
                                                    <button 
                                                        onClick={() => handleToggleModule(mod.id)}
                                                        style={{ 
                                                            width: 28, 
                                                            height: 28, 
                                                            borderRadius: '50%', 
                                                            background: mod.completed ? '#1F6F3E' : '#f3f4f6', 
                                                            border: 'none',
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            justifyContent: 'center', 
                                                            flexShrink: 0,
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        <span style={{ color: mod.completed ? '#fff' : '#9ca3af', fontSize: '0.8rem', fontWeight: 700 }}>
                                                            {mod.completed ? '✓' : '○'}
                                                        </span>
                                                    </button>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#111' }}>
                                                            {mod.title}
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                                            <span className="badge badge-gray" style={{ fontSize: '0.68rem', padding: '2px 8px', background: '#f3f4f6', color: '#4b5563', borderRadius: 4 }}>
                                                                {mod.type}
                                                            </span>
                                                            <span style={{ fontSize: '0.68rem', color: '#9ca3af' }}>· Core Module</span>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleToggleModule(mod.id)}
                                                        style={{ 
                                                            padding: '8px 16px', 
                                                            background: mod.completed ? '#f0fdf4' : '#1F6F3E', 
                                                            color: mod.completed ? '#166534' : '#fff', 
                                                            border: mod.completed ? '1px solid #bbf7d0' : 'none', 
                                                            borderRadius: 4, 
                                                            fontSize: '0.75rem', 
                                                            fontWeight: 600, 
                                                            cursor: 'pointer', 
                                                            fontFamily: 'Inter, sans-serif',
                                                            transition: 'all 0.2s'
                                                        }}
                                                        onMouseEnter={(e: any) => { if (!mod.completed) e.target.style.background = '#166534'; }}
                                                        onMouseLeave={(e: any) => { if (!mod.completed) e.target.style.background = '#1F6F3E'; }}
                                                    >
                                                        {mod.completed ? 'Completed' : 'Complete'}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Sidebar info */}
                        <div>
                            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.75rem', marginBottom: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                                <h3 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '0.9rem', color: '#111', marginBottom: '1.25rem', letterSpacing: '0.5px' }}>
                                    MY READINESS SCORE
                                </h3>
                                <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                                    <div style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '3rem', color: '#1F6F3E' }}>{score}</div>
                                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#6b7280', fontWeight: 500 }}>out of 100 points</div>
                                    <span style={{ 
                                        marginTop: 10, 
                                        display: 'inline-block',
                                        background: score >= 85 ? '#f0fdf4' : '#fef9c3',
                                        color: score >= 85 ? '#166534' : '#854d0e',
                                        border: score >= 85 ? '1px solid #bbf7d0' : '1px solid #fef08a',
                                        padding: '4px 12px',
                                        borderRadius: 12,
                                        fontSize: '0.7rem',
                                        fontWeight: 600
                                    }}>
                                        {score >= 85 ? '👑 Top Competitive Stage' : '📈 Strategic Growth Stage'}
                                    </span>
                                </div>
                                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1rem', textAlign: 'center' }}>
                                    <Link href="/assessment" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#1F6F3E', fontWeight: 600, textDecoration: 'none' }}>
                                        Retake Assessment →
                                    </Link>
                                </div>
                            </div>

                            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.75rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                                <h3 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '0.9rem', color: '#111', marginBottom: '1rem', letterSpacing: '0.5px' }}>
                                    UPCOMING SESSIONS
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ paddingBottom: '0.75rem', borderBottom: '1px solid #f3f4f6' }}>
                                        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#111' }}>Cohort Group Orientation</div>
                                        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.74rem', color: '#6b7280', marginTop: 4 }}>Tomorrow · 4:00 PM GMT</div>
                                    </div>
                                    <div style={{ paddingBottom: '0.75rem', borderBottom: '1px solid #f3f4f6' }}>
                                        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#111' }}>1-on-1 Persona Branding Alignment</div>
                                        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.74rem', color: '#6b7280', marginTop: 4 }}>Thursday · 11:30 AM GMT</div>
                                    </div>
                                    <div>
                                        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#111' }}>Special Guest: Press Relations Masterclass</div>
                                        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.74rem', color: '#6b7280', marginTop: 4 }}>May 26 · 6:00 PM GMT</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. PROGRESS TAB */}
                {activeTab === 'progress' && (
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                            {[
                                { label: 'Modules Complete', value: `${completed}/${modules.length}`, color: '#1F6F3E', icon: '📚' },
                                { label: 'Active Assessment Score', value: `${score}/100`, color: '#c9a227', icon: '👑' },
                                { label: 'Cohort Rank Status', value: score >= 90 ? 'Elite' : 'Distinction', color: '#2563eb', icon: '⚡' },
                            ].map((s) => (
                                <div 
                                    key={s.label} 
                                    style={{ 
                                        background: '#fff', 
                                        borderRadius: 8, 
                                        border: '1px solid #e5e7eb', 
                                        borderLeft: `4px solid ${s.color}`, 
                                        padding: '1.5rem', 
                                        textAlign: 'center',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                                    }}
                                >
                                    <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                                    <div style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.6rem', color: '#111', marginBottom: 4 }}>{s.value}</div>
                                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#6b7280', fontWeight: 500, letterSpacing: '0.5px' }}>{s.label}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                            <h3 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1rem', color: '#111', marginBottom: '1.25rem', letterSpacing: '0.5px' }}>
                                CORE COMPETENCY BREAKDOWN
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                Based on your Political Readiness Assessment score of <strong>{score}</strong>, the curriculum model has tailored candidate modules to target critical growth vectors:
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ border: '1px solid #f3f4f6', borderRadius: 6, padding: '1.25rem', background: '#faf9f6' }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1F6F3E', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                        🎯 Primary Strengths
                                    </div>
                                    <ul style={{ fontSize: '0.78rem', color: '#4b5563', paddingLeft: '1.2rem', margin: 0, lineHeight: 1.6 }}>
                                        <li>Strong brand narrative identity alignment.</li>
                                        <li>Effective values articulation and messaging consistency.</li>
                                        <li>Exceptional platform engagement strategy.</li>
                                    </ul>
                                </div>
                                <div style={{ border: '1px solid #f3f4f6', borderRadius: 6, padding: '1.25rem', background: '#faf9f6' }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#c9a227', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                        🚀 Tailored Growth Areas
                                    </div>
                                    <ul style={{ fontSize: '0.78rem', color: '#4b5563', paddingLeft: '1.2rem', margin: 0, lineHeight: 1.6 }}>
                                        <li>Intense simulation practice for policy debates.</li>
                                        <li>Advanced message control during crisis handling.</li>
                                        <li>Donor activation campaigns and tracking funnels.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. FORUM TAB */}
                {activeTab === 'forum' && (
                    <div style={{ maxWidth: 720, margin: '0 auto' }}>
                        
                        {/* New Comment Box */}
                        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                            <h3 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '0.9rem', color: '#111', marginBottom: '1rem', letterSpacing: '0.5px' }}>
                                POST A COHORT UPDATE
                            </h3>
                            {commentError && (
                                <div style={{ padding: '8px 12px', background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', borderRadius: 4, fontSize: '0.75rem', marginBottom: 12 }}>
                                    {commentError}
                                </div>
                            )}
                            <form onSubmit={handlePostComment}>
                                <textarea 
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Share a strategic insight, feedback on a module, or questions with your cohort..." 
                                    rows={3} 
                                    required
                                    style={{ 
                                        width: '100%', 
                                        border: '1.5px solid #e5e0d6', 
                                        borderRadius: 4, 
                                        padding: '12px 14px', 
                                        fontFamily: 'Inter, sans-serif', 
                                        fontSize: '0.88rem', 
                                        outline: 'none', 
                                        resize: 'none', 
                                        boxSizing: 'border-box', 
                                        marginBottom: 12,
                                        transition: 'border-color 0.2s'
                                    }}
                                    onFocus={(e: any) => { e.target.style.borderColor = '#1F6F3E'; }}
                                    onBlur={(e: any) => { e.target.style.borderColor = '#e5e0d6'; }}
                                    disabled={submittingComment}
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button 
                                        type="submit"
                                        className="btn-primary" 
                                        style={{ fontSize: '0.8rem', padding: '10px 24px', height: 40 }}
                                        disabled={submittingComment || !newComment.trim()}
                                    >
                                        {submittingComment ? 'Posting...' : 'Post Comment 📣'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* List Discussions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {discussions.map((d, i) => {
                                const initials = d.author ? d.author.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'F';
                                const isSelf = d.email.toLowerCase().trim() === email.toLowerCase().trim();
                                
                                return (
                                    <div 
                                        key={i} 
                                        style={{ 
                                            background: '#fff', 
                                            borderRadius: 8, 
                                            border: '1px solid #e5e7eb', 
                                            padding: '1.25rem 1.5rem', 
                                            boxShadow: '0 2px 10px rgba(0,0,0,0.01)',
                                            transition: 'transform 0.2s',
                                            borderLeft: isSelf ? '4px solid #1F6F3E' : '1px solid #e5e7eb'
                                        }}
                                    >
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                            <div style={{ 
                                                width: 38, 
                                                height: 38, 
                                                borderRadius: '50%', 
                                                background: isSelf ? '#1F6F3E' : '#c9a227', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                color: '#fff', 
                                                fontWeight: 700, 
                                                fontSize: '0.8rem', 
                                                flexShrink: 0 
                                            }}>
                                                {initials}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                                    <div>
                                                        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.86rem', color: '#111' }}>
                                                            {d.author}
                                                        </span>
                                                        {isSelf && (
                                                            <span style={{ fontSize: '0.65rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: 4, marginLeft: 6, fontWeight: 600 }}>
                                                                You
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.74rem', color: '#9ca3af', fontWeight: 500 }}>
                                                        {formatRelativeTime(d.timestamp)}
                                                    </span>
                                                </div>
                                                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.86rem', color: '#374151', margin: 0, lineHeight: 1.6 }}>
                                                    {d.msg}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
