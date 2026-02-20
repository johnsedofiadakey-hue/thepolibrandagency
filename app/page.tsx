import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const services = [
  {
    icon: '◈',
    title: 'Personal Brand Positioning',
    desc: 'Identity architecture, message discipline, and leadership positioning that distinguishes you from the political noise.',
    color: '#1F6F3E',
  },
  {
    icon: '◆',
    title: 'Political Brand Strategy',
    desc: 'Constituency mapping, narrative development, and strategic alignment for sustained electoral viability.',
    color: '#C9A227',
  },
  {
    icon: '◉',
    title: 'Campaign Communication',
    desc: 'Media architecture, speech development, and crisis communication frameworks built for modern politics.',
    color: '#B22222',
  },
  {
    icon: '◎',
    title: 'Media Training',
    desc: 'Interview simulations, debate strategy, camera presence coaching, and press preparation at the highest level.',
    color: '#1F6F3E',
  },
  {
    icon: '◇',
    title: 'Fundraising Strategy',
    desc: 'Donor positioning, political credibility framing, and campaign funding narratives that open doors.',
    color: '#C9A227',
  },
];

const stats = [
  { number: '200+', label: 'Women Leaders Trained' },
  { number: '18', label: 'African Countries Reached' },
  { number: '94%', label: 'Campaign Success Rate' },
  { number: '12', label: 'Institutional Partners' },
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* ─── HERO ─── */}
      <section style={{
        minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(135deg, #0c3d1e 0%, #1F6F3E 40%, #154e2b 70%, #0a2a14 100%)',
        overflow: 'hidden',
      }}>
        {/* Background texture overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(201,162,39,0.08) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(178,34,34,0.06) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        {/* Diagonal accent */}
        <div style={{
          position: 'absolute', right: 0, top: 0, width: '45%', height: '100%',
          background: 'linear-gradient(135deg, transparent 0%, rgba(201,162,39,0.04) 100%)',
          borderLeft: '1px solid rgba(201,162,39,0.12)',
        }} />
        {/* Gold corner accent */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 0, height: 0,
          borderTop: '200px solid rgba(201,162,39,0.07)',
          borderLeft: '200px solid transparent',
        }} />

        <div className="container-brand" style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '120px', paddingBottom: '60px', width: '100%' }}>
          <div style={{ maxWidth: 760 }}>
            {/* Tag */}
            <div className="animate-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '2rem' }}>
              <div style={{ width: 32, height: 1, background: '#C9A227' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, color: '#C9A227', letterSpacing: '3px', textTransform: 'uppercase' }}>
                The Leading Political Branding Partner for Women Leaders
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up-delay-1" style={{
              fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              color: '#FFFFFF', lineHeight: 1.18, marginBottom: '1.75rem', letterSpacing: '-0.5px',
            }}>
              Building Political Power<br />
              <span style={{ color: '#C9A227' }}>for Women</span> Across Africa.
            </h1>

            {/* Sub */}
            <p className="animate-fade-up-delay-2" style={{
              fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', fontWeight: 400,
              color: 'rgba(255,255,255,0.78)', lineHeight: 1.8, maxWidth: 580, marginBottom: '2.5rem',
            }}>
              Strategic branding, campaign communication, and leadership development
              for women shaping the future of governance.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up-delay-3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/apply" className="btn-gold">
                Apply for Fellowship →
              </Link>
              <Link href="/institutional-clients" className="btn-secondary">
                Partner With Us
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="relative mt-12 md:mt-0 w-full" style={{
          background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(201,162,39,0.2)',
        }}>
          <div className="container-brand grid grid-cols-2 md:grid-cols-4 gap-4 p-6 md:p-0" style={{ padding: '24px 24px' }}>
            {stats.map((s, i) => (
              <div key={i} className="text-center py-2 md:border-r border-white/10 last:border-0" style={{ padding: '8px 0' }}>
                <div style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.8rem', color: '#C9A227' }}>{s.number}</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STRATEGIC GAP ─── */}
      <section className="section-pad" style={{ background: '#fff' }}>
        <div className="container-brand">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
                <div style={{ width: 28, height: 1, background: '#B22222' }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, color: '#B22222', letterSpacing: '3px', textTransform: 'uppercase' }}>The Challenge</span>
              </div>
              <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#111', lineHeight: 1.25, marginBottom: '0.5rem' }}>
                The Representation Gap<br />Is <span style={{ color: '#1F6F3E' }}>Structural.</span>
              </h2>
              <div className="divider-gold" />
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.98rem', color: '#444', lineHeight: 1.9, marginBottom: '1.5rem' }}>
                Women across emerging democracies remain underrepresented in legislative, executive, and party leadership structures. The barrier is not ambition — it is strategic infrastructure.
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', color: '#444', lineHeight: 1.9, marginBottom: '2rem' }}>
                Modern politics demands tools that most women have never been given access to:
              </p>
              <div className="prose-brand">
                <ul>
                  {['Narrative clarity', 'Media discipline', 'Voter alignment', 'Fundraising architecture', 'Strategic visibility'].map((item) => (
                    <li key={item} style={{ fontFamily: 'Inter, sans-serif', color: '#333', fontWeight: 500 }}>{item}</li>
                  ))}
                </ul>
              </div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#1F6F3E', fontSize: '1rem', marginTop: '1.5rem', fontStyle: 'italic' }}>
                Polibrand exists to equip women with these structural tools.
              </p>
            </div>

            {/* Visual side */}
            <div style={{ position: 'relative' }}>
              <div style={{
                background: 'linear-gradient(135deg, #1F6F3E 0%, #154e2b 100%)',
                borderRadius: '4px', padding: '3rem', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(201,162,39,0.12)' }} />
                <div style={{ position: 'absolute', bottom: -30, left: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(178,34,34,0.08)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '1.3rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    "Democracy thrives when leadership reflects society."
                  </div>
                  <div style={{ width: 40, height: 2, background: '#C9A227', marginBottom: '1.5rem' }} />
                  {[
                    { label: 'Women in African Parliaments', value: '26%', target: '50%' },
                    { label: 'Women Executives', value: '18%', target: '50%' },
                    { label: 'Women Party Leaders', value: '14%', target: '50%' },
                  ].map((stat) => (
                    <div key={stat.label} style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>{stat.label}</span>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 700, color: '#C9A227' }}>{stat.value}</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }}>
                        <div style={{ height: '100%', width: stat.value, background: 'linear-gradient(90deg, #C9A227, #f0c84a)', borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '1rem', letterSpacing: '0.5px' }}>
                    Source: African Union Gender Representation Index, 2024
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section className="section-pad" style={{ background: 'var(--color-bg)' }}>
        <div className="container-brand">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
              <div style={{ width: 28, height: 1, background: '#C9A227' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, color: '#C9A227', letterSpacing: '3px', textTransform: 'uppercase' }}>What We Offer</span>
              <div style={{ width: 28, height: 1, background: '#C9A227' }} />
            </div>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: '#111', marginBottom: '1rem' }}>
              Core Strategic Services
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#666', maxWidth: 560, margin: '0 auto' }}>
              Institutional-grade tools designed for the complexities of modern democratic competition.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {services.map((s, i) => (
              <div key={i} className="card-brand" style={{ textAlign: 'center' }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%', margin: '0 auto 1.25rem',
                  background: `${s.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2px solid ${s.color}30`, fontSize: '1.5rem', color: s.color,
                }}>
                  {s.icon}
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1rem', color: '#111', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                  {s.title}
                </h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.84rem', color: '#666', lineHeight: 1.75 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/services" className="btn-outline-dark">
              Explore All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── POLITICAL READINESS INDEX ─── */}
      <section style={{
        background: 'linear-gradient(135deg, #8b1a1a 0%, #B22222 50%, #8b1a1a 100%)',
        padding: '100px 0', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(201,162,39,0.1) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)' }} />

        <div className="container-brand" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '3px', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>
            Diagnostic Tool
          </span>
          <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: '#fff', marginBottom: '1rem' }}>
            Measure Your Political Readiness.
          </h2>
          <div style={{ width: 60, height: 2, background: '#C9A227', margin: '0 auto 1.5rem' }} />
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', color: 'rgba(255,255,255,0.78)', maxWidth: 580, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
            A structured assessment evaluating your communication clarity, narrative strength, visibility readiness, and fundraising positioning. Get your personalized score and growth roadmap.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            {['Brand Clarity', 'Communication Strength', 'Public Visibility', 'Fundraising Readiness'].map((cat) => (
              <span key={cat} style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600,
                padding: '6px 14px', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '2px',
                color: 'rgba(255,255,255,0.7)', letterSpacing: '0.5px',
              }}>{cat}</span>
            ))}
          </div>
          <Link href="/assessment" className="btn-gold" style={{ fontSize: '0.9rem', padding: '16px 36px' }}>
            Start Assessment →
          </Link>
        </div>
      </section>

      {/* ─── PARTNERSHIPS ─── */}
      <section id="partnerships" className="section-pad" style={{ background: '#fff' }}>
        <div className="container-brand">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
                <div style={{ width: 28, height: 1, background: '#1F6F3E' }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, color: '#1F6F3E', letterSpacing: '3px', textTransform: 'uppercase' }}>Institutional</span>
              </div>
              <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: '#111', lineHeight: 1.25, marginBottom: '0.5rem' }}>
                Strengthening Democratic<br />Leadership Infrastructure.
              </h2>
              <div className="divider-gold" />
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.98rem', color: '#444', lineHeight: 1.9, marginBottom: '1.5rem' }}>
                We collaborate with NGOs, political parties, international democracy organizations, and development institutions to design structured leadership and communication programs.
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', color: '#444', lineHeight: 1.8, marginBottom: '2rem' }}>
                Partnership formats include gender leadership programs, policy communication consulting, advocacy campaign architecture, and multi-country training deployments.
              </p>
              <Link href="#" className="btn-primary">
                Request Partnership Proposal →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'NGO Programs', icon: '🌍', desc: 'Custom gender leadership training programs.' },
                { title: 'Political Parties', icon: '🏛', desc: 'Candidate communication and brand strategy.' },
                { title: 'Democracy Bodies', icon: '⚖️', desc: 'International democracy capacity-building.' },
                { title: 'Development Orgs', icon: '📊', desc: 'Advocacy campaign architecture.' },
              ].map((p) => (
                <div key={p.title} style={{
                  background: 'var(--color-bg)', border: '1px solid var(--color-border)',
                  borderRadius: 4, padding: '1.5rem', transition: 'all 0.3s',
                }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{p.icon}</div>
                  <h4 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '0.95rem', color: '#111', marginBottom: '0.5rem' }}>{p.title}</h4>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#666', lineHeight: 1.7 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
