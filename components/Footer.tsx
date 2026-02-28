"use client";
import Link from 'next/link';
import { useContext } from 'react';
import { PoliSettingsContext } from './SettingsProvider';

export default function Footer() {
    const { theme, content } = useContext(PoliSettingsContext) as any;
    const footer = content.footer;
    const navbar = content.navbar;

    return (
        <footer style={{ background: 'var(--color-primary)', color: '#fff', paddingTop: '80px', borderTop: `1px solid var(--color-secondary)` }}>
            <div className="container-brand">
                <style>{`
                    .footer-grid {
                        display: grid;
                        grid-template-columns: 2fr 1fr 1fr 1fr;
                        gap: 3rem;
                        padding-bottom: 60px;
                        border-bottom: 1px solid rgba(255,255,255,0.1);
                    }
                    .newsletter-section {
                        padding: 40px 0;
                        border-bottom: 1px solid rgba(255,255,255,0.1);
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        flex-wrap: wrap;
                        gap: 1.5rem;
                    }
                    .newsletter-form {
                        display: flex;
                        gap: 0;
                        width: 100%;
                        max-width: 450px;
                    }
                    .footer-bottom {
                        padding: 28px 0;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        flex-wrap: wrap;
                        gap: 1rem;
                    }
                    @media (max-width: 768px) {
                        .footer-grid {
                            grid-template-columns: 1fr;
                            gap: 2.5rem;
                            text-align: center;
                        }
                        .footer-brand-col {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                        }
                        .newsletter-section {
                            flex-direction: column;
                            text-align: center;
                        }
                        .newsletter-form {
                            width: 100%;
                            max-width: 100%;
                        }
                        .footer-bottom {
                            flex-direction: column;
                            text-align: center;
                        }
                        .social-links {
                            justify-content: center;
                        }
                    }
                `}</style>

                <div className="footer-grid">
                    {/* Brand Column */}
                    <div className="footer-brand-col">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                            <img src={theme.logo || "/logo.png"} alt="The Polibrand Agency" style={{ height: 56, width: 56, objectFit: 'contain', background: 'var(--color-bg)', borderRadius: 8, border: `2px solid var(--color-secondary)` }} />
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-secondary)', letterSpacing: '1px' }}>{navbar.brand.line1}</div>
                                <div style={{ fontFamily: 'Cinzel, serif', fontWeight: 400, fontSize: '0.6rem', color: '#fff', letterSpacing: '2px' }}>{navbar.brand.line2}</div>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', lineHeight: 1.8, maxWidth: 280, marginBottom: '1.5rem', opacity: 0.8 }}>
                            {footer.brand.description}
                        </p>
                        <div className="social-links" style={{ display: 'flex', gap: 12 }}>
                            {footer.socials.map((social: any) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    style={{
                                        width: 40, height: 40, borderRadius: '50%',
                                        border: '1px solid rgba(201,162,39,0.3)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--color-secondary)', fontSize: '0.75rem', fontWeight: 700,
                                        textDecoration: 'none', transition: 'all 0.2s',
                                        background: 'rgba(255,255,255,0.03)'
                                    }}
                                    title={social.label}
                                >
                                    {social.label.charAt(0)}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link Columns */}
                    {footer.sections.map((section: any) => (
                        <div key={section.title}>
                            <h4 style={{ fontFamily: 'Cinzel, serif', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-secondary)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                                {section.title}
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {section.links.map((link: any) => (
                                    <li key={link.label} style={{ marginBottom: '0.85rem' }}>
                                        <Link
                                            href={link.href}
                                            style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}
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
                <div className="newsletter-section">
                    <div>
                        <h4 style={{ fontFamily: 'Cinzel, serif', fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: 8 }}>{footer.newsletter.title}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)' }}>{footer.newsletter.description}</p>
                    </div>
                    <div className="newsletter-form">
                        <input
                            type="email"
                            placeholder="Email address"
                            style={{
                                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(201,162,39,0.3)',
                                borderRight: 'none', color: '#fff', padding: '14px 20px', fontSize: '0.9rem',
                                borderRadius: '4px 0 0 4px', outline: 'none', flex: 1,
                                fontFamily: 'Inter, sans-serif',
                            }}
                        />
                        <button
                            style={{
                                background: 'var(--color-secondary)', color: '#111', border: 'none', padding: '14px 24px',
                                fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.75rem',
                                letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer',
                                borderRadius: '0 4px 4px 0',
                            }}
                        >
                            Subscribe
                        </button>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                        {footer.bottom.copyright}
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {footer.bottom.links.map((item: any) => (
                            <a key={item.label} href={item.href} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
                                {item.label}
                            </a>
                        ))}
                        <Link href="/admin/login" style={{
                            fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
                            display: 'flex', alignItems: 'center', gap: 6,
                            transition: 'color 0.2s', padding: '4px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.05)'
                        }}>
                            Admin Portal
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
