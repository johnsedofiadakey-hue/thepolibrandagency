'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: '◈' },
    { label: 'Brand Settings', href: '/admin/brand', icon: '🎨' },
    { label: 'Content', href: '/admin/content', icon: '📝' },
    { label: 'Readiness Index', href: '/admin/assessment', icon: '📊' },
    { label: 'Applications', href: '/admin/applications', icon: '👩🏾‍🎓' },
    { label: 'Payments', href: '/admin/payments', icon: '💳' },
    { label: 'Partners CRM', href: '/admin/partners', icon: '🤝' },
    { label: 'Email Automation', href: '/admin/email', icon: '📧' },
    { label: 'Analytics', href: '/admin/analytics', icon: '📈' },
    { label: 'Documents', href: '/admin/documents', icon: '📂' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (pathname === '/admin/login' || pathname === '/admin') {
        return <>{children}</>;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside className="admin-sidebar">
                {/* Logo */}
                <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                        <img src="/logo.png" alt="Logo" style={{ width: 38, height: 38, objectFit: 'contain' }} />
                        <div>
                            <div style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '0.75rem', color: '#C9A227', letterSpacing: '0.5px', lineHeight: 1 }}>POLIBRAND</div>
                            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px' }}>ADMIN PANEL</div>
                        </div>
                    </Link>
                </div>

                {/* Section label */}
                <div style={{ padding: '1.25rem 1.25rem 0.5rem', fontFamily: 'Inter, sans-serif', fontSize: '0.62rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    Navigation
                </div>

                {/* Nav Links */}
                <nav style={{ padding: '0 0.75rem', flex: 1 }}>
                    {navItems.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                                    borderRadius: 4, marginBottom: 2, textDecoration: 'none',
                                    background: active ? 'rgba(201,162,39,0.18)' : 'transparent',
                                    border: `1px solid ${active ? 'rgba(201,162,39,0.3)' : 'transparent'}`,
                                    transition: 'all 0.2s',
                                }}
                            >
                                <span style={{ fontSize: '1rem', minWidth: 20 }}>{item.icon}</span>
                                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: active ? 600 : 400, color: active ? '#C9A227' : 'rgba(255,255,255,0.75)' }}>
                                    {item.label}
                                </span>
                                {active && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#C9A227' }} />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto' }}>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>Super Admin</div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>admin@polibrand.co</div>
                    <Link href="/admin/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: '0.75rem', fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
                        ⎋ Logout
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main" style={{ flex: 1 }}>
                {/* Top Bar */}
                <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 2rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
                    <div>
                        <Link href="/" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#6b7280', textDecoration: 'none' }}>
                            ← View Public Site
                        </Link>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#9ca3af' }}>Feb 2026</span>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1F6F3E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '0.85rem' }}>
                            SA
                        </div>
                    </div>
                </div>
                <div style={{ padding: '2rem' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
