'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import IconGlyph from '@/components/IconGlyph';
import Link from 'next/link';
import { useContext } from 'react';
import { PoliSettingsContext } from '@/components/SettingsProvider';

export default function InstitutionalClientsPage() {
    const { content } = useContext(PoliSettingsContext) as any;
    const institutional = content.pages.institutional;

    return (
        <div className="bg-[var(--color-bg)] min-h-screen">
            <Navbar />

            {/* ─── HERO ─── */}
            <section className="relative pt-40 pb-24 overflow-hidden" style={{ 
                background: institutional.hero.image 
                    ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${institutional.hero.image})`
                    : 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 80%, color-mix(in srgb, var(--color-secondary), transparent 88%) 0%, transparent 50%)', pointerEvents: 'none' }} />

                <div className="container-brand relative z-10 text-center animate-fade-up">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-8 h-px bg-[var(--color-secondary)]" />
                        <span className="font-sans text-xs font-semibold text-[var(--color-secondary)] tracking-widest uppercase">{institutional.hero.tag}</span>
                        <div className="w-8 h-px bg-[var(--color-secondary)]" />
                    </div>
                    <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6 max-w-4xl mx-auto">
                        {institutional.hero.title}
                    </h1>
                    <p className="font-sans text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                        {institutional.hero.description}
                    </p>
                </div>
            </section>

            {/* ─── INSTITUTIONAL PARTNERS ─── */}
            {institutional.partners && institutional.partners.length > 0 && (
                <section className="py-12 bg-white border-b border-[var(--color-border)]">
                    <div className="container-brand">
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 hover:opacity-100 transition-opacity duration-500">
                            {institutional.partners.map((partner: any, i: number) => (
                                <div key={i} className="grayscale hover:grayscale-0 transition-all duration-300">
                                    {partner.logo ? (
                                        <img src={partner.logo} alt={partner.name} className="h-10 md:h-12 w-auto object-contain" />
                                    ) : (
                                        <span className="font-serif font-bold text-xl text-[var(--color-primary)]">{partner.name}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ─── PARTNERSHIP MODELS ─── */}
            <section className="section-pad">
                <div className="container-brand">
                    <div className="text-center mb-16 animate-fade-up-delay-1">
                        <h2 className="font-serif font-bold text-3xl md:text-4xl text-[var(--color-text)] mb-4">Our Partnership Models</h2>
                        <div className="divider-gold divider-gold-center" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 animate-fade-up-delay-2">
                        {institutional.models.map((client: any, idx: number) => (
                            <div key={idx} className="card-brand flex flex-col hover:-translate-y-2 transition-transform duration-300">
                                <div className="text-4xl mb-6 bg-[var(--color-bg)] w-16 h-16 rounded-full flex items-center justify-center border border-[var(--color-border)] shadow-sm">
                                    <IconGlyph icon={client.icon} size={32} />
                                </div>
                                <h3 className="font-serif font-bold text-2xl text-[var(--color-text)] mb-3">{client.title}</h3>
                                <p className="font-sans text-base text-[var(--color-muted)] leading-relaxed mb-6 flex-grow">
                                    {client.desc}
                                </p>
                                <div className="bg-[var(--color-bg)] rounded-lg p-5 border border-[var(--color-border)] mt-auto">
                                    <h4 className="font-sans text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-3">Key Capabilities</h4>
                                    <ul className="space-y-2">
                                        {client.features.map((feature: string, fIdx: number) => (
                                            <li key={fIdx} className="flex items-start gap-3">
                                                <span className="text-[var(--color-secondary)] text-lg mt-0.5">▸</span>
                                                <span className="font-sans text-sm text-[var(--color-text)] font-medium">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section className="section-pad bg-white border-t border-[var(--color-border)] text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-secondary)]/10 rounded-full blur-3xl" />

                <div className="container-brand relative z-10">
                    <h2 className="font-serif font-bold text-3xl md:text-4xl text-[var(--color-text)] mb-6">
                        {institutional.cta?.title || "Ready to Discuss a Partnership?"}
                    </h2>
                    <p className="font-sans text-lg text-[var(--color-muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
                        {institutional.cta?.description || "Submit a partnership proposal request and our strategy team will reach out to align on deployment goals."}
                    </p>
                    <Link href="/apply?program=Institutional%20Partnership%20Proposal" className="btn-primary">
                        {institutional.cta?.button || "Request a Proposal"}
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
