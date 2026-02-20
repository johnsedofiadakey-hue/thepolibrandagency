import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const clients = [
    {
        title: 'NGO & Civic Programs',
        icon: '🌍',
        desc: 'Custom gender leadership training programs designed to empower community organizers and civic leaders with strategic communication tools.',
        features: ['Grassroots narrative building', 'Community mobilization training', 'Civic leadership positioning'],
    },
    {
        title: 'Political Parties',
        icon: '🏛',
        desc: 'Candidate communication and brand strategy for women wings and high-level female candidates preparing for general elections.',
        features: ['Candidate media training', 'Debate preparation simulations', 'Voter alignment strategy'],
    },
    {
        title: 'Democracy Bodies',
        icon: '⚖️',
        desc: 'International democracy capacity-building. We partner with trans-national bodies to execute multi-country leadership deployments.',
        features: ['Cross-border campaign analysis', 'Policy communication workshops', 'Structural representation audits'],
    },
    {
        title: 'Development Organizations',
        icon: '📊',
        desc: 'Advocacy campaign architecture. We help development institutions translate their gender equity goals into actionable political programming.',
        features: ['Advocacy narrative design', 'Funding alignment strategies', 'Impact measurement frameworks'],
    },
];

export default function InstitutionalClientsPage() {
    return (
        <div className="bg-[var(--color-bg)] min-h-screen">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-40 pb-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0c3d1e 0%, #17542e 100%)' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(201,162,39,0.1) 0%, transparent 50%)', pointerEvents: 'none' }} />

                <div className="container-brand relative z-10 text-center animate-fade-up">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-8 h-px bg-[#C9A227]" />
                        <span className="font-sans text-xs font-semibold text-[#C9A227] tracking-widest uppercase">Institutional Clients</span>
                        <div className="w-8 h-px bg-[#C9A227]" />
                    </div>
                    <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6 max-w-4xl mx-auto">
                        Strengthening Democratic Infrastructure Across Africa.
                    </h1>
                    <p className="font-sans text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                        We collaborate with NGOs, political parties, international democracy organizations, and development institutions to design and execute high-impact leadership programs.
                    </p>
                </div>
            </section>

            {/* Client Categories */}
            <section className="section-pad">
                <div className="container-brand">
                    <div className="text-center mb-16 animate-fade-up-delay-1">
                        <h2 className="font-serif font-bold text-3xl md:text-4xl text-[#111] mb-4">Our Partnership Models</h2>
                        <div className="divider-gold divider-gold-center" />
                        <p className="font-sans text-[var(--color-muted)] max-w-2xl mx-auto text-lg leading-relaxed">
                            Discover how we align our strategic architecture with your organizational objectives to close the gender representation gap.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 animate-fade-up-delay-2">
                        {clients.map((client, idx) => (
                            <div key={idx} className="card-brand flex flex-col hover:-translate-y-2 transition-transform duration-300">
                                <div className="text-4xl mb-6 bg-[calc(var(--color-bg-dark))] w-16 h-16 rounded-full flex items-center justify-center border border-[var(--color-border)] shadow-sm">
                                    {client.icon}
                                </div>
                                <h3 className="font-serif font-bold text-2xl text-[#111] mb-3">{client.title}</h3>
                                <p className="font-sans text-base text-[var(--color-muted)] leading-relaxed mb-6 flex-grow">
                                    {client.desc}
                                </p>
                                <div className="bg-[var(--color-bg)] rounded-lg p-5 border border-[var(--color-border)] mt-auto">
                                    <h4 className="font-sans text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-3">Key Capabilities</h4>
                                    <ul className="space-y-2">
                                        {client.features.map((feature, fIdx) => (
                                            <li key={fIdx} className="flex items-start gap-3">
                                                <span className="text-[var(--color-secondary)] text-lg mt-0.5">▸</span>
                                                <span className="font-sans text-sm text-[#333] font-medium">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-pad bg-white border-t border-[var(--color-border)] text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-secondary)]/10 rounded-full blur-3xl" />

                <div className="container-brand relative z-10">
                    <h2 className="font-serif font-bold text-3xl md:text-4xl text-[#111] mb-6">
                        Ready to Discuss a Partnership?
                    </h2>
                    <p className="font-sans text-lg text-[var(--color-muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
                        Submit a partnership proposal request and our strategy team will reach out to align on deployment goals.
                    </p>
                    <Link href="/apply?type=institutional" className="btn-primary">
                        Request a Proposal
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
