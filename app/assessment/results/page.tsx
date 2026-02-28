'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useContext } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { PoliSettingsContext } from '@/components/SettingsProvider';

interface CategoryScore {
    id: string;
    label: string;
    weight: number;
    color: string;
    score: number;
}

interface Tier {
    max: number;
    label: string;
    color: string;
    bg: string;
    advice: string;
    program: string;
}

function ResultsContent() {
    const { content } = useContext(PoliSettingsContext) as any;
    const assessmentResults = content.pages.assessment_results;
    const categories = assessmentResults.categories;
    const tiers: Tier[] = assessmentResults.tiers;

    const params = useSearchParams();
    const total = parseInt(params.get('total') ?? '0', 10);

    const tier = tiers.find((t: Tier) => total <= t.max) || tiers[tiers.length - 1];
    const program = tier.program;

    const catScores: CategoryScore[] = categories.map((cat: any) => ({
        ...cat,
        score: parseInt(params.get(cat.id) ?? '0', 10),
    }));

    const circumference = 2 * Math.PI * 72;
    const dashOffset = circumference - (total / 100) * circumference;

    return (
        <>
            <Navbar />
            <section style={{ background: 'var(--color-bg)', padding: '120px 0 80px', minHeight: '100vh' }}>
                <div className="container-brand" style={{ maxWidth: 900 }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                            <div style={{ width: 28, height: 1, background: '#C9A227' }} />
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, color: '#C9A227', letterSpacing: '3px', textTransform: 'uppercase' }}>Your Results</span>
                            <div style={{ width: 28, height: 1, background: '#C9A227' }} />
                        </div>
                        <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '2.4rem', color: '#111', marginBottom: '0.5rem' }}>
                            Political Readiness Index Results
                        </h1>
                        <div className="divider-gold divider-gold-center" />
                    </div>

                    {/* Score + Tier */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginBottom: '2.5rem' }}>
                        {/* Donut Score */}
                        <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 4, padding: '3rem', textAlign: 'center', boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="180" height="180" viewBox="0 0 180 180" style={{ marginBottom: '1.5rem' }}>
                                <circle cx="90" cy="90" r="72" fill="none" stroke="#f0ebe2" strokeWidth="12" />
                                <circle
                                    cx="90" cy="90" r="72" fill="none"
                                    stroke="url(#grad)" strokeWidth="12"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={dashOffset}
                                    transform="rotate(-90 90 90)"
                                    style={{ transition: 'stroke-dashoffset 1.5s ease' }}
                                />
                                <defs>
                                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#1F6F3E" />
                                        <stop offset="100%" stopColor="#C9A227" />
                                    </linearGradient>
                                </defs>
                                <text x="90" y="81" textAnchor="middle" fontFamily="Cinzel, serif" fontWeight="700" fontSize="36" fill="#111">{total}</text>
                                <text x="90" y="106" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="12" fill="#888">out of 100</text>
                            </svg>
                            <div style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.1rem', color: tier.color }}>{tier.label}</div>
                        </div>

                        {/* Tier Info */}
                        <div style={{ background: tier.bg, border: `2px solid ${tier.color}30`, borderRadius: 4, padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.2rem', color: tier.color, marginBottom: '0.5rem' }}>{tier.label}</h3>
                                <div style={{ width: 40, height: 2, background: tier.color, marginBottom: '1rem' }} />
                                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#333', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                                    {tier.advice}
                                </p>
                                <div style={{ background: '#fff', border: '1px solid #e5e0d6', borderRadius: 4, padding: '1rem' }}>
                                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 700, color: '#888', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 6 }}>Recommended Program</p>
                                    <p style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1rem', color: '#111' }}>{program}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category Breakdown */}
                    <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 4, padding: '2.5rem', marginBottom: '2rem', boxShadow: 'var(--shadow-card)' }}>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.15rem', color: '#111', marginBottom: '2rem' }}>Category Breakdown</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {catScores.map((cat: CategoryScore) => (
                                <div key={cat.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                                        <div>
                                            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#111' }}>{cat.label}</span>
                                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#888', marginLeft: 8 }}>({cat.weight}% weight)</span>
                                        </div>
                                        <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1rem', color: cat.color }}>{cat.score}/100</span>
                                    </div>
                                    <div style={{ height: 8, background: '#f0ebe2', borderRadius: 4 }}>
                                        <div style={{
                                            height: '100%', width: `${cat.score}%`, background: `linear-gradient(90deg, ${cat.color}, ${cat.color}bb)`,
                                            borderRadius: 4, transition: 'width 1.2s ease',
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTAs */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{ background: '#1F6F3E', borderRadius: 4, padding: '2rem', color: '#fff' }}>
                            <h3 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem' }}>Enroll in a Program</h3>
                            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.78)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                                Based on your readiness score, we recommend: <strong style={{ color: '#C9A227' }}>{program}</strong>
                            </p>
                            <Link href="/apply" className="btn-gold" style={{ fontSize: '0.8rem', padding: '12px 22px' }}>
                                Apply Now →
                            </Link>
                        </div>
                        <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 4, padding: '2rem' }}>
                            <h3 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.1rem', color: '#111', marginBottom: '0.75rem' }}>Consult a Strategist</h3>
                            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#666', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                                Speak directly with a Polibrand political communication strategist to discuss your results and create a tailored roadmap.
                            </p>
                            <Link href="#" className="btn-outline-dark" style={{ fontSize: '0.8rem', padding: '12px 22px' }}>
                                Book Consultation
                            </Link>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <Link href="/assessment" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#888', textDecoration: 'underline' }}>
                            Retake Assessment
                        </Link>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default function ResultsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResultsContent />
        </Suspense>
    );
}
