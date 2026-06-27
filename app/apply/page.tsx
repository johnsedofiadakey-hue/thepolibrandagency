'use client';
import { Suspense, useState, useContext, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PoliSettingsContext } from '@/components/SettingsProvider';

const SERVICE_OPTIONS = [
    {
        category: 'Training Programs',
        items: [
            { id: 'fellowship', label: 'The Polibrand Fellowship', desc: 'Flagship leadership & political branding programme for women in governance.' },
            { id: 'bootcamp', label: 'Leadership Branding Bootcamp', desc: '6-week intensive on personal brand, narrative & media strategy.' },
            { id: 'courses', label: 'Digital Courses', desc: 'Self-paced courses in political communication and digital presence.' },
        ],
    },
    {
        category: 'Individual Services',
        items: [
            { id: 'brand-positioning', label: 'Personal Brand Positioning', desc: 'Build a distinctive political identity that commands attention and trust.' },
            { id: 'brand-strategy', label: 'Political Brand Strategy', desc: 'Data-driven communication strategy tailored to your political goals.' },
            { id: 'campaign-comms', label: 'Campaign Communication Management', desc: 'End-to-end messaging, media handling and campaign narrative.' },
        ],
    },
    {
        category: 'Institutional Services',
        items: [
            { id: 'policy-comms', label: 'Policy Communication Consulting', desc: 'Translate complex policy into public messaging that resonates.' },
            { id: 'gender-leadership', label: 'Gender Leadership Programs', desc: 'Custom-designed programs for political parties, NGOs and institutions.' },
        ],
    },
];

const COUNTRIES = [
    'Ghana', 'Nigeria', 'Kenya', 'South Africa', 'Rwanda', 'Uganda', 'Tanzania',
    'Senegal', 'Côte d\'Ivoire', 'Cameroon', 'Ethiopia', 'Zimbabwe', 'Zambia',
    'Botswana', 'Namibia', 'Mozambique', 'Madagascar', 'Malawi', 'Sierra Leone',
    'Liberia', 'Guinea', 'Mali', 'Burkina Faso', 'Niger', 'Chad', 'Sudan',
    'Egypt', 'Morocco', 'Tunisia', 'Algeria', 'Libya', 'Other African Country', 'International',
];

