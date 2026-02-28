'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useContext } from 'react';
import { PoliSettingsContext } from '@/components/SettingsProvider';

export default function ProgramsPage() {
    const { content } = useContext(PoliSettingsContext) as any;
    const programs = content.pages.programs;

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
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
                        <div style={{ width: 28, height: 1, background: 'var(--color-secondary)' }} />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-secondary)', letterSpacing: '3px', textTransform: 'uppercase' }}>{programs.hero.tag}</span>
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', color: '#fff', lineHeight: 1.2, marginBottom: '1.5rem' }}>
                        {programs.hero.title}
                    </h1>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.8, maxWidth: 580 }}>
                        {programs.hero.description}
                    </p>
                </div>
            </section>

            {/* ─── BOOTCAMP ─── */}
            <section id="bootcamp" className="section-pad" style={{ background: '#fff' }}>
                <div className="container-brand">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }}>
                        <div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                                <span className="badge badge-green">{programs.bootcamp.badge}</span>
                            </div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                                <div style={{ width: 28, height: 1, background: 'var(--color-primary)' }} />
                                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '3px', textTransform: 'uppercase' }}>{programs.bootcamp.tag}</span>
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2.2rem', color: '#111', marginBottom: '0.5rem' }}>{programs.bootcamp.title}</h2>
                            <div className="divider-gold" />
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: '#555', lineHeight: 1.9, marginBottom: '1.5rem' }}>
                                {programs.bootcamp.description}
                            </p>
                            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-primary)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>PROGRAM MODULES</p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {programs.bootcamp.modules.map((m: string, i: number) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: '#333' }}>
                                        <span style={{ width: 22, height: 22, background: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                                        {m}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/apply?type=bootcamp" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-flex' }}>
                                Apply for Bootcamp →
                            </Link>
                        </div>
                        <div>
                            <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 4, padding: '2.5rem', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: '#111', marginBottom: '1.25rem' }}>Program Outcomes</h3>
                                {programs.bootcamp.outcomes.map((o: any) => (
                                    <div key={o.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, padding: '12px', background: '#fff', borderRadius: 4, border: '1px solid var(--color-border)' }}>
                                        <span style={{ color: 'var(--color-secondary)', fontSize: '1rem' }}>{o.icon}</span>
                                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', fontWeight: 500, color: '#333' }}>{o.label}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ background: 'var(--color-primary)', borderRadius: 4, padding: '2rem', color: '#fff' }}>
                                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', marginBottom: '0.75rem' }}>Next Cohort</h4>
                                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', marginBottom: '1rem' }}>{programs.bootcamp.next_cohort}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── FELLOWSHIP ─── */}
            <section id="fellowship" className="section-pad" style={{ background: 'var(--color-bg)' }}>
                <div className="container-brand">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <span className="badge badge-gold" style={{ marginBottom: '1rem', display: 'inline-block' }}>{programs.fellowship.badge}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem', justifyContent: 'center' }}>
                            <div style={{ width: 28, height: 1, background: 'var(--color-secondary)' }} />
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-secondary)', letterSpacing: '3px', textTransform: 'uppercase' }}>{programs.fellowship.tag}</span>
                            <div style={{ width: 28, height: 1, background: 'var(--color-secondary)' }} />
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2.4rem', color: '#111', marginBottom: '1rem' }}>{programs.fellowship.title}</h2>
                        <div className="divider-gold divider-gold-center" />
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: '#555', maxWidth: 620, margin: '0 auto' }}>
                            {programs.fellowship.description}
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                        {programs.fellowship.inclusions.map((f: any, i: number) => (
                            <div key={i} className="card-brand" style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{f.icon}</div>
                                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: '#111', marginBottom: '0.5rem' }}>{f.title}</h4>
                                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#666', lineHeight: 1.7 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                        <Link href="/assessment" className="btn-primary" style={{ marginRight: '1rem' }}>Take Readiness Assessment First</Link>
                        <Link href="/apply" className="btn-outline-dark">Apply to Fellowship</Link>
                    </div>
                </div>
            </section>

            {/* ─── DIGITAL COURSES ─── */}
            <section id="courses" className="section-pad" style={{ background: '#fff' }}>
                <div className="container-brand">
                    <div style={{ marginBottom: '3.5rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                            <div style={{ width: 28, height: 1, background: 'var(--color-accent)' }} />
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-accent)', letterSpacing: '3px', textTransform: 'uppercase' }}>{programs.courses.tag}</span>
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2.2rem', color: '#111' }}>{programs.courses.title}</h2>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: '#666', maxWidth: 500, marginTop: '0.5rem' }}>
                            {programs.courses.description}
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {programs.courses.items.map((c: any) => (
                            <div key={c.number} className="card-brand" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
                                <div>
                                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '3rem', color: 'color-mix(in srgb, var(--color-primary), transparent 80%)' }}>{c.number}</span>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: '#111' }}>{c.title}</h3>
                                        <span className="badge badge-green">{c.duration}</span>
                                    </div>
                                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: '#555', lineHeight: 1.8 }}>{c.desc}</p>
                                </div>
                                <div>
                                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-secondary)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>TOPICS COVERED</p>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {c.topics.map((t: string) => (
                                            <li key={t} style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#555', padding: '4px 0 4px 1.25rem', position: 'relative' }}>
                                                <span style={{ position: 'absolute', left: 0, color: 'var(--color-secondary)' }}>▸</span>{t}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Consulting & Advocacy */}
            <section id="consulting" className="section-pad bg-[var(--color-bg)] text-center relative overflow-hidden">
                <div className="absolute top-10 right-10 w-48 h-48 rounded-full border border-[var(--color-primary)]/10 animate-float pointer-events-none" />
                <div className="container-brand relative z-10">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-8 h-px bg-[var(--color-primary)]" />
                        <span className="font-sans text-xs font-semibold text-[var(--color-primary)] tracking-widest uppercase">Advanced Services</span>
                        <div className="w-8 h-px bg-[var(--color-primary)]" />
                    </div>
                    <h2 className="font-serif font-bold text-3xl md:text-4xl text-[#111] mb-12">
                        {programs.consulting.title} & {programs.advocacy.title}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
                        <div className="card-brand hover:-translate-y-2 transition-transform duration-300">
                            <div className="text-4xl mb-4 bg-green-50 w-16 h-16 rounded-full flex items-center justify-center text-green-700 shadow-sm border border-green-100">
                                📑
                            </div>
                            <h3 className="font-serif font-bold text-xl text-[#111] mb-3">{programs.consulting.title}</h3>
                            <p className="font-sans text-sm text-[var(--color-muted)] leading-relaxed mb-4">
                                {programs.consulting.desc}
                            </p>
                            <Link href="/apply?type=consulting" className="font-sans text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider hover:underline">
                                Request Consultation →
                            </Link>
                        </div>

                        <div className="card-brand hover:-translate-y-2 transition-transform duration-300">
                            <div className="text-4xl mb-4 bg-red-50 w-16 h-16 rounded-full flex items-center justify-center text-red-700 shadow-sm border border-red-100">
                                📢
                            </div>
                            <h3 className="font-serif font-bold text-xl text-[#111] mb-3">{programs.advocacy.title}</h3>
                            <p className="font-sans text-sm text-[var(--color-muted)] leading-relaxed mb-4">
                                {programs.advocacy.desc}
                            </p>
                            <Link href="/apply?type=advocacy" className="font-sans text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider hover:underline">
                                Launch Your Campaign →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
