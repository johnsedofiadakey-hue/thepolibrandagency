'use client';
import { useState } from 'react';

const templates = [
    {
        id: 'assessment_complete',
        label: 'Assessment Completion',
        trigger: 'Triggered when a user completes the Political Readiness Index',
        subject: 'Your Political Readiness Score is Ready – The Polibrand Agency',
        body: `Dear {{first_name}},

Thank you for completing the Polibrand Political Readiness Index.

Your Score: {{score}}/100
Status: {{tier}}

Based on your results, we recommend: {{recommended_program}}.

Click below to view your full results and explore program options tailored to your readiness stage.

[View Full Results]

Warm regards,
The Polibrand Agency Team`,
    },
    {
        id: 'application_received',
        label: 'Application Received',
        trigger: 'Triggered when a new application is submitted',
        subject: 'Application Received – {{program_name}} | The Polibrand Agency',
        body: `Dear {{first_name}},

We have received your application for the {{program_name}}. Our admissions team will review it and contact you within 5 business days.

Application Reference: {{app_id}}
Program: {{program_name}}
Submitted: {{date}}

In the meantime, you may wish to retake the Political Readiness Assessment to strengthen your profile.

Best regards,
The Polibrand Agency`,
    },
    {
        id: 'application_approved',
        label: 'Application Approved',
        trigger: 'Triggered when admin approves an application',
        subject: 'Congratulations! Your Application Has Been Approved – {{program_name}}',
        body: `Dear {{first_name}},

Congratulations — your application to the {{program_name}} has been approved.

You are now part of an elite cohort of women building political power across Africa.

Next Steps:
1. Complete your payment to secure your spot
2. Access your onboarding materials
3. Join the fellows community

Payment Link: {{payment_link}}

We look forward to working with you.

The Polibrand Agency Team`,
    },
];

export default function EmailPage() {
    const [activeTemplate, setActiveTemplate] = useState(templates[0].id);
    const [bodies, setBodies] = useState<Record<string, string>>(
        Object.fromEntries(templates.map((t) => [t.id, t.body]))
    );
    const [subjects, setSubjects] = useState<Record<string, string>>(
        Object.fromEntries(templates.map((t) => [t.id, t.subject]))
    );
    const [saved, setSaved] = useState(false);

    const active = templates.find((t) => t.id === activeTemplate)!;

    return (
        <div>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                    <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.4rem', color: '#111', marginBottom: '0.15rem' }}>Email Automation</h1>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#9ca3af' }}>Template management</p>
                </div>
            </div>

            <div className="grid-cols-2-mobile-1" style={{ gridTemplateColumns: '280px 1fr' }}>
                {/* Template List */}
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f3f4f6', fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>Email Templates</div>
                    {templates.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTemplate(t.id)}
                            style={{
                                width: '100%', textAlign: 'left', padding: '1rem 1.25rem', cursor: 'pointer', border: 'none',
                                background: activeTemplate === t.id ? '#f0fdf4' : '#fff',
                                borderBottom: '1px solid #f3f4f6', transition: 'background 0.2s',
                                borderLeft: `3px solid ${activeTemplate === t.id ? '#1F6F3E' : 'transparent'}`,
                            }}
                        >
                            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.84rem', color: activeTemplate === t.id ? '#1F6F3E' : '#111', marginBottom: 4 }}>{t.label}</div>
                            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#9ca3af' }}>{t.trigger.substring(0, 45)}...</div>
                        </button>
                    ))}
                </div>

                {/* Editor */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Trigger info */}
                    <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 6, padding: '0.75rem 1rem', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#92400e' }}>
                        ⚡ <strong>Trigger:</strong> {active.trigger}
                    </div>

                    <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.75rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>Subject Line</label>
                            <input
                                type="text"
                                value={subjects[activeTemplate]}
                                onChange={(e) => setSubjects({ ...subjects, [activeTemplate]: e.target.value })}
                                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5e0d6', borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>Email Body</label>
                            <textarea
                                value={bodies[activeTemplate]}
                                onChange={(e) => setBodies({ ...bodies, [activeTemplate]: e.target.value })}
                                rows={16}
                                style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e5e0d6', borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', lineHeight: 1.7, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <button className="btn-primary" style={{ fontSize: '0.82rem', padding: '10px 20px' }} onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
                                {saved ? '✓ Saved' : 'Save Template'}
                            </button>
                            <button className="btn-outline-dark" style={{ fontSize: '0.82rem', padding: '10px 20px' }}>Send Test Email</button>
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#9ca3af' }}>
                                Variables: {'{{first_name}}'}, {'{{score}}'}, {'{{tier}}'}, {'{{program_name}}'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
