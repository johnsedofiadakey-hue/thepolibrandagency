'use client';
import { useState } from 'react';

const transactions = [
    { id: 'TXN-001', name: 'Grace Mutuku', program: 'Fellowship', amount: 500, status: 'Completed', date: 'Feb 15, 2026', method: 'Stripe' },
    { id: 'TXN-002', name: 'Mariama Balde', program: 'Fellowship', amount: 500, status: 'Completed', date: 'Feb 12, 2026', method: 'Flutterwave' },
    { id: 'TXN-003', name: 'Chisom Okafor', program: 'Bootcamp', amount: 250, status: 'Refunded', date: 'Feb 10, 2026', method: 'Stripe' },
    { id: 'TXN-004', name: 'Naledi Dlamini', program: 'Digital Courses', amount: 120, status: 'Completed', date: 'Feb 8, 2026', method: 'Stripe' },
    { id: 'TXN-005', name: 'Amara Kone', program: 'Bootcamp', amount: 250, status: 'Pending', date: 'Feb 18, 2026', method: 'Flutterwave' },
];

const programs = [
    { name: 'Fellowship Program', price: 500, currency: 'USD', enrolled: 27 },
    { name: 'Leadership Bootcamp', price: 250, currency: 'USD', enrolled: 41 },
    { name: 'Digital Courses', price: 120, currency: 'USD', enrolled: 88 },
];

export default function PaymentsPage() {
    const [newPrice, setNewPrice] = useState<Record<string, string>>({});

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.6rem', color: '#111', marginBottom: '0.25rem' }}>Payment Management</h1>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#9ca3af' }}>Program pricing, coupon codes, and transaction history</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Program Pricing */}
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.75rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.05rem', color: '#111', marginBottom: '1.25rem' }}>Program Pricing</h3>
                    {programs.map((p) => (
                        <div key={p.name} style={{ marginBottom: '1.25rem', padding: '1rem', background: '#f9fafb', borderRadius: 6, border: '1px solid #f3f4f6' }}>
                            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.88rem', color: '#111', marginBottom: 8 }}>{p.name}</div>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e5e0d6', borderRadius: 4, overflow: 'hidden' }}>
                                    <span style={{ padding: '8px 10px', background: '#f3f4f6', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#6b7280', fontWeight: 600 }}>{p.currency}</span>
                                    <input
                                        type="number"
                                        defaultValue={p.price}
                                        value={newPrice[p.name] ?? p.price}
                                        onChange={(e) => setNewPrice({ ...newPrice, [p.name]: e.target.value })}
                                        style={{ padding: '8px 12px', border: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', outline: 'none', width: 80 }}
                                    />
                                </div>
                                <button className="btn-primary" style={{ fontSize: '0.72rem', padding: '8px 14px' }}>Update</button>
                                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#9ca3af' }}>{p.enrolled} enrolled</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Coupon Codes */}
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.75rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.05rem', color: '#111', marginBottom: '1.25rem' }}>Coupon Codes</h3>
                    {[{ code: 'WOMEN2026', discount: '20%', uses: 12, max: 50, expires: 'Mar 31, 2026' }, { code: 'PARTNER50', discount: '50%', uses: 3, max: 10, expires: 'Dec 31, 2026' }].map((c) => (
                        <div key={c.code} style={{ marginBottom: '0.75rem', padding: '1rem', background: '#f9fafb', borderRadius: 6, border: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '0.88rem', color: '#1F6F3E', background: '#f0fdf4', padding: '3px 10px', borderRadius: 4 }}>{c.code}</span>
                                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#9ca3af', marginTop: 6 }}>{c.discount} off · {c.uses}/{c.max} uses · Expires {c.expires}</div>
                            </div>
                            <button style={{ padding: '5px 10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 4, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Delete</button>
                        </div>
                    ))}
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                        <input type="text" placeholder="New coupon code..." style={{ flex: 1, padding: '9px 12px', border: '1.5px solid #e5e0d6', borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', outline: 'none' }} />
                        <input type="text" placeholder="Discount %" style={{ width: 80, padding: '9px 12px', border: '1.5px solid #e5e0d6', borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', outline: 'none' }} />
                        <button className="btn-primary" style={{ fontSize: '0.78rem', padding: '9px 16px' }}>Create</button>
                    </div>
                </div>
            </div>

            {/* Transaction Log */}
            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.05rem', color: '#111' }}>Transaction Log</h3>
                    <button style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#1F6F3E', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Export CSV</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f9fafb' }}>
                            {['TX ID', 'Name', 'Program', 'Amount', 'Method', 'Status', 'Date', 'Action'].map((h) => (
                                <th key={h} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', padding: '10px 1.25rem', textAlign: 'left', borderBottom: '1px solid #f3f4f6' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => (
                            <tr key={tx.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                                <td style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#9ca3af', padding: '12px 1.25rem' }}>{tx.id}</td>
                                <td style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600, color: '#111', padding: '12px 1.25rem' }}>{tx.name}</td>
                                <td style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#6b7280', padding: '12px 1.25rem' }}>{tx.program}</td>
                                <td style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', fontWeight: 700, color: '#111', padding: '12px 1.25rem' }}>${tx.amount}</td>
                                <td style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#6b7280', padding: '12px 1.25rem' }}>{tx.method}</td>
                                <td style={{ padding: '12px 1.25rem' }}>
                                    <span className={`badge ${tx.status === 'Completed' ? 'badge-green' : tx.status === 'Pending' ? 'badge-gold' : 'badge-red'}`}>{tx.status}</span>
                                </td>
                                <td style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#9ca3af', padding: '12px 1.25rem' }}>{tx.date}</td>
                                <td style={{ padding: '12px 1.25rem' }}>
                                    {tx.status === 'Completed' && (
                                        <button style={{ padding: '4px 10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 4, fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Refund</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
