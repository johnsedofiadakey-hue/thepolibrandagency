'use client';
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { PoliSettingsContext } from '@/components/SettingsProvider';

const sections = [
    { id: 'metadata', label: 'Global SEO / Metadata', group: 'Global', icon: '🔍' },
    { id: 'navbar', label: 'Navigation Bar', group: 'Global', icon: '🧭' },
    { id: 'footer', label: 'Footer', group: 'Global', icon: '🏷️' },
    { id: 'theme', label: 'Theme & Branding', group: 'Design', icon: '🎨' },
    { id: 'home', label: 'Homepage', group: 'Pages', icon: '🏠' },
    { id: 'about', label: 'About Us', group: 'Pages', icon: 'ℹ️' },
    { id: 'services', label: 'Services', group: 'Pages', icon: '⚙️' },
    { id: 'programs', label: 'Programs', group: 'Pages', icon: '🎓' },
    { id: 'institutional', label: 'Institutional Clients', group: 'Pages', icon: '🤝' },
    { id: 'assessment', label: 'Readiness Index', group: 'Pages', icon: '📊' },
    { id: 'apply', label: 'Application Form', group: 'Pages', icon: '📝' },
];

//
// ─── FIELD HELPERS ──────────────────────────────────────────────────────────────────
//

type FieldType = 'text' | 'textarea' | 'color' | 'image';

function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((curr, k) => curr?.[k], obj);
}

function setNestedValue(obj: any, path: string, value: any): any {
    const keys = path.split('.');
    const next = { ...obj };
    let current = next;
    for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    return next;
}

//
// ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────────────
//

// Minimal field input
function Field({ label, value, onChange, type = 'text' }: {
    label: string; value: any; onChange: (v: string) => void; type?: FieldType;
}) {
    const commonStyle: React.CSSProperties = {
        width: '100%', padding: '9px 13px', border: '1.5px solid #e5e0d6',
        borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: '0.86rem',
        outline: 'none', boxSizing: 'border-box', color: '#111', background: '#fff',
    };
    return (
        <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>
                {label}
            </label>
            {type === 'textarea' ? (
                <textarea value={value ?? ''} onChange={e => onChange(e.target.value)} rows={3} style={{ ...commonStyle, minHeight: 80 }} />
            ) : type === 'color' ? (
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <input type="color" value={value ?? '#000000'} onChange={e => onChange(e.target.value)}
                        style={{ width: 54, height: 38, padding: 0, border: '1.5px solid #e5e0d6', borderRadius: 4, cursor: 'pointer' }} />
                    <input type="text" value={value ?? ''} onChange={e => onChange(e.target.value)}
                        style={{ ...commonStyle, width: 120 }} />
                </div>
            ) : (
                <input type="text" value={value ?? ''} onChange={e => onChange(e.target.value)} style={commonStyle} />
            )}
        </div>
    );
}

function ImageUploadField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setUploading(true);
        setUploadError(null);
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Firebase Storage refused the upload.');
            if (data.url) onChange(data.url);
        } catch (err: any) {
            console.error('Upload failed', err);
            setUploadError(err.message || 'Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>
                {label}
            </label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                <div style={{ width: 100, height: 60, borderRadius: 6, background: '#f3f4f6', border: '1.5px solid #e5e0d6', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {value ? <img src={value} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '0.6rem', color: '#9ca3af' }}>No Image</span>}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <input type="text" value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder="URL or path"
                            style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #e5e0d6', borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: '0.8rem' }} />
                        <label style={{ background: '#1F6F3E', color: '#fff', padding: '8px 14px', borderRadius: 4, cursor: uploading ? 'wait' : 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                            {uploading ? '...' : 'Upload'}
                            <input type="file" onChange={handleUpload} style={{ display: 'none' }} accept="image/*" />
                        </label>
                    </div>
                    {uploadError && (
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#991b1b', margin: 0 }}>
                            {uploadError}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Section subheading
function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '2rem 0 1rem', color: '#1F6F3E', paddingBottom: '0.5rem', borderBottom: '2px solid #e8f5ee' }}>
            {children}
        </h4>
    );
}

// Card wrapper for list items
function ItemCard({ index, onRemove, children }: { index: number; onRemove: () => void; children: React.ReactNode }) {
    return (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '1.25rem', marginBottom: '1rem', position: 'relative', background: '#fafafa' }}>
            <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: '#9ca3af', background: '#f3f4f6', padding: '2px 8px', borderRadius: 10 }}>#{index + 1}</span>
                <button onClick={onRemove} title="Remove" style={{ background: '#fee2e2', border: 'none', borderRadius: 4, width: 26, height: 26, cursor: 'pointer', color: '#dc2626', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    &times;
                </button>
            </div>
            {children}
        </div>
    );
}

// "Add Item" button
function AddBtn({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button onClick={onClick} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: '1.5px dashed #1F6F3E',
            borderRadius: 6, background: '#f0fdf4', color: '#1F6F3E', fontFamily: 'Inter, sans-serif',
            fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', marginBottom: '1rem',
        }}>
            <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span> {label}
        </button>
    );
}

// Collapsible wrapper for complex nested sections
function Collapsible({ label, children, defaultOpen = false }: { label: string; children: React.ReactNode; defaultOpen?: boolean; key?: any }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 4, marginBottom: '0.75rem', overflow: 'hidden' }}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                style={{ padding: '0.75rem 1rem', background: '#f9fafb', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>{label}</span>
                <span style={{ fontSize: '0.8rem', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▶</span>
            </div>
            {isOpen && <div style={{ padding: '1rem', background: '#fff' }}>{children}</div>}
        </div>
    );
}

// Simple list of strings editor
function StringListField({ label, items, onChange }: { label: string; items: string[]; onChange: (newItems: string[]) => void }) {
    const updateItem = (i: number, val: string) => {
        const next = [...items];
        next[i] = val;
        onChange(next);
    };
    const removeItem = (i: number) => onChange(items.filter((_, idx) => idx !== i));
    const addItem = () => onChange([...items, "New Item"]);

    return (
        <div style={{ marginBottom: "2rem" }}>
            <label style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 12 }}>
                {label}
            </label>
            {(items || []).map((item: string, i: number) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <input
                        type="text"
                        value={item}
                        onChange={(e) => updateItem(i, e.target.value)}
                        style={{ flex: 1, padding: "8px 12px", border: "1.5px solid #e5e0d6", borderRadius: 4, fontSize: "0.85rem" }}
                    />
                    <button onClick={() => removeItem(i)} style={{ padding: "0 10px", background: "#fee2e2", border: "none", borderRadius: 4, color: "#dc2626", cursor: "pointer" }}>&times;</button>
                </div>
            ))}
            <AddBtn label={`Add to ${label}`} onClick={addItem} />
        </div>
    );
}

