'use client';
import { useState, useEffect, useContext } from 'react';
import { SettingsContext } from './SettingsProvider';
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Programs', href: '/programs' },
    { label: 'Assessment', href: '/assessment' },
    { label: 'Institutional Clients', href: '/institutional-clients' },
];

    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const settings = useContext(SettingsContext);
    const theme = settings.theme;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Shrink logo/company name on scroll
    const logoSize = scrolled ? 60 : 100;
    const nameSize = scrolled ? '1.5rem' : '2.5rem';
    const subSize = scrolled ? '1rem' : '1.5rem';

    return (
        <nav
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
                background: scrolled ? theme.primary : 'rgba(17,17,17,0.6)',
                backdropFilter: 'blur(16px)',
                borderBottom: scrolled ? `1px solid ${theme.secondary}` : 'none',
                transition: 'all 0.35s ease',
                padding: '0 24px',
            }}
        >
            <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
                {/* Logo */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                    <img src="/logo.png" alt="The Polibrand Agency" className="logo" style={{ height: logoSize, width: logoSize, objectFit: 'contain', boxShadow: '0 4px 24px rgba(0,0,0,0.15)', transition: 'height 0.3s, width 0.3s' }} />
                    <div>
                        <div className="company-name" style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: nameSize, color: theme.secondary, letterSpacing: '2px', lineHeight: 1, textShadow: '0 2px 8px rgba(0,0,0,0.12)', transition: 'font-size 0.3s, color 0.3s' }}>
                            THE POLIBRAND
                        </div>
                        <div className="company-sub" style={{ fontFamily: 'Cinzel, serif', fontWeight: 400, fontSize: subSize, color: theme.text, letterSpacing: '4px', lineHeight: 1.4, textShadow: '0 2px 8px rgba(0,0,0,0.12)', transition: 'font-size 0.3s, color 0.3s' }}>
                            AGENCY
                        </div>
                    </div>
                </Link>

                {/* Desktop Nav Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{
                                fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.78rem',
                                letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.82)',
                                textDecoration: 'none', transition: 'color 0.2s', padding: '4px 0',
                                borderBottom: '2px solid transparent',
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link href="/apply" className="btn-gold" style={{ fontSize: '0.72rem', padding: '10px 20px' }}>
                        Apply Now
                    </Link>
                </div>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
                    className="mobile-only"
                >
                    <div style={{ width: 24, height: 2, background: '#C9A227', marginBottom: 5, transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
                    <div style={{ width: 24, height: 2, background: '#C9A227', marginBottom: 5, opacity: menuOpen ? 0 : 1 }} />
                    <div style={{ width: 24, height: 2, background: '#C9A227', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div style={{ background: 'rgba(17,17,17,0.98)', borderTop: '1px solid rgba(201,162,39,0.2)', padding: '1.5rem 24px 2rem' }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            style={{
                                display: 'block', padding: '12px 0',
                                fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.85rem',
                                letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)',
                                textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.07)',
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link href="/apply" className="btn-gold" style={{ marginTop: '1.5rem', fontSize: '0.78rem' }}>
                        Apply Now
                    </Link>
                </div>
            )}

            <style>{`
        @media (min-width: 769px) { .mobile-only { display: none !important; } }
        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
      `}</style>
        </nav>
    );
}
