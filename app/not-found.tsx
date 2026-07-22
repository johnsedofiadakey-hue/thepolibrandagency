import Link from 'next/link';

export default function NotFound() {
    return (
        <div style={{
            minHeight: '100vh', background: '#06080f',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden', padding: '2rem',
        }}>
            {/* Background grid */}
            <div style={{
                position: 'absolute', inset: 0, opacity: 0.04,
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
            }} />

            {/* Gold glow */}
            <div style={{
                position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
                width: '50vw', height: '50vw', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(201,162,39,0.12) 0%, transparent 65%)',
                pointerEvents: 'none',
            }} />

            {/* Decorative rings */}
            <div style={{ position: 'absolute', opacity: 0.08 }}>
                <svg width="600" height="600" viewBox="0 0 600 600" fill="none">
                    <circle cx="300" cy="300" r="290" stroke="#C9A227" strokeWidth="0.8" />
                    <circle cx="300" cy="300" r="220" stroke="#C9A227" strokeWidth="0.5" strokeDasharray="4 8" />
                    <circle cx="300" cy="300" r="140" stroke="#C9A227" strokeWidth="0.8" />
                </svg>
            </div>

            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 560 }}>
                <div style={{
                    fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700,
                    fontSize: 'clamp(5rem, 15vw, 10rem)', color: '#C9A227',
                    lineHeight: 1, opacity: 0.15, letterSpacing: '-4px',
                    position: 'absolute', top: '-2rem', left: '50%', transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                }}>404</div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
                        <div style={{ width: 28, height: 1.5, background: '#C9A227' }} />
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', fontWeight: 700, color: '#C9A227', letterSpacing: '4px', textTransform: 'uppercase' }}>Page Not Found</span>
                        <div style={{ width: 28, height: 1.5, background: '#C9A227' }} />
                    </div>

                    <h1 style={{
                        fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700,
                        fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                        color: '#fff', lineHeight: 1.2, marginBottom: '1.25rem',
                    }}>
                        This Page Doesn&apos;t Exist
                    </h1>

                    <p style={{
                        fontFamily: 'Inter, sans-serif', fontSize: '1rem',
                        color: 'rgba(255,255,255,0.55)', lineHeight: 1.8,
                        maxWidth: 420, margin: '0 auto 2.5rem',
                    }}>
                        The page you&apos;re looking for may have moved or never existed. Let&apos;s get you back on track.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/" style={{
                            fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.72rem',
                            letterSpacing: '1.5px', textTransform: 'uppercase', textDecoration: 'none',
                            background: '#C9A227', color: '#0a0a0a',
                            padding: '13px 28px', borderRadius: 3,
                        }}>
                            Go Home
                        </Link>
                        <Link href="/apply" style={{
                            fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.72rem',
                            letterSpacing: '1.5px', textTransform: 'uppercase', textDecoration: 'none',
                            color: '#fff', padding: '12px 24px', borderRadius: 3,
                            border: '1px solid rgba(255,255,255,0.2)',
                        }}>
                            Book Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
