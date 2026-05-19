'use client';

import { useState, useEffect, useMemo } from 'react';

const statusColors: Record<string, string> = {
    'Active Partner': 'badge-green',
    'Proposal Sent': 'badge-gold',
    'Negotiating': 'badge-red',
    'Lead': 'badge-gray',
};

export default function PartnersPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form fields for a new B2B Partner Lead
    const [orgName, setOrgName] = useState('');
    const [partnerType, setPartnerType] = useState('NGO & Civic Programs');
    const [contactName, setContactName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [leadStatus, setLeadStatus] = useState('Lead');

    const fetchPartners = async () => {
        try {
            const res = await fetch('/api/applications');
            if (res.ok) {
                const data = await res.json();
                setApplications(data);
            }
        } catch (err) {
            console.error('Failed to load partners:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    // Filter and map B2B Leads dynamically
    const partnersList = useMemo(() => {
        return applications
            .filter((app: any) => 
                (app.program || '').toLowerCase().includes('institutional') ||
                (app.program || '').toLowerCase().includes('partnership')
            )
            .map((app: any) => {
                // Map legacy 'Pending' / 'Approved' status to premium CRM categories
                let currentStatus = app.status || 'Lead';
                if (currentStatus === 'Pending') currentStatus = 'Lead';
                if (currentStatus === 'Approved') currentStatus = 'Active Partner';
                if (currentStatus === 'Rejected') currentStatus = 'Negotiating';

                // Org name logic: if B2B form added, firstName holds the OrgName, and lastName is '(B2B)'
                const isManualB2B = app.lastName === '(B2B)';
                const org = isManualB2B 
                    ? app.firstName 
                    : `${app.firstName} ${app.lastName}`;

                return {
                    id: app.id,
                    org,
                    type: app.role || 'B2B Partner Proposal',
                    contactName: isManualB2B ? 'Direct Contact' : `${app.firstName} ${app.lastName}`,
                    contact: `${app.email}${app.phone ? ` / ${app.phone}` : ''}`,
                    email: app.email,
                    status: currentStatus,
                    rawStatus: app.status
                };
            });
    }, [applications]);

    const stats = useMemo(() => {
        const total = partnersList.length;
        const active = partnersList.filter(p => p.status === 'Active Partner').length;
        const negotiating = partnersList.filter(p => p.status === 'Negotiating').length;
        const leads = partnersList.filter(p => p.status === 'Lead' || p.status === 'Proposal Sent').length;

        return [
            { label: 'Total B2B Leads', value: total, color: 'var(--color-primary)' },
            { label: 'Active Partners', value: active, color: 'var(--color-primary)' },
            { label: 'In Negotiations', value: negotiating, color: 'var(--color-secondary)' },
            { label: 'Open Opportunities', value: leads, color: '#6b7280' },
        ];
    }, [partnersList]);

    // Handle inline status toggle
    const handleStatusChange = async (id: number, nextStatus: string) => {
        try {
            // Optimistically update local application status list
            setApplications(prev => 
                prev.map((app: any) => {
                    if (Number(app.id) === Number(id)) {
                        // Map internal status back for standard endpoints
                        let mappedStatus = nextStatus;
                        if (nextStatus === 'Active Partner') mappedStatus = 'Approved';
                        return { ...app, status: mappedStatus };
                    }
                    return app;
                })
            );

            // Send patch request
            let payloadStatus = nextStatus;
            if (nextStatus === 'Active Partner') payloadStatus = 'Approved';

            await fetch('/api/applications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: payloadStatus }),
            });
        } catch (err) {
            console.error('Failed to patch partner status:', err);
            fetchPartners(); // Rollback on error
        }
    };

    // Save a manually added partner
    const handleAddPartner = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orgName) {
            alert('Organization Name is required.');
            return;
        }
        setSaving(true);
        try {
            const newLead = {
                firstName: orgName,
                lastName: '(B2B)',
                email: email || 'partnership@polibrand.org',
                phone: phone || '',
                role: partnerType,
                program: 'Institutional Partnership Proposal',
                status: leadStatus === 'Active Partner' ? 'Approved' : leadStatus,
                essay: `Added manually by Admin. Contact Person: ${contactName || 'None'}`
            };

            const res = await fetch('/api/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newLead)
            });

            if (res.ok) {
                // Clear fields & refresh list
                setOrgName('');
                setContactName('');
                setEmail('');
                setPhone('');
                setPartnerType('NGO & Civic Programs');
                setLeadStatus('Lead');
                setShowAdd(false);
                await fetchPartners();
            } else {
                alert('Failed to save B2B Partner lead.');
            }
        } catch (error) {
            console.error('Add B2B Partner error:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div>
                {/* Header skeleton */}
                <div style={{ marginBottom: '1.25rem', height: '40px', background: '#e5e7eb', borderRadius: 4, width: '200px', animation: 'pulse 1.5s infinite ease-in-out' }} />
                
                {/* Widgets skeleton */}
                <div className="grid-cols-4-mobile-2" style={{ gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <div key={idx} style={{ height: '70px', background: '#e5e7eb', borderRadius: 8, animation: 'pulse 1.5s infinite ease-in-out' }} />
                    ))}
                </div>

                {/* Table skeleton */}
                <div style={{ height: '300px', background: '#e5e7eb', borderRadius: 8, animation: 'pulse 1.5s infinite ease-in-out' }} />
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', color: '#111', marginBottom: '0.15rem' }}>Partners</h1>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: '#9ca3af' }}>Institutional CRM</p>
                </div>
                <button onClick={() => setShowAdd(!showAdd)} className="btn-primary" style={{ fontSize: '0.72rem', padding: '8px 14px', whiteSpace: 'nowrap' }}>
                    {showAdd ? 'Cancel' : '+ New Lead'}
                </button>
            </div>

            {/* B2B CRM Widgets */}
            <div className="grid-cols-4-mobile-2" style={{ gap: '0.75rem', marginBottom: '1.5rem' }}>
                {stats.map((s) => (
                    <div key={s.label} className="stat-widget" style={{ borderLeftColor: s.color }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: '#111', marginBottom: '0.1rem' }}>{s.value}</div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* New B2B Lead Form */}
            {showAdd && (
                <form onSubmit={handleAddPartner} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.03)', animation: 'fadeIn 0.2s ease-out' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: '#111', marginBottom: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem' }}>Add B2B Partner Lead</h3>
                    <div className="grid-cols-2-mobile-1" style={{ gap: '0.75rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>Organization / Client Name *</label>
                            <input required type="text" placeholder="e.g. UN Women Initiative" value={orgName} onChange={(e) => setOrgName(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #e5e0d6', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                        <div>
                            <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>Partnership Type</label>
                            <select value={partnerType} onChange={(e) => setPartnerType(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #e5e0d6', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: '0.8rem', outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
                                <option>NGO & Civic Programs</option>
                                <option>Political Parties</option>
                                <option>Government Agencies</option>
                                <option>Corporate CSR Advocacy</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>Contact Person</label>
                            <input type="text" placeholder="e.g. Director Sarah Jane" value={contactName} onChange={(e) => setContactName(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #e5e0d6', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                        <div>
                            <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>Email Address</label>
                            <input type="email" placeholder="contact@organization.org" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #e5e0d6', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                        <div>
                            <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>Phone Number</label>
                            <input type="text" placeholder="+233 24 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #e5e0d6', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                        <div>
                            <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>Initial CRM Status</label>
                            <select value={leadStatus} onChange={(e) => setLeadStatus(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #e5e0d6', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: '0.8rem', outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
                                <option>Lead</option>
                                <option>Proposal Sent</option>
                                <option>Negotiating</option>
                                <option>Active Partner</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
                        <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 1, fontSize: '0.75rem', padding: '10px' }}>
                            {saving ? 'Saving...' : 'Add Lead Record'}
                        </button>
                        <button type="button" onClick={() => setShowAdd(false)} className="btn-outline-dark" style={{ flex: 1, fontSize: '0.75rem', padding: '10px' }}>Cancel</button>
                    </div>
                </form>
            )}

            {/* B2B CRM Table */}
            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                {/* Desktop View */}
                <div className="hide-mobile">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb' }}>
                                {['Organization', 'Type', 'Contact Details', 'CRM Lead Status', 'Actions'].map((h) => (
                                    <th key={h} style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', padding: '10px 1.25rem', textAlign: 'left', borderBottom: '1px solid #f3f4f6' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {partnersList.map((p) => (
                                <tr key={p.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                                    <td style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 600, color: '#111', padding: '14px 1.25rem' }}>
                                        {p.org}
                                    </td>
                                    <td style={{ padding: '14px 1.25rem' }}>
                                        <span className="badge badge-gray" style={{ fontSize: '0.65rem' }}>{p.type}</span>
                                    </td>
                                    <td style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#6b7280', padding: '14px 1.25rem' }}>
                                        {p.contact}
                                    </td>
                                    <td style={{ padding: '14px 1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <span className={`badge ${statusColors[p.status]}`} style={{ width: 10, height: 10, borderRadius: '50%', padding: 0, display: 'inline-block' }} />
                                            <select
                                                value={p.status}
                                                onChange={(e) => handleStatusChange(p.id, e.target.value)}
                                                style={{ border: 'none', fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, outline: 'none', background: 'transparent', cursor: 'pointer', color: '#374151' }}
                                            >
                                                <option>Lead</option>
                                                <option>Proposal Sent</option>
                                                <option>Negotiating</option>
                                                <option>Active Partner</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 1.25rem' }}>
                                        <a href={`mailto:${p.email}?subject=Partnership%20Proposal%20-%20Polibrand%20Agency`} style={{ padding: '4px 8px', background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: 4, fontSize: '0.65rem', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
                                            Email Client
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card List */}
                <div className="show-mobile" style={{ flexDirection: 'column' }}>
                    {partnersList.map((p) => (
                        <div key={p.id} style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                <div>
                                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 700, color: '#111' }}>{p.org}</div>
                                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#9ca3af', marginTop: 2 }}>{p.type}</div>
                                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#6b7280', marginTop: 2 }}>{p.contact}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'space-between', background: '#f9fafb', padding: '6px 10px', borderRadius: 6, border: '1px solid #f3f4f6' }}>
                                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: '#6b7280', fontWeight: 600 }}>Lead Status:</span>
                                <select
                                    value={p.status}
                                    onChange={(e) => handleStatusChange(p.id, e.target.value)}
                                    style={{ border: 'none', fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 700, outline: 'none', background: 'transparent', cursor: 'pointer', color: '#111' }}
                                >
                                    <option>Lead</option>
                                    <option>Proposal Sent</option>
                                    <option>Negotiating</option>
                                    <option>Active Partner</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: 6, marginTop: '0.75rem' }}>
                                <a href={`mailto:${p.email}?subject=Partnership%20Proposal%20-%20Polibrand%20Agency`} style={{ flex: 1, padding: '8px', background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
                                    Email Partner
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {partnersList.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3.5rem 1rem', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#9ca3af' }}>
                        No B2B Partnership leads registered.
                    </div>
                )}
            </div>
        </div>
    );
}
