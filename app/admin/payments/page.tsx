'use client';
import { useState } from 'react';

const transactions: any[] = [];

const programs = [
    { name: 'Fellowship Program', price: 500, currency: 'USD', enrolled: 0 },
    { name: 'Leadership Bootcamp', price: 250, currency: 'USD', enrolled: 0 },
    { name: 'Digital Courses', price: 120, currency: 'USD', enrolled: 0 },
];

export default function PaymentsPage() {
    const [newPrice, setNewPrice] = useState<Record<string, string>>({});

    return (
        <div>
            <div style={{ marginBottom: '1.25rem' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', color: '#111', marginBottom: '0.15rem' }}>Payments</h1>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: '#9ca3af' }}>Pricing & Transactions</p>
            </div>

            <div className="grid-cols-2-mobile-1" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Program Pricing - High Density */}
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1rem 1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: '#111', marginBottom: '1rem' }}>Pricing Controls</h3>
                    {programs.map((p) => (
                        <div key={p.name} style={{ marginBottom: '0.75rem', padding: '0.75rem', background: '#f9fafb', borderRadius: 8, border: '1px solid #f3f4f6' }}>
                            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.8rem', color: '#111', marginBottom: 6 }}>{p.name}</div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e5e0d6', background: '#fff', borderRadius: 6, overflow: 'hidden', flex: 1 }}>
                                    <span style={{ padding: '6px 8px', background: '#f9fafb', fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#9ca3af', fontWeight: 700 }}>$</span>
                                    <input
                                        type="number"
                                        value={newPrice[p.name] ?? p.price}
                                        onChange={(e) => setNewPrice({ ...newPrice, [p.name]: e.target.value })}
                                        style={{ padding: '6px 4px', border: 'none', fontFamily: 'var(--font-body)', fontSize: '0.85rem', outline: 'none', width: '100%' }}
                                    />
                                </div>
                                <button className="btn-primary" style={{ fontSize: '0.65rem', padding: '8px 12px' }}>Save</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Coupon Codes - Compact */}
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1rem 1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: '#111', marginBottom: '1rem' }}>Active Coupons</h3>
                    {[].map((c: any) => (
                        <div key={c.code} style={{ marginBottom: '0.5rem', padding: '0.75rem', background: '#f9fafb', borderRadius: 8, border: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.8rem', color: 'var(--color-primary)', background: 'rgba(13, 44, 25, 0.05)', padding: '2px 8px', borderRadius: 4 }}>{c.code}</span>
                                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: '#9ca3af', marginTop: 4, fontWeight: 600 }}>{c.discount} off · {c.uses} used</div>
                            </div>
                            <button style={{ padding: '4px 8px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 6, fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer' }}>Del</button>
                        </div>
                    ))}
                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input type="text" placeholder="Code" style={{ flex: 1, padding: '8px 10px', border: '1.5px solid #e5e0d6', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: '0.8rem', outline: 'none' }} />
                            <input type="text" placeholder="%" style={{ width: 60, padding: '8px 10px', border: '1.5px solid #e5e0d6', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: '0.8rem', outline: 'none' }} />
                        </div>
                        <button className="btn-primary" style={{ width: '100%', fontSize: '0.75rem', padding: '10px' }}>Create New Code</button>
                    </div>
                </div>
            </div>

            {/* Transaction Log - Responsive */}
            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>Transactions</h3>
                    <button className="hide-mobile" style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>EXPORT</button>
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
                            {transactions.map((tx) => (
                                <tr key={tx.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                                    <td style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 600, color: '#111', padding: '12px 1.25rem' }}>{tx.name}</td>
                                    <td style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#6b7280', padding: '12px 1.25rem' }}>{tx.program}</td>
                                    <td style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 700, color: '#111', padding: '12px 1.25rem' }}>${tx.amount}</td>
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
                    {transactions.map((tx) => (
                        <div key={tx.id} style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 700, color: '#111' }}>{tx.name}</div>
                                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#9ca3af' }}>{tx.program} · {tx.date}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 800, color: '#111' }}>${tx.amount}</div>
                                <span className={`badge ${tx.status === 'Completed' ? 'badge-green' : 'badge-gold'}`} style={{ fontSize: '0.55rem', padding: '1px 6px' }}>{tx.status}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {transactions.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#9ca3af' }}>
                        No transactions found.
                    </div>
                )}
            </div>
        </div>
    );
}