// Complex list of objects editor
function ObjectListField({ label, items, fields, onChange }: { 
    label: string; 
    items: any[]; 
    fields: { key: string; label: string; type?: FieldType }[]; 
    onChange: (newItems: any[]) => void; 
}) {
    const updateItem = (i: number, key: string, val: any) => {
        const next = [...items];
        next[i] = { ...next[i], [key]: val };
        onChange(next);
    };
    const removeItem = (i: number) => onChange(items.filter((_, idx) => idx !== i));
    const addItem = () => {
        const newItem = fields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {});
        onChange([...items, newItem]);
    };

    return (
        <div style={{ marginBottom: '2rem', border: '1px solid #e5e7eb', padding: '1rem', borderRadius: 6 }}>
            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 12 }}>
                {label}
            </label>
            {(items || []).map((item: any, i: number) => (
                <ItemCard key={i} index={i} onRemove={() => removeItem(i)}>
                    {fields.map((f: { key: string; label: string; type?: FieldType }) => (
                        <div key={f.key}>
                            {f.type === 'image' ? (
                                <ImageUploadField 
                                    label={f.label} 
                                    value={item[f.key]} 
                                    onChange={v => updateItem(i, f.key, v)} 
                                />
                            ) : (
                                <Field 
                                    label={f.label} 
                                    value={item[f.key]} 
                                    onChange={v => updateItem(i, f.key, v)} 
                                    type={f.type as any} 
                                />
                            )}
                        </div>
                    ))}
                </ItemCard>
            ))}
            <AddBtn label={`Add to ${label}`} onClick={addItem} />
        </div>
    );
}

function MetadataEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
    const meta = content?.metadata || {};
    const setField = (path: string, value: any) => onChange(setNestedValue(content, `metadata.${path}`, value));

    return (
        <>
            <SectionTitle>Global SEO Settings</SectionTitle>
            <Field label="Site Title" value={meta.title} onChange={v => setField('title', v)} />
            <Field label="Meta Description" value={meta.description} onChange={v => setField('description', v)} type="textarea" />
            <Field label="Keywords (comma separated)" value={meta.keywords} onChange={v => setField('keywords', v)} type="textarea" />
            
            <p style={{ marginTop: '2rem', padding: '1rem', background: '#fff9e6', border: '1px solid #ffeeba', borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#856404' }}>
                <strong>Tip:</strong> These values are used by Google and social media platforms to display your site info. Changes will take effect globally after saving.
            </p>
        </>
    );
}
 
//
// ─── SECTION EDITORS ────────────────────────────────────────────────────────────────
//

function NavbarEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
    const nav = content?.navbar || {};
    const setField = (path: string, value: any) => onChange(setNestedValue(content, `navbar.${path}`, value));

    const addLink = () => {
        const links = [...(nav.links || []), { label: 'New Link', href: '/' }];
        onChange(setNestedValue(content, 'navbar.links', links));
    };
    const removeLink = (i: number) => {
        const links = (nav.links || []).filter((_: any, idx: number) => idx !== i);
        onChange(setNestedValue(content, 'navbar.links', links));
    };
    const updateLink = (i: number, key: string, value: string) => {
        const links = (nav.links || []).map((l: any, idx: number) => idx === i ? { ...l, [key]: value } : l);
        onChange(setNestedValue(content, 'navbar.links', links));
    };

    return (
        <>
            <SectionTitle>Brand Name</SectionTitle>
            <Field label="Line 1" value={nav.brand?.line1} onChange={v => setField('brand.line1', v)} />
            <Field label="Line 2" value={nav.brand?.line2} onChange={v => setField('brand.line2', v)} />

            <SectionTitle>CTA Button</SectionTitle>
            <Field label="Button Label" value={nav.cta?.label} onChange={v => setField('cta.label', v)} />
            <Field label="Button Link" value={nav.cta?.href} onChange={v => setField('cta.href', v)} />

            <SectionTitle>Navigation Links</SectionTitle>
            {(nav.links || []).map((link: any, i: number) => (
                <ItemCard key={i} index={i} onRemove={() => removeLink(i)}>
                    <Field label="Label" value={link.label} onChange={v => updateLink(i, 'label', v)} />
                    <Field label="URL" value={link.href} onChange={v => updateLink(i, 'href', v)} />
                </ItemCard>
            ))}
            <AddBtn label="Add Navigation Link" onClick={addLink} />
        </>
    );
}

function FooterEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
    const footer = content?.footer || {};
    const setField = (path: string, value: any) => onChange(setNestedValue(content, `footer.${path}`, value));

    const updateSectionLink = (sectionIdx: number, linkIdx: number, key: string, value: string) => {
        const sections = (footer.sections || []).map((s: any, si: number) =>
            si === sectionIdx ? {
                ...s, links: (s.links || []).map((l: any, li: number) => li === linkIdx ? { ...l, [key]: value } : l)
            } : s
        );
        onChange(setNestedValue(content, 'footer.sections', sections));
    };
    const addSectionLink = (sectionIdx: number) => {
        const sections = (footer.sections || []).map((s: any, si: number) =>
            si === sectionIdx ? { ...s, links: [...(s.links || []), { label: 'New Link', href: '/' }] } : s
        );
        onChange(setNestedValue(content, 'footer.sections', sections));
    };
    const removeSectionLink = (sectionIdx: number, linkIdx: number) => {
        const sections = (footer.sections || []).map((s: any, si: number) =>
            si === sectionIdx ? { ...s, links: (s.links || []).filter((_: any, li: number) => li !== linkIdx) } : s
        );
        onChange(setNestedValue(content, 'footer.sections', sections));
    };

    const updateSocial = (i: number, key: string, value: string) => {
        const socials = (footer.socials || []).map((s: any, idx: number) => idx === i ? { ...s, [key]: value } : s);
        onChange(setNestedValue(content, 'footer.socials', socials));
    };

    return (
        <>
            <SectionTitle>Brand Description</SectionTitle>
            <Field label="Description" value={footer.brand?.description} onChange={v => setField('brand.description', v)} type="textarea" />

            <SectionTitle>Newsletter</SectionTitle>
            <Field label="Title" value={footer.newsletter?.title} onChange={v => setField('newsletter.title', v)} />
            <Field label="Description" value={footer.newsletter?.description} onChange={v => setField('newsletter.description', v)} type="textarea" />

            <SectionTitle>Copyright</SectionTitle>
            <Field label="Copyright Text" value={footer.bottom?.copyright} onChange={v => setField('bottom.copyright', v)} />

            <SectionTitle>Footer Link Sections</SectionTitle>
            {(footer.sections || []).map((section: any, si: number) => (
                <div key={si} style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f0fdf4', borderRadius: 6, border: '1px solid #bbf7d0' }}>
                    <Field label={`Section ${si + 1} Title`} value={section.title} onChange={v => {
                        const sections = (footer.sections || []).map((s: any, idx: number) => idx === si ? { ...s, title: v } : s);
                        onChange(setNestedValue(content, 'footer.sections', sections));
                    }} />
                    {(section.links || []).map((link: any, li: number) => (
                        <ItemCard key={li} index={li} onRemove={() => removeSectionLink(si, li)}>
                            <Field label="Label" value={link.label} onChange={v => updateSectionLink(si, li, 'label', v)} />
                            <Field label="URL" value={link.href} onChange={v => updateSectionLink(si, li, 'href', v)} />
                        </ItemCard>
                    ))}
                    <AddBtn label="Add Link" onClick={() => addSectionLink(si)} />
                </div>
            ))}

            <SectionTitle>Social Links</SectionTitle>
            {(footer.socials || []).map((social: any, i: number) => (
                <ItemCard key={i} index={i} onRemove={() => {
                    const socials = (footer.socials || []).filter((_: any, idx: number) => idx !== i);
                    onChange(setNestedValue(content, 'footer.socials', socials));
                }}>
                    <Field label="Platform Name" value={social.label} onChange={v => updateSocial(i, 'label', v)} />
                    <Field label="URL" value={social.href} onChange={v => updateSocial(i, 'href', v)} />
                </ItemCard>
            ))}
            <AddBtn label="Add Social Link" onClick={() => {
                const socials = [...(footer.socials || []), { label: 'Platform', href: '#' }];
                onChange(setNestedValue(content, 'footer.socials', socials));
            }} />

            <SectionTitle>Legal & Bottom Links</SectionTitle>
            {(footer.bottom?.links || []).map((link: any, i: number) => (
                <ItemCard key={i} index={i} onRemove={() => {
                    const links = (footer.bottom.links || []).filter((_: any, idx: number) => idx !== i);
                    onChange(setNestedValue(content, 'footer.bottom.links', links));
                }}>
                    <Field label="Label" value={link.label} onChange={v => {
                        const links = (footer.bottom.links || []).map((l: any, idx: number) => idx === i ? { ...l, label: v } : l);
                        onChange(setNestedValue(content, 'footer.bottom.links', links));
                    }} />
                    <Field label="URL" value={link.href} onChange={v => {
                        const links = (footer.bottom.links || []).map((l: any, idx: number) => idx === i ? { ...l, href: v } : l);
                        onChange(setNestedValue(content, 'footer.bottom.links', links));
                    }} />
                </ItemCard>
            ))}
            <AddBtn label="Add Bottom Link" onClick={() => {
                const links = [...(footer.bottom?.links || []), { label: 'New Link', href: '#' }];
                onChange(setNestedValue(content, 'footer.bottom.links', links));
            }} />
        </>
    );
}

function HomeEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
    const home = content?.pages?.home || {};
    const setField = (path: string, value: any) => onChange(setNestedValue(content, `pages.home.${path}`, value));

    const updateStat = (i: number, key: string, value: string) => {
        const stats = (home.stats || []).map((s: any, idx: number) => idx === i ? { ...s, [key]: value } : s);
        onChange(setNestedValue(content, 'pages.home.stats', stats));
    };
    const updateService = (i: number, key: string, value: string) => {
        const items = (home.services?.items || []).map((s: any, idx: number) => idx === i ? { ...s, [key]: value } : s);
        onChange(setNestedValue(content, 'pages.home.services.items', items));
    };
    const updateChallengeStat = (i: number, key: string, value: string) => {
        const stats = (home.challenge?.stats || []).map((s: any, idx: number) => idx === i ? { ...s, [key]: value } : s);
        onChange(setNestedValue(content, 'pages.home.challenge.stats', stats));
    };

    return (
        <>
            <SectionTitle>Hero</SectionTitle>
            <Field label="Tag / Overline" value={home.hero?.tag} onChange={v => setField('hero.tag', v)} />
            <Field label="Headline" value={home.hero?.headline} onChange={v => setField('hero.headline', v)} type="textarea" />
            <Field label="Subheadline" value={home.hero?.subheadline} onChange={v => setField('hero.subheadline', v)} type="textarea" />

            <SectionTitle>Who We Serve</SectionTitle>
            <Field label="Tag" value={home.whoWeServe?.tag} onChange={v => setField('whoWeServe.tag', v)} />
            <Field label="Intro Text" value={home.whoWeServe?.text} onChange={v => setField('whoWeServe.text', v)} type="textarea" />
            <ObjectListField
                label="Audience Segments"
                items={home.whoWeServe?.segments || []}
                fields={[
                    { key: 'tag', label: 'Segment Tag (e.g. For First-Time Candidates)' },
                    { key: 'title', label: 'Title' },
                    { key: 'text', label: 'Body Text (use blank line between paragraphs)', type: 'textarea' },
                    { key: 'highlight', label: 'Highlight / Pull Quote', type: 'textarea' },
                    { key: 'ctaLabel', label: 'CTA Label' },
                    { key: 'ctaHref', label: 'CTA Link (e.g. /apply?program=...)' },
                ]}
                onChange={v => setField('whoWeServe.segments', v)}
            />

            <SectionTitle>Statistics Bar</SectionTitle>
            {(home.stats || []).map((stat: any, i: number) => (
                <ItemCard key={i} index={i} onRemove={() => {
                    const stats = (home.stats || []).filter((_: any, idx: number) => idx !== i);
                    onChange(setNestedValue(content, 'pages.home.stats', stats));
                }}>
                    <Field label="Number" value={stat.number} onChange={v => updateStat(i, 'number', v)} />
                    <Field label="Label" value={stat.label} onChange={v => updateStat(i, 'label', v)} />
                </ItemCard>
            ))}
            <AddBtn label="Add Stat" onClick={() => {
                const stats = [...(home.stats || []), { number: '0', label: 'New Stat' }];
                onChange(setNestedValue(content, 'pages.home.stats', stats));
            }} />

            <SectionTitle>The Challenge Section</SectionTitle>
            <Field label="Tag" value={home.challenge?.tag} onChange={v => setField('challenge.tag', v)} />
            <Field label="Title" value={home.challenge?.title} onChange={v => setField('challenge.title', v)} type="textarea" />
            <Field label="Body Text" value={home.challenge?.text} onChange={v => setField('challenge.text', v)} type="textarea" />
            
            <StringListField 
                label="Challenge Points (Bullet List)" 
                items={home.challenge?.list || []} 
                onChange={v => setField('challenge.list', v)} 
            />

            <Field label="Pull Quote" value={home.challenge?.quote} onChange={v => setField('challenge.quote', v)} />

            <div style={{ marginTop: '1rem' }}>
                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>Challenge Stats (Visual Progress Bars)</label>
                {(home.challenge?.stats || []).map((s: any, i: number) => (
                    <ItemCard key={i} index={i} onRemove={() => {
                        const stats = (home.challenge?.stats || []).filter((_: any, idx: number) => idx !== i);
                        onChange(setNestedValue(content, 'pages.home.challenge.stats', stats));
                    }}>
                        <Field label="Label" value={s.label} onChange={v => updateChallengeStat(i, 'label', v)} />
                        <Field label="Value (e.g. 26%)" value={s.value} onChange={v => updateChallengeStat(i, 'value', v)} />
                    </ItemCard>
                ))}
                <AddBtn label="Add Challenge Stat" onClick={() => {
                    const stats = [...(home.challenge?.stats || []), { label: 'New Stat', value: '0%' }];
                    onChange(setNestedValue(content, 'pages.home.challenge.stats', stats));
                }} />
            </div>

            <SectionTitle>Services Teaser</SectionTitle>
            <Field label="Tag" value={home.services?.tag} onChange={v => setField('services.tag', v)} />
            <Field label="Title" value={home.services?.title} onChange={v => setField('services.title', v)} />
            <Field label="Description" value={home.services?.description} onChange={v => setField('services.description', v)} type="textarea" />
            {(home.services?.items || []).map((item: any, i: number) => (
                <ItemCard key={i} index={i} onRemove={() => {
                    const items = (home.services?.items || []).filter((_: any, idx: number) => idx !== i);
                    onChange(setNestedValue(content, 'pages.home.services.items', items));
                }}>
                    <Field label="Icon (emoji or symbol)" value={item.icon} onChange={v => updateService(i, 'icon', v)} />
                    <Field label="Title" value={item.title} onChange={v => updateService(i, 'title', v)} />
                    <Field label="Description" value={item.desc} onChange={v => updateService(i, 'desc', v)} type="textarea" />
                </ItemCard>
            ))}
            <AddBtn label="Add Service Teaser" onClick={() => {
                const items = [...(home.services?.items || []), { icon: '◈', title: 'New Service', desc: 'Description.' }];
                onChange(setNestedValue(content, 'pages.home.services.items', items));
            }} />

            <SectionTitle>Diagnostic / PRI Teaser</SectionTitle>
            <Field label="Tag" value={home.diagnostic?.tag} onChange={v => setField('diagnostic.tag', v)} />
            <Field label="Title" value={home.diagnostic?.title} onChange={v => setField('diagnostic.title', v)} />
            <Field label="Description" value={home.diagnostic?.description} onChange={v => setField('diagnostic.description', v)} type="textarea" />
            
            <StringListField 
                label="Diagnostic Categories (Tags)" 
                items={home.diagnostic?.categories || []} 
                onChange={v => setField('diagnostic.categories', v)} 
            />

            <ObjectListField 
                 label="Institutional Partners" 
                 items={home.partnerships?.items || []} 
                 fields={[
                     { key: 'name', label: 'Partner Name' },
                     { key: 'logo', label: 'Logo URL / Path', type: 'image' }
                 ]} 
                 onChange={v => setField('partnerships.items', v)}
             />

             <SectionTitle>Primary Call-to-Actions (Buttons)</SectionTitle>
             <Field label="Apply Button Label" value={home.cta?.apply} onChange={v => setField('cta.apply', v)} />
             <Field label="Partner Button Label" value={home.cta?.partner} onChange={v => setField('cta.partner', v)} />
             <Field label="Mission Highlight Text" value={home.cta?.mission} onChange={v => setField('cta.mission', v)} type="textarea" />
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Explore Services Label" value={home.cta?.services} onChange={v => setField('cta.services', v)} />
                <Field label="Start Assessment Label" value={home.cta?.assessment} onChange={v => setField('cta.assessment', v)} />
             </div>
             <Field label="Partnership Proposal Label" value={home.cta?.proposal} onChange={v => setField('cta.proposal', v)} />
         </>
     );
 }

function AboutEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
    const about = content?.pages?.about || {};
    const setField = (path: string, value: any) => onChange(setNestedValue(content, `pages.about.${path}`, value));

    return (
        <>
            <SectionTitle>Hero Section</SectionTitle>
            <Field label="Tag" value={about.hero?.tag} onChange={v => setField('hero.tag', v)} />
            <Field label="Title" value={about.hero?.title} onChange={v => setField('hero.title', v)} type="textarea" />
            <Field label="Description" value={about.hero?.description} onChange={v => setField('hero.description', v)} type="textarea" />
            <ImageUploadField label="Hero Background Image" value={about.hero?.image} onChange={v => setField('hero.image', v)} />

            <SectionTitle>Vision Section</SectionTitle>
            <Field label="Tag" value={about.vision?.tag} onChange={v => setField('vision.tag', v)} />
            <Field label="Title" value={about.vision?.title} onChange={v => setField('vision.title', v)} />
            <Field label="Description" value={about.vision?.description} onChange={v => setField('vision.description', v)} type="textarea" />
            <ObjectListField 
                label="Vision Metrics" 
                items={about.vision?.items || []} 
                fields={[{ key: 'label', label: 'Metric Name' }, { key: 'percentage', label: 'Percentage (e.g. 85%)' }]} 
                onChange={v => setField('vision.items', v)}
            />

            <SectionTitle>Strategic Architecture</SectionTitle>
            <Field label="Tag" value={about.strategy?.tag} onChange={v => setField('strategy.tag', v)} />
            <Field label="Title" value={about.strategy?.title} onChange={v => setField('strategy.title', v)} />
            <ObjectListField 
                label="Steps" 
                items={about.strategy?.steps || []} 
                fields={[{ key: 'title', label: 'Title' }, { key: 'desc', label: 'Description', type: 'textarea' }]} 
                onChange={v => setField('strategy.steps', v)}
            />

            <SectionTitle>Philosophy Section</SectionTitle>
            <Field label="Tag" value={about.philosophy?.tag} onChange={v => setField('philosophy.tag', v)} />
            <Field label="Title" value={about.philosophy?.title} onChange={v => setField('philosophy.title', v)} />
            <ObjectListField 
                label="Cards" 
                items={about.philosophy?.cards || []} 
                fields={[{ key: 'title', label: 'Title' }, { key: 'text', label: 'Text', type: 'textarea' }]} 
                onChange={v => setField('philosophy.cards', v)}
            />

            <SectionTitle>Founders / Team Section</SectionTitle>
            <Field label="Tag" value={about.founders?.tag} onChange={v => setField('founders.tag', v)} />
            <Field label="Section Title" value={about.founders?.title} onChange={v => setField('founders.title', v)} />
            <Field label="Section Description" value={about.founders?.description} onChange={v => setField('founders.description', v)} type="textarea" />
            <div style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Team Members</span>
                    <button
                        type="button"
                        onClick={() => {
                            const team = [...(about.founders?.team || []), { name: '', title: '', bio: '', image: '' }];
                            setField('founders.team', team);
                        }}
                        style={{ padding: '4px 10px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                    >+ Add Member</button>
                </div>
                {(about.founders?.team || []).map((member: any, i: number) => (
                    <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '1rem', marginBottom: '0.75rem', background: '#fafafa', position: 'relative' }}>
                        <button
                            type="button"
                            onClick={() => {
                                const team = (about.founders?.team || []).filter((_: any, idx: number) => idx !== i);
                                setField('founders.team', team);
                            }}
                            style={{ position: 'absolute', top: 8, right: 8, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 4, padding: '2px 8px', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer' }}
                        >Remove</button>
                        <Field label="Full Name" value={member.name} onChange={v => {
                            const team = (about.founders?.team || []).map((m: any, idx: number) => idx === i ? { ...m, name: v } : m);
                            setField('founders.team', team);
                        }} />
                        <Field label="Title / Role" value={member.title} onChange={v => {
                            const team = (about.founders?.team || []).map((m: any, idx: number) => idx === i ? { ...m, title: v } : m);
                            setField('founders.team', team);
                        }} />
                        <Field label="Bio" value={member.bio} onChange={v => {
                            const team = (about.founders?.team || []).map((m: any, idx: number) => idx === i ? { ...m, bio: v } : m);
                            setField('founders.team', team);
                        }} type="textarea" />
                        <ImageUploadField label="Photo" value={member.image} onChange={v => {
                            const team = (about.founders?.team || []).map((m: any, idx: number) => idx === i ? { ...m, image: v } : m);
                            setField('founders.team', team);
                        }} />
                    </div>
                ))}
            </div>

            <SectionTitle>Founders Story Section</SectionTitle>
            <Field label="Tag" value={about.foundersStory?.tag} onChange={v => setField('foundersStory.tag', v)} />
            <Field label="Title" value={about.foundersStory?.title} onChange={v => setField('foundersStory.title', v)} />
            <Field label="Story" value={about.foundersStory?.story} onChange={v => setField('foundersStory.story', v)} type="textarea" />
            <ImageUploadField label="Story Image" value={about.foundersStory?.image} onChange={v => setField('foundersStory.image', v)} />

            <SectionTitle>Impact Timeline</SectionTitle>
            <ObjectListField
                label="Timeline Events"
                items={about.timeline || []}
                fields={[{ key: 'year', label: 'Year' }, { key: 'event', label: 'Event Description', type: 'textarea' }]}
                onChange={v => setField('timeline', v)}
            />
        </>
    );
}

function ServicesEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
    const services = content?.pages?.services || {};
    const setField = (path: string, value: any) => onChange(setNestedValue(content, `pages.services.${path}`, value));

    return (
        <>
            <SectionTitle>Hero</SectionTitle>
            <Field label="Tag" value={services.hero?.tag} onChange={v => setField('hero.tag', v)} />
            <Field label="Title" value={services.hero?.title} onChange={v => setField('hero.title', v)} type="textarea" />
            <Field label="Description" value={services.hero?.description} onChange={v => setField('hero.description', v)} type="textarea" />

            <SectionTitle>Individual Services</SectionTitle>
            <Field label="Tag" value={services.individual?.tag} onChange={v => setField('individual.tag', v)} />
            <Field label="Title" value={services.individual?.title} onChange={v => setField('individual.title', v)} />
            {(services.individual?.items || []).map((item: any, i: number) => (
                <ItemCard key={i} index={i} onRemove={() => {
                    const items = (services.individual?.items || []).filter((_: any, idx: number) => idx !== i);
                    onChange(setNestedValue(content, 'pages.services.individual.items', items));
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1rem' }}>
                        <Field label="No." value={item.number} onChange={v => {
                            const items = (services.individual?.items || []).map((s: any, idx: number) => idx === i ? { ...s, number: v } : s);
                            onChange(setNestedValue(content, 'pages.services.individual.items', items));
                        }} />
                        <Field label="Title" value={item.title} onChange={v => {
                            const items = (services.individual?.items || []).map((s: any, idx: number) => idx === i ? { ...s, title: v } : s);
                            onChange(setNestedValue(content, 'pages.services.individual.items', items));
                        }} />
                    </div>
                    <Field label="Intro Text" value={item.intro} onChange={v => {
                        const items = (services.individual?.items || []).map((s: any, idx: number) => idx === i ? { ...s, intro: v } : s);
                        onChange(setNestedValue(content, 'pages.services.individual.items', items));
                    }} type="textarea" />
                    <Field label="Accent Color" value={item.color} onChange={v => {
                        const items = (services.individual?.items || []).map((s: any, idx: number) => idx === i ? { ...s, color: v } : s);
                        onChange(setNestedValue(content, 'pages.services.individual.items', items));
                    }} />
                    
                    <StringListField 
                        label="Service Deliverables" 
                        items={item.deliverables || []} 
                        onChange={v => {
                            const items = (services.individual?.items || []).map((s: any, idx: number) => idx === i ? { ...s, deliverables: v } : s);
                            onChange(setNestedValue(content, 'pages.services.individual.items', items));
                        }} 
                    />
                </ItemCard>
            ))}
            <AddBtn label="Add Individual Service" onClick={() => {
                const items = [...(services.individual?.items || []), { number: '04', title: 'New Service', intro: 'Description.', deliverables: [] }];
                onChange(setNestedValue(content, 'pages.services.individual.items', items));
            }} />

            <SectionTitle>Institutional Services</SectionTitle>
            <Field label="Tag" value={services.institutional?.tag} onChange={v => setField('institutional.tag', v)} />
            <Field label="Title" value={services.institutional?.title} onChange={v => setField('institutional.title', v)} />
            {(services.institutional?.items || []).map((item: any, i: number) => (
                <ItemCard key={i} index={i} onRemove={() => {
                    const items = (services.institutional?.items || []).filter((_: any, idx: number) => idx !== i);
                    onChange(setNestedValue(content, 'pages.services.institutional.items', items));
                }}>
                    <Field label="Icon" value={item.icon} onChange={v => {
                        const items = (services.institutional?.items || []).map((s: any, idx: number) => idx === i ? { ...s, icon: v } : s);
                        onChange(setNestedValue(content, 'pages.services.institutional.items', items));
                    }} />
                    <Field label="Title" value={item.title} onChange={v => {
                        const items = (services.institutional?.items || []).map((s: any, idx: number) => idx === i ? { ...s, title: v } : s);
                        onChange(setNestedValue(content, 'pages.services.institutional.items', items));
                    }} />
                    <Field label="Description" value={item.desc} onChange={v => {
                        const items = (services.institutional?.items || []).map((s: any, idx: number) => idx === i ? { ...s, desc: v } : s);
                        onChange(setNestedValue(content, 'pages.services.institutional.items', items));
                    }} type="textarea" />
                    
                    <StringListField 
                        label="Features / Offerings" 
                        items={item.features || []} 
                        onChange={v => {
                            const items = (services.institutional?.items || []).map((s: any, idx: number) => idx === i ? { ...s, features: v } : s);
                            onChange(setNestedValue(content, 'pages.services.institutional.items', items));
                        }} 
                    />
                </ItemCard>
            ))}
            <AddBtn label="Add Institutional Service" onClick={() => {
                 const items = [...(services.institutional?.items || []), { icon: '📋', title: 'New Program', desc: 'Description.', features: [] }];
                 onChange(setNestedValue(content, 'pages.services.institutional.items', items));
            }} />
        </>
    );
}



function AssessmentEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
    const assessment = content?.pages?.assessment || {};
    const results = content?.pages?.assessment_results || {};
    const setField = (path: string, value: any) => onChange(setNestedValue(content, `pages.assessment.${path}`, value));
    const setResultsField = (path: string, value: any) => onChange(setNestedValue(content, `pages.assessment_results.${path}`, value));

    const updateCategory = (i: number, key: string, value: any) => {
        const categories = (assessment.categories || []).map((c: any, idx: number) => idx === i ? { ...c, [key]: value } : c);
        setField('categories', categories);
    };

    const updateQuestion = (catIdx: number, qIdx: number, key: string, value: any) => {
        const categories = [...(assessment.categories || [])];
        const category = { ...categories[catIdx] };
        category.questions = (category.questions || []).map((q: any, idx: number) => idx === qIdx ? { ...q, [key]: value } : q);
        categories[catIdx] = category;
        setField('categories', categories);
    };

    const updateOption = (catIdx: number, qIdx: number, oIdx: number, key: string, value: any) => {
        const categories = [...(assessment.categories || [])];
        const category = { ...categories[catIdx] };
        const questions = [...(category.questions || [])];
        const question = { ...questions[qIdx] };
        question.options = (question.options || []).map((o: any, idx: number) => idx === oIdx ? { ...o, [key]: value } : o);
        questions[qIdx] = question;
        category.questions = questions;
        categories[catIdx] = category;
        setField('categories', categories);
    };

    const updateTier = (i: number, key: string, value: any) => {
        const tiers = (results.tiers || []).map((t: any, idx: number) => idx === i ? { ...t, [key]: value } : t);
        setResultsField('tiers', tiers);
    };

    return (
        <>
            <SectionTitle>Hero & Intro</SectionTitle>
            <Field label="Tag" value={assessment.hero?.tag} onChange={v => setField('hero.tag', v)} />
            <Field label="Title" value={assessment.hero?.title} onChange={v => setField('hero.title', v)} type="textarea" />
            <Field label="Description" value={assessment.hero?.description} onChange={v => setField('hero.description', v)} type="textarea" />
            <ImageUploadField label="Hero Background Image" value={assessment.hero?.image} onChange={v => setField('hero.image', v)} />

            <SectionTitle>Assessment Highlights (Hero Details)</SectionTitle>
            {(assessment.hero?.details || []).map((detail: any, i: number) => (
                <ItemCard key={i} index={i} onRemove={() => {
                    const details = (assessment.hero.details || []).filter((_: any, idx: number) => idx !== i);
                    setField('hero.details', details);
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '1rem' }}>
                        <Field label="Icon" value={detail.icon} onChange={v => {
                            const details = (assessment.hero.details || []).map((d: any, idx: number) => idx === i ? { ...d, icon: v } : d);
                            setField('hero.details', details);
                        }} />
                        <Field label="Text" value={detail.text} onChange={v => {
                            const details = (assessment.hero.details || []).map((d: any, idx: number) => idx === i ? { ...d, text: v } : d);
                            setField('hero.details', details);
                        }} />
                    </div>
                </ItemCard>
            ))}
            <AddBtn label="Add Detail" onClick={() => {
                const details = [...(assessment.hero?.details || []), { icon: '📝', text: 'New Detail' }];
                setField('hero.details', details);
            }} />

            <SectionTitle>Survey Questions & Logic</SectionTitle>
            {(assessment.categories || []).map((cat: any, ci: number) => (
                <Collapsible key={cat.id || ci} label={`Category: ${cat.label} (Weight: ${cat.weight}%)`}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px', gap: '1rem' }}>
                        <Field label="Category Label" value={cat.label} onChange={v => updateCategory(ci, 'label', v)} />
                        <Field label="Weight" value={cat.weight} onChange={v => updateCategory(ci, 'weight', parseInt(v) || 0)} />
                        <Field label="Color" value={cat.color} onChange={v => updateCategory(ci, 'color', v)} type="color" />
                    </div>

                    <SectionTitle>Questions for {cat.label}</SectionTitle>
                    {(cat.questions || []).map((q: any, qi: number) => (
                        <div key={q.id || qi} style={{ border: '1px solid #f3f4f6', padding: '1rem', borderRadius: 6, marginBottom: '1.5rem', background: '#fdfdfd' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: '#1F6F3E' }}>QUESTION #{qi + 1}</span>
                                <button onClick={() => {
                                    const qs = (cat.questions || []).filter((_: any, idx: number) => idx !== qi);
                                    updateCategory(ci, 'questions', qs);
                                }} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.75rem' }}>Remove Question</button>
                            </div>
                            <Field label="Question Text" value={q.text} onChange={v => updateQuestion(ci, qi, 'text', v)} type="textarea" />
                            
                            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', fontWeight: 600, color: '#9ca3af', display: 'block', marginBottom: '1rem' }}>SCORING OPTIONS</label>
                            {(q.options || []).map((opt: any, oi: number) => (
                                <div key={oi} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 30px', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                                    <input 
                                        type="text" 
                                        value={opt.text} 
                                        placeholder="Option Text"
                                        onChange={e => updateOption(ci, qi, oi, 'text', e.target.value)}
                                        style={{ padding: '6px 10px', border: '1px solid #e5e0d6', borderRadius: 4, fontSize: '0.8rem' }}
                                    />
                                    <input 
                                        type="number" 
                                        value={opt.score} 
                                        placeholder="Score"
                                        onChange={e => updateOption(ci, qi, oi, 'score', parseInt(e.target.value) || 0)}
                                        style={{ padding: '6px 10px', border: '1px solid #e5e0d6', borderRadius: 4, fontSize: '0.8rem' }}
                                    />
                                    <button onClick={() => {
                                        const ops = (q.options || []).filter((_: any, idx: number) => idx !== oi);
                                        updateQuestion(ci, qi, 'options', ops);
                                    }} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>&times;</button>
                                </div>
                            ))}
                            <button onClick={() => {
                                const ops = [...(q.options || []), { text: 'New Option', score: 1 }];
                                updateQuestion(ci, qi, 'options', ops);
                            }} style={{ background: 'none', border: 'none', color: '#1F6F3E', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', padding: 4 }}>+ Add Option</button>
                        </div>
                    ))}
                    <AddBtn label="Add Question" onClick={() => {
                        const qs = [...(cat.questions || []), { id: `q${Date.now()}`, text: 'New Question', options: [{ text: 'Yes', score: 4 }, { text: 'No', score: 1 }] }];
                        updateCategory(ci, 'questions', qs);
                    }} />
                </Collapsible>
            ))}
            <AddBtn label="Add Category" onClick={() => {
                const cats = [...(assessment.categories || []), { id: `cat${Date.now()}`, label: 'New Category', weight: 0, color: '#000000', questions: [] }];
                setField('categories', cats);
            }} />

            <SectionTitle>Scoring Tiers (Result Logic)</SectionTitle>
            {(results.tiers || []).map((tier: any, i: number) => (
                <ItemCard key={i} index={i} onRemove={() => {
                    const ts = (results.tiers || []).filter((_: any, idx: number) => idx !== i);
                    setResultsField('tiers', ts);
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px', gap: '1rem' }}>
                        <Field label="Tier Label" value={tier.label} onChange={v => updateTier(i, 'label', v)} />
                        <Field label="Max Score" value={tier.max} onChange={v => updateTier(i, 'max', parseInt(v) || 0)} />
                        <Field label="Color" value={tier.color} onChange={v => updateTier(i, 'color', v)} type="color" />
                    </div>
                    <Field label="Advice Text" value={tier.advice} onChange={v => updateTier(i, 'advice', v)} type="textarea" />
                    <Field label="Recommended Program" value={tier.program} onChange={v => updateTier(i, 'program', v)} />
                </ItemCard>
            ))}
            <AddBtn label="Add Scoring Tier" onClick={() => {
                const ts = [...(results.tiers || []), { max: 100, label: 'New Tier', advice: 'Keep going!', program: 'N/A' }];
                setResultsField('tiers', ts);
            }} />
        </>
    );
}

function ApplyEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
    const apply = content?.pages?.apply || {};
    const setField = (path: string, value: any) => onChange(setNestedValue(content, `pages.apply.${path}`, value));

    return (
        <>
            <SectionTitle>Hero Section</SectionTitle>
            <Field label="Tag" value={apply.hero?.tag} onChange={v => setField('hero.tag', v)} />
            <Field label="Title" value={apply.hero?.title} onChange={v => setField('hero.title', v)} type="textarea" />
            <Field label="Description" value={apply.hero?.description} onChange={v => setField('hero.description', v)} type="textarea" />
            <ImageUploadField label="Hero Background Image" value={apply.hero?.image} onChange={v => setField('hero.image', v)} />

            <SectionTitle>Form Step Labels</SectionTitle>
            <Field label="Step 1 Title" value={apply.form?.step1_title} onChange={v => setField('form.step1_title', v)} />
            <Field label="Step 2 Title" value={apply.form?.step2_title} onChange={v => setField('form.step2_title', v)} />

            <SectionTitle>Consultation Fee</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Amount (number only)" value={apply.form?.consultationFee?.amount} onChange={v => setField('form.consultationFee.amount', v)} />
                <Field label="Currency" value={apply.form?.consultationFee?.currency} onChange={v => setField('form.consultationFee.currency', v)} />
            </div>
            <Field label="Refund Description" value={apply.form?.consultationFee?.description} onChange={v => setField('form.consultationFee.description', v)} type="textarea" />

            <SectionTitle>Success State</SectionTitle>
            <Field label="Success Title" value={apply.form?.success?.title} onChange={v => setField('form.success.title', v)} />
            <Field label="Success Text" value={apply.form?.success?.text} onChange={v => setField('form.success.text', v)} type="textarea" />
        </>
    );
}

function InstitutionalEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
    const page = content?.pages?.institutional || {};
    const setField = (path: string, value: any) => onChange(setNestedValue(content, `pages.institutional.${path}`, value));
    const models = page.models || [];

    return (
        <>
            <SectionTitle>Hero Section</SectionTitle>
            <Field label="Tag" value={page.hero?.tag} onChange={v => setField('hero.tag', v)} />
            <Field label="Title" value={page.hero?.title} onChange={v => setField('hero.title', v)} type="textarea" />
            <Field label="Description" value={page.hero?.description} onChange={v => setField('hero.description', v)} type="textarea" />
            <ImageUploadField label="Hero Background Image" value={page.hero?.image} onChange={v => setField('hero.image', v)} />

            <SectionTitle>Partnership Models</SectionTitle>
            <ObjectListField 
                label="Models" 
                items={page.models || []} 
                fields={[
                    { key: 'icon', label: 'Icon (emoji)' },
                    { key: 'title', label: 'Title' },
                    { key: 'desc', label: 'Description', type: 'textarea' }
                ]} 
                onChange={v => setField('models', v)}
            />

            <SectionTitle>Institutional Partners</SectionTitle>
            <ObjectListField 
                label="Partners List" 
                items={page.partners || []} 
                fields={[
                    { key: 'name', label: 'Partner Name' },
                    { key: 'logo', label: 'Logo', type: 'image' }
                ]} 
                onChange={v => setField('partners', v)}
            />
        </>
    );
}

function ProgramsEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
    const page = content?.pages?.programs || {};
    const setField = (path: string, value: any) => onChange(setNestedValue(content, `pages.programs.${path}`, value));

    const renderProgramSection = (key: string, label: string) => {
        const prog = page[key] || {};
        return (
            <Collapsible label={`${label} Section`}>
                <Field label="Badge" value={prog.badge} onChange={v => setField(`${key}.badge`, v)} />
                <Field label="Tag" value={prog.tag} onChange={v => setField(`${key}.tag`, v)} />
                <Field label="Title" value={prog.title} onChange={v => setField(`${key}.title`, v)} />
                <Field label="Description" value={prog.description} onChange={v => setField(`${key}.description`, v)} type="textarea" />
                {prog.next_cohort !== undefined && <Field label="Next Cohort" value={prog.next_cohort} onChange={v => setField(`${key}.next_cohort`, v)} />}
                
                {prog.modules && <StringListField label="Modules" items={prog.modules} onChange={v => setField(`${key}.modules`, v)} />}
                {prog.outcomes && (
                    <ObjectListField 
                        label="Outcomes" 
                        items={prog.outcomes} 
                        fields={[{ key: 'icon', label: 'Icon' }, { key: 'label', label: 'Label' }]} 
                        onChange={v => setField(`${key}.outcomes`, v)}
                    />
                )}
                {prog.inclusions && (
                    <ObjectListField 
                        label="Inclusions" 
                        items={prog.inclusions} 
                        fields={[{ key: 'icon', label: 'Icon' }, { key: 'title', label: 'Title' }, { key: 'desc', label: 'Desc', type: 'textarea' }]} 
                        onChange={v => setField(`${key}.inclusions`, v)}
                    />
                )}
            </Collapsible>
        );
    };

    return (
        <>
            <SectionTitle>Hero Section</SectionTitle>
            <Field label="Tag" value={page.hero?.tag} onChange={v => setField('hero.tag', v)} />
            <Field label="Title" value={page.hero?.title} onChange={v => setField('hero.title', v)} type="textarea" />
            <Field label="Description" value={page.hero?.description} onChange={v => setField('hero.description', v)} type="textarea" />
            <ImageUploadField label="Hero Background Image" value={page.hero?.image} onChange={v => setField('hero.image', v)} />

            <SectionTitle>Main Programs</SectionTitle>
            {renderProgramSection('bootcamp', 'Bootcamp')}
            {renderProgramSection('fellowship', 'Elite Fellowship')}
            
            <SectionTitle>Digital Courses</SectionTitle>
            <Field label="Tag" value={page.courses?.tag} onChange={v => setField('courses.tag', v)} />
            <Field label="Title" value={page.courses?.title} onChange={v => setField('courses.title', v)} />
            <Field label="Description" value={page.courses?.description} onChange={v => setField('courses.description', v)} type="textarea" />
            <ObjectListField 
                label="Courses List" 
                items={page.courses?.items || []} 
                fields={[{ key: 'number', label: 'No.' }, { key: 'title', label: 'Title' }, { key: 'duration', label: 'Duration' }, { key: 'desc', label: 'Desc', type: 'textarea' }]} 
                onChange={v => setField('courses.items', v)}
            />

            <SectionTitle>Consulting & Advocacy</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <h5 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: 8 }}>Consulting</h5>
                    <Field label="Title" value={page.consulting?.title} onChange={v => setField('consulting.title', v)} />
                    <Field label="Desc" value={page.consulting?.desc} onChange={v => setField('consulting.desc', v)} type="textarea" />
                </div>
                <div>
                    <h5 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: 8 }}>Advocacy</h5>
                    <Field label="Title" value={page.advocacy?.title} onChange={v => setField('advocacy.title', v)} />
                    <Field label="Desc" value={page.advocacy?.desc} onChange={v => setField('advocacy.desc', v)} type="textarea" />
                </div>
            </div>
        </>
    );
}

