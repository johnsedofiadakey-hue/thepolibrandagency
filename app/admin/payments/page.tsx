'use client';

import { useState, useEffect, useMemo } from 'react';

export default function PaymentsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newPrice, setNewPrice] = useState<Record<string, string>>({});

    // Paystack integration
    const [publicKey, setPublicKey] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [showSecret, setShowSecret] = useState(false);
    const [keySaving, setKeySaving] = useState(false);
    const [keySaved, setKeySaved] = useState(false);
    const [keyError, setKeyError] = useState('');

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const res = await fetch('/api/applications');
                if (res.ok) {
                    const data = await res.json();
                    setApplications(data);
                }
            } catch (err) {
                console.error('Failed to load payments applications:', err);
            } finally {
                setLoading(false);
            }
        };

        const fetchKeys = async () => {
            try {
                const res = await fetch('/api/integrations');
                if (res.ok) {
                    const d = await res.json();
                    setPublicKey(d?.paystack?.publicKey || '');
                    setSecretKey(d?.paystack?.secretKey || '');
                }
            } catch { /* silent */ }
        };

        fetchApps();
        fetchKeys();
    }, []);

    const handleSaveKeys = async () => {
        setKeySaving(true);
        setKeyError('');
        setKeySaved(false);
        try {
            const res = await fetch('/api/integrations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paystack: { publicKey, secretKey } }),
            });
            if (res.ok) {
                setKeySaved(true);
                setTimeout(() => setKeySaved(false), 3000);
            } else {
                const d = await res.json().catch(() => null);
                setKeyError(d?.error || 'Failed to save.');
            }
        } catch { setKeyError('Network error. Please try again.'); }
        finally { setKeySaving(false); }
    };

    const isConfigured = publicKey.startsWith('pk_') && secretKey.length > 8;

    const data = useMemo(() => {
        // Derive dynamic transactions from Approved applications
        const transactionsList = applications
            .filter((a: any) => (a.status || '').toLowerCase() === 'approved')
            .map((app: any) => {
                let amount = 0;
                const prog = (app.program || '').toLowerCase();
                if (prog.includes('fellowship')) amount = 7500;
                else if (prog.includes('bootcamp') || prog.includes('leadership')) amount = 3750;
                else if (prog.includes('digital') || prog.includes('course')) amount = 1800;
                else return null;

                return {
                    id: app.id || Date.now(),
                    name: app.name || 'Anonymous',
                    program: app.program || 'Polibrand Course',
                    amount: amount,
                    status: 'Completed',
                    date: app.timestamp ? new Date(app.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'
                };
            })
            .filter(Boolean) as any[];

        // Count enrollments by program (approved only)
        let fellowshipCount = 0;
        let bootcampCount = 0;
        let courseCount = 0;

        applications.forEach((app: any) => {
            if ((app.status || '').toLowerCase() === 'approved') {
                const prog = (app.program || '').toLowerCase();
                if (prog.includes('fellowship')) fellowshipCount++;
                else if (prog.includes('bootcamp') || prog.includes('leadership')) bootcampCount++;
                else if (prog.includes('digital') || prog.includes('course')) courseCount++;
            }
        });

        const programs = [
            { name: 'Fellowship Program', price: 7500, currency: 'GHS', enrolled: fellowshipCount },
            { name: 'Leadership Bootcamp', price: 3750, currency: 'GHS', enrolled: bootcampCount },
            { name: 'Digital Courses', price: 1800, currency: 'GHS', enrolled: courseCount },
        ];

        return {
            transactions: transactionsList,
            programs
        };
    }, [applications]);

    if (loading) {
        return (
            <div>
                {/* Header skeleton */}
                <div style={{ marginBottom: '1.25rem', height: '40px', background: '#e5e7eb', borderRadius: 4, width: '200px', animation: 'pulse 1.5s infinite ease-in-out' }} />
                
                {/* Grid skeleton */}
                <div className="grid-cols-2-mobile-1" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ height: '220px', background: '#e5e7eb', borderRadius: 8, animation: 'pulse 1.5s infinite ease-in-out' }} />
                    <div style={{ height: '220px', background: '#e5e7eb', borderRadius: 8, animation: 'pulse 1.5s infinite ease-in-out' }} />
                </div>

                {/* Table skeleton */}
                <div style={{ height: '260px', background: '#e5e7eb', borderRadius: 8, animation: 'pulse 1.5s infinite ease-in-out' }} />
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: '1.25rem' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', color: '#111', marginBottom: '0.15rem' }}>Payments</h1>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: '#9ca3af' }}>Pricing & Transactions</p>
            </div>

            {/* Paystack Integration */}
            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.25rem', marginBottom: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: '#111', marginBottom: 2 }}>Payment Integration · Paystack</h3>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#9ca3af' }}>Enter your Paystack keys to enable ₵1,500 payment collection on the application form.</p>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.65rem', fontWeight: 700, fontFamily: 'var(--font-body)', background: isConfigured ? '#dcfce7' : '#f3f4f6', color: isConfigured ? '#166534' : '#6b7280' }}>
                        {isConfigured ? '● ACTIVE' : '● NOT SET'}
                    </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                        <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 5 }}>Public Key</label>
                        <input type="text" value={publicKey} onChange={e => setPublicKey(e.target.value)} placeholder="pk_live_..." style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e5e0d6', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                        <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 5 }}>Secret Key</label>
                        <div style={{ position: 'relative' }}>
                            <input type={showSecret ? 'text' : 'password'} value={secretKey} onChange={e => setSecretKey(e.target.value)} placeholder="sk_live_..." style={{ width: '100%', padding: '9px 40px 9px 12px', border: '1.5px solid #e5e0d6', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
                            <button type="button" onClick={() => setShowSecret(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '0.65rem', fontWeight: 700 }}>{showSecret ? 'HIDE' : 'SHOW'}</button>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <button onClick={handleSaveKeys} disabled={keySaving} className="btn-primary" style={{ fontSize: '0.72rem', padding: '8px 18px', opacity: keySaving ? 0.6 : 1 }}>
                        {keySaving ? 'Saving...' : 'Save Keys'}
                    </button>
                    {keySaved && <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>✓ Saved</span>}
                    {keyError && <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#b91c1c' }}>{keyError}</span>}
                    <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: '#9ca3af' }}>Find keys at <strong>dashboard.paystack.com</strong> → Settings → API Keys</span>
                </div>
            </div>

            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', color: '#9a3412', borderRadius: 8, padding: '0.85rem 1rem', marginBottom: '1rem', fontFamily: 'var(--font-body)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                {isConfigured ? 'Payment gateway active — applications now require ₵1,500 via Paystack before submission.' : 'Payment gateway not connected. Add Paystack keys above to activate. Figures below are from approved applications only.'}
            </div>

            <div className="grid-cols-2-mobile-1" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Program Pricing - High Density */}
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1rem 1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: '#111', marginBottom: '1rem' }}>Pricing & Enrollments</h3>
                    {data.programs.map((p) => (
                        <div key={p.name} style={{ marginBottom: '0.75rem', padding: '0.75rem', background: '#f9fafb', borderRadius: 8, border: '1px solid #f3f4f6' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.8rem', color: '#111' }}>{p.name}</div>
                                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 700 }}>{p.enrolled} Enrolled</div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e5e0d6', background: '#fff', borderRadius: 6, overflow: 'hidden', flex: 1 }}>
                                    <span style={{ padding: '6px 8px', background: '#f9fafb', fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#9ca3af', fontWeight: 700 }}>₵</span>
                                    <input
                                        type="number"
                                        value={newPrice[p.name] ?? p.price}
                                        onChange={(e) => setNewPrice({ ...newPrice, [p.name]: e.target.value })}
                                        style={{ padding: '6px 4px', border: 'none', fontFamily: 'var(--font-body)', fontSize: '0.85rem', outline: 'none', width: '100%' }}
                                    />
                                </div>
                                <button disabled className="btn-primary" style={{ fontSize: '0.65rem', padding: '8px 12px', opacity: 0.55, cursor: 'not-allowed' }}>Save</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Coupon Codes - Compact */}
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1rem 1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: '#111', marginBottom: '1rem' }}>Active Coupons</h3>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', fontFamily: 'var(--font-body)', marginBottom: '0.75rem' }}>No coupons created yet. Apply discount codes for special campaigns.</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input type="text" placeholder="Code" style={{ flex: 1, padding: '8px 10px', border: '1.5px solid #e5e0d6', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: '0.8rem', outline: 'none' }} />
                            <input type="text" placeholder="%" style={{ width: 60, padding: '8px 10px', border: '1.5px solid #e5e0d6', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: '0.8rem', outline: 'none' }} />
                        </div>
                        <button disabled className="btn-primary" style={{ width: '100%', fontSize: '0.75rem', padding: '10px', opacity: 0.55, cursor: 'not-allowed' }}>Create New Code</button>
                    </div>
                </div>
            </div>

            {/* Transaction Log - Responsive */}
            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>Transactions</h3>
                    <button disabled className="hide-mobile" style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#9ca3af', background: 'none', border: 'none', cursor: 'not-allowed', fontWeight: 700 }}>EXPORT</button>
                </div>

                {/* Desktop Table */}
                <div className="hide-mobile">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb' }}>
                                {['Name', 'Program', 'Amount', 'Status', 'Date'].map((h) => (
                                    <th key={h} style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', padding: '10px 1.25rem', textAlign: 'left', borderBottom: '1px solid #f3f4f6' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.transactions.map((tx) => (
                                <tr key={tx.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                                    <td style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 600, color: '#111', padding: '12px 1.25rem' }}>{tx.name}</td>
                                    <td style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#6b7280', padding: '12px 1.25rem' }}>{tx.program}</td>
                                    <td style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 700, color: '#111', padding: '12px 1.25rem' }}>₵{tx.amount.toLocaleString()}</td>
                                    <td style={{ padding: '12px 1.25rem' }}>
                                        <span className={`badge ${tx.status === 'Completed' ? 'badge-green' : 'badge-gold'}`}>{tx.status}</span>
                                    </td>
                                    <td style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: '#9ca3af', padding: '12px 1.25rem' }}>{tx.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card List */}
                <div className="show-mobile" style={{ flexDirection: 'column' }}>
                    {data.transactions.map((tx) => (
                        <div key={tx.id} style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 700, color: '#111' }}>{tx.name}</div>
                                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#9ca3af' }}>{tx.program} · {tx.date}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 800, color: '#111' }}>₵{tx.amount.toLocaleString()}</div>
                                <span className={`badge ${tx.status === 'Completed' ? 'badge-green' : 'badge-gold'}`} style={{ fontSize: '0.55rem', padding: '1px 6px' }}>{tx.status}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {data.transactions.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#9ca3af' }}>
                        No transactions found.
                    </div>
                )}
            </div>
        </div>
    );
}
