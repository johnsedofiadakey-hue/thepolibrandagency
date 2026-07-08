'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useContext } from 'react';
import { PoliSettingsContext } from '@/components/SettingsProvider';

export default function AboutPage() {
    const { content } = useContext(PoliSettingsContext) as any;
    const about = content.pages.about;
    const timeline = about.timeline || [];

    return (
        <div className="bg-[var(--color-bg)]">
            <Navbar />

            {/* ─── HERO ─── */}
            <section style={{
                background: about.hero.image 
                    ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${about.hero.image})`
                    : 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: 'clamp(100px, 20vw, 160px) 0 clamp(48px, 10vw, 100px)', position: 'relative', overflow: 'hidden',
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

            {/* ─── FOUNDER SPOTLIGHT ─── */}
            {about.founder && (
                <section className="section-pad bg-white">
                    <div className="container-brand max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-3 mb-8 justify-center">
                            <div className="w-8 h-px bg-[var(--color-primary)]" />
                            <span className="font-sans text-xs font-semibold text-[var(--color-primary)] tracking-widest uppercase">{about.founder.tag}</span>
                            <div className="w-8 h-px bg-[var(--color-primary)]" />
                        </div>
                        <div className="w-36 h-36 rounded-full overflow-hidden mx-auto mb-8 border-4 border-[var(--color-secondary)]/20 shadow-xl bg-[var(--color-bg)]">
                            {about.founder.image ? (
                                <img src={about.founder.image} alt={about.founder.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]">
                                    <span className="font-display font-bold text-5xl text-white">
                                        {(about.founder.name || '?').charAt(0)}
                                    </span>
                                </div>
                            )}
                        </div>
                        <h2 className="font-display font-bold text-3xl text-[#111] mb-1">{about.founder.name}</h2>
                        <p className="font-sans text-xs font-semibold text-[var(--color-primary)] uppercase tracking-widest mb-8">{about.founder.title}</p>
                        <div className="max-w-2xl mx-auto text-left space-y-5">
                            {(about.founder.bio || '').split('\n\n').map((para: string, i: number) => (
                                <p key={i} className="font-sans text-base text-[var(--color-muted)] leading-relaxed">{para}</p>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ─── TPA TEAM ─── */}
            {about.team?.members?.length > 0 && (
                <section className="section-pad bg-[var(--color-bg)]">
                    <div className="container-brand">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-3 mb-4 justify-center">
                                <div className="w-8 h-px bg-[var(--color-secondary)]" />
                                <span className="font-sans text-xs font-semibold text-[var(--color-secondary-dark)] tracking-widest uppercase">{about.team.tag}</span>
                                <div className="w-8 h-px bg-[var(--color-secondary)]" />
                            </div>
                            <h2 className="font-display font-bold text-4xl text-[#111] mb-4">{about.team.title}</h2>
                            <div className="divider-gold divider-gold-center" />
                            {about.team.description && (
                                <p className="font-sans text-lg text-[var(--color-muted)] max-w-3xl mx-auto mt-6 leading-relaxed">{about.team.description}</p>
                            )}
                        </div>
                        <div className={`grid grid-cols-1 ${about.team.members.length === 1 ? 'max-w-lg mx-auto' : about.team.members.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-3'} gap-10`}>
                            {about.team.members.map((member: any, i: number) => (
                                <div key={i} className="card-brand text-center hover:-translate-y-2 transition-transform duration-300">
                                    <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-6 border-4 border-[var(--color-secondary)]/20 shadow-lg bg-[var(--color-bg)]">
                                        {member.image ? (
                                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]">
                                                <span className="font-display font-bold text-3xl text-white">
                                                    {(member.name || '?').charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-display font-bold text-xl text-[#111] mb-1">{member.name}</h3>
                                    <p className="font-sans text-xs font-semibold text-[var(--color-primary)] uppercase tracking-widest mb-4">{member.title}</p>
                                    <div className="w-8 h-px bg-[var(--color-secondary)] mx-auto mb-4" />
                                    <p className="font-sans text-sm text-[var(--color-muted)] leading-relaxed">{member.bio}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ─── VISION & MISSION ─── */}
            <section className="section-pad bg-white">
                <div className="container-brand">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div>
                            <div className="inline-flex items-center gap-3 mb-6">
                                <div className="w-8 h-px bg-[var(--color-secondary)]" />
                                <span className="font-sans text-xs font-semibold text-[var(--color-secondary-dark)] tracking-widest uppercase">{about.vision.tag}</span>
                            </div>
                            <h2 className="font-display font-bold text-3xl text-[#111] mb-6">{about.vision.title}</h2>
                            <p className="font-sans text-lg text-[var(--color-muted)] leading-relaxed">
                                {about.vision.description}
                            </p>
                        </div>
                        {about.mission && (
                            <div>
                                <div className="inline-flex items-center gap-3 mb-6">
                                    <div className="w-8 h-px bg-[var(--color-primary)]" />
                                    <span className="font-sans text-xs font-semibold text-[var(--color-primary)] tracking-widest uppercase">{about.mission.tag}</span>
                                </div>
                                <h2 className="font-display font-bold text-3xl text-[#111] mb-6">{about.mission.title}</h2>
                                <p className="font-sans text-lg text-[var(--color-muted)] leading-relaxed">
                                    {about.mission.description}
                                </p>
                            </div>
                        )}
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

                        {timeline.map((t: any, i: number) => (
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
                        {about.cta?.title || "Ready to Build Your Political Power?"}
                    </h2>
                    <p className="font-sans text-lg text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                        {about.cta?.description || "Join women leaders across Africa who are transforming their political futures through strategic communication and branding."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/apply" className="btn-gold justify-center">
                            {(about.cta?.apply && !about.cta.apply.toLowerCase().includes('fellowship')) ? about.cta.apply : "Apply"}
                        </Link>
                        <Link href="/assessment" className="btn-secondary justify-center">
                            {about.cta?.assessment || "Take the Assessment"}
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
