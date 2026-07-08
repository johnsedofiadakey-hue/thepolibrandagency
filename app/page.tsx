"use client";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhoWeServeCard from '@/components/WhoWeServeCard';
import Link from 'next/link';
import { useContext } from 'react';
import { PoliSettingsContext } from '@/components/SettingsProvider';

export default function Page() {
  const { theme = {}, content = {} } = useContext(PoliSettingsContext) as any;
  
  // Safe deep access with fallbacks to prevent rendering crashes
  const home = content?.pages?.home || {
    hero: { tag: "The Trusted Political Branding Partner", headline: "Building Political Power\nAcross Africa.", subheadline: "Strategic branding and leadership development." },
    stats: [],
    whoWeServe: { tag: "Who We Serve", title: "", text: "", segments: [] },
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
      <section className="home-hero" style={{
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
        {/* Main hero content */}
        <div className="container-brand home-hero-content" style={{ position: 'relative', zIndex: 3, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 100, paddingBottom: 40 }}>
          <div className="home-hero-copy" style={{ maxWidth: 740 }}>

            {/* Tag line */}
            <div className="animate-fade-up home-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: '2.25rem' }}>
              <div style={{ width: 36, height: 1.5, background: theme.secondary || '#C9A227', borderRadius: 1 }} />
              <span style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', fontWeight: 700,
                color: theme.secondary || '#C9A227', letterSpacing: '4px', textTransform: 'uppercase',
              }}>
                {home.hero.tag}
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up-delay-1 home-hero-title" style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(2.8rem, 5.5vw, 5rem)',
              color: '#fff', lineHeight: 1.08, marginBottom: '1.75rem',
              letterSpacing: '-1.5px',
              textShadow: '0 4px 22px rgba(0,0,0,0.55)',
            }}>
              {home.hero.headline.split('\n').map((line: string, i: number) => (
                <span key={i} style={{ display: 'block' }}>{line}</span>
              ))}
            </h1>

            {/* Divider */}
            <div className="animate-fade-up-delay-1 home-hero-divider" style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.75rem',
            }}>
              <div style={{ width: 48, height: 2, background: theme.secondary || '#C9A227', borderRadius: 1 }} />
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: theme.secondary || '#C9A227', opacity: 0.6 }} />
            </div>

            {/* Subheadline */}
            <p className="animate-fade-up-delay-2 home-hero-subtitle" style={{
              fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', fontWeight: 400,
              color: 'rgba(255,255,255,0.78)', lineHeight: 1.85, maxWidth: 520, marginBottom: '2.75rem',
              letterSpacing: '0.2px',
              textShadow: '0 2px 14px rgba(0,0,0,0.55)',
            }}>
              {home.hero.subheadline}
            </p>

            {/* CTAs */}
            <div className="animate-fade-up-delay-3 home-hero-actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
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
                {(home.cta?.apply && !home.cta.apply.toLowerCase().includes('fellowship')) ? home.cta.apply : "Apply"}
              </Link>
              <Link href="/assessment" style={{
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
                {home.cta?.assessment || "Start Assessment →"}
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
            <div className="container-brand stats-bar home-stats-bar">
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

      {/* ─── WHO WE SERVE ─── */}
      {home.whoWeServe?.segments?.length > 0 && (
        <section className="section-pad" style={{ background: '#f7f6f2' }}>
          <div className="container-brand">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                <div style={{ width: 28, height: 1.5, background: theme.secondary || '#C9A227' }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', fontWeight: 700, color: theme.secondary || '#C9A227', letterSpacing: '4px', textTransform: 'uppercase' }}>{home.whoWeServe.tag}</span>
                <div style={{ width: 28, height: 1.5, background: theme.secondary || '#C9A227' }} />
              </div>
              {home.whoWeServe.text && (
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.98rem', color: '#666', maxWidth: 560, margin: '0 auto', lineHeight: 1.8 }}>
                  {home.whoWeServe.text}
                </p>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
              {home.whoWeServe.segments.map((seg: any, i: number) => (
                <WhoWeServeCard key={i} seg={seg} accent={theme.secondary || '#C9A227'} primary={theme.primary || '#F3010A'} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── STRATEGIC GAP ─── */}
      <section className="section-pad" style={{ background: '#fff' }}>
        <div className="container-brand">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
                <div style={{ width: 28, height: 1.5, background: theme.secondary || '#C9A227' }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', fontWeight: 700, color: theme.secondary || '#C9A227', letterSpacing: '4px', textTransform: 'uppercase' }}>{home.challenge.tag}</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#0d1117', lineHeight: 1.2, marginBottom: '1.25rem', letterSpacing: '-0.5px' }}>
                {home.challenge.title.split('\n').map((line: string, i: number) => (
                  <span key={i} style={{ display: 'block' }}>{line}</span>
                ))}
              </h2>
              <div style={{ width: 48, height: 2, background: theme.secondary || '#C9A227', marginBottom: '1.5rem', borderRadius: 1 }} />
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.98rem', color: '#555', lineHeight: 1.9, marginBottom: '1.75rem' }}>
                {home.challenge.text}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.75rem' }}>
                {home.challenge.list.map((item: string, i: number) => (
                  <div key={item} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.65rem 0', borderBottom: '1px solid rgba(0,0,0,0.06)',
                  }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: 2, flexShrink: 0,
                      background: `${theme.secondary || '#C9A227'}18`,
                      border: `1px solid ${theme.secondary || '#C9A227'}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Cinzel, serif', fontSize: '0.55rem', fontWeight: 700,
                      color: theme.secondary || '#C9A227',
                    }}>{String(i + 1).padStart(2, '0')}</div>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', color: '#333', fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: theme.primary || '#1A2B4C', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: 1.7 }}>
                {home.cta?.mission || "The Polibrand Agency exists to equip women with structural political tools."}
              </p>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{
                background: theme.primary || '#1A2B4C',
                borderRadius: 4, padding: '2.5rem', position: 'relative', overflow: 'hidden',
              }}>
                {/* Subtle geometric grid */}
                <div style={{
                  position: 'absolute', inset: 0, opacity: 0.05,
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }} />
                {/* Gold accent circle */}
                <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: `${theme.secondary || '#C9A227'}15` }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    fontFamily: 'Cinzel, Georgia, serif', fontStyle: 'italic',
                    fontSize: '1.15rem', color: 'rgba(255,255,255,0.88)', lineHeight: 1.65, marginBottom: '1.5rem',
                  }}>
                    {home.challenge.quote}
                  </div>
                  <div style={{ width: 40, height: 2, background: theme.secondary || '#C9A227', marginBottom: '2rem', borderRadius: 1 }} />
                  {home.challenge.stats.map((stat: any) => (
                    <div key={stat.label} style={{ marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{stat.label}</span>
                        <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.82rem', fontWeight: 700, color: theme.secondary || '#C9A227' }}>{stat.value}</span>
                      </div>
                      <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                        <div style={{ height: '100%', width: stat.value, background: `linear-gradient(90deg, ${theme.secondary || '#C9A227'}, ${theme.secondary || '#C9A227'}80)`, borderRadius: 2 }} />
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
      <section className="section-pad" style={{ background: '#f7f6f2' }}>
        <div className="container-brand">
          <div className="home-section-intro" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
              <div style={{ width: 28, height: 1.5, background: theme.secondary || '#C9A227' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', fontWeight: 700, color: theme.secondary || '#C9A227', letterSpacing: '4px', textTransform: 'uppercase' }}>{home.services.tag}</span>
              <div style={{ width: 28, height: 1.5, background: theme.secondary || '#C9A227' }} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: '#0d1117', marginBottom: '1rem', letterSpacing: '-0.5px' }}>
              {home.services.title}
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.98rem', color: '#666', maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
              {home.services.description}
            </p>
          </div>

          <div className="home-services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {home.services.items.map((s: any, i: number) => (
              <div key={i} className="home-service-card" style={{
                background: '#fff',
                borderRadius: 4,
                padding: '2rem 1.5rem',
                border: '1px solid rgba(0,0,0,0.07)',
                boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.25s, box-shadow 0.25s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 16px rgba(0,0,0,0.04)'; }}
              >
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: 3,
                  background: `linear-gradient(90deg, ${theme.secondary || '#C9A227'}, ${theme.secondary || '#C9A227'}80)`,
                }} />
                <div style={{
                  fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700,
                  fontSize: '0.6rem', letterSpacing: '3px', color: theme.secondary || '#C9A227',
                  opacity: 0.8, marginBottom: '1.25rem', textTransform: 'uppercase',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: '0.95rem', color: '#0d1117', marginBottom: '0.75rem', lineHeight: 1.4,
                }}>
                  {s.title}
                </h3>
                <div style={{ width: 24, height: 2, background: theme.secondary || '#C9A227', marginBottom: '0.85rem', borderRadius: 1 }} />
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#555', lineHeight: 1.8, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="home-services-cta" style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/services" style={{
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.72rem',
              letterSpacing: '1.5px', textTransform: 'uppercase', textDecoration: 'none',
              color: theme.primary || '#1A2B4C', padding: '12px 28px', borderRadius: 3,
              border: `2px solid ${theme.primary || '#1A2B4C'}`,
              display: 'inline-block', transition: 'all 0.25s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = theme.primary || '#1A2B4C'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = theme.primary || '#1A2B4C'; }}
            >
              {home.cta?.services || "Explore All Services →"}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── POLITICAL READINESS INDEX ─── */}
      <section className="home-diagnostic" style={{
        background: theme.primary || '#1A2B4C',
        padding: '100px 0', position: 'relative', overflow: 'hidden',
      }}>
        {/* Geometric grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
          backgroundSize: '60px 60px', pointerEvents: 'none',
        }} />
        {/* Gold glow */}
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-10%',
          width: '50vw', height: '50vw', borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.secondary || '#C9A227'}14 0%, transparent 65%)`,
          pointerEvents: 'none',
        }} />
        {/* Decorative SVG reticle */}
        <div style={{ position: 'absolute', left: -60, top: '50%', transform: 'translateY(-50%)', opacity: 0.06, pointerEvents: 'none' }}>
          <svg width="300" height="300" viewBox="0 0 300 300" fill="none">
            <circle cx="150" cy="150" r="145" stroke={theme.secondary || '#C9A227'} strokeWidth="0.8" />
            <circle cx="150" cy="150" r="100" stroke={theme.secondary || '#C9A227'} strokeWidth="0.5" strokeDasharray="4 8" />
            <circle cx="150" cy="150" r="55" stroke={theme.secondary || '#C9A227'} strokeWidth="0.8" />
          </svg>
        </div>

        <div className="container-brand" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
            <div style={{ width: 28, height: 1.5, background: theme.secondary || '#C9A227' }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', fontWeight: 700, color: theme.secondary || '#C9A227', letterSpacing: '4px', textTransform: 'uppercase' }}>
              {home.diagnostic.tag}
            </span>
            <div style={{ width: 28, height: 1.5, background: theme.secondary || '#C9A227' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: '#fff', marginBottom: '1rem', letterSpacing: '-0.5px' }}>
            {home.diagnostic.title}
          </h2>
          <div style={{ width: 60, height: 2, background: theme.secondary || '#C9A227', margin: '0 auto 1.75rem', borderRadius: 1 }} />
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
            {home.diagnostic.description}
          </p>
          <div className="home-diagnostic-tags" style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            {home.diagnostic.categories.map((cat: string) => (
              <span key={cat} style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.68rem', fontWeight: 600,
                padding: '7px 16px',
                border: `1px solid ${theme.secondary || '#C9A227'}40`,
                background: `${theme.secondary || '#C9A227'}0d`,
                borderRadius: 2,
                color: theme.secondary || '#C9A227',
                letterSpacing: '1px', textTransform: 'uppercase',
              }}>{cat}</span>
            ))}
          </div>
          <Link href="/assessment" style={{
            fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.72rem',
            letterSpacing: '1.5px', textTransform: 'uppercase', textDecoration: 'none',
            background: theme.secondary || '#C9A227', color: '#0a0a0a',
            padding: '14px 36px', borderRadius: 3,
            boxShadow: `0 8px 32px ${theme.secondary || '#C9A227'}35`,
            display: 'inline-block', transition: 'all 0.25s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${theme.secondary || '#C9A227'}50`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${theme.secondary || '#C9A227'}35`; }}
          >
            {home.cta?.assessment || "Start Assessment →"}
          </Link>
        </div>
      </section>

      {/* ─── PARTNERSHIPS ─── */}
      <section id="partnerships" className="section-pad" style={{ background: '#f7f6f2' }}>
        <div className="container-brand">
          <div className="home-partnership-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
                <div style={{ width: 28, height: 1.5, background: theme.secondary || '#C9A227' }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', fontWeight: 700, color: theme.secondary || '#C9A227', letterSpacing: '4px', textTransform: 'uppercase' }}>{home.partnerships.tag}</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: '#0d1117', lineHeight: 1.2, marginBottom: '1.25rem', letterSpacing: '-0.5px' }}>
                {home.partnerships.title.split('\n').map((line: string, i: number) => (
                  <span key={i} style={{ display: 'block' }}>{line}</span>
                ))}
              </h2>
              <div style={{ width: 48, height: 2, background: theme.secondary || '#C9A227', marginBottom: '1.5rem', borderRadius: 1 }} />
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.98rem', color: '#555', lineHeight: 1.9, marginBottom: '2rem' }}>
                {home.partnerships.text}
              </p>
              <Link href="/apply" style={{
                fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.72rem',
                letterSpacing: '1.5px', textTransform: 'uppercase', textDecoration: 'none',
                background: theme.primary || '#1A2B4C', color: '#fff',
                padding: '13px 28px', borderRadius: 3, display: 'inline-block',
                transition: 'all 0.25s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${theme.primary || '#1A2B4C'}40`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                {home.cta?.proposal || "Request Partnership Proposal →"}
              </Link>
            </div>
            <div className="home-partner-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              {home.partnerships.items.map((p: any, i: number) => (
                <div key={p.name || p.title || i} className="home-partner-card" style={{
                  background: '#fff', border: '1px solid rgba(0,0,0,0.07)',
                  borderRadius: 4, padding: '1.75rem 1.25rem',
                  transition: 'all 0.25s', textAlign: 'center',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  position: 'relative', overflow: 'hidden',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
                    background: `linear-gradient(90deg, transparent, ${theme.secondary || '#C9A227'}, transparent)`,
                    opacity: 0,
                    transition: 'opacity 0.25s',
                  }} />
                  {p.logo ? (
                    <img src={p.logo} alt={p.name || p.title} style={{ maxHeight: 44, maxWidth: '100%', objectFit: 'contain', opacity: 0.7 }} />
                  ) : (
                    <>
                      <div style={{
                        width: 48, height: 48, borderRadius: '50%', margin: '0 auto 0.85rem',
                        background: `linear-gradient(135deg, ${theme.primary || '#1A2B4C'}, ${theme.primary || '#1A2B4C'}cc)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700,
                        fontSize: '1.15rem', color: '#fff',
                        boxShadow: `0 6px 16px ${theme.primary || '#1A2B4C'}35`,
                      }}>
                        {(p.name || p.title || '?').charAt(0)}
                      </div>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#111', lineHeight: 1.4 }}>{p.name || p.title}</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .home-hero {
            min-height: 92vh !important;
            background-position: 58% center !important;
          }
          .home-hero-content {
            padding-top: 136px !important;
            padding-bottom: 22px !important;
            justify-content: flex-end !important;
          }
          .home-hero-copy {
            max-width: 100% !important;
          }
          .home-eyebrow {
            gap: 9px !important;
            margin-bottom: 1.15rem !important;
          }
          .home-eyebrow span {
            font-size: 0.54rem !important;
            letter-spacing: 2.35px !important;
            line-height: 1.65 !important;
          }
          .home-eyebrow div {
            width: 24px !important;
          }
          .home-hero-title {
            font-size: clamp(2.16rem, 12.4vw, 3.12rem) !important;
            line-height: 1.04 !important;
            margin-bottom: 1.1rem !important;
            letter-spacing: 0 !important;
            text-wrap: balance;
          }
          .home-hero-divider {
            margin-bottom: 1.05rem !important;
          }
          .home-hero-subtitle {
            font-size: 0.95rem !important;
            line-height: 1.68 !important;
            margin-bottom: 1.65rem !important;
            max-width: 330px !important;
          }
          .home-hero-actions {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 0.78rem !important;
            width: min(100%, 300px);
          }
          .home-hero-actions a {
            width: 100% !important;
            min-height: 50px;
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
            padding: 14px 20px !important;
            text-align: center;
            white-space: normal;
          }
          .home-stats-bar {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            padding: 10px 0 !important;
          }
          .home-stats-bar > div {
            padding: 9px 5px !important;
          }
          .home-stats-bar > div > div:first-child {
            font-size: 1.38rem !important;
          }
          .home-stats-bar > div > div:last-child {
            font-size: 0.5rem !important;
            letter-spacing: 1px !important;
            line-height: 1.35 !important;
          }
          .home-section-intro {
            margin-bottom: 2.5rem !important;
          }
          .home-services-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          .home-service-card {
            min-height: auto;
            padding: 1.55rem 1.35rem !important;
          }
          .home-service-card h3 {
            font-size: 1.02rem !important;
          }
          .home-services-cta a,
          .home-diagnostic a {
            width: 100%;
            max-width: 320px;
            min-height: 50px;
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
            padding: 13px 18px !important;
            text-align: center;
            white-space: normal;
          }
          .home-partnership-layout a {
            width: 100%;
            min-height: 50px;
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
            padding: 13px 18px !important;
            text-align: center;
            white-space: normal;
          }
          .home-diagnostic {
            padding: 72px 0 !important;
          }
          .home-diagnostic-tags {
            gap: 0.55rem !important;
            margin-bottom: 2.35rem !important;
          }
          .home-diagnostic-tags span {
            flex: 1 1 calc(50% - 0.55rem);
            max-width: 150px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            line-height: 1.25;
          }
          .home-partnership-layout {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .home-partner-grid {
            grid-template-columns: 1fr !important;
            gap: 0.85rem !important;
          }
          .home-partner-card {
            min-height: 92px;
            padding: 1.2rem 1.25rem !important;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 1rem;
            text-align: left !important;
          }
          .home-partner-card > div:nth-of-type(2) {
            margin: 0 !important;
            flex: 0 0 44px;
          }
          .home-partner-card > div:last-child {
            flex: 1 1 auto !important;
            text-align: left !important;
          }
        }
      `}</style>

      <Footer />
    </>
  );
}