function ThemeEditor({ theme, onChange, onLogoUploaded }: { theme: any; onChange: (t: any) => void; onLogoUploaded?: (url: string) => void }) {
    const setField = (key: string, value: string) => onChange({ ...theme, [key]: value });

    return (
        <>
            <SectionTitle>Brand Colors</SectionTitle>
            <Field label="Primary Color" value={theme?.primary} onChange={v => setField('primary', v)} type="color" />
            <Field label="Secondary Color" value={theme?.secondary} onChange={v => setField('secondary', v)} type="color" />
            <Field label="Accent Color" value={theme?.accent} onChange={v => setField('accent', v)} type="color" />

            <SectionTitle>UI Colors</SectionTitle>
            <Field label="Background Color" value={theme?.background} onChange={v => setField('background', v)} type="color" />
            <Field label="Text Color" value={theme?.text} onChange={v => setField('text', v)} type="color" />

            <SectionTitle>Global Logo</SectionTitle>
            <ImageUploadField 
                label="Custom Logo" 
                value={theme?.logo} 
                onChange={v => {
                    setField('logo', v);
                    onLogoUploaded?.(v);
                }} 
            />

            <SectionTitle>Global Hero Background Image</SectionTitle>
            <ImageUploadField 
                label="Hero Background" 
                value={theme?.heroImage} 
                onChange={v => setField('heroImage', v)} 
            />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: '#9ca3af', marginTop: -8, marginBottom: '1.5rem' }}>
                Optional. If removed, gradient background is used.
            </p>
        </>
    );
}

