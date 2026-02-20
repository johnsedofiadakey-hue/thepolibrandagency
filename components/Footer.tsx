'use client';
import Link from 'next/link';

const footerLinks = {
    Platform: [
        { label: 'About', href: '/about' },
        { label: 'Services', href: '/services' },
        { label: 'Programs', href: '/programs' },
        { label: 'Political Readiness Index', href: '/assessment' },
    ],
    Programs: [
        { label: 'Leadership Bootcamp', href: '/programs#bootcamp' },
        { label: 'Fellowship', href: '/programs#fellowship' },
        { label: 'Digital Courses', href: '/programs#courses' },
        { label: 'Fellows Portal', href: '/portal' },
    ],
    Institution: [
        { label: 'Institutional Clients', href: '/institutional-clients' },
        { label: 'Partner Proposal', href: '/apply' },
        { label: 'Document Library', href: '/admin/documents' },
    ],
};

export default function Footer() {
    return (
        <footer style={{ background: '#0d0d0d', color: 'rgba(255,255,255,0.75)', paddingTop: '80px' }}>
            <div className="container-brand">
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', paddingBottom: '60px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {/* Brand Column */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                            <img src="/logo.png" alt="The Polibrand Agency" style={{ height: 56, width: 56, objectFit: 'contain' }} />
                            <div>
                                <div style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '0.9rem', color: '#C9A227', letterSpacing: '1px' }}>THE POLIBRAND</div>
                                <div style={{ fontFamily: 'Cinzel, serif', fontWeight: 400, fontSize: '0.6rem', color: '#fff', letterSpacing: '2px' }}>AGENCY</div>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', lineHeight: 1.8, maxWidth: 280, marginBottom: '1.5rem' }}>
                            The leading political branding partner for women leaders across Africa.
                        </p>
                        <div style={{ display: 'flex', gap: 12 }}>
                            {['Twitter/X', 'LinkedIn', 'Instagram'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    style={{
                                        width: 36, height: 36, borderRadius: '50%',
                                        border: '1px solid rgba(201,162,39,0.4)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#C9A227', fontSize: '0.65rem', fontWeight: 700,
                                        textDecoration: 'none', transition: 'all 0.2s',
                                    }}
                                    title={social}
                                >
                                    {social.charAt(0)}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link Columns */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 style={{ fontFamily: 'Cinzel, serif', fontSize: '0.75rem', fontWeight: 700, color: '#C9A227', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                                {title}
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {links.map((link) => (
                                    <li key={link.label} style={{ marginBottom: '0.75rem' }}>
                                        <Link
                                            href={link.href}
                                            style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.2s' }}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter */}
                <div style={{ padding: '40px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div>
                        <h4 style={{ fontFamily: 'Cinzel, serif', fontSize: '0.9rem', fontWeight: 600, color: '#fff', marginBottom: 6 }}>Stay Informed</h4>
                        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)' }}>Political strategy insights, fellowship updates, and program announcements.</p>
                    </div>
                    <div style={{ display: 'flex', gap: 0 }}>
                        <input
                            type="email"
                            placeholder="Your email address"
                            style={{
                                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(201,162,39,0.3)',
                                borderRight: 'none', color: '#fff', padding: '12px 18px', fontSize: '0.82rem',
                                borderRadius: '2px 0 0 2px', outline: 'none', minWidth: 240,
                                fontFamily: 'Inter, sans-serif',
                            }}
                        />
                        <button
                            style={{
                                background: '#C9A227', color: '#111', border: 'none', padding: '12px 24px',
                                fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.75rem',
                                letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer',
                                borderRadius: '0 2px 2px 0',
                            }}
                        >
                            Subscribe
                        </button>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{ padding: '28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', position: 'relative' }}>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                        © 2026 The Polibrand Agency. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                            <a key={item} href="#" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
                                {item}
                            </a>
                        ))}
                        <Link href="/admin/login" style={{
                            fontSize: '0.75rem', color: 'rgba(255,255,255,0.15)', textDecoration: 'none',
                            marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: 6,
                            transition: 'color 0.2s'
                        }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#C9A227'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.15)'; }}
                        >
                            <span style={{ fontSize: '1rem' }}>◈</span> Admin
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
