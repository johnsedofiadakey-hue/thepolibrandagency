import Link from 'next/link';

const stats = [
    { label: 'Total Users', value: '1,342', change: '+12%', color: '#1F6F3E', icon: '👤' },
    { label: 'Assessment Completions', value: '896', change: '+8%', color: '#C9A227', icon: '📊' },
    { label: 'Active Programs', value: '3', change: '—', color: '#B22222', icon: '🎓' },
    { label: 'Applications Pending', value: '48', change: '+18%', color: '#1F6F3E', icon: '📋' },
    { label: 'Revenue (USD)', value: '$24,800', change: '+22%', color: '#C9A227', icon: '💰' },
    { label: 'Newsletter Subscribers', value: '3,201', change: '+5%', color: '#B22222', icon: '📧' },
    { label: 'Partner Leads', value: '14', change: '+3%', color: '#1F6F3E', icon: '🤝' },
    { label: 'Fellows Active', value: '27', change: '—', color: '#C9A227', icon: '⭐' },
];

const recentApplications = [
    { name: 'Amara Kone', country: 'Côte d\'Ivoire', program: 'Fellowship', score: 78, status: 'Pending' },
    { name: 'Fatima Yusuf', country: 'Nigeria', program: 'Bootcamp', score: 62, status: 'Under Review' },
    { name: 'Grace Mutuku', country: 'Kenya', program: 'Fellowship', score: 85, status: 'Approved' },
    { name: 'Naledi Dlamini', country: 'South Africa', program: 'Digital Courses', score: 45, status: 'Pending' },
    { name: 'Mariama Balde', country: 'Guinea', program: 'Fellowship', score: 91, status: 'Approved' },
];

const quickLinks = [
    { label: 'Brand Settings', href: '/admin/brand', icon: '🎨', desc: 'Update colors, logo, typography' },
    { label: 'Applications', href: '/admin/applications', icon: '👩🏾‍🎓', desc: 'Review & process applications' },
    { label: 'Analytics', href: '/admin/analytics', icon: '📈', desc: 'Traffic & conversion data' },
    { label: 'Email Campaigns', href: '/admin/email', icon: '📧', desc: 'Manage email templates' },
];

export default function AdminDashboard() {
    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.6rem', color: '#111', marginBottom: '0.25rem' }}>Admin Dashboard</h1>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#9ca3af' }}>Thursday, 19 February 2026 · Overview of platform activity</p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {stats.map((s) => (
                    <div key={s.label} className="stat-widget" style={{ borderLeftColor: s.color }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                            <span style={{
                                fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', fontWeight: 600,
                                color: s.change.startsWith('+') ? '#16a34a' : s.change === '—' ? '#9ca3af' : '#dc2626',
                                background: s.change.startsWith('+') ? '#f0fdf4' : s.change === '—' ? '#f9fafb' : '#fef2f2',
                                padding: '2px 8px', borderRadius: 10,
                            }}>
                                {s.change}
                            </span>
                        </div>
                        <div style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.6rem', color: '#111', marginBottom: '0.2rem' }}>{s.value}</div>
                        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Recent Applications Table */}
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1rem', color: '#111' }}>Recent Applications</h3>
                        <Link href="/admin/applications" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#1F6F3E', textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb' }}>
                                {['Applicant', 'Country', 'Program', 'Score', 'Status'].map((h) => (
                                    <th key={h} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', padding: '10px 1.5rem', textAlign: 'left' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {recentApplications.map((app, i) => (
                                <tr key={i} style={{ borderTop: '1px solid #f3f4f6' }}>
                                    <td style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600, color: '#111', padding: '12px 1.5rem' }}>{app.name}</td>
                                    <td style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#6b7280', padding: '12px 1.5rem' }}>{app.country}</td>
                                    <td style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#6b7280', padding: '12px 1.5rem' }}>{app.program}</td>
                                    <td style={{ padding: '12px 1.5rem' }}>
                                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: app.score >= 80 ? '#1F6F3E' : app.score >= 60 ? '#C9A227' : '#B22222' }}>
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

                {/* Quick Access */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.25rem 1.5rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1rem', color: '#111', marginBottom: '1rem' }}>Quick Access</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {quickLinks.map((link) => (
                                <Link key={link.href} href={link.href} style={{
                                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                                    borderRadius: 6, textDecoration: 'none', border: '1px solid #f3f4f6', transition: 'all 0.2s',
                                }}>
                                    <span style={{ fontSize: '1.2rem' }}>{link.icon}</span>
                                    <div>
                                        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#111' }}>{link.label}</div>
                                        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#9ca3af' }}>{link.desc}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Readiness Score Distribution */}
                    <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.25rem 1.5rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1rem', color: '#111', marginBottom: '1rem' }}>Readiness Score Distribution</h3>
                        {[
                            { label: 'Leadership Ready (91-100)', count: 42, color: '#1F6F3E' },
                            { label: 'Competitive (71-90)', count: 198, color: '#C9A227' },
                            { label: 'Development (41-70)', count: 412, color: '#f59e0b' },
                            { label: 'Foundational (0-40)', count: 244, color: '#B22222' },
                        ].map((tier) => (
                            <div key={tier.label} style={{ marginBottom: '0.75rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#6b7280' }}>{tier.label}</span>
                                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: tier.color }}>{tier.count}</span>
                                </div>
                                <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3 }}>
                                    <div style={{ height: '100%', width: `${(tier.count / 896) * 100}%`, background: tier.color, borderRadius: 3 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