//
// ─── MAIN PAGE ───────────────────────────────────────────────────────────────────────
//

export default function ContentPage() {
    const { content, updateContent, theme, typography, updateSettings } = useContext(PoliSettingsContext) as any;
    const [activeSection, setActiveSection] = useState(sections[0].id);
    const [localContent, setLocalContent] = useState<any>(content);
    const [localTheme, setLocalTheme] = useState<any>(theme);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [persistenceStatus, setPersistenceStatus] = useState<any>(null);

    useEffect(() => {
        if (content && Object.keys(content).length > 0) setLocalContent(content);
        if (theme) setLocalTheme(theme);
    }, [content, theme]);

    useEffect(() => {
        fetch('/api/admin/persistence', { cache: 'no-store' })
            .then(async (res) => ({ ok: res.ok, data: await res.json().catch(() => null) }))
            .then(({ data }) => setPersistenceStatus(data))
            .catch(() => setPersistenceStatus({ ready: false, errors: ['Unable to check Firebase persistence status.'] }));
    }, []);

    const handleSave = async () => {
        setLoading(true);
        setSaved(false);
        setSaveError(null);
        try {
            const [contentRes, settingsRes] = await Promise.all([
                fetch('/api/content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(localContent),
                }),
                fetch('/api/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ theme: localTheme, typography: typography || 'institutional' }),
                }),
            ]);

            if (!contentRes.ok || !settingsRes.ok) {
                const [contentError, settingsError] = await Promise.all([
                    contentRes.json().catch(() => null),
                    settingsRes.json().catch(() => null),
                ]);
                throw new Error(contentError?.error || settingsError?.error || 'Firebase refused the save request.');
            }

            // Update the context immediately
            updateContent(localContent);
            updateSettings({ theme: localTheme });

            // Persistence proof: Ensure fresh load
            const [freshContent, freshSettings] = await Promise.all([
                fetch('/api/content', { cache: 'no-store' }).then(r => r.json()),
                fetch('/api/settings', { cache: 'no-store' }).then(r => r.json())
            ]);

            if (freshContent && !freshContent.error) setLocalContent(freshContent);
            if (freshSettings && freshSettings.theme) setLocalTheme(freshSettings.theme);

            const contentPersisted = freshContent?._source === 'firebase' || freshContent?._source === 'firestore_rest';
            const settingsPersisted = freshSettings?._source === 'firebase' || freshSettings?._source === 'firestore_rest';

            setPersistenceStatus({
                ready: contentPersisted && settingsPersisted,
                contentSource: freshContent?._source,
                settingsSource: freshSettings?._source,
                errors: contentPersisted && settingsPersisted ? [] : ['Saved response did not come back from Firebase.'],
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 5000);
        } catch (error: any) {
            console.error('Failed to save content:', error);
            setSaveError(error.message || 'Failed to save changes.');
        } finally {
            setLoading(false);
        }
    };

    const active = sections.find((s: any) => s.id === activeSection)!;

    const renderEditor = () => {
        switch (activeSection) {
            case 'metadata': return <MetadataEditor content={localContent} onChange={setLocalContent} />;
            case 'navbar': return <NavbarEditor content={localContent} onChange={setLocalContent} />;
            case 'footer': return <FooterEditor content={localContent} onChange={setLocalContent} />;
            case 'home': return <HomeEditor content={localContent} onChange={setLocalContent} />;
            case 'about': return <AboutEditor content={localContent} onChange={setLocalContent} />;
            case 'services': return <ServicesEditor content={localContent} onChange={setLocalContent} />;
            case 'programs': return <ProgramsEditor content={localContent} onChange={setLocalContent} />;
            case 'institutional': return <InstitutionalEditor content={localContent} onChange={setLocalContent} />;
            case 'assessment': return <AssessmentEditor content={localContent} onChange={setLocalContent} />;
            case 'apply': return <ApplyEditor content={localContent} onChange={setLocalContent} />;
            case 'theme': return <ThemeEditor theme={localTheme} onChange={setLocalTheme} />;
            default: return <p style={{ color: '#9ca3af' }}>Select a section to edit.</p>;
        }
    };

    return (
        <div style={{ height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
            {/* Header Bar */}
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', flexShrink: 0, padding: '0 0 0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                <div>
                    <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.3rem', color: '#111', marginBottom: '0.1rem' }}>Content Management</h1>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.76rem', color: '#9ca3af', margin: 0 }}>
                        Edit all content, navigation, and branding — changes sync automatically on save.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {saved && (
                        <span style={{ color: '#1F6F3E', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ fontSize: '1.1rem' }}>✓</span> Published successfully
                        </span>
                    )}
                    <button
                        className="btn-primary"
                        style={{ fontSize: '0.75rem', padding: '10px 22px', whiteSpace: 'nowrap', opacity: loading ? 0.7 : 1 }}
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? 'Publishing...' : 'Save & Publish Changes'}
                    </button>
                </div>
            </div>

            {persistenceStatus && !persistenceStatus.ready && (
                <div style={{ background: '#fff7ed', color: '#9a3412', border: '1px solid #fed7aa', padding: '0.75rem 1rem', borderRadius: 6, marginBottom: '1rem', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', lineHeight: 1.5 }}>
                    <strong>Firebase persistence is not ready.</strong> Public content is reading from <code>{persistenceStatus.contentSource || 'unknown'}</code> and settings from <code>{persistenceStatus.settingsSource || 'unknown'}</code>. {persistenceStatus.errors?.[0] || 'Create and seed Firestore before publishing admin changes.'}
                </div>
            )}

            {saveError && (
                <div style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '0.75rem 1rem', borderRadius: 6, marginBottom: '1rem', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', lineHeight: 1.5 }}>
                    <strong>Save failed:</strong> {saveError}
                </div>
            )}

            {/* Two-Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.25rem', flex: 1, minHeight: 0 }}>
                {/* Sidebar */}
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', overflowY: 'auto', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    {['Global', 'Design', 'Pages'].map((group: string) => (
                        <div key={group}>
                            <div style={{ padding: '0.75rem 1rem', background: '#f9fafb', borderBottom: '1px solid #f3f4f6', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.67rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                                {group}
                            </div>
                            {sections.filter((s: any) => s.group === group).map((s: any) => (
                                <div
                                    key={s.id}
                                    onClick={() => setActiveSection(s.id)}
                                    style={{
                                        padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid #f9fafb',
                                        background: activeSection === s.id ? '#f0fdf4' : '#fff',
                                        borderLeft: `3px solid ${activeSection === s.id ? '#1F6F3E' : 'transparent'}`,
                                        transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8,
                                    }}
                                >
                                    <span style={{ fontSize: '0.9rem' }}>{s.icon}</span>
                                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: activeSection === s.id ? 600 : 400, color: activeSection === s.id ? '#1F6F3E' : '#374151' }}>
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Editor Panel */}
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', overflowY: 'auto', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 10, position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
                        <span style={{ fontSize: '1.1rem' }}>{active.icon}</span>
                        <div>
                            <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.1rem', color: '#111', margin: 0 }}>{active.label}</h3>
                            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#9ca3af', margin: 0 }}>Update copy, links, and list items for this section.</p>
                        </div>
                    </div>
                    <div style={{ padding: '2rem', maxWidth: 780 }}>
                        {renderEditor()}
                    </div>
                </div>
            </div>
        </div>
    );
}
