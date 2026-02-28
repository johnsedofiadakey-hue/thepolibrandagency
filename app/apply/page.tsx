'use client';
import { useState, useContext } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { PoliSettingsContext } from '@/components/SettingsProvider';

export default function ApplyPage() {
    const { content } = useContext(PoliSettingsContext) as any;
    const apply = content.pages.apply;
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        country: '', program: 'Bootcamp', role: '', essay: '',
    });

    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call and save
        localStorage.setItem('polibrand_application', JSON.stringify({ ...formData, submitDate: new Date().toISOString() }));
        setSubmitted(true);
        window.scrollTo(0, 0);
    };

    if (submitted) {
        return (
            <div className="bg-[var(--color-bg)] min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-6 pt-32 pb-20 relative">
                    {/* Decorative background */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="card-brand max-w-lg w-full text-center relative z-10 animate-fade-up border-t-4 border-[var(--color-primary)]">
                        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm">
                            ✓
                        </div>
                        <h2 className="font-display font-bold text-3xl text-[#111] mb-4">{apply.form.success.title}</h2>
                        <div className="divider-gold divider-gold-center" />
                        <p className="font-sans text-[#444] mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: apply.form.success.text.replace('{name}', formData.firstName).replace('{program}', formData.program) }} />
                        <div className="flex flex-col gap-3">
                            <Link href="/" className="btn-primary w-full justify-center">
                                Return to Homepage
                            </Link>
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

    return (
        <div className="bg-[var(--color-bg)] min-h-screen">
            <Navbar />

            <section className="pt-32 pb-20 relative">
                <div className="container-brand max-w-3xl">
                    <div className="mb-10 text-center animate-fade-up">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <div className="w-6 h-px bg-[var(--color-primary)]" />
                            <span className="font-sans text-xs font-semibold text-[var(--color-primary)] tracking-widest uppercase">{apply.hero.tag}</span>
                            <div className="w-6 h-px bg-[var(--color-primary)]" />
                        </div>
                        <h1 className="font-display font-bold text-3xl md:text-5xl text-[#111] mb-6">
                            {apply.hero.title}
                        </h1>
                        <p className="font-sans text-[var(--color-muted)] text-lg">
                            {apply.hero.description}
                        </p>
                    </div>

                    <div className="card-brand animate-fade-up-delay-1 p-8 md:p-12 shadow-[var(--shadow-soft)]">
                        {/* Progress Tracker */}
                        <div className="flex justify-between items-center mb-10 relative">
                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0" />
                            <div className="absolute top-1/2 left-0 h-1 bg-[var(--color-primary)] -translate-y-1/2 z-0 transition-all duration-300" style={{ width: step === 1 ? '50%' : '100%' }} />

                            <div className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 font-bold ${step >= 1 ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 font-bold ${step >= 2 ? 'bg-[var(--color-primary)] text-white' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>2</div>
                        </div>

                        <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>

                            {/* STEP 1 */}
                            {step === 1 && (
                                <div className="space-y-6 animate-fade-up">
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
                                        <select required value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} className="w-full p-4 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all outline-none appearance-none">
                                            <option value="" disabled>Select a country</option>
                                            <option value="Nigeria">Nigeria</option>
                                            <option value="Kenya">Kenya</option>
                                            <option value="South Africa">South Africa</option>
                                            <option value="Ghana">Ghana</option>
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
                                </div>
                            )}

                            {/* STEP 2 */}
                            {step === 2 && (
                                <div className="space-y-6 animate-fade-up">
                                    <h3 className="font-display font-bold text-xl text-[#111] border-b border-gray-100 pb-3 mb-6">{apply.form.step2_title}</h3>

                                    <div>
                                        <label className="block font-sans text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{apply.form.labels.program}</label>
                                        <select required value={formData.program} onChange={e => setFormData({ ...formData, program: e.target.value })} className="w-full p-4 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all outline-none appearance-none">
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
                                        <button type="button" onClick={handlePrev} className="font-sans text-sm font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-900 transition-colors w-full md:w-auto text-center">
                                            ← Back
                                        </button>
                                        <button type="submit" className="btn-gold w-full md:w-auto justify-center shadow-[var(--shadow-gold)] hover:-translate-y-1">
                                            Submit Application
                                        </button>
                                    </div>
                                </div>
                            )}

                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
