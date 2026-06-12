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
        const handleScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                background: scrolled
                    ? 'rgba(8,8,8,0.96)'
                    : 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.0) 100%)',
                backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: scrolled ? '0 2rem' : '0 2rem',
            }}>
                {/* Gold top accent line */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                    background: `linear-gradient(90deg, transparent 0%, ${theme.secondary || '#C9A227'} 40%, ${theme.secondary || '#C9A227'} 60%, transparent 100%)`,
                    opacity: scrolled ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                }} />

                <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: scrolled ? 64 : 80, transition: 'height 0.5s ease' }}>

                    {/* Logo & Brand */}
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', flexShrink: 0 }}>
                        <div style={{
                            width: 48, height: 48,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: 6,
                            border: `1px solid rgba(255,255,255,0.12)`,
                            background: 'rgba(255,255,255,0.06)',
                            backdropFilter: 'blur(8px)',
                            overflow: 'hidden',
                            flexShrink: 0,
                        }}>
                            <img
                                src={theme.logo || '/logo.svg'}
                                alt="Logo"
                                style={{ width: 38, height: 38, objectFit: 'contain' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{
                                fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700,
                                fontSize: '0.95rem', color: '#fff',
                                letterSpacing: '2.5px', lineHeight: 1.1,
                                textTransform: 'uppercase',
                            }}>
                                {nav.brand.line1}
                            </span>
                            <span style={{
                                fontFamily: 'Cinzel, Georgia, serif', fontWeight: 400,
                                fontSize: '0.62rem', color: `${theme.secondary || '#C9A227'}`,
                                letterSpacing: '5px', marginTop: 3, textTransform: 'uppercase',
                            }}>
                                {nav.brand.line2}
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="navbar-desktop" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                        {nav.links.map((link: any) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    fontFamily: 'Inter, sans-serif', fontWeight: 500,
                                    fontSize: '0.72rem', letterSpacing: '1.8px',
                                    textTransform: 'uppercase', color: 'rgba(255,255,255,0.78)',
                                    textDecoration: 'none', transition: 'color 0.2s',
                                    position: 'relative',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.78)')}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <Link
                            href={nav.cta.href}
                            style={{
                                fontFamily: 'Inter, sans-serif', fontWeight: 700,
                                fontSize: '0.68rem', letterSpacing: '1.5px', textTransform: 'uppercase',
                                textDecoration: 'none', padding: '10px 22px',
                                background: theme.secondary || '#C9A227',
                                color: '#0a0a0a',
                                borderRadius: 3,
                                transition: 'all 0.25s',
                                boxShadow: `0 0 0 0 ${theme.secondary || '#C9A227'}40`,
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = `0 8px 24px ${theme.secondary || '#C9A227'}40`;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = `0 0 0 0 ${theme.secondary || '#C9A227'}40`;
                            }}
                        >
                            {nav.cta.label}
                        </Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="navbar-mobile-btn"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}
                        aria-label="Toggle menu"
                    >
                        <span style={{ display: 'block', width: 24, height: 1.5, background: '#fff', transition: 'all 0.3s', transformOrigin: 'center', transform: menuOpen ? 'rotate(45deg) translateY(4.5px)' : 'none' }} />
                        <span style={{ display: 'block', width: 18, height: 1.5, background: '#fff', marginLeft: 'auto', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
                        <span style={{ display: 'block', width: 24, height: 1.5, background: '#fff', transition: 'all 0.3s', transformOrigin: 'center', transform: menuOpen ? 'rotate(-45deg) translateY(-4.5px)' : 'none' }} />
                    </button>
                </div>
            </nav>

            {/* Mobile Fullscreen Menu */}
            <div style={{
                position: 'fixed', inset: 0, zIndex: 999,
                background: 'rgba(4,4,4,0.99)',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '2rem',
                opacity: menuOpen ? 1 : 0,
                pointerEvents: menuOpen ? 'auto' : 'none',
                transition: 'opacity 0.35s ease',
            }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${theme.secondary || '#C9A227'}, transparent)` }} />
                {nav.links.map((link: any, i: number) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        style={{
                            fontFamily: 'Cinzel, serif', fontWeight: 700,
                            fontSize: 'clamp(1.4rem, 5vw, 2rem)',
                            color: '#fff', textDecoration: 'none', letterSpacing: '3px',
                            textTransform: 'uppercase',
                            opacity: menuOpen ? 1 : 0,
                            transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                            transition: `opacity 0.4s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s`,
                        }}
                    >
                        {link.label}
                    </Link>
                ))}
                <Link
                    href={nav.cta.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                        marginTop: '1rem', fontFamily: 'Inter, sans-serif', fontWeight: 700,
                        fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase',
                        background: theme.secondary || '#C9A227', color: '#0a0a0a',
                        padding: '14px 40px', borderRadius: 3, textDecoration: 'none',
                        opacity: menuOpen ? 1 : 0,
                        transition: `opacity 0.4s ease ${nav.links.length * 0.06}s`,
                    }}
                >
                    {nav.cta.label}
                </Link>
            </div>

            <style>{`
                @media (min-width: 769px) { .navbar-mobile-btn { display: none !important; } }
                @media (max-width: 768px) { .navbar-desktop { display: none !important; } }
            `}</style>
        </>
    );
}
