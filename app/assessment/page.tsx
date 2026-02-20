'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';

const categories = [
    {
        id: 'brand_clarity',
        label: 'Brand Clarity',
        weight: 25,
        color: '#1F6F3E',
        questions: [
            {
                id: 'bc1',
                text: 'How clearly can you articulate your core political message in 30 seconds?',
                options: [
                    { text: 'I have a clear, rehearsed message I use consistently', score: 4 },
                    { text: 'I have a general idea but struggle to articulate it succinctly', score: 2 },
                    { text: 'I find it difficult to explain what I stand for concisely', score: 1 },
                    { text: 'I have not yet defined my political message', score: 0 },
                ],
            },
            {
                id: 'bc2',
                text: 'How consistent is your public image across different platforms?',
                options: [
                    { text: 'Highly consistent — same message, tone, and look everywhere', score: 4 },
                    { text: 'Mostly consistent with some variation', score: 2 },
                    { text: 'Inconsistent — different approaches in different contexts', score: 1 },
                    { text: 'I have not thought about image consistency', score: 0 },
                ],
            },
            {
                id: 'bc3',
                text: 'How well does your public image reflect your authentic leadership style?',
                options: [
                    { text: 'My image is a true and strategic reflection of my leadership', score: 4 },
                    { text: 'Reasonably aligned but some gaps exist', score: 2 },
                    { text: 'There is a significant gap between my image and who I really am', score: 1 },
                    { text: 'I have not developed a deliberate image', score: 0 },
                ],
            },
        ],
    },
    {
        id: 'communication',
        label: 'Communication Strength',
        weight: 25,
        color: '#C9A227',
        questions: [
            {
                id: 'cm1',
                text: 'How confident are you in a live television or radio interview?',
                options: [
                    { text: 'Very confident — I handle difficult questions with ease', score: 4 },
                    { text: 'Mostly confident but occasionally struggle under pressure', score: 2 },
                    { text: 'Anxious and reactive in live media environments', score: 1 },
                    { text: 'I have not done significant media appearances', score: 0 },
                ],
            },
            {
                id: 'cm2',
                text: 'How effectively do you use storytelling in your political communication?',
                options: [
                    { text: 'I consistently use compelling personal and constituency stories', score: 4 },
                    { text: 'I use stories sometimes but not consistently', score: 2 },
                    { text: 'I tend to communicate in policy language without many stories', score: 1 },
                    { text: 'I have not used storytelling as a deliberate strategy', score: 0 },
                ],
            },
            {
                id: 'cm3',
                text: 'How prepared are you for debate environments?',
                options: [
                    { text: 'Very prepared — I have researched opponents and practiced counter-arguments', score: 4 },
                    { text: 'Somewhat prepared but not systematically', score: 2 },
                    { text: 'I rely on my knowledge but have not formally prepared', score: 1 },
                    { text: 'Debate preparation has not been a priority', score: 0 },
                ],
            },
        ],
    },
    {
        id: 'visibility',
        label: 'Public Visibility',
        weight: 20,
        color: '#B22222',
        questions: [
            {
                id: 'pv1',
                text: 'How active and strategic is your social media presence?',
                options: [
                    { text: 'Strategic and consistent — regular posts with a clear political voice', score: 4 },
                    { text: 'Active but not particularly strategic', score: 2 },
                    { text: 'Occasional and mostly personal in nature', score: 1 },
                    { text: 'Minimal or no political social media presence', score: 0 },
                ],
            },
            {
                id: 'pv2',
                text: 'How frequently do you appear in media (print, TV, radio, online)?',
                options: [
                    { text: 'Regularly — at least monthly in significant media outlets', score: 4 },
                    { text: 'Occasionally — a few times per year', score: 2 },
                    { text: 'Rarely — mostly local or community coverage', score: 1 },
                    { text: 'I have not had significant media coverage', score: 0 },
                ],
            },
        ],
    },
    {
        id: 'fundraising',
        label: 'Fundraising Readiness',
        weight: 20,
        color: '#1F6F3E',
        questions: [
            {
                id: 'fr1',
                text: 'How developed is your donor network?',
                options: [
                    { text: 'Extensive — I have a cultivated network of committed donors', score: 4 },
                    { text: 'Moderate — some donors but not systematically developed', score: 2 },
                    { text: 'Limited — mostly personal contacts without formal engagement', score: 1 },
                    { text: 'I do not yet have a donor network', score: 0 },
                ],
            },
            {
                id: 'fr2',
                text: 'How clear is your campaign funding narrative?',
                options: [
                    { text: 'Very clear — I can articulate why donors should invest in my campaign', score: 4 },
                    { text: 'Somewhat clear but needs development', score: 2 },
                    { text: 'Vague — I have not formally developed a funding pitch', score: 1 },
                    { text: 'I have not developed a campaign funding narrative', score: 0 },
                ],
            },
        ],
    },
    {
        id: 'infrastructure',
        label: 'Strategic Infrastructure',
        weight: 10,
        color: '#C9A227',
        questions: [
            {
                id: 'si1',
                text: 'How structured is your political team and advisory network?',
                options: [
                    { text: 'Well-structured with clear roles, advisors, and regular meetings', score: 4 },
                    { text: 'Some structure but informal in nature', score: 2 },
                    { text: 'Minimal — mostly managed alone or with one person', score: 1 },
                    { text: 'I do not have a team or advisory network yet', score: 0 },
                ],
            },
        ],
    },
];

