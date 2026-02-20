'use client';
import { useState } from 'react';

const applications = [
    { id: 1, name: 'Amara Kone', country: 'Côte d\'Ivoire', program: 'Fellowship', score: 78, status: 'Pending', date: 'Feb 18, 2026', email: 'amara@example.com', notes: 'Strong media background' },
    { id: 2, name: 'Fatima Yusuf', country: 'Nigeria', program: 'Bootcamp', score: 62, status: 'Under Review', date: 'Feb 17, 2026', email: 'fatima@example.com', notes: '' },
    { id: 3, name: 'Grace Mutuku', country: 'Kenya', program: 'Fellowship', score: 85, status: 'Approved', date: 'Feb 15, 2026', email: 'grace@example.com', notes: 'Former MP candidate' },
    { id: 4, name: 'Naledi Dlamini', country: 'South Africa', program: 'Digital Courses', score: 45, status: 'Pending', date: 'Feb 14, 2026', email: 'naledi@example.com', notes: '' },
    { id: 5, name: 'Mariama Balde', country: 'Guinea', program: 'Fellowship', score: 91, status: 'Approved', date: 'Feb 12, 2026', email: 'mariama@example.com', notes: 'Top performer' },
    { id: 6, name: 'Chisom Okafor', country: 'Nigeria', program: 'Bootcamp', score: 58, status: 'Rejected', date: 'Feb 10, 2026', email: 'chisom@example.com', notes: 'Reapply in 6 months' },
    { id: 7, name: 'Sylvie Razafinjatovo', country: 'Madagascar', program: 'Fellowship', score: 74, status: 'Under Review', date: 'Feb 9, 2026', email: 'sylvie@example.com', notes: '' },
];

const statusColors: Record<string, string> = { Pending: 'badge-gray', 'Under Review': 'badge-gold', Approved: 'badge-green', Rejected: 'badge-red' };

export default function ApplicationsPage() {
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    const filtered = applications.filter((a) =>
        (filter === 'All' || a.status === filter) &&
        (a.name.toLowerCase().includes(search.toLowerCase()) || a.country.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.6rem', color: '#111', marginBottom: '0.25rem' }}>Applications</h1>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#9ca3af' }}>Review, approve, and manage fellowship and program applications</p>
            </div>

            {/* Filters */}
            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                <input
                    type="text"
                    placeholder="Search by name or country..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ flex: 1, padding: '9px 14px', border: '1.5px solid #e5e0d6', borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', outline: 'none' }}
                />
                <div style={{ display: 'flex', gap: 6 }}>
                    {['All', 'Pending', 'Under Review', 'Approved', 'Rejected'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            style={{
                                padding: '7px 14px', borderRadius: 4, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 600,
                                background: filter === s ? '#1F6F3E' : '#fff', color: filter === s ? '#fff' : '#6b7280',
                                border: `1.5px solid ${filter === s ? '#1F6F3E' : '#e5e0d6'}`, transition: 'all 0.2s',
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
                <button className="btn-primary" style={{ fontSize: '0.78rem', padding: '9px 18px' }}>+ Export CSV</button>
            </div>

            {/* Table */}
            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f9fafb' }}>
                            {['Applicant', 'Country', 'Program', 'Score', 'Status', 'Date Applied', 'Actions'].map((h) => (
                                <th key={h} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', padding: '12px 1.25rem', textAlign: 'left', borderBottom: '1px solid #f3f4f6' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((app) => (
                            <tr key={app.id} style={{ borderTop: '1px solid #f3f4f6' }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#fafafa'; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                                <td style={{ padding: '14px 1.25rem' }}>
                                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', fontWeight: 600, color: '#111' }}>{app.name}</div>
                                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#9ca3af' }}>{app.email}</div>
                                </td>
                                <td style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.84rem', color: '#6b7280', padding: '14px 1.25rem' }}>{app.country}</td>
                                <td style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.84rem', color: '#6b7280', padding: '14px 1.25rem' }}>{app.program}</td>
                                <td style={{ padding: '14px 1.25rem' }}>
                                    <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '0.9rem', color: app.score >= 80 ? '#1F6F3E' : app.score >= 60 ? '#C9A227' : '#B22222' }}>
                                        {app.score}
                                    </span>
                                </td>
                                <td style={{ padding: '14px 1.25rem' }}>
                                    <span className={`badge ${statusColors[app.status]}`}>{app.status}</span>
                                </td>
                                <td style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#9ca3af', padding: '14px 1.25rem' }}>{app.date}</td>
                                <td style={{ padding: '14px 1.25rem' }}>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        {app.status !== 'Approved' && (
                                            <button style={{ padding: '5px 10px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 4, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Approve</button>
                                        )}
                                        {app.status !== 'Rejected' && (
                                            <button style={{ padding: '5px 10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 4, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Reject</button>
                                        )}
                                        <button style={{ padding: '5px 10px', background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: 4, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Email</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', color: '#9ca3af' }}>
                        No applications match your search.
                    </div>
                )}
            </div>
        </div>
    );
}
