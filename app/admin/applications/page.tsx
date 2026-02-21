'use client';
import { useState } from 'react';

const applications: any[] = [];

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
            <div style={{ marginBottom: '1.25rem' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', color: '#111', marginBottom: '0.15rem' }}>Applications</h1>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: '#9ca3af' }}>Manage program applicants</p>
            </div>

            {/* Filters - High Density */}
            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #e5e0d6', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: '0.8rem', outline: 'none' }}
                    />
                    <button className="btn-primary hide-mobile" style={{ fontSize: '0.75rem', padding: '8px 16px' }}>Export</button>
                </div>
                <div className="admin-nav" style={{
                    display: 'flex',
                    gap: 4,
                    overflowX: 'auto',
                    paddingBottom: 4,
                    justifyContent: 'flex-start'
                }}>
                    {['All', 'Pending', 'Review', 'Approved', 'Rejected'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s === 'Review' ? 'Under Review' : s)}
                            style={{
                                padding: '6px 12px', borderRadius: 16, cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 700,
                                background: (filter === s || (filter === 'Under Review' && s === 'Review')) ? 'var(--color-primary)' : '#f9fafb',
                                color: (filter === s || (filter === 'Under Review' && s === 'Review')) ? '#fff' : '#6b7280',
                                border: `1px solid ${(filter === s || (filter === 'Under Review' && s === 'Review')) ? 'var(--color-primary)' : '#e5e7eb'}`,
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Data Container */}
            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                {/* Desktop Table */}
                <div className="hide-mobile">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb' }}>
                                {['Applicant', 'Country', 'Program', 'Score', 'Status', 'Actions'].map((h) => (
                                    <th key={h} style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', padding: '12px 1.25rem', textAlign: 'left', borderBottom: '1px solid #f3f4f6' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((app) => (
                                <tr key={app.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '14px 1.25rem' }}>
                                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600, color: '#111' }}>{app.name}</div>
                                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#9ca3af' }}>{app.email}</div>
                                    </td>
                                    <td style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: '#6b7280', padding: '14px 1.25rem' }}>{app.country}</td>
                                    <td style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: '#6b7280', padding: '14px 1.25rem' }}>{app.program}</td>
                                    <td style={{ padding: '14px 1.25rem' }}>
                                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: app.score >= 80 ? 'var(--color-primary)' : app.score >= 60 ? 'var(--color-secondary)' : 'var(--color-accent)' }}>
                                            {app.score}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 1.25rem' }}>
                                        <span className={`badge ${statusColors[app.status]}`}>{app.status}</span>
                                    </td>
                                    <td style={{ padding: '14px 1.25rem' }}>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button style={{ padding: '4px 8px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 4, fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer' }}>Approve</button>
                                            <button style={{ padding: '4px 8px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 4, fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer' }}>Reject</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card List */}
                <div className="show-mobile" style={{ flexDirection: 'column' }}>
                    {filtered.map((app) => (
                        <div key={app.id} style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <div>
                                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 700, color: '#111' }}>{app.name}</div>
                                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#9ca3af' }}>{app.country} · {app.program}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-primary)' }}>{app.score}</div>
                                    <span className={`badge ${statusColors[app.status]}`} style={{ fontSize: '0.55rem', padding: '1px 6px' }}>{app.status}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 6 }}>
                                <button style={{ flex: 1, padding: '7px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700 }}>Approve</button>
                                <button style={{ flex: 1, padding: '7px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700 }}>Reject</button>
                                <button style={{ padding: '7px 12px', background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700 }}>...</button>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#9ca3af' }}>
                        No results found.
                    </div>
                )}
            </div>
        </div>
    );
}
