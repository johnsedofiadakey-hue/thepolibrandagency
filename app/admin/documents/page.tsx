'use client';
import { useState } from 'react';

const documents = [
    { id: 1, name: 'Polibrand Program Brochure 2026', type: 'Brochure', size: '2.4 MB', downloads: 142, uploaded: 'Feb 1, 2026' },
    { id: 2, name: 'Women in Politics Africa Research Report', type: 'Research', size: '5.1 MB', downloads: 89, uploaded: 'Jan 15, 2026' },
    { id: 3, name: 'Fellowship Program Guide 2026', type: 'Report', size: '1.8 MB', downloads: 213, uploaded: 'Jan 5, 2026' },
    { id: 4, name: 'Media Kit – The Polibrand Agency', type: 'Press Kit', size: '8.7 MB', downloads: 47, uploaded: 'Dec 10, 2025' },
    { id: 5, name: 'Political Readiness Framework – White Paper', type: 'Research', size: '3.2 MB', downloads: 198, uploaded: 'Nov 20, 2025' },
];

const typeColors: Record<string, string> = { Brochure: 'badge-gold', Research: 'badge-green', Report: 'badge-gray', 'Press Kit': 'badge-red' };

export default function DocumentsPage() {
    const [dragging, setDragging] = useState(false);

    return (
        <div>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.4rem', color: '#111', marginBottom: '0.15rem' }}>Document Library</h1>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#9ca3af' }}>Reports & Research</p>
            </div>

            {/* Upload Zone */}
            <div
                onDragEnter={() => setDragging(true)}
                onDragLeave={() => setDragging(false)}
                onDrop={() => setDragging(false)}
                style={{
                    border: `2px dashed ${dragging ? '#1F6F3E' : '#e5e0d6'}`, borderRadius: 8,
                    padding: '3rem', textAlign: 'center', marginBottom: '1.5rem', cursor: 'pointer',
                    background: dragging ? '#f0fdf4' : '#fff', transition: 'all 0.2s',
                }}
            >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📁</div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.1rem', color: '#111', marginBottom: '0.5rem' }}>
                    Drag & Drop Files Here
                </h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '1.25rem' }}>
                    Supported: PDF, DOC, DOCX, PPTX · Maximum file size: 50MB
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button className="btn-primary" style={{ fontSize: '0.75rem', padding: '8px 16px', whiteSpace: 'nowrap' }}>Browse Files</button>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {['Research', 'Brochure', 'Report', 'Press Kit'].map((t) => (
                            <span key={t} className={`badge ${typeColors[t]}`} style={{ fontSize: '0.6rem', padding: '2px 6px' }}>+ {t}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid-cols-4-mobile-2" style={{ gap: '0.75rem', marginBottom: '1.5rem' }}>
                {[
                    { label: 'Documents', value: '5', color: '#1F6F3E' },
                    { label: 'Downloads', value: '689', color: '#C9A227' },
                    { label: 'Storage', value: '21MB', color: '#B22222' },
                ].map((s) => (
                    <div key={s.label} className="stat-widget" style={{ borderLeftColor: s.color }}>
                        <div className="value" style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.2rem', color: '#111' }}>{s.value}</div>
                        <div className="label" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.6rem', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Table / Card View */}
            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                <div className="hide-mobile">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb' }}>
                                {['Document Name', 'Type', 'Size', 'Downloads', 'Uploaded', 'Actions'].map((h) => (
                                    <th key={h} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', padding: '10px 1.25rem', textAlign: 'left', borderBottom: '1px solid #f3f4f6' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc) => (
                                <tr key={doc.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '14px 1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span style={{ fontSize: '1.2rem' }}>📄</span>
                                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.86rem', fontWeight: 600, color: '#111' }}>{doc.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 1.25rem' }}><span className={`badge ${typeColors[doc.type]}`}>{doc.type}</span></td>
                                    <td style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#6b7280', padding: '14px 1.25rem' }}>{doc.size}</td>
                                    <td style={{ padding: '14px 1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '0.9rem', color: '#1F6F3E' }}>{doc.downloads}</span>
                                            <div style={{ width: 40, height: 4, background: '#f3f4f6', borderRadius: 2 }}>
                                                <div style={{ height: '100%', width: `${(doc.downloads / 250) * 100}%`, background: '#1F6F3E', borderRadius: 2 }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#9ca3af', padding: '14px 1.25rem' }}>{doc.uploaded}</td>
                                    <td style={{ padding: '14px 1.25rem' }}>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button style={{ padding: '5px 10px', background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: 4, fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Download</button>
                                            <button style={{ padding: '5px 10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 4, fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="show-mobile" style={{ flexDirection: 'column' }}>
                    {documents.map((doc) => (
                        <div key={doc.id} style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                <div style={{ flex: 1, paddingRight: '1rem' }}>
                                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#111', lineHeight: 1.4 }}>{doc.name}</div>
                                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: '#9ca3af', marginTop: 4 }}>{doc.size} · {doc.uploaded}</div>
                                </div>
                                <span className={`badge ${typeColors[doc.type]}`} style={{ fontSize: '0.55rem', padding: '1px 6px' }}>{doc.type}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ fontSize: '0.7rem' }}>📊</span>
                                    <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '0.8rem', color: '#1F6F3E' }}>{doc.downloads} DLs</span>
                                </div>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <button style={{ padding: '6px 12px', background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700 }}>Download</button>
                                    <button style={{ padding: '6px 12px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700 }}>Del</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
