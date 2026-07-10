'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import IconGlyph from '@/components/IconGlyph';

const quickLinks = [
    { label: 'Brand Settings', href: '/admin/brand', icon: '🎨', desc: 'Update colors, logo, typography' },
    { label: 'Applications', href: '/admin/applications', icon: '👩🏾‍🎓', desc: 'Review & process applications' },
    { label: 'Analytics', href: '/admin/analytics', icon: '📈', desc: 'Traffic & conversion data' },
    { label: 'Email Campaigns', href: '/admin/email', icon: '📧', desc: 'Manage email templates' },
];

export default function AdminDashboard() {
    const [applications, setApplications] = useState<any[]>([]);
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appsRes, subsRes] = await Promise.all([
                    fetch('/api/applications'),
                    fetch('/api/newsletter')
                ]);
                if (appsRes.status === 401 || subsRes.status === 401) {
                    window.location.href = '/admin/login';
                    return;
                }
                if (appsRes.ok) {
                    const appsData = await appsRes.json();
                    setApplications(appsData);
                }
                if (subsRes.ok) {
                    const subsData = await subsRes.json();
                    setSubscribers(subsData);
                }
            } catch (err) {
                console.error('Failed to load dashboard metrics:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const metrics = useMemo(() => {
        const uniqueEmails = new Set<string>();
        applications.forEach((a: any) => { if (a.email) uniqueEmails.add(a.email.toLowerCase()); });
        subscribers.forEach((s: any) => { if (s.email) uniqueEmails.add(s.email.toLowerCase()); });

        const totalUsers = uniqueEmails.size;
        const totalSubscribers = subscribers.length;

        const withScore = applications.filter((a: any) => a.assessmentScore !== undefined && a.assessmentScore !== null);
        const assessmentCompletions = withScore.length;

        const pendingApps = applications.filter((a: any) => (a.status || 'Pending').toLowerCase() === 'pending').length;

        const partnerLeads = applications.filter((a: any) => 
            (a.program || '').toLowerCase().includes('institutional')
        ).length;

        // Approved fellowship applications = active fellows
        const activeFellows = applications.filter((a: any) => 
            (a.status || '').toLowerCase() === 'approved' &&
            (a.program || '').toLowerCase().includes('fellowship')
        ).length;

        // Revenue derived from Approved applications
        const revenue = applications.reduce((acc: number, app: any) => {
            if ((app.status || '').toLowerCase() === 'approved') {
                const prog = (app.program || '').toLowerCase();
                if (prog.includes('fellowship')) return acc + 500;
                if (prog.includes('bootcamp') || prog.includes('leadership')) return acc + 250;
                if (prog.includes('digital') || prog.includes('course')) return acc + 120;
            }
            return acc;
        }, 0);

        // Readiness Score distribution
        let readyCount = 0;
        let competitiveCount = 0;
        let devCount = 0;
        let basicCount = 0;

        withScore.forEach((a: any) => {
            const score = Number(a.assessmentScore);
            if (score >= 80) readyCount++;
            else if (score >= 60) competitiveCount++;
            else if (score >= 40) devCount++;
            else basicCount++;
        });

        // 5 most recent applications
        const recentApps = [...applications]
            .sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())
            .slice(0, 5);

        return {
            totalUsers,
            assessmentCompletions,
            pendingApps,
            revenue,
            totalSubscribers,
            partnerLeads,
            activeFellows,
            readyCount,
            competitiveCount,
            devCount,
            basicCount,
            recentApps,
            withScoreCount: withScore.length
        };
    }, [applications, subscribers]);

    const stats = [
        { label: 'Total Users', value: metrics.totalUsers.toString(), color: 'var(--color-primary)', icon: '👤' },
        { label: 'Assessment Completions', value: metrics.assessmentCompletions.toString(), color: 'var(--color-secondary)', icon: '📊' },
        { label: 'Active Programs', value: '3', color: 'var(--color-accent)', icon: '🎓' },
        { label: 'Applications Pending', value: metrics.pendingApps.toString(), color: 'var(--color-primary)', icon: '📋' },
        { label: 'Revenue (USD)', value: `$${metrics.revenue.toLocaleString()}`, color: 'var(--color-secondary)', icon: '💰' },
        { label: 'Newsletter Subscribers', value: metrics.totalSubscribers.toString(), color: 'var(--color-accent)', icon: '📧' },
        { label: 'Partner Leads', value: metrics.partnerLeads.toString(), color: 'var(--color-primary)', icon: '🤝' },
        { label: 'Fellows Active', value: metrics.activeFellows.toString(), color: 'var(--color-secondary)', icon: '⭐' },
    ];

    const readyPct = metrics.withScoreCount > 0 ? (metrics.readyCount / metrics.withScoreCount) * 100 : 0;
    const competitivePct = metrics.withScoreCount > 0 ? (metrics.competitiveCount / metrics.withScoreCount) * 100 : 0;
    const devPct = metrics.withScoreCount > 0 ? (metrics.devCount / metrics.withScoreCount) * 100 : 0;
    const basicPct = metrics.withScoreCount > 0 ? (metrics.basicCount / metrics.withScoreCount) * 100 : 0;

    const distributionTiers = [
        { label: 'Ready (80-100)', count: metrics.readyCount, pct: readyPct, color: 'var(--color-primary)' },
        { label: 'Competitive (60-79)', count: metrics.competitiveCount, pct: competitivePct, color: 'var(--color-secondary)' },
        { label: 'Developing (40-59)', count: metrics.devCount, pct: devPct, color: '#f59e0b' },
        { label: 'Basic (<40)', count: metrics.basicCount, pct: basicPct, color: 'var(--color-accent)' },
    ];

    if (loading) {
        return (
            <div>
                {/* Header loading skeleton */}
                <div style={{ marginBottom: '1.25rem', height: '40px', background: '#e5e7eb', borderRadius: 4, width: '200px', animation: 'pulse 1.5s infinite ease-in-out' }} />
                
                {/* Stats Grid skeleton */}
                <div className="grid-cols-4-mobile-2" style={{ gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {Array.from({ length: 8 }).map((_, idx) => (
                        <div key={idx} style={{ height: '70px', background: '#e5e7eb', borderRadius: 8, animation: 'pulse 1.5s infinite ease-in-out', animationDelay: `${idx * 0.1}s` }} />
                    ))}
                </div>

                <div className="grid-cols-2-mobile-1" style={{ gap: '1.5rem' }}>
                    <div style={{ height: '300px', background: '#e5e7eb', borderRadius: 8, animation: 'pulse 1.5s infinite ease-in-out' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ height: '140px', background: '#e5e7eb', borderRadius: 8, animation: 'pulse 1.5s infinite ease-in-out' }} />
                        <div style={{ height: '140px', background: '#e5e7eb', borderRadius: 8, animation: 'pulse 1.5s infinite ease-in-out' }} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '1.25rem' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', color: '#111', marginBottom: '0.15rem' }}>Overview</h1>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: '#9ca3af' }}>Platform activity snapshot</p>
            </div>

            {/* Stats Grid - High Density */}
            <div className="grid-cols-4-mobile-2" style={{ gap: '0.75rem', marginBottom: '1.5rem' }}>
                {stats.map((s: any) => (
                    <div key={s.label} className="stat-widget" style={{ borderLeftColor: s.color }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: '#111' }}>{s.value}</div>
                            <span style={{ display: 'inline-flex', color: s.color }}><IconGlyph icon={s.icon} size={18} /></span>
                        </div>
                        <div className="label" style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px', marginTop: 'auto' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid-cols-2-mobile-1" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Recent Applications - Card Based for Mobile */}
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>Recent Activity</h3>
                        <Link href="/admin/applications" style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 700 }}>VIEW ALL</Link>
                    </div>
                    {metrics.recentApps.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#9ca3af' }}>
                            No recent applications found.
                        </div>
                    ) : (
                        <>
                            <div className="hide-mobile">
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#f9fafb' }}>
                                            {['Applicant', 'Country', 'Program', 'Score', 'Status'].map((h: string) => (
                                                <th key={h} style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', padding: '10px 1.5rem', textAlign: 'left' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {metrics.recentApps.map((app: any, i: number) => (
                                            <tr key={i} style={{ borderTop: '1px solid #f3f4f6' }}>
                                                <td style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 600, color: '#111', padding: '12px 1.5rem' }}>{app.name}</td>
                                                <td style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#6b7280', padding: '12px 1.5rem' }}>{app.country || '—'}</td>
                                                <td style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#6b7280', padding: '12px 1.5rem', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.program}</td>
                                                <td style={{ padding: '12px 1.5rem' }}>
                                                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 700, color: app.assessmentScore >= 80 ? 'var(--color-primary)' : app.assessmentScore >= 60 ? 'var(--color-secondary)' : '#f59e0b' }}>
                                                        {app.assessmentScore !== undefined && app.assessmentScore !== null ? `${app.assessmentScore}/100` : '—'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 1.5rem' }}>
                                                    <span className={`badge ${app.status === 'Approved' ? 'badge-green' : app.status === 'Rejected' ? 'badge-red' : 'badge-gold'}`}>
                                                        {app.status || 'Pending'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Mobile Specific List View (Cards) */}
                            <div className="show-mobile" style={{ flexDirection: 'column' }}>
                                {metrics.recentApps.map((app: any, i: number) => (
                                    <div key={i} style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 600, color: '#111' }}>{app.name}</div>
                                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#6b7280' }}>{app.country || '—'} · {app.program}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                                                {app.assessmentScore !== undefined && app.assessmentScore !== null ? `${app.assessmentScore}/100` : '—'}
                                            </div>
                                            <div className={`badge ${app.status === 'Approved' ? 'badge-green' : app.status === 'Rejected' ? 'badge-red' : 'badge-gold'}`} style={{ fontSize: '0.6rem', padding: '1px 6px' }}>{app.status || 'Pending'}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Quick Access - Compact Icons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1rem 1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: '#111', marginBottom: '0.75rem' }}>Shortcuts</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                            {quickLinks.map((link: any) => (
                                <Link key={link.href} href={link.href} style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 8px',
                                    borderRadius: 8, textDecoration: 'none', background: '#f9fafb', border: '1px solid #f3f4f6', textAlign: 'center'
                                }}>
                                    <span style={{ display: 'inline-flex', color: 'var(--color-primary)' }}><IconGlyph icon={link.icon} size={22} /></span>
                                    <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.65rem', color: '#111', textTransform: 'uppercase' }}>{link.label}</div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Distribution - High Density */}
                    <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1rem 1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: '#111', marginBottom: '0.75rem' }}>Readiness Score</h3>
                        {distributionTiers.map((tier: any) => (
                            <div key={tier.label} style={{ marginBottom: '0.6rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: '#6b7280', fontWeight: 600 }}>{tier.label}</span>
                                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 700, color: tier.color }}>{tier.count}</span>
                                </div>
                                <div style={{ height: 4, background: '#f3f4f6', borderRadius: 2 }}>
                                    <div style={{ height: '100%', width: `${tier.pct}%`, background: tier.color, borderRadius: 2 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
