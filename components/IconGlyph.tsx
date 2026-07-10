'use client';

import {
    BarChart3,
    BookOpen,
    BriefcaseBusiness,
    CalendarClock,
    Camera,
    CheckCircle2,
    ClipboardList,
    Clock3,
    CreditCard,
    FileChartColumn,
    FileText,
    Globe2,
    GraduationCap,
    Handshake,
    Home,
    Info,
    Landmark,
    LineChart,
    Mail,
    Megaphone,
    Navigation,
    Palette,
    PenLine,
    Search,
    Settings,
    ShieldAlert,
    Star,
    Target,
    User,
    Users,
    Vote,
} from 'lucide-react';

const iconMap: Record<string, any> = {
    '🔍': Search,
    '🧭': Navigation,
    '🏷️': PenLine,
    '🎨': Palette,
    '🏠': Home,
    'ℹ️': Info,
    '⚙️': Settings,
    '🎓': GraduationCap,
    '🤝': Handshake,
    '📊': BarChart3,
    '📝': PenLine,
    '📋': ClipboardList,
    '👑': Star,
    '⭐': Star,
    '🧠': Vote,
    '🎙️': Megaphone,
    '👥': Users,
    '🌍': Globe2,
    '🏛': Landmark,
    '🎯': Target,
    '⏱️': Clock3,
    '📑': FileText,
    '📢': Megaphone,
    '💰': CreditCard,
    '📸': Camera,
    '⌛': CalendarClock,
    '👩🏾‍🎓': GraduationCap,
    '📈': LineChart,
    '📧': Mail,
    '👤': User,
    '📚': BookOpen,
    '⚡': ShieldAlert,
    '💳': CreditCard,
    '📂': BriefcaseBusiness,
    '📄': FileText,
    '🚪': ShieldAlert,
    '🚀': Target,
    '📣': Megaphone,
    '◈': CheckCircle2,
    '◆': Target,
    '◉': Megaphone,
    '◎': Users,
    '◇': FileChartColumn,
};

export default function IconGlyph({
    icon,
    size = 24,
    color = 'currentColor',
    strokeWidth = 1.8,
    className,
}: {
    icon?: string;
    size?: number;
    color?: string;
    strokeWidth?: number;
    className?: string;
}) {
    const Icon = icon ? iconMap[icon] : undefined;

    if (!Icon) {
        return <CheckCircle2 size={size} color={color} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
    }

    return <Icon size={size} color={color} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
}
