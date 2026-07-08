'use client';
import { useState, useEffect, useContext } from 'react';
import { PoliSettingsContext } from './SettingsProvider';
import Link from 'next/link';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { theme, content } = useContext(PoliSettingsContext) as any;
    const nav = content.navbar;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    return (
        <>
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                background: scrolled
                    ? `linear-gradient(180deg, rgba(10,10,12,0.45) 0%, rgba(10,10,12,0.22) 65%, rgba(10,10,12,0) 100%)`
                    : `linear-gradient(180deg, rgba(10,10,12,0.22) 0%, rgba(10,10,12,0.1) 65%, rgba(10,10,12,0) 100%)`,
                backdropFilter: scrolled ? 'blur(16px) saturate(140%)' : 'blur(10px) saturate(140%)',
                WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(140%)' : 'blur(10px) saturate(140%)',
                maskImage: 'linear-gradient(180deg, black 0%, black 65%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(180deg, black 0%, black 65%, transparent 100%)',
                paddingTop: scrolled ? '0.75rem' : '1.25rem',
                paddingLeft: '24px', paddingRight: '24px',
                paddingBottom: scrolled ? '2.5rem' : '3rem',
                transition: 'all 0.35s ease',
            }}>
                <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Logo & Brand Lockup */}
                    <Link href="/" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
                        <div style={{ position: 'relative', width: 68, height: 68, transition: 'transform 0.3s' }}>
                            <img
                                src={theme.logo || '/logo.png'}
                                alt="Logo"
                                style={{
                                    width: '100%', height: '100%', objectFit: 'contain',
                                    filter: scrolled ? 'none' : 'drop-shadow(0 0 8px rgba(0,0,0,0.3))'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', borderLeft: `1px solid ${theme.secondary}40`, paddingLeft: '16px' }}>
                            <span style={{
                                fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.2rem',
                                color: theme.secondary, letterSpacing: '2px', lineHeight: 1,
                                textShadow: scrolled ? 'none' : '0 2px 10px rgba(0,0,0,0.4)'
                            }}>
                                {nav.brand.line1}
                            </span>
                            <span style={{
                                fontFamily: 'Cinzel, serif', fontWeight: 400, fontSize: '0.8rem',
                                color: '#fff', letterSpacing: '4.5px', marginTop: '2px',
                                opacity: 0.9
                            }}>
                                {nav.brand.line2}
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }} className="desktop-nav">
                        {nav.links.map((link: any) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.75rem',
                                    letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fff',
                                    textDecoration: 'none', transition: 'all 0.2s',
                                    opacity: 0.85
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = theme.secondary; }}
                                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.color = '#fff'; }}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href={nav.cta.href}
                            style={{
                                background: theme.secondary, color: '#111',
                                padding: '10px 24px', borderRadius: '2px',
                                fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.7rem',
                                textTransform: 'uppercase', letterSpacing: '1px', textDecoration: 'none',
                                transition: 'all 0.3s', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'; }}
                        >
                            {nav.cta.label}
                        </Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 12, zIndex: 1001, position: 'relative' }}
                        className="mobile-only"
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    >
                        <div style={{ width: 24, height: 2, background: theme.secondary, marginBottom: 5, transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
                        <div style={{ width: 20, height: 2, background: theme.secondary, marginBottom: 5, marginLeft: 'auto', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
                        <div style={{ width: 24, height: 2, background: theme.secondary, transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none' }} />
                    </button>
                </div>

                <style>{`
          @media (min-width: 769px) { .mobile-only { display: none !important; } }
          @media (max-width: 768px) { .desktop-nav { display: none !important; } }
        `}</style>
            </nav>

            {/* ── Mobile Menu Overlay ──
                MUST be a sibling of <nav>, NOT a child.
                nav has backdrop-filter which creates a containing block that
                traps position:fixed children to the nav's own dimensions. */}
            <div
                className="mobile-only"
                style={{
                    position: 'fixed', inset: 0, zIndex: 999,
                    background: `linear-gradient(160deg, rgba(10,10,10,0.99) 0%, ${theme.primary}f5 100%)`,
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', alignItems: 'center',
                    gap: '0.15rem',
                    opacity: menuOpen ? 1 : 0,
                    transform: menuOpen ? 'translateY(0)' : 'translateY(-20px)',
                    transition: 'opacity 0.38s ease, transform 0.38s ease',
                    pointerEvents: menuOpen ? 'auto' : 'none',
                    overflow: 'hidden',
                    padding: '80px 24px 40px',
                }}
            >
                {/* Decorative reticle — bottom right */}
                <div style={{ position: 'absolute', right: -50, bottom: -50, opacity: 0.08, pointerEvents: 'none' }}>
                    <svg width="320" height="320" viewBox="0 0 320 320" fill="none">
                        <circle cx="160" cy="160" r="158" stroke={theme.secondary} strokeWidth="0.8" />
                        <circle cx="160" cy="160" r="112" stroke={theme.secondary} strokeWidth="0.5" strokeDasharray="4 8" />
                        <circle cx="160" cy="160" r="60" stroke={theme.secondary} strokeWidth="0.8" />
                    </svg>
                </div>
                {/* Decorative reticle — top left */}
                <div style={{ position: 'absolute', left: -40, top: -40, opacity: 0.05, pointerEvents: 'none' }}>
                    <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                        <circle cx="100" cy="100" r="98" stroke={theme.secondary} strokeWidth="0.8" />
                        <circle cx="100" cy="100" r="64" stroke={theme.secondary} strokeWidth="0.5" strokeDasharray="3 6" />
                    </svg>
                </div>

                {/* Brand mark */}
                <div style={{
                    marginBottom: '2rem', textAlign: 'center',
                    opacity: menuOpen ? 1 : 0,
                    transition: 'opacity 0.5s 0.05s ease',
                }}>
                    <div style={{ width: 40, height: 1.5, background: theme.secondary, margin: '0 auto 8px' }} />
                    <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '0.68rem', color: theme.secondary, letterSpacing: '4px', textTransform: 'uppercase' }}>
                        {nav.brand.line1}
                    </span>
                    <div style={{ width: 40, height: 1.5, background: theme.secondary, margin: '8px auto 0' }} />
                </div>

                {nav.links.map((link: any, i: number) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        style={{
                            fontFamily: 'Cinzel, serif', fontWeight: 700,
                            fontSize: 'clamp(1.25rem, 5vw, 1.7rem)',
                            color: '#fff', textDecoration: 'none', letterSpacing: '3px',
                            padding: '12px 0',
                            display: 'block',
                            opacity: menuOpen ? 1 : 0,
                            transform: menuOpen ? 'translateX(0)' : 'translateX(24px)',
                            transition: `opacity 0.4s ${0.08 + i * 0.06}s ease, transform 0.4s ${0.08 + i * 0.06}s ease, color 0.2s`,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = theme.secondary; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#fff'; }}
                    >
                        {link.label}
                    </Link>
                ))}

                <Link
                    href={nav.cta.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                        background: theme.secondary, color: '#111',
                        padding: '15px 48px', borderRadius: '2px', marginTop: '2rem',
                        fontFamily: 'Inter, sans-serif', fontWeight: 700, textDecoration: 'none',
                        fontSize: '0.78rem', letterSpacing: '2px', textTransform: 'uppercase',
                        opacity: menuOpen ? 1 : 0,
                        transform: menuOpen ? 'translateY(0)' : 'translateY(12px)',
                        transition: `opacity 0.4s 0.45s ease, transform 0.4s 0.45s ease`,
                        boxShadow: `0 8px 32px ${theme.secondary}40`,
                        display: 'inline-block',
                    }}
                >
                    {nav.cta.label}
                </Link>
            </div>
        </>
    );
}
