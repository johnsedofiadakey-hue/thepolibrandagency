'use client';
import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { PoliSettingsContext } from '@/components/SettingsProvider';
import { getFirebaseClientAuth } from '@/lib/firebase-client';
import { isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from 'firebase/auth';

export default function PortalPage() {
    const { content } = useContext(PoliSettingsContext) as any;
    const portal = content.pages.portal;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);
    const [firebaseAuthReady] = useState(() => !!getFirebaseClientAuth());

    useEffect(() => {
        const auth = getFirebaseClientAuth();
        if (!auth || !isSignInWithEmailLink(auth, window.location.href)) return;

        async function completeFirebaseLogin() {
            setLoading(true);
            setError(null);
            try {
                const storedEmail = window.localStorage.getItem('portalEmailForSignIn');
                if (!storedEmail) {
                    setError('Please enter your email again to complete sign-in.');
                    setLoading(false);
                    return;
                }

                const credential = await signInWithEmailLink(auth!, storedEmail, window.location.href);
                const idToken = await credential.user.getIdToken();
                const res = await fetch('/api/portal/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idToken }),
                });
                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || 'Firebase authentication failed.');
                    setLoading(false);
                    return;
                }

                localStorage.setItem('fellowEmail', data.email || storedEmail);
                localStorage.removeItem('portalEmailForSignIn');
                window.location.href = '/portal/dashboard';
            } catch (err) {
                console.error('Firebase email-link login error:', err);
                setError('Firebase sign-in could not be completed.');
                setLoading(false);
            }
        }

        completeFirebaseLogin();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        if (e) e.preventDefault();
        setError(null);
        setNotice(null);
        setLoading(true);

        const targetEmail = email.trim();

        if (!targetEmail) {
            setError('Please enter your registered email address.');
            setLoading(false);
            return;
        }

        try {
            const auth = getFirebaseClientAuth();
            if (auth && !password) {
                await sendSignInLinkToEmail(auth, targetEmail, {
                    url: `${window.location.origin}/portal`,
                    handleCodeInApp: true,
                });
                localStorage.setItem('portalEmailForSignIn', targetEmail);
                setNotice('A Firebase sign-in link has been sent to your email.');
                setLoading(false);
                return;
            }

            if (!password) {
                setError('Please enter your access code.');
                setLoading(false);
                return;
            }

            const res = await fetch('/api/portal/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: targetEmail, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Authentication failed. Please verify your email and access code.');
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
                        <strong>Enrollment Notice:</strong> {error}
                    </div>
                )}

                {notice && (
                    <div style={{
                        background: 'rgba(31, 111, 62, 0.08)',
                        border: '1px solid rgba(31, 111, 62, 0.2)',
                        borderRadius: 6,
                        padding: '12px 14px',
                        marginBottom: '1.5rem',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.8rem',
                        color: '#166534',
                        lineHeight: '1.4',
                        textAlign: 'left'
                    }}>
                        {notice}
                    </div>
                )}

                <form onSubmit={handleLogin}>
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
                        <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#374151', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>{firebaseAuthReady ? 'Access Code (Fallback)' : 'Access Code'}</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                            style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e5e0d6', borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                            onFocus={(e: any) => { e.target.style.borderColor = '#1F6F3E'; }}
                            onBlur={(e: any) => { e.target.style.borderColor = '#e5e0d6'; }}
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', height: 46 }} disabled={loading}>
                        {loading ? 'Authenticating...' : firebaseAuthReady && !password ? 'Send Sign-In Link' : `${portal.login.button} →`}
                    </button>
                </form>

                <Link href="/" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#9ca3af', textDecoration: 'none' }}>
                    ← Back to Website
                </Link>
            </div>
        </div>
    );
}
