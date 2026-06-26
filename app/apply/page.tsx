'use client';
import { Suspense, useState, useContext, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PoliSettingsContext } from '@/components/SettingsProvider';

function ApplyForm() {
    const { content } = useContext(PoliSettingsContext) as any;
    const apply = content.pages.apply;
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [paystackPublicKey, setPaystackPublicKey] = useState('');
    const [paystackReady, setPaystackReady] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const paramScore = searchParams.get('score');
    const paramProgram = searchParams.get('program');

    const [formData, setFormData] = useState(() => {
        let initialProgram = 'Leadership Branding Bootcamp';
        if (paramProgram) {
            const normalized = decodeURIComponent(paramProgram).trim();
            if (normalized.toLowerCase().includes('fellowship')) initialProgram = 'The Elite Fellowship';
            else if (normalized.toLowerCase().includes('bootcamp')) initialProgram = 'Leadership Branding Bootcamp';
            else if (normalized.toLowerCase().includes('digital') || normalized.toLowerCase().includes('course')) initialProgram = 'Digital Courses';
            else if (normalized.toLowerCase().includes('partnership') || normalized.toLowerCase().includes('proposal') || normalized.toLowerCase().includes('institutional')) initialProgram = 'Institutional Partnership Proposal';
        }
        return {
            firstName: '', lastName: '', email: '', phone: '',
            country: '', program: initialProgram, role: '', essay: '',
            assessmentScore: paramScore ? parseInt(paramScore, 10) : undefined,
        };
    });

    useEffect(() => {
        fetch('/api/payment/config')
            .then(r => r.json())
            .then(d => setPaystackPublicKey(d.paystackPublicKey || ''))
            .catch(() => {});

        // If script already loaded (e.g. back-navigation), mark ready immediately
        if ((window as any).PaystackPop) {
            setPaystackReady(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        script.onload = () => setPaystackReady(true);
        script.onerror = () => setPaymentError('Failed to load payment system. Please refresh and try again.');
        document.head.appendChild(script);
        return () => { try { document.head.removeChild(script); } catch { /* already removed */ } };
    }, []);

    const goNext = () => { setStep(s => s + 1); window.scrollTo(0, 0); };
    const goPrev = () => { setStep(s => s - 1); window.scrollTo(0, 0); };

    const handlePayment = () => {
        setPaymentError(null);
        setPaymentLoading(true);

        const PaystackPop = (window as any).PaystackPop;
        if (!PaystackPop) {
            setPaymentError('Payment system is still loading. Please wait a moment and try again.');
            setPaymentLoading(false);
            return;
        }

        const handler = PaystackPop.setup({
            key: paystackPublicKey,
            email: formData.email,
            amount: 150000, // ₵1,500 in pesewas
            currency: 'GHS',
            ref: `pba_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
            metadata: {
                custom_fields: [
                    { display_name: 'Applicant Name', variable_name: 'applicant_name', value: `${formData.firstName} ${formData.lastName}` },
                    { display_name: 'Program', variable_name: 'program', value: formData.program },
                ],
            },
            callback: async (response: any) => {
                try {
                    const res = await fetch('/api/payment/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ reference: response.reference, ...formData }),
                    });
                    if (res.ok) {
                        setSubmitted(true);
                        window.scrollTo(0, 0);
                    } else {
                        const d = await res.json().catch(() => null);
                        setPaymentError(
                            (d?.error || 'Payment verification failed.') +
                            ` (Ref: ${response.reference}) — contact us if this persists.`
                        );
                        setPaymentLoading(false);
                    }
                } catch {
                    setPaymentError(`Network error. Reference: ${response.reference} — please contact us.`);
                    setPaymentLoading(false);
                }
            },
            onClose: () => setPaymentLoading(false),
        });

        handler.openIframe();
    };

    if (submitted) {
        return (
            <div className="bg-[var(--color-bg)] min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-6 pt-32 pb-20 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="card-brand max-w-lg w-full text-center relative z-10 animate-fade-up border-t-4 border-[var(--color-primary)]">
                        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm">✓</div>
                        <h2 className="font-display font-bold text-3xl text-[#111] mb-4">{apply.form.success.title}</h2>
                        <div className="divider-gold divider-gold-center" />
                        <p className="font-sans text-[#444] mb-8 leading-relaxed">
                            {apply.form.success.text.replace('{name}', formData.firstName).replace('{program}', formData.program)}
                        </p>
                        <div className="flex flex-col gap-3">
                            <Link href="/" className="btn-primary w-full justify-center">Return to Homepage</Link>
                            <Link href="/services" className="font-sans text-sm text-[var(--color-primary)] font-semibold uppercase tracking-wider mt-2 hover:underline">
                                Explore Our Services →
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const fillWidth = step === 1 ? '0%' : step === 2 ? '50%' : '100%';

    return (
        <div className="bg-[var(--color-bg)] min-h-screen">
            <Navbar />

            <section className="pt-40 pb-20 relative overflow-hidden" style={{
                background: apply.hero.image
                    ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${apply.hero.image})`
                    : 'transparent',
                backgroundSize: 'cover', backgroundPosition: 'center',
            }}>
                {!apply.hero.image && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg)] to-white opacity-50 -z-10" />
                )}

                <div className="container-brand max-w-3xl relative z-10">
                    <div className="mb-10 text-center animate-fade-up">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <div className="w-6 h-px bg-[var(--color-primary)]" />
                            <span className="font-sans text-xs font-semibold text-[var(--color-primary)] tracking-widest uppercase">{apply.hero.tag}</span>
                            <div className="w-6 h-px bg-[var(--color-primary)]" />
                        </div>
                        <h1 className="font-display font-bold text-3xl md:text-5xl text-[#111] mb-6">{apply.hero.title}</h1>
                        <p className={`font-sans text-lg ${apply.hero.image ? 'text-white/90' : 'text-[var(--color-muted)]'}`}>
                            {apply.hero.description}
                        </p>
                    </div>

                    <div className="card-brand animate-fade-up-delay-1 p-8 md:p-12 shadow-[var(--shadow-soft)]">
                        {/* Assessment score sync notice */}
                        {formData.assessmentScore !== undefined && (
                            <div style={{ background: 'rgba(31,111,62,0.08)', border: '1.5px solid var(--color-primary)', borderRadius: 6, padding: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>✓</div>
                                <div>
                                    <h4 className="font-display font-bold text-sm text-[#111] m-0">Political Readiness Score Sync Active</h4>
                                    <p className="font-sans text-xs text-[#555] m-0 mt-1">
                                        Your index score of <strong>{formData.assessmentScore}</strong> and recommended program have been imported.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* 3-step progress bar */}
                        <div className="flex justify-between items-center mb-4 relative">
                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0" />
                            <div className="absolute top-1/2 left-0 h-1 bg-[var(--color-primary)] -translate-y-1/2 z-0 transition-all duration-300" style={{ width: fillWidth }} />
                            {[1, 2, 3].map(n => (
                                <div key={n} className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 font-bold text-sm ${step >= n ? 'bg-[var(--color-primary)] text-white' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>{n}</div>
                            ))}
                        </div>
                        <div className="flex justify-between mb-8">
                            {['Personal Info', 'Program Details', 'Payment'].map((label, i) => (
                                <span key={label} className={`font-sans text-xs font-semibold uppercase tracking-wider ${step === i + 1 ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}
                                    style={{ width: '33%', textAlign: i === 0 ? 'left' : i === 2 ? 'right' : 'center' }}>
                                    {label}
                                </span>
                            ))}
                        </div>

                        {submitError && (
                            <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm font-medium text-red-700">{submitError}</div>
                        )}

                        {/* STEP 1 — Personal Info */}
                        {step === 1 && (
                            <form className="space-y-6 animate-fade-up" onSubmit={e => { e.preventDefault(); goNext(); }}>
                                <h3 className="font-display font-bold text-xl text-[#111] border-b border-gray-100 pb-3 mb-6">{apply.form.step1_title}</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block font-sans text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{apply.form.labels.firstName}</label>
                                        <input required type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full p-4 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all outline-none" placeholder={apply.form.placeholders.firstName} />
                                    </div>
                                    <div>
                                        <label className="block font-sans text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{apply.form.labels.lastName}</label>
                                        <input required type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="w-full p-4 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all outline-none" placeholder={apply.form.placeholders.lastName} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block font-sans text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{apply.form.labels.email}</label>
                                        <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-4 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all outline-none" placeholder={apply.form.placeholders.email} />
                                    </div>
                                    <div>
                                        <label className="block font-sans text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{apply.form.labels.phone}</label>
                                        <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-4 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all outline-none" placeholder={apply.form.placeholders.phone} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-sans text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{apply.form.labels.country}</label>
                                    <select required value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} className="w-full p-4 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all outline-none appearance-none" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', backgroundSize: '1.25em 1.25em' }}>
                                        <option value="" disabled>Select a country</option>
                                        <option value="Ghana">Ghana</option>
                                        <option value="Nigeria">Nigeria</option>
                                        <option value="Kenya">Kenya</option>
                                        <option value="South Africa">South Africa</option>
                                        <option value="Rwanda">Rwanda</option>
                                        <option value="Other">Other African National</option>
                                        <option value="International">International</option>
                                    </select>
                                </div>

                                <div className="pt-6">
                                    <button type="submit" className="btn-primary w-full md:w-auto justify-center md:float-right">
                                        Continue to Step 2 →
                                    </button>
                                    <div className="clear-both" />
                                </div>
                            </form>
                        )}

                        {/* STEP 2 — Program Details */}
                        {step === 2 && (
                            <form className="space-y-6 animate-fade-up" onSubmit={e => { e.preventDefault(); goNext(); }}>
                                <h3 className="font-display font-bold text-xl text-[#111] border-b border-gray-100 pb-3 mb-6">{apply.form.step2_title}</h3>

                                <div>
                                    <label className="block font-sans text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{apply.form.labels.program}</label>
                                    <select required value={formData.program} onChange={e => setFormData({ ...formData, program: e.target.value })} className="w-full p-4 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all outline-none appearance-none" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', backgroundSize: '1.25em 1.25em' }}>
                                        <option value="Leadership Branding Bootcamp">Leadership Branding Bootcamp</option>
                                        <option value="The Elite Fellowship">The Elite Fellowship</option>
                                        <option value="Digital Courses">Digital Courses</option>
                                        <option value="Institutional Partnership Proposal">Institutional Partnership Proposal</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-sans text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{apply.form.labels.role}</label>
                                    <input required type="text" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full p-4 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all outline-none" placeholder={apply.form.placeholders.role} />
                                </div>

                                <div>
                                    <label className="block font-sans text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{apply.form.labels.essay}</label>
                                    <textarea required value={formData.essay} onChange={e => setFormData({ ...formData, essay: e.target.value })} rows={5} className="w-full p-4 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all outline-none resize-none" placeholder={apply.form.placeholders.essay} />
                                    <p className="text-xs text-gray-400 mt-2">Minimum 50 words recommended.</p>
                                </div>

                                <div className="pt-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                                    <button type="button" onClick={goPrev} className="font-sans text-sm font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-900 transition-colors w-full md:w-auto text-center">
                                        ← Back
                                    </button>
                                    <button type="submit" className="btn-primary w-full md:w-auto justify-center">
                                        Continue to Payment →
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* STEP 3 — Payment */}
                        {step === 3 && (
                            <div className="space-y-6 animate-fade-up">
                                <h3 className="font-display font-bold text-xl text-[#111] border-b border-gray-100 pb-3 mb-6">Complete Your Application</h3>

                                {/* Summary */}
                                <div style={{ background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb', padding: '1.25rem' }}>
                                    <p className="font-sans text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Application Summary</p>
                                    <div className="space-y-2">
                                        {[
                                            { label: 'Name', value: `${formData.firstName} ${formData.lastName}` },
                                            { label: 'Email', value: formData.email },
                                            { label: 'Program', value: formData.program },
                                            { label: 'Country', value: formData.country },
                                        ].map(({ label, value }) => (
                                            <div key={label} className="flex justify-between">
                                                <span className="font-sans text-xs text-gray-500">{label}</span>
                                                <span className="font-sans text-xs font-semibold text-[#111]">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Payment card */}
                                <div style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #0d1f3c 100%)', borderRadius: 10, padding: '1.5rem', color: '#fff' }}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Consultation Fee</p>
                                            <p className="font-display font-bold text-3xl" style={{ color: '#C9A227' }}>₵1,500</p>
                                        </div>
                                        <div style={{ background: 'rgba(201,162,39,0.18)', borderRadius: 6, padding: '6px 12px' }}>
                                            <span className="font-sans text-xs font-bold" style={{ color: '#C9A227' }}>ONE-TIME</span>
                                        </div>
                                    </div>
                                    <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
                                        A one-time consultation fee to process your application. You will be connected with an adviser within 48 hours.
                                    </p>
                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', marginTop: '1rem', paddingTop: '0.75rem', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                        {['Card', 'Mobile Money', 'Bank Transfer'].map(m => (
                                            <span key={m} className="font-sans text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>✓ {m}</span>
                                        ))}
                                    </div>
                                </div>

                                {paymentError && (
                                    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm font-medium text-red-700">{paymentError}</div>
                                )}

                                <div className="pt-2 flex flex-col md:flex-row gap-4 justify-between items-center">
                                    <button type="button" onClick={goPrev} disabled={paymentLoading} className="font-sans text-sm font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-900 transition-colors w-full md:w-auto text-center disabled:opacity-40">
                                        ← Back
                                    </button>
                                    {paystackPublicKey ? (
                                        <button
                                            type="button"
                                            onClick={handlePayment}
                                            disabled={paymentLoading || !paystackReady}
                                            className="btn-gold w-full md:w-auto justify-center shadow-[var(--shadow-gold)] hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                                        >
                                            {paymentLoading ? 'Processing...' : !paystackReady ? 'Loading...' : 'Pay ₵1,500 & Submit →'}
                                        </button>
                                    ) : (
                                        <div className="font-sans text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-md px-4 py-3 w-full md:w-auto text-center">
                                            Payment not configured — contact the administrator.
                                        </div>
                                    )}
                                </div>

                                <p className="font-sans text-xs text-center text-gray-400 mt-2">
                                    Secured by Paystack · Your payment is encrypted and protected
                                </p>
                            </div>
                        )}
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
            <div className="bg-[var(--color-bg)] min-h-screen flex items-center justify-center font-sans text-[#111]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Loading Application Form...</p>
                </div>
            </div>
        }>
            <ApplyForm />
        </Suspense>
    );
}
