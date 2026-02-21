'use client';
import { useState } from 'react';

const partners: any[] = [];

const statusColors: Record<string, string> = {
    'Active Partner': 'badge-green', 'Proposal Sent': 'badge-gold',
    Negotiating: 'badge-red', Lead: 'badge-gray',
};

export default function PartnersPage() {
    const [showAdd, setShowAdd] = useState(false);

    return (
        <div>
            <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', color: '#111', marginBottom: '0.15rem' }}>Partners</h1>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: '#9ca3af' }}>Institutional CRM</p>
                </div>
                <button onClick={() => setShowAdd(!showAdd)} className="btn-primary" style={{ fontSize: '0.72rem', padding: '8px 14px' }}>+ New</button>
            </div>

            {/* Stats - High Density */}
            <div className="grid-cols-4-mobile-2" style={{ gap: '0.75rem', marginBottom: '1.5rem' }}>
                {[
                    { label: 'Total', value: 0, color: 'var(--color-primary)' },
                    { label: 'Active', value: 0, color: 'var(--color-primary)' },
                    { label: 'Negotiating', value: 0, color: 'var(--color-secondary)' },
                    { label: 'Leads', value: 0, color: '#6b7280' },
                ].map((s) => (
                    <div key={s.label} className="stat-widget" style={{ borderLeftColor: s.color, padding: '0.85rem' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: '#111', marginBottom: '0.1rem' }}>{s.value}</div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {showAdd && (
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1rem', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: '#111', marginBottom: '1rem' }}>Add Partner</h3>
                    <div className="grid-cols-2-mobile-1" style={{ gap: '0.75rem' }}>
                        {['Org Name', 'Type', 'Contact', 'Status', 'Proposal Date', 'Follow-up'].map((field) => (
                            <div key={field}>
                                <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{field}</label>
                                <input type="text" style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #e5e0d6', borderRadius: 4, fontFamily: 'var(--font-body)', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <button className="btn-primary" style={{ flex: 1, fontSize: '0.75rem', padding: '9px' }}>Save</button>
                        <button onClick={() => setShowAdd(false)} className="btn-outline-dark" style={{ flex: 1, fontSize: '0.75rem', padding: '9px' }}>Cancel</button>
                    </div>
                </div>
            )}

            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                {/* Desktop Table */}
                <div className="hide-mobile">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb' }}>
                                {['Organization', 'Type', 'Contact', 'Status', 'Actions'].map((h) => (
                                    <th key={h} style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', padding: '10px 1.25rem', textAlign: 'left', borderBottom: '1px solid #f3f4f6' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {partners.map((p) => (
                                <tr key={p.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                                    <td style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600, color: '#111', padding: '14px 1.25rem' }}>{p.org}</td>
                                    <td style={{ padding: '14px 1.25rem' }}><span className="badge badge-gray">{p.type}</span></td>
                                    <td style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#6b7280', padding: '14px 1.25rem' }}>{p.contact}</td>
                                    <td style={{ padding: '14px 1.25rem' }}><span className={`badge ${statusColors[p.status]}`}>{p.status}</span></td>
                                    <td style={{ padding: '14px 1.25rem' }}>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button style={{ padding: '4px 8px', background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: 4, fontSize: '0.65rem', fontWeight: 700 }}>Edit</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile List View */}
                <div className="show-mobile" style={{ flexDirection: 'column' }}>
                    {partners.map((p) => (
                        <div key={p.id} style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                <div>
                                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 700, color: '#111' }}>{p.org}</div>
                                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#9ca3af' }}>{p.type} · {p.contact}</div>
                                </div>
                                <span className={`badge ${statusColors[p.status]}`} style={{ fontSize: '0.55rem', padding: '1px 6px' }}>{p.status}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 6 }}>
                                <button style={{ flex: 1, padding: '7px', background: '#f9fafb', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700 }}>Edit Details</button>
                                <button style={{ padding: '7px 12px', background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700 }}>Email</button>
                            </div>
                        </div>
                    ))}
                    {partners.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#9ca3af' }}>
                            No partners found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
