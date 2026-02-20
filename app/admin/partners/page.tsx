'use client';
import { useState } from 'react';

const partners = [
    { id: 1, org: 'African Women in Leadership Org', type: 'NGO', contact: 'Dr. Aisha Diallo', status: 'Active Partner', proposalSent: 'Jan 5, 2026', followup: 'Mar 1, 2026' },
    { id: 2, org: 'West Africa Democracy Fund', type: 'Democracy Body', contact: 'Mr. Kojo Mensah', status: 'Proposal Sent', proposalSent: 'Feb 10, 2026', followup: 'Feb 25, 2026' },
    { id: 3, org: 'National Democratic Party – Kenya', type: 'Political Party', contact: 'Hon. Grace Otieno', status: 'Negotiating', proposalSent: 'Jan 20, 2026', followup: 'Mar 5, 2026' },
    { id: 4, org: 'UN Women – West Africa', type: 'International Org', contact: 'Ms. Sophie Laurent', status: 'Active Partner', proposalSent: 'Nov 15, 2025', followup: 'Apr 1, 2026' },
    { id: 5, org: 'Rwanda Gender Monitoring Office', type: 'Government', contact: 'Dr. Claire Mutoni', status: 'Lead', proposalSent: '—', followup: 'Mar 15, 2026' },
];

const statusColors: Record<string, string> = {
    'Active Partner': 'badge-green', 'Proposal Sent': 'badge-gold',
    Negotiating: 'badge-red', Lead: 'badge-gray',
};

export default function PartnersPage() {
    const [showAdd, setShowAdd] = useState(false);

    return (
        <div>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.6rem', color: '#111', marginBottom: '0.25rem' }}>Partnership CRM</h1>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#9ca3af' }}>Track and manage institutional partner relationships</p>
                </div>
                <button onClick={() => setShowAdd(!showAdd)} className="btn-primary" style={{ fontSize: '0.82rem' }}>+ Add Partner</button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                    { label: 'Total Partners', value: 5, color: '#1F6F3E' },
                    { label: 'Active Partners', value: 2, color: '#16a34a' },
                    { label: 'In Negotiation', value: 1, color: '#C9A227' },
                    { label: 'New Leads', value: 1, color: '#6b7280' },
                ].map((s) => (
                    <div key={s.label} className="stat-widget" style={{ borderLeftColor: s.color }}>
                        <div style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.6rem', color: '#111' }}>{s.value}</div>
                        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#9ca3af' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {showAdd && (
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1rem', color: '#111', marginBottom: '1.25rem' }}>Add New Partner</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        {['Organization Name', 'Type', 'Contact Person', 'Status', 'Proposal Sent Date', 'Follow-up Date'].map((field) => (
                            <div key={field}>
                                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{field}</label>
                                <input type="text" style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e5e0d6', borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                        <button className="btn-primary" style={{ fontSize: '0.82rem', padding: '10px 20px' }}>Save Partner</button>
                        <button onClick={() => setShowAdd(false)} className="btn-outline-dark" style={{ fontSize: '0.82rem', padding: '10px 20px' }}>Cancel</button>
                    </div>
                </div>
            )}

            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f9fafb' }}>
                            {['Organization', 'Type', 'Contact', 'Status', 'Proposal Sent', 'Follow-up', 'Actions'].map((h) => (
                                <th key={h} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', padding: '10px 1.25rem', textAlign: 'left', borderBottom: '1px solid #f3f4f6' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {partners.map((p) => (
                            <tr key={p.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                                <td style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', fontWeight: 600, color: '#111', padding: '14px 1.25rem', maxWidth: 200 }}>{p.org}</td>
                                <td style={{ padding: '14px 1.25rem' }}><span className="badge badge-gray">{p.type}</span></td>
                                <td style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#6b7280', padding: '14px 1.25rem' }}>{p.contact}</td>
                                <td style={{ padding: '14px 1.25rem' }}><span className={`badge ${statusColors[p.status]}`}>{p.status}</span></td>
                                <td style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#9ca3af', padding: '14px 1.25rem' }}>{p.proposalSent}</td>
                                <td style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#9ca3af', padding: '14px 1.25rem' }}>{p.followup}</td>
                                <td style={{ padding: '14px 1.25rem' }}>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <button style={{ padding: '5px 10px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 4, fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Edit</button>
                                        <button style={{ padding: '5px 10px', background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: 4, fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Email</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