function ServiceCard({ item, selected, onToggle }: { item: typeof SERVICE_OPTIONS[0]['items'][0]; selected: boolean; onToggle: () => void }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="text-left w-full transition-all duration-200"
            style={{
                padding: '1rem',
                borderRadius: 10,
                border: selected ? '2px solid var(--color-primary)' : '2px solid #e5e7eb',
                background: selected ? 'rgba(var(--color-primary-rgb, 139,0,0), 0.04)' : '#fff',
                cursor: 'pointer',
                position: 'relative',
            }}
        >
            <div style={{ position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderRadius: 4, border: selected ? '2px solid var(--color-primary)' : '2px solid #d1d5db', background: selected ? 'var(--color-primary)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {selected && <span style={{ color: '#fff', fontSize: 11, fontWeight: 900 }}>✓</span>}
            </div>
            <p className="font-display font-bold text-sm text-[#111] mb-1 pr-8">{item.label}</p>
            <p className="font-sans text-xs text-[var(--color-muted)] leading-relaxed">{item.desc}</p>
        </button>
    );
}

// Public key is safe to embed — it's a Paystack publishable key (like Stripe pk_live_*)
const PAYSTACK_PK_FALLBACK = 'pk_live_8ed2906bfdd2f7f064f4c2f171e2aa603b5690c7';

function ApplyForm() {
    const { content } = useContext(PoliSettingsContext) as any;
    const apply = content.pages.apply;

    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [paystackPublicKey, setPaystackPublicKey] = useState(PAYSTACK_PK_FALLBACK);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [serviceError, setServiceError] = useState('');

    const searchParams = useSearchParams();
    const paramScore = searchParams.get('score');
    const paramProgram = searchParams.get('program');

    const getInitialServices = () => {
        if (!paramProgram) return [];
        const n = decodeURIComponent(paramProgram).toLowerCase();
        if (n.includes('fellowship')) return ['fellowship'];
        if (n.includes('bootcamp')) return ['bootcamp'];
        if (n.includes('course')) return ['courses'];
        return [];
    };

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        country: '', role: '',
        services: getInitialServices(),
        essay: '',
        assessmentScore: paramScore ? parseInt(paramScore, 10) : undefined as number | undefined,
    });

    useEffect(() => {
        // Fetch key from API; fall back to hardcoded public key if empty/unavailable
        fetch('/api/payment/config')
            .then(r => r.json())
            .then(d => { if (d.paystackPublicKey) setPaystackPublicKey(d.paystackPublicKey); })
            .catch(() => {});

        // Load Paystack inline.js once
        if ((window as any).PaystackPop) return;
        if (document.getElementById('paystack-js')) return;
        const script = document.createElement('script');
        script.id = 'paystack-js';
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const toggleService = (id: string) => {
        setServiceError('');
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(id)
                ? prev.services.filter(s => s !== id)
                : [...prev.services, id],
        }));
    };

    const goNext = () => { setStep(s => s + 1); window.scrollTo(0, 0); };
    const goPrev = () => { setStep(s => s - 1); window.scrollTo(0, 0); };

    const handleStep2Submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.services.length === 0) {
            setServiceError('Please select at least one service or program.');
            return;
        }
        goNext();
    };

    const getSelectedLabels = () => {
        const all = SERVICE_OPTIONS.flatMap(g => g.items);
        return formData.services.map(id => all.find(i => i.id === id)?.label || id);
    };

    const handlePayment = () => {
        setPaymentError(null);
        setPaymentLoading(true);

        try {
            const PaystackPop = (window as any).PaystackPop;
            if (!PaystackPop || typeof PaystackPop.setup !== 'function') {
                // Script may still be loading — wait up to 5 s then retry
                let waited = 0;
                const check = setInterval(() => {
                    waited += 250;
                    const PS = (window as any).PaystackPop;
                    if (PS && typeof PS.setup === 'function') {
                        clearInterval(check);
                        setPaymentLoading(false);
                        // Re-trigger after the script loads
                        handlePayment();
                    } else if (waited >= 5000) {
                        clearInterval(check);
                        setPaymentError('Payment system failed to load. Please refresh the page and try again.');
                        setPaymentLoading(false);
                    }
                }, 250);
                return;
            }

            const handler = PaystackPop.setup({
                key: paystackPublicKey,
                email: formData.email,
                amount: 150000,
                currency: 'GHS',
                ref: `pba_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
                label: `${formData.firstName} ${formData.lastName}`,
                metadata: {
                    custom_fields: [
                        { display_name: 'Applicant', variable_name: 'applicant', value: `${formData.firstName} ${formData.lastName}` },
                        { display_name: 'Services', variable_name: 'services', value: getSelectedLabels().join(', ') },
                    ],
                },
                callback: async (response: any) => {
                    try {
                        const res = await fetch('/api/payment/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                reference: response.reference,
                                firstName: formData.firstName,
                                lastName: formData.lastName,
                                email: formData.email,
                                phone: formData.phone,
                                country: formData.country,
                                role: formData.role,
                                program: getSelectedLabels().join(', '),
                                essay: formData.essay,
                                services: formData.services,
                                assessmentScore: formData.assessmentScore,
                            }),
                        });
                        if (res.ok) { setSubmitted(true); window.scrollTo(0, 0); }
                        else {
                            const d = await res.json().catch(() => null);
                            setPaymentError((d?.error || 'Payment verification failed.') + ` (Ref: ${response.reference})`);
                            setPaymentLoading(false);
                        }
                    } catch {
                        setPaymentError(`Network error after payment. Please save your reference: ${response.reference} and contact us.`);
                        setPaymentLoading(false);
                    }
                },
                onClose: () => { setPaymentLoading(false); },
            });

            handler.openIframe();
        } catch (err: any) {
            setPaymentError(`Payment error: ${err?.message || 'Unknown error. Please refresh and try again.'}`);
            setPaymentLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-[var(--color-bg)] min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-6 pt-32 pb-20">
                    <div className="card-brand max-w-lg w-full text-center border-t-4 border-[var(--color-primary)] animate-fade-up">
                        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
                        <h2 className="font-display font-bold text-3xl text-[#111] mb-4">{apply.form.success.title}</h2>
                        <div className="divider-gold divider-gold-center" />
                        <p className="font-sans text-[#444] mb-8 leading-relaxed">
                            {apply.form.success.text.replace('{name}', formData.firstName).replace('{program}', getSelectedLabels().join(', '))}
                        </p>
                        <div className="flex flex-col gap-3">
                            <Link href="/" className="btn-primary w-full justify-center">Return to Homepage</Link>
                            <Link href="/services" className="font-sans text-sm text-[var(--color-primary)] font-semibold uppercase tracking-wider mt-2 hover:underline">Explore Our Services →</Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const fillWidth = step === 1 ? '0%' : step === 2 ? '50%' : '100%';
    const inputCls = "w-full px-4 py-3.5 border-2 border-gray-100 rounded-lg bg-gray-50 focus:bg-white focus:border-[var(--color-primary)] transition-all outline-none font-sans text-sm text-[#111] placeholder-gray-400";
    const selectArrow = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`;

    return (
        <div className="bg-[var(--color-bg)] min-h-screen">
            <Navbar />

            {/* Hero */}
            <section className="pt-36 pb-12 relative overflow-hidden" style={{
                background: apply.hero.image
                    ? `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${apply.hero.image}) center/cover`
                    : 'linear-gradient(135deg, var(--color-primary) 0%, #0d1f3c 100%)',
            }}>
                <div className="container-brand max-w-2xl text-center relative z-10">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-6 h-px bg-[#C9A227]" />
                        <span className="font-sans text-xs font-semibold text-[#C9A227] tracking-widest uppercase">{apply.hero.tag}</span>
                        <div className="w-6 h-px bg-[#C9A227]" />
                    </div>
                    <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">{apply.hero.title}</h1>
                    <p className="font-sans text-base text-white/75 leading-relaxed">{apply.hero.description}</p>
                </div>
            </section>

            {/* Form */}
            <section className="pb-24 -mt-6 relative z-10">
                <div className="container-brand max-w-2xl">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

                        {/* Progress header */}
                        <div style={{ background: 'var(--color-primary)', padding: '1.25rem 2rem' }}>
                            {formData.assessmentScore !== undefined && (
                                <div className="flex items-center gap-2 mb-3 bg-white/10 rounded-lg px-3 py-2">
                                    <span style={{ color: '#C9A227', fontWeight: 900 }}>★</span>
                                    <span className="font-sans text-xs text-white/90">
                                        Political Readiness Score <strong style={{ color: '#C9A227' }}>{formData.assessmentScore}</strong> imported
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                {[
                                    { n: 1, label: 'Your Details' },
                                    { n: 2, label: 'Services' },
                                    { n: 3, label: 'Payment' },
                                ].map(({ n, label }, i, arr) => (
                                    <div key={n} className="flex items-center gap-3" style={{ flex: n < arr.length ? 1 : 'none' }}>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <div style={{
                                                width: 28, height: 28, borderRadius: '50%',
                                                background: step > n ? '#C9A227' : step === n ? '#fff' : 'rgba(255,255,255,0.2)',
                                                color: step > n ? '#fff' : step === n ? 'var(--color-primary)' : 'rgba(255,255,255,0.5)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 800, fontSize: '0.78rem',
                                            }}>
                                                {step > n ? '✓' : n}
                                            </div>
                                            <span className="font-sans text-xs font-semibold hidden sm:block" style={{ color: step >= n ? '#fff' : 'rgba(255,255,255,0.45)' }}>{label}</span>
                                        </div>
                                        {n < arr.length && (
                                            <div style={{ flex: 1, height: 2, background: step > n ? '#C9A227' : 'rgba(255,255,255,0.2)', borderRadius: 1 }} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 md:p-10">

                            {/* STEP 1 — Your Details */}
                            {step === 1 && (
                                <form onSubmit={e => { e.preventDefault(); goNext(); }} className="space-y-5 animate-fade-up">
                                    <div>
                                        <h2 className="font-display font-bold text-2xl text-[#111]">Tell us about yourself</h2>
                                        <p className="font-sans text-sm text-gray-500 mt-1">Basic information so we can reach you.</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-sans text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">First Name <span className="text-red-400">*</span></label>
                                            <input required type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className={inputCls} placeholder="e.g. Ama" />
                                        </div>
                                        <div>
                                            <label className="block font-sans text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Last Name <span className="text-red-400">*</span></label>
                                            <input required type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className={inputCls} placeholder="e.g. Mensah" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-sans text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Email Address <span className="text-red-400">*</span></label>
                                            <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className={inputCls} placeholder="you@example.com" />
                                        </div>
                                        <div>
                                            <label className="block font-sans text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Phone Number <span className="text-red-400">*</span></label>
                                            <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className={inputCls} placeholder="+233 20 000 0000" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-sans text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Country <span className="text-red-400">*</span></label>
                                            <select required value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} className={inputCls + ' appearance-none cursor-pointer'} style={{ backgroundImage: selectArrow, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}>
                                                <option value="" disabled>Select your country</option>
                                                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block font-sans text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Current Role / Title <span className="text-red-400">*</span></label>
                                            <input required type="text" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className={inputCls} placeholder="e.g. MP Candidate, NGO Director" />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button type="submit" className="btn-primary w-full justify-center py-4 text-sm tracking-widest">
                                            Continue → Select Services
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* STEP 2 — Services */}
                            {step === 2 && (
                                <form onSubmit={handleStep2Submit} className="space-y-6 animate-fade-up">
                                    <div>
                                        <h2 className="font-display font-bold text-2xl text-[#111]">What can we help with?</h2>
                                        <p className="font-sans text-sm text-gray-500 mt-1">Select one or more services or programs. <span className="font-semibold text-[var(--color-primary)]">Multiple selections welcome.</span></p>
                                    </div>

                                    {SERVICE_OPTIONS.map(group => (
                                        <div key={group.category}>
                                            <p className="font-sans text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{group.category}</p>
                                            <div className="grid grid-cols-1 gap-2.5">
                                                {group.items.map(item => (
                                                    <ServiceCard
                                                        key={item.id}
                                                        item={item}
                                                        selected={formData.services.includes(item.id)}
                                                        onToggle={() => toggleService(item.id)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {serviceError && (
                                        <p className="font-sans text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{serviceError}</p>
                                    )}

                                    <div>
                                        <label className="block font-sans text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Why are you applying? <span className="text-red-400">*</span></label>
                                        <textarea
                                            required
                                            value={formData.essay}
                                            onChange={e => setFormData({ ...formData, essay: e.target.value })}
                                            rows={4}
                                            className={inputCls + ' resize-none'}
                                            placeholder="Tell us about your background, goals, and what you hope to achieve through Polibrand..."
                                        />
                                        <p className="font-sans text-xs text-gray-400 mt-1.5">Minimum 50 words recommended.</p>
                                    </div>

                                    {formData.services.length > 0 && (
                                        <div className="rounded-xl bg-[var(--color-bg)] border border-gray-100 px-4 py-3">
                                            <p className="font-sans text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Selected ({formData.services.length})</p>
                                            <div className="flex flex-wrap gap-2">
                                                {getSelectedLabels().map(label => (
                                                    <span key={label} className="font-sans text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'var(--color-primary)', color: '#fff' }}>{label}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                        <button type="button" onClick={goPrev} className="font-sans text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors sm:w-auto text-center py-4 sm:py-0">
                                            ← Back
                                        </button>
                                        <button type="submit" className="btn-primary flex-1 justify-center py-4 text-sm tracking-widest">
                                            Continue → Review & Pay
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* STEP 3 — Payment */}
                            {step === 3 && (
                                <div className="space-y-5 animate-fade-up">
                                    <div>
                                        <h2 className="font-display font-bold text-2xl text-[#111]">Review & Complete</h2>
                                        <p className="font-sans text-sm text-gray-500 mt-1">Check your details, then pay to submit your application.</p>
                                    </div>

                                    {/* Summary card */}
                                    <div className="rounded-xl border border-gray-100 overflow-hidden">
                                        <div style={{ background: 'var(--color-bg)', padding: '0.75rem 1.25rem', borderBottom: '1px solid #f3f4f6' }}>
                                            <p className="font-sans text-xs font-bold text-gray-500 uppercase tracking-wider">Application Summary</p>
                                        </div>
                                        <div className="divide-y divide-gray-50">
                                            {[
                                                { label: 'Name', value: `${formData.firstName} ${formData.lastName}` },
                                                { label: 'Email', value: formData.email },
                                                { label: 'Phone', value: formData.phone },
                                                { label: 'Country', value: formData.country },
                                                { label: 'Role', value: formData.role },
                                            ].map(({ label, value }) => (
                                                <div key={label} className="flex justify-between items-start px-5 py-3">
                                                    <span className="font-sans text-xs text-gray-400 shrink-0 w-20">{label}</span>
                                                    <span className="font-sans text-sm font-semibold text-[#111] text-right">{value}</span>
                                                </div>
                                            ))}
                                            <div className="px-5 py-3">
                                                <span className="font-sans text-xs text-gray-400 block mb-2">Services Selected</span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {getSelectedLabels().map(label => (
                                                        <span key={label} className="font-sans text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(var(--color-primary-rgb,139,0,0),0.08)', color: 'var(--color-primary)' }}>{label}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment card */}
                                    <div style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #0d1f3c 100%)', borderRadius: 14, padding: '1.5rem' }}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Consultation Fee</p>
                                                <p className="font-display font-bold text-4xl" style={{ color: '#C9A227' }}>₵1,500</p>
                                            </div>
                                            <span className="font-sans text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(201,162,39,0.18)', color: '#C9A227' }}>ONE-TIME</span>
                                        </div>
                                        <p className="font-sans text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
                                            A one-time fee to process your application. An adviser will reach out within 48 hours of payment.
                                        </p>
                                        <div className="flex gap-4 flex-wrap" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.75rem' }}>
                                            {['Card', 'Mobile Money', 'Bank Transfer'].map(m => (
                                                <span key={m} className="font-sans text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>✓ {m}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {paymentError && (
                                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700">{paymentError}</div>
                                    )}

                                    <div className="flex flex-col sm:flex-row gap-3 pt-1">
                                        <button type="button" onClick={goPrev} disabled={paymentLoading} className="font-sans text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors sm:w-auto text-center py-4 sm:py-0 disabled:opacity-40">
                                            ← Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handlePayment}
                                            disabled={paymentLoading}
                                            className="btn-gold flex-1 justify-center py-4 text-sm tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {paymentLoading ? 'Opening payment...' : 'Pay ₵1,500 & Submit Application →'}
                                        </button>
                                    </div>
                                    <p className="font-sans text-xs text-center text-gray-400">
                                        Secured by Paystack · Your payment is encrypted and protected
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default function ApplyPage() {
    return (
        <Suspense fallback={
            <div className="bg-[var(--color-bg)] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="font-sans text-sm font-semibold text-gray-600 uppercase tracking-wider">Loading...</p>
                </div>
            </div>
        }>
            <ApplyForm />
        </Suspense>
    );
}
