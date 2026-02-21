export default function AdminAnalyticsPage() {
    const countryData = [
        { country: 'Nigeria', visitors: 4820, pct: 32 },
        { country: 'Kenya', visitors: 2640, pct: 17 },
        { country: 'Ghana', visitors: 1980, pct: 13 },
        { country: 'South Africa', visitors: 1740, pct: 11 },
        { country: 'Ethiopia', visitors: 1320, pct: 9 },
        { country: 'Côte d\'Ivoire', visitors: 900, pct: 6 },
        { country: 'Others', visitors: 1800, pct: 12 },
    ];

    const conversionMetrics = [
        { label: 'Visitor → Assessment Start', value: '38.4%', trend: '+2.1%', good: true },
        { label: 'Assessment Completion Rate', value: '71.2%', trend: '+4.8%', good: true },
        { label: 'Assessment → Application', value: '22.6%', trend: '+1.3%', good: true },
        { label: 'Application → Enrollment', value: '64.8%', trend: '-1.2%', good: false },
        { label: 'Newsletter Subscriber Rate', value: '18.9%', trend: '+3.5%', good: true },
        { label: 'Partner Lead Conversion', value: '8.2%', trend: '+0.7%', good: true },
    ];

    const programRevenue = [
        { program: 'Fellowship Program', revenue: 12400, enrollments: 27, avgScore: 81 },
        { program: 'Leadership Bootcamp', revenue: 8200, enrollments: 41, avgScore: 67 },
        { program: 'Digital Courses', revenue: 4200, enrollments: 88, avgScore: 55 },
    ];

    const monthlyData = [
        { month: 'Aug', visitors: 1200, applications: 18 },
        { month: 'Sep', visitors: 1480, applications: 22 },
        { month: 'Oct', visitors: 1820, applications: 31 },
        { month: 'Nov', visitors: 2100, applications: 38 },
        { month: 'Dec', visitors: 1640, applications: 26 },
        { month: 'Jan', visitors: 2680, applications: 45 },
        { month: 'Feb', visitors: 3200, applications: 54 },
    ];

    const maxVisitors = Math.max(...monthlyData.map((d) => d.visitors));

    return (
        <div>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.4rem', color: '#111', marginBottom: '0.15rem' }}>Analytics Dashboard</h1>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#9ca3af' }}>Performance metrics · Last 30 days</p>
            </div>

            {/* KPI Cards */}
            <div className="grid-cols-4-mobile-2" style={{ gap: '0.75rem', marginBottom: '1.5rem' }}>
                {[
                    { label: 'Visitors', value: '15,200', change: '+22%', color: '#1F6F3E' },
                    { label: 'Assessments', value: '896', change: '+8%', color: '#C9A227' },
                    { label: 'Revenue', value: '$24.8K', change: '+18%', color: '#1F6F3E' },
                    { label: 'Avg. Score', value: '64/100', change: '+3pt', color: '#C9A227' },
                ].map((kpi) => (
                    <div key={kpi.label} className="stat-widget" style={{ borderLeftColor: kpi.color }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="value" style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.1rem', color: '#111' }}>{kpi.value}</div>
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.55rem', fontWeight: 700, color: '#16a34a', background: '#f0fdf4', padding: '1px 6px', borderRadius: 10 }}>{kpi.change}</span>
                        </div>
                        <div className="label" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.6rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px', marginTop: 'auto' }}>{kpi.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid-cols-2-mobile-1" style={{ gridTemplateColumns: '2fr 1fr' }}>
                {/* Bar Chart */}
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.75rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.05rem', color: '#111', marginBottom: '1.5rem' }}>Monthly Visitors & Applications</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: 180 }}>
                        {monthlyData.map((d) => (
                            <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 150 }}>
                                    <div style={{ width: 16, background: '#1F6F3E', height: `${(d.visitors / maxVisitors) * 140}px`, borderRadius: '2px 2px 0 0', transition: 'height 0.8s ease' }} title={`${d.visitors} visitors`} />
                                    <div style={{ width: 16, background: '#C9A227', height: `${(d.applications / 60) * 140}px`, borderRadius: '2px 2px 0 0', transition: 'height 0.8s ease' }} title={`${d.applications} applications`} />
                                </div>
                                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#9ca3af' }}>{d.month}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 12, height: 12, background: '#1F6F3E', borderRadius: 2 }} />
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#6b7280' }}>Visitors</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 12, height: 12, background: '#C9A227', borderRadius: 2 }} />
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#6b7280' }}>Applications</span>
                        </div>
                    </div>
                </div>

                {/* Traffic by Country */}
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.75rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.05rem', color: '#111', marginBottom: '1.25rem' }}>Traffic by Country</h3>
                    {countryData.map((c) => (
                        <div key={c.country} style={{ marginBottom: '0.9rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#374151', fontWeight: 500 }}>{c.country}</span>
                                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 700, color: '#1F6F3E' }}>{c.pct}%</span>
                            </div>
                            <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3 }}>
                                <div style={{ height: '100%', width: `${c.pct}%`, background: 'linear-gradient(90deg, #1F6F3E, #2a9154)', borderRadius: 3, transition: 'width 1s ease' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Conversion Funnel + Revenue */}
            <div className="grid-cols-2-mobile-1" style={{ gap: '1.5rem', marginTop: '1.5rem' }}>
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.75rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.05rem', color: '#111', marginBottom: '1.25rem' }}>Conversion Metrics</h3>
                    {conversionMetrics.map((m) => (
                        <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#374151' }}>{m.label}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>{m.value}</span>
                                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', fontWeight: 600, color: m.good ? '#16a34a' : '#dc2626', background: m.good ? '#f0fdf4' : '#fef2f2', padding: '2px 8px', borderRadius: 10 }}>{m.trend}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.75rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.05rem', color: '#111', marginBottom: '1.25rem' }}>Revenue by Program</h3>
                    {programRevenue.map((p) => (
                        <div key={p.program} style={{ background: '#f9fafb', borderRadius: 6, padding: '1rem', marginBottom: '0.75rem', border: '1px solid #f3f4f6' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.85rem', color: '#111' }}>{p.program}</span>
                                <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '0.9rem', color: '#1F6F3E' }}>${p.revenue.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#6b7280' }}>
                                    <span style={{ fontWeight: 600 }}>{p.enrollments}</span> enrolled
                                </div>
                                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#6b7280' }}>
                                    Avg. score: <span style={{ fontWeight: 600, color: p.avgScore >= 80 ? '#1F6F3E' : '#C9A227' }}>{p.avgScore}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
