export default function MaintenanceScreen({
    title,
    message,
}: {
    title?: string;
    message?: string;
}) {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, var(--color-primary-dark, var(--color-primary)) 0%, var(--color-primary) 100%)',
        }}>
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle at 70% 30%, color-mix(in srgb, var(--color-secondary), transparent 90%) 0%, transparent 60%)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', inset: 0, opacity: 0.04,
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
                pointerEvents: 'none',
            }} />
            <div style={{ position: 'absolute', opacity: 0.12, pointerEvents: 'none' }}>
                <svg width="320" height="320" viewBox="0 0 320 320" fill="none">
                    <circle cx="160" cy="160" r="158" stroke="var(--color-secondary)" strokeWidth="0.8" />
                    <circle cx="160" cy="160" r="112" stroke="var(--color-secondary)" strokeWidth="0.5" strokeDasharray="4 8" />
                    <circle cx="160" cy="160" r="60" stroke="var(--color-secondary)" strokeWidth="0.8" />
                </svg>
            </div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: 560 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: '2rem' }}>
                    <div style={{ width: 36, height: 1.5, background: 'var(--color-secondary)' }} />
                    <span style={{
                        fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700,
                        color: 'var(--color-secondary)', letterSpacing: '4px', textTransform: 'uppercase',
                    }}>
                        The Polibrand Agency
                    </span>
                    <div style={{ width: 36, height: 1.5, background: 'var(--color-secondary)' }} />
                </div>

                <h1 style={{
                    fontFamily: 'var(--font-display)', fontWeight: 700,
                    fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', color: '#fff',
                    lineHeight: 1.2, marginBottom: '1.25rem', letterSpacing: '-0.5px',
                }}>
                    {title || "We're Building Something New."}
                </h1>

                <div style={{ width: 56, height: 2, background: 'var(--color-secondary)', margin: '0 auto 1.5rem', borderRadius: 1 }} />

                <p style={{
                    fontFamily: 'var(--font-body)', fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
                    color: 'rgba(255,255,255,0.78)', lineHeight: 1.85, marginBottom: '2rem',
                }}>
                    {message || "We're working on new features and improvements behind the scenes. We'll be back online shortly — thank you for your patience."}
                </p>

                <a
                    href="mailto:hello@thepolibrandagency.com"
                    style={{
                        fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.72rem',
                        letterSpacing: '1.5px', textTransform: 'uppercase', textDecoration: 'none',
                        color: 'var(--color-secondary)', border: '1px solid var(--color-secondary)',
                        padding: '12px 28px', borderRadius: 3, display: 'inline-block',
                    }}
                >
                    Get in Touch →
                </a>
            </div>
        </div>
    );
}
