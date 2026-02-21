import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const bootcampModules = [
    'Political identity and brand architecture',
    'Message clarity and narrative discipline',
    'Media readiness and interview strategy',
    'Digital communications and content positioning',
    'Strategic visibility and public presence',
    'Campaign communication foundations',
];

const fellowshipIncludes = [
    { icon: '🧠', title: 'Strategy Labs', desc: 'Monthly workshops on political strategy, branding, and governance communication.' },
    { icon: '🎙️', title: 'Media Workshops', desc: 'Hands-on training in TV, radio, and digital media performance.' },
    { icon: '👥', title: 'Mentorship', desc: '1:1 mentorship with experienced political communicators and leaders.' },
    { icon: '📊', title: 'Readiness Scoring', desc: 'Quarterly political readiness assessments with personalized growth plans.' },
    { icon: '🎓', title: 'Capstone Project', desc: 'A real campaign communication plan presented to a panel of political experts.' },
];

const courses = [
    {
        number: '01',
        title: 'Building Political Voice',
        duration: '4 weeks',
        desc: 'Develop a clear, consistent political voice grounded in your values, constituency, and strategic positioning.',
        topics: ['Voice architecture', 'Signature phrases', 'Message testing', 'Public persona design'],
    },
    {
        number: '02',
        title: 'Campaign Messaging Foundations',
        duration: '6 weeks',
        desc: 'Master the art and science of campaign messaging — from voter targeting to crisis communication.',
        topics: ['Voter segmentation', 'Message matrix', 'Ground game communications', 'Digital advertising copy'],
    },
    {
        number: '03',
        title: 'Women & Narrative Power',
        duration: '5 weeks',
        desc: 'Understand how gender intersects with political narrative and how to turn that dynamic into strategic advantage.',
        topics: ['Narrative framing theory', 'Gender and political power', 'Reframing opposition', 'Media representation strategy'],
    },
];

