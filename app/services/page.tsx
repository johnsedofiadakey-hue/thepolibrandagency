import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const womenServices = [
    {
        number: '01',
        title: 'Personal Brand Positioning',
        color: '#1F6F3E',
        intro: 'Identity architecture, message discipline, and leadership positioning built to distinguish you in a crowded political space.',
        deliverables: [
            'Brand identity blueprint',
            'Message matrix',
            'Leadership archetype framework',
            'Visual direction guide',
            'Signature speaking themes',
        ],
    },
    {
        number: '02',
        title: 'Political Brand Strategy',
        color: '#C9A227',
        intro: 'Constituency mapping, narrative development, and strategic alignment for sustained electoral viability.',
        deliverables: [
            'Constituency segmentation model',
            'Issue alignment mapping',
            'Strategic narrative playbook',
            'Opponent positioning strategy',
            'Voter communication calendar',
        ],
    },
    {
        number: '03',
        title: 'Campaign Communication Management',
        color: '#B22222',
        intro: 'Media architecture, speech development, and crisis communication frameworks for the modern political environment.',
        deliverables: [
            'Speech framework',
            'Media engagement calendar',
            'Press release structure',
            'Crisis communication guide',
            'Digital content strategy',
        ],
    },
    {
        number: '04',
        title: 'Media Training',
        color: '#1F6F3E',
        intro: 'Structured coaching that transforms raw communication talent into politically powerful presence.',
        deliverables: [
            'Mock interview sessions',
            'Debate rehearsal simulations',
            'Camera presence coaching',
            'Body language alignment',
            'Messaging under pressure',
        ],
    },
    {
        number: '05',
        title: 'Fundraising Strategy',
        color: '#C9A227',
        intro: 'Donor positioning, political credibility framing, and campaign funding narratives that open the right doors.',
        deliverables: [
            'Donor messaging system',
            'Political credibility framing',
            'Campaign funding narrative',
            'Sponsorship positioning',
            'Event messaging guide',
        ],
    },
];

const institutionalServices = [
    {
        icon: '📋',
        title: 'Policy Communication Consulting',
        desc: 'Translating complex policy into compelling public communication that resonates with diverse constituencies.',
        features: ['Policy narrative development', 'Public messaging frameworks', 'Stakeholder communication plans', 'Plain language guides'],
    },
    {
        icon: '👑',
        title: 'Gender Leadership Programs',
        desc: 'Custom-designed leadership and communication programs for political parties and NGOs.',
        features: ['Cohort program design', 'Trainer certification', 'Curriculum development', 'Impact measurement frameworks'],
    },
    {
        icon: '📢',
        title: 'Advocacy Campaign Architecture',
        desc: 'Strategic campaign planning, stakeholder alignment, and public messaging for institutional change.',
        features: ['Campaign strategy design', 'Coalition building frameworks', 'Media intervention planning', 'Evaluation systems'],
    },
];

export default function ServicesPage() {
    return (
        <>
            <Navbar />

            {/* Hero */}
            <section style={{
                background: 'linear-gradient(135deg, #0c3d1e 0%, #1F6F3E 100%)',
                padding: '160px 0 80px', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(201,162,39,0.1) 0%, transparent 60%)', pointerEvents: 'none' }} />
                <div className="container-brand" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ maxWidth: 700 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
                            <div style={{ width: 28, height: 1, background: '#C9A227' }} />
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, color: '#C9A227', letterSpacing: '3px', textTransform: 'uppercase' }}>Strategic Services</span>
                        </div>
                        <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#fff', lineHeight: 1.2, marginBottom: '1.5rem' }}>
                            Institutional-Grade Tools for Modern Political Leadership.
                        </h1>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.8, maxWidth: 580 }}>
                            Every service is designed around the structural requirements of competitive democratic environments.
                        </p>
                    </div>
                </div>
            </section>

            {/* For Women Leaders */}
            <section className="section-pad" style={{ background: 'var(--color-bg)' }}>
                <div className="container-brand">
                    <div style={{ marginBottom: '3.5rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                            <div style={{ width: 28, height: 1, background: '#1F6F3E' }} />
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, color: '#1F6F3E', letterSpacing: '3px', textTransform: 'uppercase' }}>For Women Leaders</span>
                        </div>
                        <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '2.2rem', color: '#111' }}>Individual Strategy Services</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {womenServices.map((s, i) => (
                            <div key={i} style={{
                                background: '#fff', border: '1px solid var(--color-border)', borderRadius: 4,
                                padding: '2.5rem', display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '2.5rem',
                                alignItems: 'start', boxShadow: 'var(--shadow-card)', transition: 'transform 0.3s ease',
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '2.5rem', color: `${s.color}25` }}>{s.number}</span>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
                                        <div style={{ width: 4, height: 24, background: s.color, borderRadius: 2 }} />
                                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.2rem', color: '#111' }}>{s.title}</h3>
                                    </div>
                                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#555', lineHeight: 1.8 }}>{s.intro}</p>
                                </div>
                                <div>
                                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 700, color: s.color, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>DELIVERABLES</p>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {s.deliverables.map((d) => (
                                            <li key={d} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.84rem', color: '#444', padding: '5px 0 5px 1.5rem', position: 'relative', borderBottom: '1px solid #f0ebe2' }}>
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

            {/* For Institutions */}
            <section className="section-pad" style={{ background: '#fff' }}>
                <div className="container-brand">
                    <div style={{ marginBottom: '3.5rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                            <div style={{ width: 28, height: 1, background: '#B22222' }} />
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, color: '#B22222', letterSpacing: '3px', textTransform: 'uppercase' }}>For Institutions</span>
                        </div>
                        <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '2.2rem', color: '#111' }}>Institutional Partnership Services</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {institutionalServices.map((s, i) => (
                            <div key={i} className="card-brand">
                                <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{s.icon}</div>
                                <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.15rem', color: '#111', marginBottom: '0.75rem' }}>{s.title}</h3>
                                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.86rem', color: '#555', lineHeight: 1.8, marginBottom: '1.25rem' }}>{s.desc}</p>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {s.features.map((f) => (
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

            {/* CTA */}
            <section style={{ background: '#111', padding: '80px 0' }}>
                <div className="container-brand" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '2rem', color: '#fff', marginBottom: '0.75rem' }}>Ready to Begin?</h2>
                    <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.65)', marginBottom: '2rem' }}>Start with the Political Readiness Index to identify your strategic starting point.</p>
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
