'use client';
import { useState, useContext } from 'react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { PoliSettingsContext } from '@/components/SettingsProvider';

interface Category {
    id: string;
    label: string;
    weight: number;
    color: string;
    questions: Question[];
}

interface Question {
    id: string;
    text: string;
    options: Option[];
}

interface Option {
    text: string;
    score: number;
}

export default function AssessmentPage() {
    const { content } = useContext(PoliSettingsContext) as any;
    const assessment = content.pages.assessment;
    const categories: Category[] = assessment.categories;
    const router = useRouter();
    const [currentCatIdx, setCurrentCatIdx] = useState(0);
    const [currentQIdx, setCurrentQIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [selected, setSelected] = useState<number | null>(null);
    const [started, setStarted] = useState(false);

    const totalQuestions = categories.reduce((sum: number, cat: Category) => sum + cat.questions.length, 0);
    const answeredCount = Object.keys(answers).length;
    const progress = (answeredCount / totalQuestions) * 100;

    const currentCat = categories[currentCatIdx];
    const currentQ = currentCat?.questions[currentQIdx];

    const handleNext = () => {
        if (selected === null || !currentQ) return;
        const newAnswers: Record<string, number> = { ...answers, [currentQ.id]: selected };
        setAnswers(newAnswers);
        setSelected(null);

        const nextQIdx = currentQIdx + 1;
        if (nextQIdx < currentCat.questions.length) {
            setCurrentQIdx(nextQIdx);
        } else {
            const nextCatIdx = currentCatIdx + 1;
            if (nextCatIdx < categories.length) {
                setCurrentCatIdx(nextCatIdx);
                setCurrentQIdx(0);
            } else {
                const scores: Record<string, number> = {};
                categories.forEach((cat: Category) => {
                    const catAnswers = cat.questions.map((q: Question) => newAnswers[q.id] ?? 0);
                    const totalPossible = cat.questions.reduce((sum, q) => {
                        const maxOptionScore = Math.max(...q.options.map((o: Option) => o.score));
                        return sum + maxOptionScore;
                    }, 0);
                    const totalScored = catAnswers.reduce((a: number, b: number) => a + b, 0);
                    scores[cat.id] = totalPossible > 0 ? Math.round((totalScored / totalPossible) * 100) : 0;
                });
                const total = Math.round(
                    categories.reduce((sum: number, cat: Category) => sum + (scores[cat.id] * cat.weight) / 100, 0)
                );
                const params = new URLSearchParams({ total: String(total), ...Object.fromEntries(Object.entries(scores).map(([k, v]: [string, number]) => [k, String(v)])) });
                router.push(`/assessment/results?${params.toString()}`);
            }
        }
    };

    /* ─── INTRO SCREEN ─── */
    if (!started) {
        return (
            <>
                <Navbar />
                <section
                    className="min-h-screen flex items-center pt-24 pb-16 md:pt-32 md:pb-20 relative overflow-hidden"
                    style={{
                        background: assessment.hero.image
                            ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${assessment.hero.image})`
                            : 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 30%, color-mix(in srgb, var(--color-secondary), transparent 90%) 0%, transparent 60%)', pointerEvents: 'none' }} />

                    <div className="container-brand relative z-10 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">

                            {/* Left: text */}
                            <div>
                                <div className="inline-flex items-center gap-2.5 mb-6">
                                    <div style={{ width: 28, height: 1, background: 'var(--color-secondary)' }} />
                                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-secondary)', letterSpacing: '3px', textTransform: 'uppercase' }}>{assessment.hero.tag}</span>
                                </div>
                                <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-5">
                                    {assessment.hero.title}
                                </h1>
                                <div style={{ width: 60, height: 2, background: 'var(--color-secondary)', marginBottom: '1.5rem' }} />
                                <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, marginBottom: '2rem' }}>
                                    {assessment.hero.description}
                                </p>
                                <div className="flex flex-col gap-3 mb-8">
                                    {assessment.hero.details.map((item: any) => (
                                        <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)' }}>
                                            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>{item.text}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => setStarted(true)} className="btn-gold w-full sm:w-auto" style={{ fontSize: '0.9rem', padding: '16px 36px' }}>
                                    Begin Assessment →
                                </button>
                            </div>

                            {/* Right: category stat cards */}
                            <div className="grid grid-cols-2 gap-3 mt-2 md:mt-0">
                                {categories.map((cat: Category) => (
                                    <div key={cat.id} style={{
                                        background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)',
                                        border: '1px solid rgba(255,255,255,0.12)', borderRadius: 4, padding: '1rem',
                                    }}>
                                        <div style={{ width: 36, height: 4, background: cat.color === '#1F6F3E' ? 'var(--color-secondary)' : cat.color, borderRadius: 2, marginBottom: '0.75rem' }} />
                                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', color: '#fff', marginBottom: 4 }}>{cat.weight}%</div>
                                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.5px' }}>{cat.label}</div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </section>
            </>
        );
    }

    /* ─── QUESTION SCREEN ─── */
    return (
        <>
            <Navbar />
            <section className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center pt-24 pb-16 px-4 md:pt-32 md:pb-20">
                <div className="w-full" style={{ maxWidth: 720 }}>

                    {/* Progress */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: '#888', fontWeight: 500 }}>
                                Question {answeredCount + 1} of {totalQuestions}
                            </span>
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: '#888', fontWeight: 500 }}>
                                {Math.round(progress)}% Complete
                            </span>
                        </div>
                        <div style={{ height: 6, background: '#e5e0d6', borderRadius: 3 }}>
                            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))', borderRadius: 3, transition: 'width 0.4s ease' }} />
                        </div>
                        {/* Category segment tabs */}
                        <div className="flex gap-1.5 mt-3">
                            {categories.map((cat: Category, i: number) => (
                                <div key={cat.id} style={{
                                    flex: 1, height: 4, borderRadius: 2,
                                    background: i < currentCatIdx ? 'var(--color-primary)' : i === currentCatIdx ? 'var(--color-secondary)' : '#e5e0d6',
                                    transition: 'background 0.3s',
                                }} title={cat.label} />
                            ))}
                        </div>
                    </div>

                    {/* Category Badge */}
                    <div className="mb-5">
                        <span className="badge badge-green inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: `${currentCat.color}15`, color: currentCat.color, border: `1px solid ${currentCat.color}30` }}>
                            {currentCat.label}
                            <span className="opacity-50">·</span>
                            <span>{currentCat.weight}% Weight</span>
                        </span>
                    </div>

                    {/* Question Card */}
                    <div className="bg-white border border-[var(--color-border)] rounded-md p-5 sm:p-8 md:p-12 shadow-[var(--shadow-card)] mb-5">
                        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1rem, 3vw, 1.35rem)', color: '#111', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                            {currentQ.text}
                        </h2>
                        <div className="flex flex-col gap-3">
                            {currentQ.options.map((opt: Option, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setSelected(opt.score)}
                                    className="text-left rounded-md transition-all duration-200"
                                    style={{
                                        padding: '0.875rem 1.1rem',
                                        cursor: 'pointer',
                                        border: `2px solid ${selected === opt.score ? currentCat.color : '#e5e0d6'}`,
                                        background: selected === opt.score ? `${currentCat.color}0d` : '#fff',
                                        display: 'flex', alignItems: 'flex-start', gap: 12,
                                    }}
                                >
                                    <div style={{
                                        width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                                        border: `2px solid ${selected === opt.score ? currentCat.color : '#ccc'}`,
                                        background: selected === opt.score ? currentCat.color : 'transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.2s',
                                    }}>
                                        {selected === opt.score && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                                    </div>
                                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: selected === opt.score ? currentCat.color : '#333', fontWeight: selected === opt.score ? 600 : 400, lineHeight: 1.5 }}>
                                        {opt.text}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Next button — full-width on mobile */}
                    <div className="flex justify-stretch sm:justify-end">
                        <button
                            onClick={handleNext}
                            disabled={selected === null}
                            className="btn-primary w-full sm:w-auto justify-center"
                            style={{ opacity: selected === null ? 0.5 : 1, cursor: selected === null ? 'not-allowed' : 'pointer' }}
                        >
                            {answeredCount + 1 === totalQuestions ? 'View My Results →' : 'Next Question →'}
                        </button>
                    </div>

                </div>
            </section>
        </>
    );
}
