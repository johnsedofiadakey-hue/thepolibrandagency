'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function WhoWeServeCard({ seg, accent, primary }: { seg: any; accent: string; primary: string }) {
    const [supportsHover, setSupportsHover] = useState(true);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setSupportsHover(window.matchMedia('(hover: hover)').matches);
    }, []);

    return (
        <div
            onMouseEnter={() => supportsHover && setOpen(true)}
            onMouseLeave={() => supportsHover && setOpen(false)}
            onClick={() => !supportsHover && setOpen(o => !o)}
            style={{
                background: '#fff', borderRadius: 6, padding: '1.75rem',
                border: '1px solid rgba(0,0,0,0.07)',
                boxShadow: open ? '0 12px 32px rgba(0,0,0,0.1)' : '0 2px 16px rgba(0,0,0,0.04)',
                position: 'relative', overflow: 'hidden',
                cursor: supportsHover ? 'default' : 'pointer',
                transition: 'box-shadow 0.25s ease',
            }}
        >
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: 3,
                background: `linear-gradient(90deg, ${accent}, ${accent}80)`,
            }} />

            {/* Always-visible category header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <span style={{
                    fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '0.82rem',
                    color: '#0d1117', letterSpacing: '1px', textTransform: 'uppercase', lineHeight: 1.4,
                }}>
                    {seg.tag}
                </span>
                <span aria-hidden="true" style={{
                    flexShrink: 0, fontSize: '0.75rem', color: accent,
                    transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease',
                }}>
                    ▾
                </span>
            </div>

            {/* Hover (desktop) / tap (mobile) reveal */}
            <div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows 0.35s ease' }}>
                <div style={{ overflow: 'hidden' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: '#0d1117', margin: '1.1rem 0 0.9rem', lineHeight: 1.35 }}>
                        {seg.title}
                    </h3>
                    {(seg.text || '').split('\n\n').map((para: string, pi: number) => (
                        <p key={pi} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#555', lineHeight: 1.8, marginBottom: '0.85rem' }}>{para}</p>
                    ))}
                    {seg.highlight && (
                        <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: primary, fontSize: '0.88rem', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                            {seg.highlight}
                        </p>
                    )}
                    {seg.ctaHref && (
                        <Link href={seg.ctaHref} style={{
                            fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.7rem',
                            letterSpacing: '1px', textTransform: 'uppercase', textDecoration: 'none',
                            color: primary, display: 'inline-block', paddingBottom: '0.25rem',
                        }}>
                            {seg.ctaLabel || 'Learn More →'}
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
