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

    return (
        <nav
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                background: scrolled ? 'rgba(17,17,17,0.95)' : 'transparent',
                backdropFilter: scrolled ? 'blur(12px)' : 'none',
                borderBottom: scrolled ? `1px solid ${theme.secondary}30` : 'none',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: scrolled ? '0.75rem 24px' : '1.25rem 24px',
            }}
        >
            <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Logo & Brand Lockup */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
                    <div style={{ position: 'relative', width: 48, height: 48, transition: 'transform 0.3s' }}>
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
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 12 }}
                    className="mobile-only"
                >
                    <div style={{ width: 24, height: 2, background: theme.secondary, marginBottom: 5, transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
                    <div style={{ width: 20, height: 2, background: theme.secondary, marginBottom: 5, marginLeft: 'auto', opacity: menuOpen ? 0 : 1 }} />
                    <div style={{ width: 24, height: 2, background: theme.secondary, transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none' }} />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, left: 0,
                background: 'rgba(17,17,17,0.98)', zIndex: -1,
                display: menuOpen ? 'flex' : 'none', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center', gap: '2rem',
                transition: 'all 0.3s'
            }}>
                {nav.links.map((link: any) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        style={{
                            fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.5rem',
                            color: '#fff', textDecoration: 'none', letterSpacing: '2px'
                        }}
                    >
                        {link.label}
                    </Link>
                ))}
                <Link
                    href={nav.cta.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                        background: theme.secondary, color: '#111',
                        padding: '16px 40px', borderRadius: '2px', marginTop: '1rem',
                        fontFamily: 'Inter, sans-serif', fontWeight: 700, textDecoration: 'none'
                    }}
                >
                    {nav.cta.label}
                </Link>
            </div>

            <style>{`
        @media (min-width: 769px) { .mobile-only { display: none !important; } }
        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
      `}</style>
        </nav>
    );
}