export default function AssessmentPage() {
    const router = useRouter();
    const [currentCatIdx, setCurrentCatIdx] = useState(0);
    const [currentQIdx, setCurrentQIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [selected, setSelected] = useState<number | null>(null);
    const [started, setStarted] = useState(false);

    const totalQuestions = categories.reduce((sum, cat) => sum + cat.questions.length, 0);
    const answeredCount = Object.keys(answers).length;
    const progress = (answeredCount / totalQuestions) * 100;

    const currentCat = categories[currentCatIdx];
    const currentQ = currentCat?.questions[currentQIdx];

    const handleNext = () => {
        if (selected === null) return;
        const newAnswers = { ...answers, [currentQ.id]: selected };
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
                // Done — compute and go to results
                const scores: Record<string, number> = {};
                categories.forEach((cat) => {
                    const catAnswers = cat.questions.map((q) => newAnswers[q.id] ?? 0);
                    const avg = catAnswers.reduce((a, b) => a + b, 0) / cat.questions.length;
                    scores[cat.id] = Math.round((avg / 4) * 100);
                });
                const total = Math.round(
                    categories.reduce((sum, cat) => sum + (scores[cat.id] * cat.weight) / 100, 0)
                );
                const params = new URLSearchParams({ total: String(total), ...scores });
                router.push(`/assessment/results?${params.toString()}`);
            }
        }
    };

    if (!started) {
        return (
            <>
                <Navbar />
                <section style={{
                    minHeight: '100vh', background: 'linear-gradient(135deg, #0c3d1e 0%, #1F6F3E 100%)',
                    display: 'flex', alignItems: 'center', padding: '120px 0 80px', position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(201,162,39,0.1) 0%, transparent 60%)', pointerEvents: 'none' }} />
                    <div className="container-brand" style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
                            <div>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
                                    <div style={{ width: 28, height: 1, background: '#C9A227' }} />
                                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, color: '#C9A227', letterSpacing: '3px', textTransform: 'uppercase' }}>Diagnostic Tool</span>
                                </div>
                                <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', lineHeight: 1.2, marginBottom: '1.25rem' }}>
                                    Political Readiness Index
                                </h1>
                                <div style={{ width: 60, height: 2, background: '#C9A227', marginBottom: '1.5rem' }} />
                                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, marginBottom: '2rem' }}>
                                    A structured diagnostic that evaluates your readiness across five critical dimensions of political competition. Receive a personalised score and strategic growth roadmap.
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: '2.5rem' }}>
                                    {[
                                        { icon: '⏱', text: `${totalQuestions} questions · 5–8 minutes` },
                                        { icon: '📊', text: '5 scored categories tracked' },
                                        { icon: '🎯', text: 'Personalised program recommendations' },
                                    ].map((item) => (
                                        <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)' }}>
                                            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>{item.text}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => setStarted(true)} className="btn-gold" style={{ fontSize: '0.9rem', padding: '16px 36px' }}>
                                    Begin Assessment →
                                </button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {categories.map((cat) => (
                                    <div key={cat.id} style={{
                                        background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)',
                                        border: '1px solid rgba(255,255,255,0.12)', borderRadius: 4, padding: '1.25rem',
                                    }}>
                                        <div style={{ width: 36, height: 4, background: cat.color === '#1F6F3E' ? '#C9A227' : cat.color, borderRadius: 2, marginBottom: '0.75rem' }} />
                                        <div style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.6rem', color: '#fff', marginBottom: 4 }}>{cat.weight}%</div>
                                        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.5px' }}>{cat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <section style={{
                minHeight: '100vh', background: 'var(--color-bg)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '120px 24px 80px',
            }}>
                <div style={{ width: '100%', maxWidth: 720 }}>
                    {/* Progress */}
                    <div style={{ marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#888', fontWeight: 500 }}>
                                Question {answeredCount + 1} of {totalQuestions}
                            </span>
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#888', fontWeight: 500 }}>
                                {Math.round(progress)}% Complete
                            </span>
                        </div>
                        <div style={{ height: 6, background: '#e5e0d6', borderRadius: 3 }}>
                            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #1F6F3E, #C9A227)', borderRadius: 3, transition: 'width 0.4s ease' }} />
                        </div>
                        {/* Category tabs */}
                        <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                            {categories.map((cat, i) => (
                                <div key={cat.id} style={{
                                    flex: 1, height: 4, borderRadius: 2,
                                    background: i < currentCatIdx ? '#1F6F3E' : i === currentCatIdx ? '#C9A227' : '#e5e0d6',
                                    transition: 'background 0.3s',
                                }} title={cat.label} />
                            ))}
                        </div>
                    </div>

                    {/* Category Badge */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <span className="badge badge-green" style={{ background: `${currentCat.color}15`, color: currentCat.color, border: `1px solid ${currentCat.color}30` }}>
                            {currentCat.label} · {currentCat.weight}% Weight
                        </span>
                    </div>

                    {/* Question Card */}
                    <div style={{
                        background: '#fff', border: '1px solid var(--color-border)', borderRadius: 4,
                        padding: '3rem', boxShadow: 'var(--shadow-card)', marginBottom: '1.5rem',
                    }}>
                        <h2 style={{
                            fontFamily: 'Playfair Display, serif', fontWeight: 700,
                            fontSize: '1.35rem', color: '#111', lineHeight: 1.5, marginBottom: '2rem',
                        }}>
                            {currentQ.text}
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {currentQ.options.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelected(opt.score)}
                                    style={{
                                        textAlign: 'left', padding: '1rem 1.25rem', borderRadius: 4, cursor: 'pointer',
                                        border: `2px solid ${selected === opt.score ? currentCat.color : '#e5e0d6'}`,
                                        background: selected === opt.score ? `${currentCat.color}0d` : '#fff',
                                        transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 12,
                                    }}
                                >
                                    <div style={{
                                        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                                        border: `2px solid ${selected === opt.score ? currentCat.color : '#ccc'}`,
                                        background: selected === opt.score ? currentCat.color : 'transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.2s',
                                    }}>
                                        {selected === opt.score && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                                    </div>
                                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: selected === opt.score ? currentCat.color : '#333', fontWeight: selected === opt.score ? 600 : 400 }}>
                                        {opt.text}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            onClick={handleNext}
                            disabled={selected === null}
                            className="btn-primary"
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
