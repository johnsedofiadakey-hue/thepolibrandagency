'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useContext } from 'react';
import { PoliSettingsContext } from '@/components/SettingsProvider';

export default function ServicesPage() {
    const { content } = useContext(PoliSettingsContext) as any;
    const services = content.pages.services;

    return (
        <>
            <Navbar />

            {/* ─── HERO ─── */}
            <section style={{
                background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
                padding: '160px 0 80px', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 30%, color-mix(in srgb, var(--color-secondary), transparent 90%) 0%, transparent 60%)', pointerEvents: 'none' }} />
                <div className="container-brand" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ maxWidth: 700 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
                            <div style={{ width: 28, height: 1, background: 'var(--color-secondary)' }} />
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-secondary)', letterSpacing: '3px', textTransform: 'uppercase' }}>{services.hero.tag}</span>
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#fff', lineHeight: 1.2, marginBottom: '1.5rem' }}>
                            {services.hero.title}
                        </h1>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.8, maxWidth: 580 }}>
                            {services.hero.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── FOR WOMEN LEADERS ─── */}
            <section className="section-pad" style={{ background: 'var(--color-bg)' }}>
                <div className="container-brand">
                    <div style={{ marginBottom: '3.5rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                            <div style={{ width: 28, height: 1, background: 'var(--color-primary)' }} />
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '3px', textTransform: 'uppercase' }}>{services.individual.tag}</span>
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2.2rem', color: '#111' }}>{services.individual.title}</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {services.individual.items.map((s: any, i: number) => (
                            <div key={i} style={{
                                background: '#fff', border: '1px solid var(--color-border)', borderRadius: 4,
                                padding: '2.5rem', display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '2.5rem',
                                alignItems: 'start', boxShadow: 'var(--shadow-card)', transition: 'transform 0.3s ease',
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2.5rem', color: 'color-mix(in srgb, var(--color-primary), transparent 85%)' }}>{s.number}</span>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
                                        <div style={{ width: 4, height: 24, background: s.color, borderRadius: 2 }} />
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: '#111' }}>{s.title}</h3>
                                    </div>
                                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: '#555', lineHeight: 1.8 }}>{s.intro}</p>
                                </div>
                                <div>
                                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 700, color: s.color, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>DELIVERABLES</p>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {s.deliverables.map((d: string) => (
                                            <li key={d} style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: '#444', padding: '5px 0 5px 1.5rem', position: 'relative', borderBottom: '1px solid #f0ebe2' }}>
                                                <span style={{ position: 'absolute', left: 0, color: s.color }}>▸</span>
                                                {d}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FOR INSTITUTIONS ─── */}
            <section className="section-pad" style={{ background: '#fff' }}>
                <div className="container-brand">
                    <div style={{ marginBottom: '3.5rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                            <div style={{ width: 28, height: 1, background: 'var(--color-accent)' }} />
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-accent)', letterSpacing: '3px', textTransform: 'uppercase' }}>{services.institutional.tag}</span>
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2.2rem', color: '#111' }}>{services.institutional.title}</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {services.institutional.items.map((s: any, i: number) => (
                            <div key={i} className="card-brand">
                                <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{s.icon}</div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: '#111', marginBottom: '0.75rem' }}>{s.title}</h3>
                                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', color: '#555', lineHeight: 1.8, marginBottom: '1.25rem' }}>{s.desc}</p>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {s.features.map((f: string) => (
                                        <li key={f} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#444', padding: '5px 0 5px 1.5rem', position: 'relative', borderBottom: '1px solid #f0ebe2' }}>
                                            <span style={{ position: 'absolute', left: 0, color: '#1F6F3E' }}>▸</span>{f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section style={{ background: '#111', padding: '80px 0' }}>
                <div className="container-brand" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2rem', color: '#fff', marginBottom: '0.75rem' }}>Ready to Begin?</h2>
                    <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.65)', marginBottom: '2rem' }}>Start with the Political Readiness Index to identify your strategic starting point.</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link href="/assessment" className="btn-gold">Start Assessment →</Link>
                        <Link href="/programs#fellowship" className="btn-secondary">View Programs</Link>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
