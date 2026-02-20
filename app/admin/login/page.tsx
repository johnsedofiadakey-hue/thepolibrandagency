'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setTimeout(() => {
            if (email && password) {
                window.location.href = '/admin/dashboard';
            } else {
                setError('Please enter your email and password.');
                setLoading(false);
            }
        }, 1000);
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex',
            background: 'linear-gradient(135deg, #0c3d1e 0%, #1F6F3E 60%, #154e2b 100%)',
            position: 'relative', overflow: 'hidden',
        }}>
            {/* BG decor */}
            <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(201,162,39,0.12)' }} />
            <div style={{ position: 'absolute', bottom: -120, left: -80, width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(201,162,39,0.08)' }} />

            {/* Left Brand Panel */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem', position: 'relative', zIndex: 1 }}>
                <div>
                    <img src="/logo.png" alt="The Polibrand Agency" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: '2rem' }} />
                    <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '2.2rem', color: '#fff', lineHeight: 1.25, marginBottom: '1rem' }}>
                        The Polibrand<br />Admin Portal
                    </h1>
                    <div style={{ width: 48, height: 2, background: '#C9A227', marginBottom: '1.5rem' }} />
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, maxWidth: 380 }}>
                        Secure access to the Polibrand Management System. Manage programs, applications, content, analytics, and brand settings.
                    </p>
                    <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {['Content Management', 'Application Review', 'Brand Controls', 'Analytics Dashboard'].map((f) => (
                            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A227', flexShrink: 0 }} />
                                {f}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Login Form */}
            <div style={{ width: 480, background: 'rgba(255,255,255,0.97)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 3.5rem', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '100%' }}>
                    <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.4rem', color: '#111', marginBottom: '0.5rem' }}>Welcome Back</h2>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#999', marginBottom: '2.5rem' }}>Sign in to your admin account</p>

                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 600, color: '#333', letterSpacing: '0.5px', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@polibrand.co"
                                style={{
                                    width: '100%', padding: '13px 16px', border: '1.5px solid #e5e0d6',
                                    borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#111',
                                    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                                }}
                                onFocus={(e) => { e.target.style.borderColor = '#1F6F3E'; }}
                                onBlur={(e) => { e.target.style.borderColor = '#e5e0d6'; }}
                            />
                        </div>
                        <div style={{ marginBottom: '1.75rem' }}>
                            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 600, color: '#333', letterSpacing: '0.5px', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••"
                                style={{
                                    width: '100%', padding: '13px 16px', border: '1.5px solid #e5e0d6',
                                    borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#111',
                                    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                                }}
                                onFocus={(e) => { e.target.style.borderColor = '#1F6F3E'; }}
                                onBlur={(e) => { e.target.style.borderColor = '#e5e0d6'; }}
                            />
                        </div>
                        {error && (
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 4, padding: '10px 14px', marginBottom: '1.25rem', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#b22222' }}>
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? 'Signing In...' : 'Sign In →'}
                        </button>
                    </form>

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <a href="#" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#999', textDecoration: 'underline' }}>
                            Forgot password?
                        </a>
                    </div>

                    <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #f0ebe2' }}>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {['Super Admin', 'Content Admin', 'Program Manager', 'Finance Manager'].map((role) => (
                                <span key={role} className="badge badge-gray">{role}</span>
                            ))}
                        </div>
                    </div>

                    <Link href="/" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#bbb', textDecoration: 'none' }}>
                        ← Back to Public Site
                    </Link>
                </div>
            </div>
        </div>
    );
}
