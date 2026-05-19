'use client';
import { useState, useContext } from 'react';
import Link from 'next/link';
import { PoliSettingsContext } from '@/components/SettingsProvider';

export default function PortalPage() {
    const { content } = useContext(PoliSettingsContext) as any;
    const portal = content.pages.portal;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent, isDemo = false) => {
        if (e) e.preventDefault();
        setError(null);
        setLoading(true);

        const targetEmail = isDemo ? 'jane@example.com' : email.trim();

        if (!targetEmail) {
            setError('Please enter your registered email address.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`/api/portal/profile?email=${encodeURIComponent(targetEmail)}`);
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Authentication failed. Please verify your email.');
                setLoading(false);
                return;
            }

            // Save to localStorage for dashboard retrieval
            localStorage.setItem('fellowEmail', targetEmail);
            window.location.href = '/portal/dashboard';

        } catch (err) {
            console.error('Login error:', err);
            setError('Failed to reach servers. Please check your internet connection.');
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #0c3d1e 0%, #1F6F3E 100%)',
            padding: '2rem', position: 'relative', overflow: 'hidden',
        }}>
            <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(201,162,39,0.12)' }} />
            <div style={{ position: 'absolute', bottom: -120, left: -80, width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(201,162,39,0.08)' }} />

            <div style={{ background: '#fff', borderRadius: 8, padding: '3.5rem 2.5rem', width: '100%', maxWidth: 460, position: 'relative', zIndex: 1, boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
                    <img src="/logo.png" alt="The Polibrand Agency" style={{ width: 70, height: 70, objectFit: 'contain', marginBottom: '1.25rem' }} />
                    <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.3rem', color: '#111', marginBottom: '0.25rem' }}>{portal.login.title}</h1>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#9ca3af' }}>{portal.login.subtitle}</p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: 6,
                        padding: '12px 14px',
                        marginBottom: '1.5rem',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.8rem',
                        color: '#dc2626',
                        lineHeight: '1.4',
                        textAlign: 'left'
                    }}>
                        ⚠️ <strong>Enrollment Notice:</strong> {error}
                    </div>
                )}

                <form onSubmit={(e) => handleLogin(e, false)}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#374151', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required
                            style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e5e0d6', borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                            onFocus={(e: any) => { e.target.style.borderColor = '#1F6F3E'; }}
                            onBlur={(e: any) => { e.target.style.borderColor = '#e5e0d6'; }}
                            disabled={loading}
                        />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#374151', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Password <span style={{ color: '#9ca3af', textTransform: 'none', fontWeight: 400 }}>(Optional for verified applicant)</span></label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                            style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e5e0d6', borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                            onFocus={(e: any) => { e.target.style.borderColor = '#1F6F3E'; }}
                            onBlur={(e: any) => { e.target.style.borderColor = '#e5e0d6'; }}
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', height: 46 }} disabled={loading}>
                        {loading ? 'Authenticating...' : `${portal.login.button} →`}
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: '#e5e7eb' }}>
                    <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                    <span style={{ margin: '0 10px', fontSize: '0.7rem', color: '#9ca3af', fontFamily: 'Inter, sans-serif', fontWeight: 500, letterSpacing: '0.5px' }}>OR</span>
                    <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                </div>

                <button 
                    onClick={(e) => handleLogin(e, true)}
                    style={{
                        width: '100%',
                        height: 46,
                        background: '#f9fafb',
                        border: '1.5px dashed #c9a227',
                        borderRadius: 4,
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '0.84rem',
                        color: '#c9a227',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e: any) => { e.target.style.background = '#fefdf6'; }}
                    onMouseLeave={(e: any) => { e.target.style.background = '#f9fafb'; }}
                    disabled={loading}
                >
                    ✨ Explore as Demo Fellow (Jane Doe)
                </button>

                <Link href="/" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#9ca3af', textDecoration: 'none' }}>
                    ← Back to Website
                </Link>
            </div>
        </div>
    );
}
