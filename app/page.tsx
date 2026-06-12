"use client";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useContext } from 'react';
import { PoliSettingsContext } from '@/components/SettingsProvider';

export default function Page() {
  const { theme = {}, content = {} } = useContext(PoliSettingsContext) as any;
  
  // Safe deep access with fallbacks to prevent rendering crashes
  const home = content?.pages?.home || {
    hero: { tag: "The Polibrand Agency", headline: "Building Political Power\nfor Women.", subheadline: "Strategic branding and leadership development." },
    stats: [],
    challenge: { tag: "Challenge", title: "Gap", text: "", list: [], quote: "", stats: [] },
    services: { tag: "Services", title: "Core Services", description: "", items: [] },
    diagnostic: { tag: "Diagnostic", title: "Ready?", description: "", categories: [] },
    partnerships: { tag: "Global Impact", title: "Our Partners", text: "", items: [] },
    cta: {}
  };

  return (
    <>
      <Navbar />

      {/* ─── HERO ─── */}
      <section style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-primary)',
        backgroundImage: 'var(--hero-image)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
      }}>
        {/* Primary dark overlay — always present for readability */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: theme.heroImage
            ? 'linear-gradient(110deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.2) 100%)'
            : 'linear-gradient(110deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 100%)',
        }} />

        {/* Subtle geometric grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, opacity: 0.04,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        {/* Gold radial glow — top left anchor */}
        <div style={{
          position: 'absolute', top: '-10%', left: '-5%', zIndex: 1,
          width: '55vw', height: '55vw', borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.secondary || '#C9A227'}18 0%, transparent 65%)`,
          pointerEvents: 'none',
        }} />

        {/* Diagonal accent stripe — right side */}
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, zIndex: 1,
          width: '38%', clipPath: 'polygon(18% 0%, 100% 0%, 100% 100%, 0% 100%)',
          background: `linear-gradient(160deg, ${theme.secondary || '#C9A227'}08 0%, ${theme.secondary || '#C9A227'}04 100%)`,
          borderLeft: `1px solid ${theme.secondary || '#C9A227'}14`,
        }} />

        {/* Decorative corner mark — top right */}
        <div style={{ position: 'absolute', top: 100, right: 80, zIndex: 2, opacity: 0.18, pointerEvents: 'none' }}>
          <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
            <circle cx="90" cy="90" r="88" stroke={theme.secondary || '#C9A227'} strokeWidth="0.8" />
            <circle cx="90" cy="90" r="64" stroke={theme.secondary || '#C9A227'} strokeWidth="0.5" strokeDasharray="4 6" />
            <circle cx="90" cy="90" r="38" stroke={theme.secondary || '#C9A227'} strokeWidth="0.8" />
            <line x1="90" y1="2" x2="90" y2="178" stroke={theme.secondary || '#C9A227'} strokeWidth="0.4" />
            <line x1="2" y1="90" x2="178" y2="90" stroke={theme.secondary || '#C9A227'} strokeWidth="0.4" />
          </svg>
        </div>

        {/* Main hero content */}
        <div className="container-brand" style={{ position: 'relative', zIndex: 3, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 100, paddingBottom: 40 }}>
          <div style={{ maxWidth: 740 }}>

            {/* Tag line */}
            <div className="animate-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: '2.25rem' }}>
              <div style={{ width: 36, height: 1.5, background: theme.secondary || '#C9A227', borderRadius: 1 }} />
              <span style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', fontWeight: 700,
                color: theme.secondary || '#C9A227', letterSpacing: '4px', textTransform: 'uppercase',
              }}>
                {home.hero.tag}
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up-delay-1" style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(2.8rem, 5.5vw, 5rem)',
              color: '#fff', lineHeight: 1.08, marginBottom: '1.75rem',
              letterSpacing: '-1.5px',
            }}>
              {home.hero.headline.split('\n').map((line: string, i: number) => (
                <span key={i} style={{ display: 'block' }}>{line}</span>
              ))}
            </h1>

            {/* Divider */}
            <div className="animate-fade-up-delay-1" style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.75rem',
            }}>
              <div style={{ width: 48, height: 2, background: theme.secondary || '#C9A227', borderRadius: 1 }} />
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: theme.secondary || '#C9A227', opacity: 0.6 }} />
            </div>

            {/* Subheadline */}
            <p className="animate-fade-up-delay-2" style={{
              fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', fontWeight: 400,
              color: 'rgba(255,255,255,0.78)', lineHeight: 1.85, maxWidth: 520, marginBottom: '2.75rem',
              letterSpacing: '0.2px',
            }}>
              {home.hero.subheadline}
            </p>

            {/* CTAs */}
            <div className="animate-fade-up-delay-3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link href="/apply" style={{
                fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.72rem',
                letterSpacing: '1.5px', textTransform: 'uppercase', textDecoration: 'none',
                background: theme.secondary || '#C9A227', color: '#0a0a0a',
                padding: '14px 32px', borderRadius: 3,
                boxShadow: `0 8px 32px ${theme.secondary || '#C9A227'}35`,
                transition: 'all 0.25s',
                display: 'inline-block',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${theme.secondary || '#C9A227'}50`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${theme.secondary || '#C9A227'}35`; }}
              >
                {home.cta?.apply || "Apply for Fellowship →"}
              </Link>
              <Link href="/institutional-clients" style={{
                fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.72rem',
                letterSpacing: '1.5px', textTransform: 'uppercase', textDecoration: 'none',
                color: '#fff', padding: '13px 28px', borderRadius: 3,
                border: '1px solid rgba(255,255,255,0.25)',
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.25s',
                display: 'inline-block',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
              >
                {home.cta?.partner || "Partner With Us"}
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        {home.stats.length > 0 && (
          <div style={{
            position: 'relative', zIndex: 3,
            borderTop: `1px solid rgba(255,255,255,0.08)`,
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(16px)',
          }}>
            <div className="container-brand" style={{
              display: 'grid', gridTemplateColumns: `repeat(${home.stats.length}, 1fr)`,
              padding: '20px 0',
            }}>
              {home.stats.map((s: any, i: number) => (
                <div key={i} style={{
                  textAlign: 'center', padding: '12px 8px',
                  borderRight: i < home.stats.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                }}>
                  <div style={{
                    fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)',
                    color: theme.secondary || '#C9A227', lineHeight: 1,
                  }}>{s.number}</div>
                  <div style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '0.62rem', fontWeight: 500,
                    color: 'rgba(255,255,255,0.45)', letterSpacing: '1.5px',
                    textTransform: 'uppercase', marginTop: 6,
                  }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ─── STRATEGIC GAP ─── */}
      <section className="section-pad" style={{ background: '#fff' }}>
        <div className="container-brand">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
                <div style={{ width: 28, height: 1, background: 'var(--color-accent)' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-accent)', letterSpacing: '3px', textTransform: 'uppercase' }}>{home.challenge.tag}</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#111', lineHeight: 1.25, marginBottom: '0.5rem' }}>
                {home.challenge.title.split('\n').map((line: string, i: number) => (
                  <span key={i}>{line}<br /></span>
                ))}
              </h2>
              <div className="divider-gold" />
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.98rem', color: '#444', lineHeight: 1.9, marginBottom: '1.5rem' }}>
                {home.challenge.text}
              </p>
              <div className="prose-brand">
                <ul>
                  {home.challenge.list.map((item: string) => (
                    <li key={item} style={{ fontFamily: 'Inter, sans-serif', color: '#333', fontWeight: 500 }}>{item}</li>
                  ))}
                </ul>
              </div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: 'var(--color-primary)', fontSize: '1rem', marginTop: '1.5rem', fontStyle: 'italic' }}>
                {home.cta?.mission || "The Polibrand Agency exists to equip women with structural political tools."}
              </p>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                borderRadius: '4px', padding: '3rem', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-secondary), transparent 88%)' }} />
                <div style={{ position: 'absolute', bottom: -30, left: -30, width: 160, height: 160, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-accent), transparent 92%)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.3rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {home.challenge.quote}
                  </div>
                  <div style={{ width: 40, height: 2, background: 'var(--color-secondary)', marginBottom: '1.5rem' }} />
                  {home.challenge.stats.map((stat: any) => (
                    <div key={stat.label} style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>{stat.label}</span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-secondary)' }}>{stat.value}</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }}>
                        <div style={{ height: '100%', width: stat.value, background: 'linear-gradient(90deg, var(--color-secondary), var(--color-secondary-dark))', borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
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
              <div style={{ width: 28, height: 1, background: 'var(--color-secondary)' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-secondary)', letterSpacing: '3px', textTransform: 'uppercase' }}>{home.services.tag}</span>
              <div style={{ width: 28, height: 1, background: 'var(--color-secondary)' }} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: '#111', marginBottom: '1rem' }}>
              {home.services.title}
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#666', maxWidth: 560, margin: '0 auto' }}>
              {home.services.description}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {home.services.items.map((s: any, i: number) => (
              <div key={i} className="card-brand" style={{ textAlign: 'center' }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%', margin: '0 auto 1.25rem',
                  background: `${s.color || 'var(--color-primary)'}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2px solid ${s.color || 'var(--color-primary)'}30`, fontSize: '1.5rem', color: s.color || 'var(--color-primary)',
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
              {home.cta?.services || "Explore All Services →"}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── POLITICAL READINESS INDEX ─── */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent) 100%)',
        padding: '100px 0', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(201,162,39,0.1) 0%, transparent 60%)', pointerEvents: 'none' }} />

        <div className="container-brand" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '3px', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>
            {home.diagnostic.tag}
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: '#fff', marginBottom: '1rem' }}>
            {home.diagnostic.title}
          </h2>
          <div style={{ width: 60, height: 2, background: 'var(--color-secondary)', margin: '0 auto 1.5rem' }} />
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', maxWidth: 580, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
            {home.diagnostic.description}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            {home.diagnostic.categories.map((cat: string) => (
              <span key={cat} style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600,
                padding: '6px 14px', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '2px',
                color: 'rgba(255,255,255,0.7)', letterSpacing: '0.5px',
              }}>{cat}</span>
            ))}
          </div>
          <Link href="/assessment" className="btn-gold" style={{ fontSize: '0.9rem', padding: '16px 36px' }}>
            {home.cta?.assessment || "Start Assessment →"}
          </Link>
        </div>
      </section>

      {/* ─── PARTNERSHIPS ─── */}
      <section id="partnerships" className="section-pad" style={{ background: '#fff' }}>
        <div className="container-brand">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
                <div style={{ width: 28, height: 1, background: 'var(--color-primary)' }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '3px', textTransform: 'uppercase' }}>{home.partnerships.tag}</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: '#111', lineHeight: 1.25, marginBottom: '0.5rem' }}>
                {home.partnerships.title.split('\n').map((line: string, i: number) => (
                  <span key={i}>{line}<br /></span>
                ))}
              </h2>
              <div className="divider-gold" />
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.98rem', color: '#444', lineHeight: 1.9, marginBottom: '1.5rem' }}>
                {home.partnerships.text}
              </p>
              <Link href="/apply" className="btn-primary">
                {home.cta?.proposal || "Request Partnership Proposal →"}
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {home.partnerships.items.map((p: any, i: number) => (
                <div key={p.name || p.title || i} style={{
                  background: 'var(--color-bg)', border: '1px solid var(--color-border)',
                  borderRadius: 4, padding: '1.5rem', transition: 'all 0.3s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {p.logo ? (
                    <img src={p.logo} alt={p.name || p.title} style={{ maxHeight: 48, maxWidth: '100%', objectFit: 'contain', opacity: 0.75 }} />
                  ) : (
                    <>
                      {p.icon && <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{p.icon}</div>}
                      <h4 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '0.95rem', color: '#111', marginBottom: '0.5rem' }}>{p.name || p.title}</h4>
                      {p.desc && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#666', lineHeight: 1.7 }}>{p.desc}</p>}
                    </>
                  )}
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
