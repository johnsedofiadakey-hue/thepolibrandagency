export interface ThemeSettings {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  heroImage: string;
  logo: string;
}

export interface MaintenanceSettings {
  enabled: boolean;
  title?: string;
  message?: string;
}

export interface SiteSettings {
  theme: ThemeSettings;
  typography: string;
  maintenance?: MaintenanceSettings;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface ContentMetadata {
  title: string;
  description: string;
  keywords: string;
}

export interface HeroSection {
  tag: string;
  title: string;
  description: string;
  image?: string;
}

export interface PartnerItem {
  name: string;
  logo: string;
}

export interface SiteContent {
  metadata: ContentMetadata;
  navbar: {
    brand: { line1: string; line2: string };
    links: NavLink[];
    cta: NavLink;
  };
  footer: {
    brand: { description: string };
    sections: Array<{ title: string; links: NavLink[] }>;
    newsletter: { title: string; description: string };
    socials: NavLink[];
    bottom: { copyright: string; links: NavLink[] };
  };
  pages: {
    home: {
      meta?: ContentMetadata;
      hero: { tag: string; headline: string; subheadline: string };
      stats: Array<{ number: string; label: string }>;
      challenge: {
        tag: string; title: string; text: string; list: string[];
        quote: string; stats: Array<{ label: string; value: string }>;
      };
      services: { tag: string; title: string; description: string; items: Array<{ icon: string; title: string; desc: string }> };
      diagnostic: { tag: string; title: string; description: string; categories: string[] };
      partnerships: { tag: string; title: string; text: string; items: PartnerItem[] };
      cta: Record<string, string>;
    };
    about: {
      meta?: ContentMetadata;
      hero: HeroSection;
      vision: { tag: string; title: string; description: string; image?: string; items?: Array<{ label: string; percentage: string }> };
      mission?: { tag: string; title: string; description: string };
      strategy: { tag: string; title: string; steps: Array<{ title: string; desc: string }> };
      philosophy: { tag: string; title: string; cards: Array<{ title: string; text: string }> };
      founder?: { tag: string; name: string; title: string; bio: string; image?: string };
      team?: { tag: string; title: string; description?: string; members: Array<{ name: string; title: string; bio: string; image?: string }> };
    };
    services: {
      meta?: ContentMetadata;
      hero: HeroSection;
      individual: { tag: string; title: string; items: any[] };
      institutional: { tag: string; title: string; items: any[] };
      cta: Record<string, string>;
    };
    programs: {
      meta?: ContentMetadata;
      enabled?: boolean;
      hero: HeroSection;
      bootcamp: any;
      fellowship: any;
      courses: any;
      consulting: any;
      advocacy: any;
    };
    institutional: {
      meta?: ContentMetadata;
      hero: HeroSection;
      models: any[];
      partners: PartnerItem[];
    };
    assessment: {
      meta?: ContentMetadata;
      hero: HeroSection & { details?: Array<{ icon: string; text: string }> };
      categories: any[];
    };
    assessment_results: { tiers: any[]; categories: any[] };
    apply: { meta?: ContentMetadata; hero: HeroSection; form: any };
    portal: { login: { title: string; subtitle: string; button: string } };
  };
}

export interface PoliSettingsContextValue extends SiteSettings {
  content: SiteContent;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  updateContent: (newContent: Partial<SiteContent>) => void;
  refresh: () => Promise<void>;
}
