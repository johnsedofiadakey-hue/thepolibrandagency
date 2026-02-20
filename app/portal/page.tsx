'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function PortalPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        window.location.href = '/portal/dashboard';
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #0c3d1e 0%, #1F6F3E 100%)',
            padding: '2rem', position: 'relative', overflow: 'hidden',
        }}>
            <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(201,162,39,0.12)' }} />
            <div style={{ position: 'absolute', bottom: -120, left: -80, width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(201,162,39,0.08)' }} />

            <div style={{ background: '#fff', borderRadius: 8, padding: '3.5rem', width: '100%', maxWidth: 460, position: 'relative', zIndex: 1, boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
                    <img src="/logo.png" alt="The Polibrand Agency" style={{ width: 70, height: 70, objectFit: 'contain', marginBottom: '1.25rem' }} />
                    <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.3rem', color: '#111', marginBottom: '0.25rem' }}>Fellows Portal</h1>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#9ca3af' }}>The Polibrand Agency · 2026</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#374151', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                            style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e5e0d6', borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                            onFocus={(e) => { e.target.style.borderColor = '#1F6F3E'; }}
                            onBlur={(e) => { e.target.style.borderColor = '#e5e0d6'; }}
                        />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#374151', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                            style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e5e0d6', borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                            onFocus={(e) => { e.target.style.borderColor = '#1F6F3E'; }}
                            onBlur={(e) => { e.target.style.borderColor = '#e5e0d6'; }}
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        Enter Portal →
                    </button>
                </form>
                <Link href="/" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#bbb', textDecoration: 'none' }}>
                    ← Back to Website
                </Link>
            </div>
        </div>
    );
}
