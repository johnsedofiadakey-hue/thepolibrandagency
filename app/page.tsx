"use client";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useContext } from 'react';
import { PoliSettingsContext } from '@/components/SettingsProvider';

export default function Page() {
  const { theme, content } = useContext(PoliSettingsContext) as any;
  const home = content.pages.home;

  return (
    <>
      <Navbar />

      {/* ─── HERO ─── */}
      <section style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-bg)',
        backgroundImage: 'var(--hero-image)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: theme.heroImage
            ? 'linear-gradient(to right, rgba(17,17,17,0.8) 0%, rgba(17,17,17,0.4) 100%)'
            : `linear-gradient(135deg, var(--color-bg) 0%, var(--color-primary) 40%, var(--color-primary) 70%, var(--color-accent) 100%)`,
          zIndex: 1
        }} />

        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(201,162,39,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 1
        }} />

        <div className="container-brand" style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '100px', width: '100%' }}>
          <div style={{ maxWidth: 800 }}>
            <div className="animate-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: '2.5rem' }}>
              <div style={{ width: 40, height: 1, background: 'var(--color-secondary)' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-secondary)', letterSpacing: '4px', textTransform: 'uppercase' }}>
                {home.hero.tag}
              </span>
            </div>

            <h1 className="animate-fade-up-delay-1" style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2.6rem, 5.5vw, 4.5rem)',
              color: '#fff', lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-1px',
            }}>
              {home.hero.headline.split('\n').map((line: string, i: number) => (
                <span key={i}>{line}<br /></span>
              ))}
            </h1>

            <p className="animate-fade-up-delay-2" style={{
              fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', fontWeight: 400,
              color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, maxWidth: 580, marginBottom: '2.5rem',
            }}>
              {home.hero.subheadline}
            </p>

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

        <div className="relative mt-12 md:mt-0 w-full" style={{
          background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(201,162,39,0.2)',
        }}>
          <div className="container-brand grid grid-cols-2 md:grid-cols-4 gap-4 p-6 md:p-0" style={{ padding: '24px 24px' }}>
            {home.stats.map((s: any, i: number) => (
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
                Polibrand exists to equip women with these structural tools.
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
              Explore All Services →
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
                Request Partnership Proposal →
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