export default function ProgramsPage() {
    return (
        <>
            <Navbar />

            {/* Hero */}
            <section style={{
                background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
                padding: '160px 0 80px', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 30%, color-mix(in srgb, var(--color-secondary), transparent 90%) 0%, transparent 60%)', pointerEvents: 'none' }} />
                <div className="container-brand" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
                        <div style={{ width: 28, height: 1, background: 'var(--color-secondary)' }} />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-secondary)', letterSpacing: '3px', textTransform: 'uppercase' }}>Learning & Growth</span>
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', color: '#fff', lineHeight: 1.2, marginBottom: '1.5rem' }}>
                        Elite Programs for<br />Political Advancement.
                    </h1>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.8, maxWidth: 580 }}>
                        From intensive bootcamps and flagship fellowships to digital courses and advanced policy communication consulting — our programs are outcome-driven and strategically measurable.
                    </p>
                </div>
            </section>

            {/* Leadership Branding Bootcamp */}
            <section id="bootcamp" className="section-pad" style={{ background: '#fff' }}>
                <div className="container-brand">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }}>
                        <div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                                <span className="badge badge-green">6 Weeks · Hybrid</span>
                            </div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                                <div style={{ width: 28, height: 1, background: 'var(--color-primary)' }} />
                                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '3px', textTransform: 'uppercase' }}>Flagship Program</span>
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2.2rem', color: '#111', marginBottom: '0.5rem' }}>Leadership Branding Bootcamp</h2>
                            <div className="divider-gold" />
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: '#555', lineHeight: 1.9, marginBottom: '1.5rem' }}>
                                An intensive 6-week hybrid program designed to build every structural element of your political brand — from identity architecture to campaign-ready communication.
                            </p>
                            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-primary)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>PROGRAM MODULES</p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {bootcampModules.map((m, i) => (
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
                                {[
                                    { label: 'Personal Brand Framework', icon: '◈' },
                                    { label: 'Media Readiness Profile', icon: '◉' },
                                    { label: 'Strategic Positioning Map', icon: '◆' },
                                    { label: 'Campaign Communication Playbook', icon: '◇' },
                                ].map((o) => (
                                    <div key={o.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, padding: '12px', background: '#fff', borderRadius: 4, border: '1px solid var(--color-border)' }}>
                                        <span style={{ color: 'var(--color-secondary)', fontSize: '1rem' }}>{o.icon}</span>
                                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', fontWeight: 500, color: '#333' }}>{o.label}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ background: 'var(--color-primary)', borderRadius: 4, padding: '2rem', color: '#fff' }}>
                                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', marginBottom: '0.75rem' }}>Next Cohort</h4>
                                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', marginBottom: '1rem' }}>Applications for the March 2026 cohort are open. Limited to 25 participants.</p>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <span className="badge" style={{ background: 'color-mix(in srgb, var(--color-secondary), transparent 80%)', color: 'var(--color-secondary)', border: '1px solid color-mix(in srgb, var(--color-secondary), transparent 70%)' }}>March 2026</span>
                                    <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>25 Spots</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fellowship Program */}
            <section id="fellowship" className="section-pad" style={{ background: 'var(--color-bg)' }}>
                <div className="container-brand">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <span className="badge badge-gold" style={{ marginBottom: '1rem', display: 'inline-block' }}>3–6 Months · Selective Enrollment</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem', justifyContent: 'center' }}>
                            <div style={{ width: 28, height: 1, background: 'var(--color-secondary)' }} />
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-secondary)', letterSpacing: '3px', textTransform: 'uppercase' }}>Flagship Initiative</span>
                            <div style={{ width: 28, height: 1, background: 'var(--color-secondary)' }} />
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2.4rem', color: '#111', marginBottom: '1rem' }}>The Polibrand Fellowship</h2>
                        <div className="divider-gold divider-gold-center" />
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: '#555', maxWidth: 620, margin: '0 auto' }}>
                            An immersive 3–6 month program for high-potential women leaders ready to build comprehensive political readiness and a competitive campaign infrastructure.
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                        {fellowshipIncludes.map((f, i) => (
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

            {/* Digital Courses */}
            <section id="courses" className="section-pad" style={{ background: '#fff' }}>
                <div className="container-brand">
                    <div style={{ marginBottom: '3.5rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                            <div style={{ width: 28, height: 1, background: 'var(--color-accent)' }} />
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-accent)', letterSpacing: '3px', textTransform: 'uppercase' }}>Self-Paced</span>
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2.2rem', color: '#111' }}>Digital Courses</h2>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: '#666', maxWidth: 500, marginTop: '0.5rem' }}>
                            Self-paced learning modules for women who want to build political communication skills on their own timeline.
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {courses.map((c) => (
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
                                        {c.topics.map((t) => (
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
                        Policy Communication Consulting & Advocacy
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
                        <div className="card-brand hover:-translate-y-2 transition-transform duration-300">
                            <div className="text-4xl mb-4 bg-green-50 w-16 h-16 rounded-full flex items-center justify-center text-green-700 shadow-sm border border-green-100">
                                📑
                            </div>
                            <h3 className="font-serif font-bold text-xl text-[#111] mb-3">Policy Communication Consulting</h3>
                            <p className="font-sans text-sm text-[var(--color-muted)] leading-relaxed mb-4">
                                Strategic translation of complex policy into compelling public narrative. We help legislators, executives, and organizations articulate their policy objectives in ways that resonate with voters, stakeholders, and the media.
                            </p>
                            <Link href="/apply?type=consulting" className="font-sans text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider hover:underline">
                                Request Consultation →
                            </Link>
                        </div>

                        <div className="card-brand hover:-translate-y-2 transition-transform duration-300">
                            <div className="text-4xl mb-4 bg-red-50 w-16 h-16 rounded-full flex items-center justify-center text-red-700 shadow-sm border border-red-100">
                                📢
                            </div>
                            <h3 className="font-serif font-bold text-xl text-[#111] mb-3">Strategic Advocacy Campaigns</h3>
                            <p className="font-sans text-sm text-[var(--color-muted)] leading-relaxed mb-4">
                                End-to-end architecture for gender equity, legislative, or democratic advocacy campaigns. We combine grassroots mobilization strategy with high-level media architecture to drive undeniable public impact.
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
