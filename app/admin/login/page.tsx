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
        <div className="login-container" style={{
            minHeight: '100vh', display: 'flex',
            background: 'linear-gradient(135deg, #0c3d1e 0%, #1F6F3E 60%, #154e2b 100%)',
            position: 'relative', overflow: 'hidden',
        }}>
            <style>{`
                .login-container {
                    flex-direction: row;
                }
                .brand-panel {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 4rem;
                    position: relative;
                    z-index: 1;
                }
                .login-form-panel {
                    width: 480px;
                    background: rgba(255,255,255,0.97);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem 3.5rem;
                    position: relative;
                    z-index: 1;
                }
                @media (max-width: 900px) {
                    .login-container {
                        flex-direction: column;
                        overflow-y: auto;
                    }
                    .brand-panel {
                        padding: 3rem 2rem;
                        text-align: center;
                        align-items: center;
                        flex: none;
                    }
                    .brand-panel p {
                        margin: 0 auto 1.5rem auto;
                    }
                    .brand-panel .features {
                        display: none;
                    }
                    .brand-panel .divider {
                        margin: 0 auto 1.5rem auto;
                    }
                    .login-form-panel {
                        width: 100%;
                        padding: 3rem 1.5rem;
                        background: #fff;
                        flex: 1;
                    }
                }
            `}</style>

            {/* BG decor */}
            <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(201,162,39,0.12)' }} />
            <div style={{ position: 'absolute', bottom: -120, left: -80, width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(201,162,39,0.08)' }} />

            {/* Left Brand Panel */}
            <div className="brand-panel">
                <div>
                    <img src="/logo.png" alt="The Polibrand Agency" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: '2rem' }} />
                    <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '2.2rem', color: '#fff', lineHeight: 1.25, marginBottom: '1rem' }}>
                        The Polibrand<br />Admin Portal
                    </h1>
                    <div className="divider" style={{ width: 48, height: 2, background: '#C9A227', marginBottom: '1.5rem' }} />
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, maxWidth: 380 }}>
                        Secure access to the Polibrand Management System. Manage programs, applications, content, analytics, and brand settings.
                    </p>
                    <div className="features" style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
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
            <div className="login-form-panel">
                <div style={{ width: '100%', maxWidth: 400 }}>
                    <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.6rem', color: '#111', marginBottom: '0.5rem' }}>Welcome Back</h2>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#666', marginBottom: '2.5rem' }}>Sign in to your admin account</p>

                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#333', letterSpacing: '0.5px', display: 'block', marginBottom: 10, textTransform: 'uppercase' }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@polibrand.co"
                                style={{
                                    width: '100%', padding: '15px 18px', border: '1.5px solid #e5e0d6',
                                    borderRadius: 6, fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#111',
                                    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                                    background: '#f9f9f9'
                                }}
                                onFocus={(e) => { e.target.style.borderColor = '#1F6F3E'; e.target.style.background = '#fff'; }}
                                onBlur={(e) => { e.target.style.borderColor = '#e5e0d6'; e.target.style.background = '#f9f9f9'; }}
                            />
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#333', letterSpacing: '0.5px', display: 'block', marginBottom: 10, textTransform: 'uppercase' }}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{
                                    width: '100%', padding: '15px 18px', border: '1.5px solid #e5e0d6',
                                    borderRadius: 6, fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#111',
                                    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                                    background: '#f9f9f9'
                                }}
                                onFocus={(e) => { e.target.style.borderColor = '#1F6F3E'; e.target.style.background = '#fff'; }}
                                onBlur={(e) => { e.target.style.borderColor = '#e5e0d6'; e.target.style.background = '#f9f9f9'; }}
                            />
                        </div>
                        {error && (
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 4, padding: '12px 16px', marginBottom: '1.5rem', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#b22222' }}>
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%', justifyContent: 'center', height: '56px', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? 'Signing In...' : 'Sign In →'}
                        </button>
                    </form>

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <a href="#" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#999', textDecoration: 'none' }}>
                            Forgot password?
                        </a>
                    </div>

                    <Link href="/" style={{ display: 'block', textAlign: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #eee', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'var(--color-secondary)', textDecoration: 'none', fontWeight: 600 }}>
                        ← Back to Public Site
                    </Link>
                </div>
            </div>
        </div>
    );
}
