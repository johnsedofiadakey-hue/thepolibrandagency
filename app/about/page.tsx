'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useContext } from 'react';
import { PoliSettingsContext } from '@/components/SettingsProvider';

const timeline = [
    { year: '2018', event: 'Founded with a mission to close the political representation gap for women in West Africa.' },
    { year: '2020', event: 'Launched the Leadership Branding Bootcamp — 80 women trained in the first cohort.' },
    { year: '2022', event: 'Fellowship Program launched. 12 institutional partnerships established across 6 countries.' },
    { year: '2024', event: 'Political Readiness Index developed. Platform expanded to 18 African nations.' },
    { year: '2026', event: 'Digital platform launch. Scaling to 50+ countries.' },
];

export default function AboutPage() {
    const { content } = useContext(PoliSettingsContext) as any;
    const about = content.pages.about;

    return (
        <div className="bg-[var(--color-bg)]">
            <Navbar />

            {/* ─── HERO ─── */}
            <section style={{
                background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
                padding: '160px 0 100px', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 30%, color-mix(in srgb, var(--color-secondary), transparent 90%) 0%, transparent 60%)', pointerEvents: 'none' }} />
                <div className="container-brand relative z-10 text-center animate-fade-up">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-8 h-px bg-[#C9A227]" />
                        <span className="font-sans text-xs font-semibold text-[#C9A227] tracking-widest uppercase">{about.hero.tag}</span>
                        <div className="w-8 h-px bg-[#C9A227]" />
                    </div>
                    <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
                        {about.hero.title}
                    </h1>
                    <p className="font-sans text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
                        {about.hero.description}
                    </p>
                </div>
            </section>

            {/* ─── VISION ─── */}
            <section className="section-pad bg-white">
                <div className="container-brand">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-3 mb-6">
                                <div className="w-8 h-px bg-[var(--color-secondary)]" />
                                <span className="font-sans text-xs font-semibold text-[var(--color-secondary-dark)] tracking-widest uppercase">{about.vision.tag}</span>
                            </div>
                            <h2 className="font-display font-bold text-4xl text-[#111] mb-6">{about.vision.title}</h2>
                            <p className="font-sans text-lg text-[var(--color-muted)] mb-8 leading-relaxed">
                                {about.vision.description}
                            </p>
                            <div className="space-y-6">
                                {about.vision.items.map((item: any, i: number) => (
                                    <div key={i}>
                                        <div className="flex justify-between mb-2">
                                            <span className="font-sans text-sm font-bold text-[#111] uppercase tracking-wider">{item.label}</span>
                                            <span className="font-display font-bold text-[var(--color-primary)]">{item.percentage}</span>
                                        </div>
                                        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-[var(--color-primary)] transition-all duration-1000" style={{ width: item.percentage }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-[var(--color-bg)] rounded-lg overflow-hidden border border-[var(--color-border)] shadow-xl relative z-10">
                                <img src="/vision.jpg" alt="Vision" className="w-full h-full object-cover opacity-80" />
                            </div>
                            <div className="absolute -top-10 -right-10 w-48 h-48 border-2 border-[var(--color-secondary)]/20 rounded-lg animate-float pointer-events-none" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── STRATEGY ─── */}
            <section className="section-pad bg-[var(--color-bg)]">
                <div className="container-brand">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="font-sans text-xs font-semibold text-[var(--color-primary)] tracking-widest uppercase">{about.strategy.tag}</span>
                        </div>
                        <h2 className="font-display font-bold text-4xl text-[#111] mb-4">{about.strategy.title}</h2>
                        <div className="divider-gold divider-gold-center" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {about.strategy.steps.map((step: any, i: number) => (
                            <div key={i} className="card-brand hover:-translate-y-2 transition-transform duration-300 border-t-4 border-[var(--color-primary)]">
                                <span className="font-display font-bold text-3xl text-[var(--color-primary)]/20 mb-4 block">0{i + 1}</span>
                                <h3 className="font-serif font-bold text-lg text-[#111] mb-3">{step.title}</h3>
                                <p className="font-sans text-sm text-[#666] leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── PHILOSOPHY ─── */}
            <section className="section-pad bg-white">
                <div className="container-brand">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="font-sans text-xs font-semibold text-[var(--color-secondary-dark)] tracking-widest uppercase">{about.philosophy.tag}</span>
                        </div>
                        <h2 className="font-display font-bold text-4xl text-[#111] mb-4">{about.philosophy.title}</h2>
                        <div className="divider-gold divider-gold-center" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {about.philosophy.cards.map((card: any, i: number) => (
                            <div key={i} className="card-brand text-center">
                                <div className="w-16 h-16 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                                    {i === 0 ? '◈' : i === 1 ? '◆' : '▣'}
                                </div>
                                <h3 className="font-display font-bold text-xl text-[#111] mb-4">{card.title}</h3>
                                <p className="font-sans text-[var(--color-muted)] leading-relaxed">{card.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── JOURNEY ─── */}
            <section className="section-pad bg-[var(--color-bg)]">
                <div className="container-brand max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-display font-bold text-4xl text-[#111] mb-4">Our Journey</h2>
                        <div className="divider-gold divider-gold-center" />
                    </div>
                    <div className="relative">
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-[var(--color-border)] transform -translate-x-1/2" />

                        {timeline.map((t, i) => (
                            <div key={i} className={`flex flex-col md:flex-row items-center justify-between mb-12 relative ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                <div className="hidden md:block w-5/12" />
                                <div className="z-10 bg-[var(--color-bg)] border-4 border-[var(--color-bg)] shadow-[0_0_0_4px_var(--color-bg)] w-24 h-24 rounded-full flex items-center justify-center relative my-4 md:my-0">
                                    <div className="w-20 h-20 rounded-full border-2 border-[var(--color-primary)] flex items-center justify-center">
                                        <span className="font-display font-bold text-lg text-[var(--color-primary)]">{t.year}</span>
                                    </div>
                                </div>
                                <div className="w-full md:w-5/12">
                                    <div className="card-brand hover:-translate-y-2 transition-transform duration-300">
                                        <p className="font-sans text-base text-[#333] leading-relaxed">{t.event}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section style={{ background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)', padding: '80px 0' }}>
                <div className="container-brand text-center">
                    <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-6">
                        Ready to Build Your Political Power?
                    </h2>
                    <p className="font-sans text-lg text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Join women leaders across Africa who are transforming their political futures through strategic communication and branding.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/apply" className="btn-gold justify-center">Apply for Fellowship →</Link>
                        <Link href="/assessment" className="btn-secondary justify-center">Take the Assessment</Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
