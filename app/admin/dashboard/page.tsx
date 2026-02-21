import Link from 'next/link';

const stats = [
    { label: 'Total Users', value: '0', change: '—', color: 'var(--color-primary)', icon: '👤' },
    { label: 'Assessment Completions', value: '0', change: '—', color: 'var(--color-secondary)', icon: '📊' },
    { label: 'Active Programs', value: '3', change: '—', color: 'var(--color-accent)', icon: '🎓' },
    { label: 'Applications Pending', value: '0', change: '—', color: 'var(--color-primary)', icon: '📋' },
    { label: 'Revenue (USD)', value: '$0', change: '—', color: 'var(--color-secondary)', icon: '💰' },
    { label: 'Newsletter Subscribers', value: '0', change: '—', color: 'var(--color-accent)', icon: '📧' },
    { label: 'Partner Leads', value: '0', change: '—', color: 'var(--color-primary)', icon: '🤝' },
    { label: 'Fellows Active', value: '0', change: '—', color: 'var(--color-secondary)', icon: '⭐' },
];

const recentApplications: any[] = [];

const quickLinks = [
    { label: 'Brand Settings', href: '/admin/brand', icon: '🎨', desc: 'Update colors, logo, typography' },
    { label: 'Applications', href: '/admin/applications', icon: '👩🏾‍🎓', desc: 'Review & process applications' },
    { label: 'Analytics', href: '/admin/analytics', icon: '📈', desc: 'Traffic & conversion data' },
    { label: 'Email Campaigns', href: '/admin/email', icon: '📧', desc: 'Manage email templates' },
];

export default function AdminDashboard() {
    return (
        <div>
            {/* Header - Very Tiny on Mobile */}
            <div style={{ marginBottom: '1.25rem' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', color: '#111', marginBottom: '0.15rem' }}>Overview</h1>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: '#9ca3af' }}>Platform activity snapshot</p>
            </div>

            {/* Stats Grid - High Density */}
            <div className="grid-cols-4-mobile-2" style={{ gap: '0.75rem', marginBottom: '1.5rem' }}>
                {stats.map((s) => (
                    <div key={s.label} className="stat-widget" style={{ borderLeftColor: s.color }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: '#111' }}>{s.value}</div>
                            <span style={{ fontSize: '1rem' }}>{s.icon}</span>
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
                    {recentApplications.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#9ca3af' }}>
                            No recent applications found.
                        </div>
                    ) : (
                        <>
                            <div className="hide-mobile">
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#f9fafb' }}>
                                            {['Applicant', 'Country', 'Program', 'Score', 'Status'].map((h) => (
                                                <th key={h} style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', padding: '10px 1.5rem', textAlign: 'left' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentApplications.map((app, i) => (
                                            <tr key={i} style={{ borderTop: '1px solid #f3f4f6' }}>
                                                <td style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 600, color: '#111', padding: '12px 1.5rem' }}>{app.name}</td>
                                                <td style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#6b7280', padding: '12px 1.5rem' }}>{app.country}</td>
                                                <td style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#6b7280', padding: '12px 1.5rem' }}>{app.program}</td>
                                                <td style={{ padding: '12px 1.5rem' }}>
                                                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 700, color: app.score >= 80 ? 'var(--color-primary)' : app.score >= 60 ? 'var(--color-secondary)' : 'var(--color-accent)' }}>
                                                        {app.score}/100
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 1.5rem' }}>
                                                    <span className={`badge ${app.status === 'Approved' ? 'badge-green' : app.status === 'Pending' ? 'badge-gray' : 'badge-gold'}`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Mobile Specific List View (Cards) */}
                            <div className="show-mobile" style={{ flexDirection: 'column' }}>
                                {recentApplications.map((app, i) => (
                                    <div key={i} style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 600, color: '#111' }}>{app.name}</div>
                                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#6b7280' }}>{app.country} · {app.program}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)' }}>{app.score}/100</div>
                                            <div className={`badge ${app.status === 'Approved' ? 'badge-green' : 'badge-gold'}`} style={{ fontSize: '0.6rem', padding: '1px 6px' }}>{app.status}</div>
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
                            {quickLinks.map((link) => (
                                <Link key={link.href} href={link.href} style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 8px',
                                    borderRadius: 8, textDecoration: 'none', background: '#f9fafb', border: '1px solid #f3f4f6', textAlign: 'center'
                                }}>
                                    <span style={{ fontSize: '1.25rem' }}>{link.icon}</span>
                                    <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.65rem', color: '#111', textTransform: 'uppercase' }}>{link.label}</div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Distribution - High Density */}
                    <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1rem 1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: '#111', marginBottom: '0.75rem' }}>Readiness Score</h3>
                        {[
                            { label: 'Ready', count: 0, color: 'var(--color-primary)' },
                            { label: 'Competitive', count: 0, color: 'var(--color-secondary)' },
                            { label: 'Dev', count: 0, color: '#f59e0b' },
                            { label: 'Basic', count: 0, color: 'var(--color-accent)' },
                        ].map((tier) => (
                            <div key={tier.label} style={{ marginBottom: '0.6rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: '#6b7280', fontWeight: 600 }}>{tier.label}</span>
                                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 700, color: tier.color }}>{tier.count}</span>
                                </div>
                                <div style={{ height: 4, background: '#f3f4f6', borderRadius: 2 }}>
                                    <div style={{ height: '100%', width: `0%`, background: tier.color, borderRadius: 2 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
