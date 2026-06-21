'use client';

import { useState, useEffect, useMemo } from 'react';

export default function PaymentsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newPrice, setNewPrice] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const res = await fetch('/api/applications');
                if (res.ok) {
                    const data = await res.ok ? await res.json() : [];
                    setApplications(data);
                }
            } catch (err) {
                console.error('Failed to load payments applications:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

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

            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', color: '#9a3412', borderRadius: 8, padding: '0.85rem 1rem', marginBottom: '1rem', fontFamily: 'var(--font-body)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                Payment processing is not connected yet. Figures below are derived from approved applications for planning only; pricing, coupons, exports, and transaction controls are disabled until a payment provider is integrated.
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
