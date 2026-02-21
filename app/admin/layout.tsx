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

    const activeItem = navItems.find(item => item.href === pathname) || navItems[0];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            {/* Desktop Sidebar / Mobile Bottom Nav */}
            <aside className="admin-sidebar" style={{
                background: 'var(--color-primary-dark)',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                zIndex: 1000
            }}>
                {/* Logo Section - Hidden on Mobile */}
                <div className="hide-mobile" style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                        <img src="/logo.png" alt="Logo" style={{ width: 38, height: 38, objectFit: 'contain' }} />
                        <div>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.75rem', color: 'var(--color-secondary)', letterSpacing: '0.5px', lineHeight: 1 }}>POLIBRAND</div>
                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px' }}>ADMIN PANEL</div>
                        </div>
                    </Link>
                </div>

                {/* Navigation Container */}
                <nav className="admin-nav" style={{
                    padding: '1rem 0.75rem',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto'
                }}>
                    <div className="hide-mobile" style={{ padding: '0 0.5rem 0.5rem', fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                        Menu
                    </div>
                    {navItems.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`admin-nav-item ${active ? 'active' : ''}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    padding: '12px',
                                    borderRadius: 8,
                                    marginBottom: 4,
                                    textDecoration: 'none',
                                    color: active ? 'var(--color-secondary)' : 'rgba(255,255,255,0.65)',
                                    background: active ? 'rgba(201,162,39,0.12)' : 'transparent',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    border: active ? '1px solid rgba(201,162,39,0.2)' : '1px solid transparent'
                                }}
                            >
                                <span className="nav-icon" style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                                <span className="nav-label" style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '0.82rem',
                                    fontWeight: active ? 600 : 400,
                                    whiteSpace: 'nowrap'
                                }}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Profile Section - Hidden on Mobile Base Nav */}
                <div className="hide-mobile" style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>SA</div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Super Admin</div>
                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>admin@polibrand.co</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main" style={{ flex: 1, position: 'relative' }}>
                {/* Responsive Header */}
                <header className="admin-header" style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid #e5e7eb',
                    padding: '0 1.5rem',
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    zIndex: 900
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="show-mobile" style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'var(--color-primary)', color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem', fontWeight: 700
                        }}>SA</div>
                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            color: '#111',
                            margin: 0
                        }}>
                            {activeItem.label}
                        </h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Link href="/" style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.72rem',
                            color: 'var(--color-primary)',
                            textDecoration: 'none',
                            fontWeight: 600,
                            padding: '6px 12px',
                            borderRadius: 20,
                            background: 'color-mix(in srgb, var(--color-primary), transparent 90%)'
                        }}>
                            Visit Site
                        </Link>
                    </div>
                </header>

                {/* Content Container */}
                <div className="admin-content-inner" style={{ padding: '1.25rem' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
