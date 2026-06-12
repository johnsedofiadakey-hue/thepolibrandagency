'use client';
import Link from 'next/link';

export default function Error({ reset }: { error: Error; reset: () => void }) {
    return (
        <div style={{
            minHeight: '100vh', background: '#06080f',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '2rem', textAlign: 'center',
        }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
                <div style={{ width: 28, height: 1.5, background: '#C9A227' }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', fontWeight: 700, color: '#C9A227', letterSpacing: '4px', textTransform: 'uppercase' }}>Something Went Wrong</span>
                <div style={{ width: 28, height: 1.5, background: '#C9A227' }} />
            </div>

            <h1 style={{
                fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700,
                fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                color: '#fff', lineHeight: 1.2, marginBottom: '1rem',
            }}>
                An Error Occurred
            </h1>

            <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.95rem',
                color: 'rgba(255,255,255,0.5)', lineHeight: 1.8,
                maxWidth: 400, margin: '0 auto 2rem',
            }}>
                Something unexpected happened. Please try again or return home.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={reset} style={{
                    fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.72rem',
                    letterSpacing: '1.5px', textTransform: 'uppercase',
                    background: '#C9A227', color: '#0a0a0a',
                    padding: '13px 28px', borderRadius: 3, border: 'none', cursor: 'pointer',
                }}>
                    Try Again
                </button>
                <Link href="/" style={{
                    fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.72rem',
                    letterSpacing: '1.5px', textTransform: 'uppercase', textDecoration: 'none',
                    color: '#fff', padding: '12px 24px', borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'inline-block',
                }}>
                    Go Home
                </Link>
            </div>
        </div>
    );
}
