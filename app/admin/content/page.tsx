'use client';
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { PoliSettingsContext } from '@/components/SettingsProvider';

const sections = [
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

type FieldType = 'text' | 'textarea' | 'color';

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
            <Field label="Pull Quote" value={home.challenge?.quote} onChange={v => setField('challenge.quote', v)} />

            <div style={{ marginTop: '1rem' }}>
                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>Challenge Stats</label>
                {(home.challenge?.stats || []).map((s: any, i: number) => (
                    <ItemCard key={i} index={i} onRemove={() => {
                        const stats = (home.challenge?.stats || []).filter((_: any, idx: number) => idx !== i);
                        onChange(setNestedValue(content, 'pages.home.challenge.stats', stats));
                    }}>
                        <Field label="Label" value={s.label} onChange={v => updateChallengeStat(i, 'label', v)} />
                        <Field label="Value (e.g. 26%)" value={s.value} onChange={v => updateChallengeStat(i, 'value', v)} />
                    </ItemCard>
                ))}
                <AddBtn label="Add Stat" onClick={() => {
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
                    <Field label="Icon (emoji)" value={item.icon} onChange={v => updateService(i, 'icon', v)} />
                    <Field label="Title" value={item.title} onChange={v => updateService(i, 'title', v)} />
                    <Field label="Description" value={item.desc} onChange={v => updateService(i, 'desc', v)} type="textarea" />
                </ItemCard>
            ))}
            <AddBtn label="Add Service" onClick={() => {
                const items = [...(home.services?.items || []), { icon: '◈', title: 'New Service', desc: 'Description.' }];
                onChange(setNestedValue(content, 'pages.home.services.items', items));
            }} />

            <SectionTitle>Diagnostic Teaser</SectionTitle>
            <Field label="Tag" value={home.diagnostic?.tag} onChange={v => setField('diagnostic.tag', v)} />
            <Field label="Title" value={home.diagnostic?.title} onChange={v => setField('diagnostic.title', v)} />
            <Field label="Description" value={home.diagnostic?.description} onChange={v => setField('diagnostic.description', v)} type="textarea" />

            <SectionTitle>Partnerships Section</SectionTitle>
            <Field label="Tag" value={home.partnerships?.tag} onChange={v => setField('partnerships.tag', v)} />
            <Field label="Title" value={home.partnerships?.title} onChange={v => setField('partnerships.title', v)} />
            <Field label="Body Text" value={home.partnerships?.text} onChange={v => setField('partnerships.text', v)} type="textarea" />
        </>
    );
}

function AboutEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
    const about = content?.pages?.about || {};
    const setField = (path: string, value: any) => onChange(setNestedValue(content, `pages.about.${path}`, value));

    return (
        <>
            <SectionTitle>Hero</SectionTitle>
            <Field label="Tag" value={about.hero?.tag} onChange={v => setField('hero.tag', v)} />
            <Field label="Title" value={about.hero?.title} onChange={v => setField('hero.title', v)} type="textarea" />
            <Field label="Description" value={about.hero?.description} onChange={v => setField('hero.description', v)} type="textarea" />

            <SectionTitle>Vision Section</SectionTitle>
            <Field label="Tag" value={about.vision?.tag} onChange={v => setField('vision.tag', v)} />
            <Field label="Title" value={about.vision?.title} onChange={v => setField('vision.title', v)} />
            <Field label="Description" value={about.vision?.description} onChange={v => setField('vision.description', v)} type="textarea" />

            <SectionTitle>Strategic Architecture</SectionTitle>
            <Field label="Tag" value={about.strategy?.tag} onChange={v => setField('strategy.tag', v)} />
            <Field label="Title" value={about.strategy?.title} onChange={v => setField('strategy.title', v)} />
            {(about.strategy?.steps || []).map((step: any, i: number) => (
                <ItemCard key={i} index={i} onRemove={() => {
                    const steps = (about.strategy?.steps || []).filter((_: any, idx: number) => idx !== i);
                    onChange(setNestedValue(content, 'pages.about.strategy.steps', steps));
                }}>
                    <Field label="Step Title" value={step.title} onChange={v => {
                        const steps = (about.strategy?.steps || []).map((s: any, idx: number) => idx === i ? { ...s, title: v } : s);
                        onChange(setNestedValue(content, 'pages.about.strategy.steps', steps));
                    }} />
                    <Field label="Step Description" value={step.desc} onChange={v => {
                        const steps = (about.strategy?.steps || []).map((s: any, idx: number) => idx === i ? { ...s, desc: v } : s);
                        onChange(setNestedValue(content, 'pages.about.strategy.steps', steps));
                    }} type="textarea" />
                </ItemCard>
            ))}
            <AddBtn label="Add Step" onClick={() => {
                const steps = [...(about.strategy?.steps || []), { title: 'New Step', desc: 'Description.' }];
                onChange(setNestedValue(content, 'pages.about.strategy.steps', steps));
            }} />

            <SectionTitle>Philosophy Section</SectionTitle>
            <Field label="Tag" value={about.philosophy?.tag} onChange={v => setField('philosophy.tag', v)} />
            <Field label="Title" value={about.philosophy?.title} onChange={v => setField('philosophy.title', v)} />
            {(about.philosophy?.cards || []).map((card: any, i: number) => (
                <ItemCard key={i} index={i} onRemove={() => {
                    const cards = (about.philosophy?.cards || []).filter((_: any, idx: number) => idx !== i);
                    onChange(setNestedValue(content, 'pages.about.philosophy.cards', cards));
                }}>
                    <Field label="Card Title" value={card.title} onChange={v => {
                        const cards = (about.philosophy?.cards || []).map((c: any, idx: number) => idx === i ? { ...c, title: v } : c);
                        onChange(setNestedValue(content, 'pages.about.philosophy.cards', cards));
                    }} />
                    <Field label="Card Text" value={card.text} onChange={v => {
                        const cards = (about.philosophy?.cards || []).map((c: any, idx: number) => idx === i ? { ...c, text: v } : c);
                        onChange(setNestedValue(content, 'pages.about.philosophy.cards', cards));
                    }} type="textarea" />
                </ItemCard>
            ))}
            <AddBtn label="Add Philosophy Card" onClick={() => {
                const cards = [...(about.philosophy?.cards || []), { title: 'New Principle', text: 'Description.' }];
                onChange(setNestedValue(content, 'pages.about.philosophy.cards', cards));
            }} />
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
                    <Field label="Number" value={item.number} onChange={v => {
                        const items = (services.individual?.items || []).map((s: any, idx: number) => idx === i ? { ...s, number: v } : s);
                        onChange(setNestedValue(content, 'pages.services.individual.items', items));
                    }} />
                    <Field label="Title" value={item.title} onChange={v => {
                        const items = (services.individual?.items || []).map((s: any, idx: number) => idx === i ? { ...s, title: v } : s);
                        onChange(setNestedValue(content, 'pages.services.individual.items', items));
                    }} />
                    <Field label="Intro" value={item.intro} onChange={v => {
                        const items = (services.individual?.items || []).map((s: any, idx: number) => idx === i ? { ...s, intro: v } : s);
                        onChange(setNestedValue(content, 'pages.services.individual.items', items));
                    }} type="textarea" />
                </ItemCard>
            ))}
            <AddBtn label="Add Service" onClick={() => {
                const items = [...(services.individual?.items || []), { number: '04', title: 'New Service', intro: 'Description.', deliverables: [] }];
                onChange(setNestedValue(content, 'pages.services.individual.items', items));
            }} />

            <SectionTitle>Institutional Services</SectionTitle>
            <Field label="Tag" value={services.institutional?.tag} onChange={v => setField('institutional.tag', v)} />
            <Field label="Title" value={services.institutional?.title} onChange={v => setField('institutional.title', v)} />
        </>
    );
}

function ProgramsEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
    const programs = content?.pages?.programs || {};
    const setField = (path: string, value: any) => onChange(setNestedValue(content, `pages.programs.${path}`, value));

    return (
        <>
            <SectionTitle>Hero</SectionTitle>
            <Field label="Tag" value={programs.hero?.tag} onChange={v => setField('hero.tag', v)} />
            <Field label="Title" value={programs.hero?.title} onChange={v => setField('hero.title', v)} type="textarea" />
            <Field label="Description" value={programs.hero?.description} onChange={v => setField('hero.description', v)} type="textarea" />

            <SectionTitle>Leadership Bootcamp</SectionTitle>
            <Field label="Tag" value={programs.bootcamp?.tag} onChange={v => setField('bootcamp.tag', v)} />
            <Field label="Badge (e.g. 6 Weeks · Hybrid)" value={programs.bootcamp?.badge} onChange={v => setField('bootcamp.badge', v)} />
            <Field label="Title" value={programs.bootcamp?.title} onChange={v => setField('bootcamp.title', v)} />
            <Field label="Description" value={programs.bootcamp?.description} onChange={v => setField('bootcamp.description', v)} type="textarea" />
            <Field label="Next Cohort Announcement" value={programs.bootcamp?.next_cohort} onChange={v => setField('bootcamp.next_cohort', v)} type="textarea" />

            <SectionTitle>Bootcamp Modules</SectionTitle>
            {(programs.bootcamp?.modules || []).map((mod: string, i: number) => (
                <ItemCard key={i} index={i} onRemove={() => {
                    const modules = (programs.bootcamp?.modules || []).filter((_: any, idx: number) => idx !== i);
                    onChange(setNestedValue(content, 'pages.programs.bootcamp.modules', modules));
                }}>
                    <Field label="Module Name" value={mod} onChange={v => {
                        const modules = (programs.bootcamp?.modules || []).map((m: string, idx: number) => idx === i ? v : m);
                        onChange(setNestedValue(content, 'pages.programs.bootcamp.modules', modules));
                    }} />
                </ItemCard>
            ))}
            <AddBtn label="Add Module" onClick={() => {
                const modules = [...(programs.bootcamp?.modules || []), 'New Module'];
                onChange(setNestedValue(content, 'pages.programs.bootcamp.modules', modules));
            }} />

            <SectionTitle>The Fellowship</SectionTitle>
            <Field label="Tag" value={programs.fellowship?.tag} onChange={v => setField('fellowship.tag', v)} />
            <Field label="Badge" value={programs.fellowship?.badge} onChange={v => setField('fellowship.badge', v)} />
            <Field label="Title" value={programs.fellowship?.title} onChange={v => setField('fellowship.title', v)} />
            <Field label="Description" value={programs.fellowship?.description} onChange={v => setField('fellowship.description', v)} type="textarea" />

            <SectionTitle>Digital Courses</SectionTitle>
            <Field label="Tag" value={programs.courses?.tag} onChange={v => setField('courses.tag', v)} />
            <Field label="Title" value={programs.courses?.title} onChange={v => setField('courses.title', v)} />
            <Field label="Description" value={programs.courses?.description} onChange={v => setField('courses.description', v)} type="textarea" />
        </>
    );
}

function InstitutionalEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
    const inst = content?.pages?.institutional || {};
    const setField = (path: string, value: any) => onChange(setNestedValue(content, `pages.institutional.${path}`, value));

    return (
        <>
            <SectionTitle>Hero</SectionTitle>
            <Field label="Tag" value={inst.hero?.tag} onChange={v => setField('hero.tag', v)} />
            <Field label="Title" value={inst.hero?.title} onChange={v => setField('hero.title', v)} type="textarea" />
            <Field label="Description" value={inst.hero?.description} onChange={v => setField('hero.description', v)} type="textarea" />

            <SectionTitle>Partnership Models</SectionTitle>
            {(inst.models || []).map((model: any, i: number) => (
                <ItemCard key={i} index={i} onRemove={() => {
                    const models = (inst.models || []).filter((_: any, idx: number) => idx !== i);
                    onChange(setNestedValue(content, 'pages.institutional.models', models));
                }}>
                    <Field label="Icon (emoji)" value={model.icon} onChange={v => {
                        const models = (inst.models || []).map((m: any, idx: number) => idx === i ? { ...m, icon: v } : m);
                        onChange(setNestedValue(content, 'pages.institutional.models', models));
                    }} />
                    <Field label="Title" value={model.title} onChange={v => {
                        const models = (inst.models || []).map((m: any, idx: number) => idx === i ? { ...m, title: v } : m);
                        onChange(setNestedValue(content, 'pages.institutional.models', models));
                    }} />
                    <Field label="Description" value={model.desc} onChange={v => {
                        const models = (inst.models || []).map((m: any, idx: number) => idx === i ? { ...m, desc: v } : m);
                        onChange(setNestedValue(content, 'pages.institutional.models', models));
                    }} type="textarea" />
                </ItemCard>
            ))}
            <AddBtn label="Add Partnership Model" onClick={() => {
                const models = [...(inst.models || []), { icon: '🌍', title: 'New Model', desc: 'Description.', features: [] }];
                onChange(setNestedValue(content, 'pages.institutional.models', models));
            }} />
        </>
    );
}

function AssessmentEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
    const assessment = content?.pages?.assessment || {};
    const setField = (path: string, value: any) => onChange(setNestedValue(content, `pages.assessment.${path}`, value));

    return (
        <>
            <SectionTitle>Hero</SectionTitle>
            <Field label="Tag" value={assessment.hero?.tag} onChange={v => setField('hero.tag', v)} />
            <Field label="Title" value={assessment.hero?.title} onChange={v => setField('hero.title', v)} type="textarea" />
            <Field label="Description" value={assessment.hero?.description} onChange={v => setField('hero.description', v)} type="textarea" />

            <SectionTitle>Assessment Details</SectionTitle>
            {(assessment.hero?.details || []).map((detail: any, i: number) => (
                <ItemCard key={i} index={i} onRemove={() => {
                    const details = (assessment.hero?.details || []).filter((_: any, idx: number) => idx !== i);
                    onChange(setNestedValue(content, 'pages.assessment.hero.details', details));
                }}>
                    <Field label="Icon (emoji)" value={detail.icon} onChange={v => {
                        const details = (assessment.hero?.details || []).map((d: any, idx: number) => idx === i ? { ...d, icon: v } : d);
                        onChange(setNestedValue(content, 'pages.assessment.hero.details', details));
                    }} />
                    <Field label="Text" value={detail.text} onChange={v => {
                        const details = (assessment.hero?.details || []).map((d: any, idx: number) => idx === i ? { ...d, text: v } : d);
                        onChange(setNestedValue(content, 'pages.assessment.hero.details', details));
                    }} />
                </ItemCard>
            ))}
        </>
    );
}

function ApplyEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
    const apply = content?.pages?.apply || {};
    const setField = (path: string, value: any) => onChange(setNestedValue(content, `pages.apply.${path}`, value));

    return (
        <>
            <SectionTitle>Hero</SectionTitle>
            <Field label="Tag" value={apply.hero?.tag} onChange={v => setField('hero.tag', v)} />
            <Field label="Title" value={apply.hero?.title} onChange={v => setField('hero.title', v)} type="textarea" />
            <Field label="Description" value={apply.hero?.description} onChange={v => setField('hero.description', v)} type="textarea" />

            <SectionTitle>Form Step Labels</SectionTitle>
            <Field label="Step 1 Title" value={apply.form?.step1_title} onChange={v => setField('form.step1_title', v)} />
            <Field label="Step 2 Title" value={apply.form?.step2_title} onChange={v => setField('form.step2_title', v)} />

            <SectionTitle>Success State</SectionTitle>
            <Field label="Success Title" value={apply.form?.success?.title} onChange={v => setField('form.success.title', v)} />
            <Field label="Success Text" value={apply.form?.success?.text} onChange={v => setField('form.success.text', v)} type="textarea" />
        </>
    );
}

function ThemeEditor({ theme, onChange }: { theme: any; onChange: (t: any) => void }) {
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

            <SectionTitle>Logo & Hero Image</SectionTitle>
            <Field label="Logo Path (e.g. /logo.png)" value={theme?.logo} onChange={v => setField('logo', v)} />
            <Field label="Hero Image URL (optional)" value={theme?.heroImage} onChange={v => setField('heroImage', v)} />
        </>
    );
}

//
// ─── MAIN PAGE ───────────────────────────────────────────────────────────────────────
//

export default function ContentPage() {
    const { content, updateContent, theme, updateSettings } = useContext(PoliSettingsContext) as any;
    const [activeSection, setActiveSection] = useState(sections[0].id);
    const [localContent, setLocalContent] = useState<any>(content);
    const [localTheme, setLocalTheme] = useState<any>(theme);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (content && Object.keys(content).length > 0) setLocalContent(content);
        if (theme) setLocalTheme(theme);
    }, [content, theme]);

    const handleSave = async () => {
        setLoading(true);
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
                    body: JSON.stringify({ theme: localTheme, typography: 'institutional' }),
                }),
            ]);

            if (contentRes.ok && settingsRes.ok) {
                updateContent(localContent);
                updateSettings({ theme: localTheme });
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                throw new Error('Server responded with error');
            }
        } catch (error) {
            console.error('Failed to save content:', error);
            alert('Failed to save changes. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const active = sections.find(s => s.id === activeSection)!;

    const renderEditor = () => {
        switch (activeSection) {
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

            {/* Two-Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.25rem', flex: 1, minHeight: 0 }}>
                {/* Sidebar */}
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', overflowY: 'auto', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    {['Global', 'Design', 'Pages'].map(group => (
                        <div key={group}>
                            <div style={{ padding: '0.75rem 1rem', background: '#f9fafb', borderBottom: '1px solid #f3f4f6', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.67rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                                {group}
                            </div>
                            {sections.filter(s => s.group === group).map(s => (
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
