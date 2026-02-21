import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const pillars = [
    {
        icon: '◉',
        title: 'Research-Driven',
        desc: 'Every strategy is grounded in political science, communication theory, and real electoral data.',
        color: 'var(--color-primary)',
    },
    {
        icon: '◈',
        title: 'Institutionally Aligned',
        desc: 'We work within democratic systems and align with governance frameworks, not against them.',
        color: 'var(--color-secondary)',
    },
    {
        icon: '◆',
        title: 'Outcome-Oriented',
        desc: 'Our programs measure success in real-world leadership advancement, not participation alone.',
        color: 'var(--color-accent)',
    },
    {
        icon: '◇',
        title: 'Strategically Measurable',
        desc: 'Every program delivers scored, trackable, evidence-based growth benchmarks.',
        color: 'var(--color-primary)',
    },
];

const timeline = [
    { year: '2018', event: 'Founded with a mission to close the political representation gap for women in West Africa.' },
    { year: '2020', event: 'Launched the Leadership Branding Bootcamp — 80 women trained in the first cohort.' },
    { year: '2022', event: 'Fellowship Program launched. 12 institutional partnerships established across 6 countries.' },
    { year: '2024', event: 'Political Readiness Index developed. Platform expanded to 18 African nations.' },
    { year: '2026', event: 'Digital platform launch. Scaling to 50+ countries.' },
];

export default function AboutPage() {
    return (
        <div className="bg-[var(--color-bg)]">
            <Navbar />

            {/* Hero */}
            <section style={{
                background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
                padding: '160px 0 100px', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 30%, color-mix(in srgb, var(--color-secondary), transparent 90%) 0%, transparent 60%)', pointerEvents: 'none' }} />
                <div className="container-brand relative z-10 text-center animate-fade-up">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-8 h-px bg-[#C9A227]" />
                        <span className="font-sans text-xs font-semibold text-[#C9A227] tracking-widest uppercase">About Us</span>
                        <div className="w-8 h-px bg-[#C9A227]" />
                    </div>
                    <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
                        Redefining Political Leadership Through Strategic Communication.
                    </h1>
                    <p className="font-sans text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
                        Democracy thrives when leadership reflects society. Polibrand combines political strategy, communication architecture, and leadership development to close the representation gap.
                    </p>
                </div>
            </section>

            {/* Mission and Vision Grid */}
            <section className="section-pad bg-[var(--color-bg)] relative overflow-hidden">
                {/* Decorative floating shapes */}
                <div className="absolute top-10 left-10 w-32 h-32 rounded-full border border-[var(--color-primary)]/10 animate-float-slow pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full border border-[var(--color-secondary)]/20 animate-float pointer-events-none" />

                <div className="container-brand relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-stretch">
                        {/* MISSION Card */}
                        <div className="card-brand flex flex-col justify-center">
                            <div className="inline-flex items-center gap-3 mb-6">
                                <div className="w-8 h-px bg-[var(--color-primary)]" />
                                <span className="font-sans text-xs font-semibold text-[var(--color-primary)] tracking-widest uppercase">Our Mission</span>
                            </div>
                            <h2 className="font-display font-bold text-3xl text-[#111] mb-4">
                                Strategic Infrastructure for Women Leaders
                            </h2>
                            <div className="divider-gold" />
                            <div className="prose-brand">
                                <p>
                                    Across Africa, women who aspire to political leadership face not a lack of capability or vision — but a systemic absence of the strategic infrastructure that enables men to compete effectively.
                                </p>
                                <p>
                                    <strong>Our mission is to permanently change this equation.</strong> We equip women with narrative architecture, media discipline, voter targeting, fundraising strategy, and crisis communication — tools that established networks rarely share.
                                </p>
                            </div>
                        </div>

                        {/* VISION Card */}
                        <div className="card-brand flex flex-col justify-center">
                            <div className="inline-flex items-center gap-3 mb-6">
                                <div className="w-8 h-px bg-[var(--color-secondary)]" />
                                <span className="font-sans text-xs font-semibold text-[var(--color-secondary-dark)] tracking-widest uppercase">Our Vision</span>
                            </div>
                            <h2 className="font-display font-bold text-3xl text-[#111] mb-4">
                                Equal Representation in Policy & Power
                            </h2>
                            <div className="divider-gold" />
                            <div className="prose-brand">
                                <p>
                                    We envision an Africa where political leadership undeniably reflects the society it governs. A landscape where women hold 50% of legislative seats, executive positions, and pivotal roles within political parties.
                                </p>
                                <p>
                                    <strong>Polibrand stands as a strategy-driven institution</strong> to realize this vision. We are a campaign communication architecture firm and democracy capacity-building platform operating at the apex of political science and gender equity.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Four Pillars */}
            <section className="section-pad bg-[var(--color-bg)]">
                <div className="container-brand">
                    <div className="text-center mb-16 animate-fade-up">
                        <h2 className="font-display font-bold text-4xl text-[#111] mb-4">Our Approach</h2>
                        <div className="divider-gold divider-gold-center" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {pillars.map((p, i) => (
                            <div key={i} className="card-brand text-center hover:scale-105 transition-transform duration-300">
                                <div style={{
                                    width: 68, height: 68, borderRadius: '9999px', margin: '0 auto 1.25rem',
                                    background: `${p.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: `2px solid ${p.color}30`, fontSize: '1.6rem', color: p.color,
                                }}>
                                    {p.icon}
                                </div>
                                <h3 className="font-serif font-bold text-lg text-[#111] mb-3">{p.title}</h3>
                                <p className="font-sans text-sm text-[#666] leading-relaxed">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="section-pad bg-[var(--color-bg)]">
                <div className="container-brand max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-display font-bold text-4xl text-[#111] mb-4">Our Journey</h2>
                        <div className="divider-gold divider-gold-center" />
                    </div>
                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-[var(--color-border)] transform -translate-x-1/2" />

                        {timeline.map((t, i) => (
                            <div key={i} className={`flex flex-col md:flex-row items-center justify-between mb-12 relative ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                <div className="hidden md:block w-5/12" />

                                {/* Timeline Node */}
                                <div className="z-10 bg-[var(--color-bg)] border-4 border-[var(--color-bg)] shadow-[0_0_0_4px_var(--color-bg)] w-24 h-24 rounded-full flex items-center justify-center relative my-4 md:my-0">
                                    <div className="w-20 h-20 rounded-full border-2 border-[var(--color-primary)] flex items-center justify-center">
                                        <span className="font-display font-bold text-lg text-[var(--color-primary)]">{t.year}</span>
                                    </div>
                                </div>

                                {/* Timeline Content */}
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

            {/* CTA */}
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
