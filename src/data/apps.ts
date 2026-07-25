/**
 * The single source of truth for every app under the Koryuu umbrella.
 *
 * To add a new app, append one entry to the `apps` array below. The home
 * grid, the /apps directory, and the per-app landing page at /apps/<slug>
 * are all generated from this file — no new pages to build by hand.
 */

export type Platform = "macOS" | "iOS" | "Android" | "Web" | "WordPress" | "Windows" | "Linux";
export type Status = "live" | "beta" | "in-development" | "internal";

export interface AppLink {
  label: string;
  href: string;
}

export interface App {
  /** URL slug — becomes /apps/<slug>/ */
  slug: string;
  /** Display name */
  name: string;
  /** Short category label, e.g. "Productivity", "Study" */
  category: string;
  /** One sharp sentence */
  tagline: string;
  /** A paragraph or two for the landing page */
  description: string;
  platforms: Platform[];
  status: Status;
  year: number;
  tech?: string[];
  features?: string[];
  /** Optional origin story shown as a pull-quote */
  story?: string;

  // ── Branding ──────────────────────────────────────────────
  /** Hex accent color for this app's icon + landing page */
  accent: string;
  /** A glyph used inside the generated icon tile (kanji, letter, emoji) */
  glyph: string;
  /** Optional path to a real logo image under /public, e.g. /apps/foo.png.
   *  When set, it overrides the generated glyph tile. */
  logo?: string;
  /** Set when `logo` is a mark on a transparent/odd background rather than a
   *  full-bleed app icon — it gets framed (contained + padded) on a white tile. */
  logoContain?: boolean;

  // ── Links ─────────────────────────────────────────────────
  /** Primary external destination (download, live site, repo). */
  href?: string;
  /** Extra links shown on the landing page */
  links?: AppLink[];
  /** If true, clicking the card goes straight to `href` (no landing page). */
  external?: boolean;
}

export const STATUS_LABEL: Record<Status, string> = {
  live: "Live",
  beta: "Beta",
  "in-development": "Building",
  internal: "Internal",
};

export const apps: App[] = [
  {
    slug: "dtp-master",
    name: "Koryuu DTP Master",
    category: "Production",
    accent: "#0891b2",
    glyph: "組",
    logo: "/apps/dtp-master.png",
    logoContain: true,
    tagline: "The trilingual desktop-publishing workflow, automated.",
    description:
      "A production tool built for translators and DTP specialists working across Arabic, Japanese and English. It handles the tedious parts of the job — outline checks, layout-error catching, font verification — so the work itself can stay craft.",
    platforms: ["macOS", "Windows"],
    status: "in-development",
    year: 2025,
    tech: ["Tauri", "React", "Rust", "Python"],
    features: [
      "Outline and presentation diagnostics",
      "Project prospect tracking",
      "Built around real DTP studio workflows",
    ],
    story:
      "Born from a decade of doing trilingual DTP work by hand. Every feature replaces a checklist that used to live on paper.",
  },
  {
    slug: "jlpt-master",
    name: "JLPT Master",
    category: "Study",
    accent: "#e11d48",
    glyph: "日",
    logo: "/apps/jlpt-master.svg",
    logoContain: true,
    tagline: "Japanese, the way Arabic speakers actually learn it.",
    description:
      "A Japanese study companion built around SRS flashcards, real N5–N1 grammar drills, and an immersive reader with furigana, tokenization and audio. Toggle between English and Arabic translations — most JLPT tools assume English is your first language. This one doesn't.",
    platforms: ["Web", "macOS"],
    status: "in-development",
    year: 2025,
    tech: ["React", "TypeScript", "Vite"],
    features: [
      "SRS vocabulary review",
      "N5–N1 grammar browser and quizzes",
      "Reading mode with furigana, tokens, and TTS",
      "Daily stats, streaks, weak-word tracking",
      "English / Arabic translation toggle",
    ],
  },
  {
    slug: "supernotch",
    name: "SuperNotch",
    category: "macOS",
    accent: "#7c3aed",
    glyph: "S",
    logo: "/apps/supernotch.svg",
    tagline: "Your MacBook's notch, finally earning its keep.",
    description:
      "A macOS app that turns the notch into a control center — media playback, file shelf, calendar, weather, system monitor, pomodoro, shortcuts. Inspired by the iOS Dynamic Island, but pushed much further. Works on notchless Macs too, as a floating panel.",
    platforms: ["macOS"],
    status: "in-development",
    year: 2025,
    tech: ["Swift", "SwiftUI"],
    features: [
      "Hover-expand notch with spring animations",
      "Media, files, calendar, weather, shortcuts, pomodoro widgets",
      "Multi-display and notchless support",
      "Drag & drop file shelf",
      "Gestures and haptic feedback",
    ],
  },
  {
    slug: "switcher",
    name: "Switcher",
    category: "macOS",
    accent: "#059669",
    glyph: "⌘",
    logo: "/apps/switcher.png",
    tagline: "Two thumb-keys. One window away.",
    description:
      "A tiny native macOS app (~600 lines of Swift) that binds any two keys to hide the frontmost window or open a fast app switcher. Designed for the 英数 and かな keys on a JIS keyboard — they sit under your thumbs and clash with nothing. Configurable for ANSI too.",
    platforms: ["macOS"],
    status: "in-development",
    year: 2025,
    tech: ["Swift"],
    features: [
      "Hide / minimize the frontmost app — windowed or fullscreen",
      "Fast app switcher: tap to advance, Enter to commit",
      "Single-process design (no flicker like Karabiner + AltTab)",
      "JSON-configurable bindings",
    ],
    story:
      "Replaces a fragile Karabiner + AltTab combo that flickered constantly on macOS Tahoe. One process, no synthetic events, no flicker.",
  },
  {
    slug: "mylife",
    name: "Mylife",
    category: "Personal",
    accent: "#d97706",
    glyph: "M",
    logo: "/apps/mylife.png",
    tagline: "A quiet place to track the parts of life that matter.",
    description:
      "A cross-platform personal app for the small recurring rituals of life — the things that fall through the cracks of generic productivity tools. Built for myself first, refined into something shareable.",
    platforms: ["iOS", "Android", "Web"],
    status: "in-development",
    year: 2025,
    tech: ["React Native", "Expo"],
  },
  {
    slug: "cloudops-associate",
    name: "CloudOps Associate",
    category: "Study",
    accent: "#0284c7",
    glyph: "A",
    logo: "/apps/cloudops-associate.png",
    logoContain: true,
    tagline: "AWS SOA-C03, drilled the right way.",
    description:
      "A focused study and quiz app for the AWS Certified SysOps Administrator (SOA-C03) exam. Practice mode with domain filtering, full timed exam mode, performance dashboards, and a review flow that turns wrong answers into flashcards.",
    platforms: ["Web"],
    status: "in-development",
    year: 2025,
    tech: ["React", "Vite"],
    features: [
      "Practice mode with source/domain filtering",
      "Timed exam mode (65 questions / 130 min)",
      "Domain performance dashboard",
      "Error flashcards and study plan",
      "Search across questions and review cards",
    ],
  },
  {
    slug: "shams",
    name: "SHAMS",
    category: "Client",
    accent: "#ea580c",
    glyph: "☀",
    logo: "/apps/shams.jpg",
    tagline: "A modern face for an established name.",
    description:
      "Website refresh for SHAMS, delivered in two parts: a static preview site for stakeholder review, and a custom WordPress theme matching the same design system. Trilingual-ready (Japanese, English, Arabic) via Polylang.",
    platforms: ["Web", "WordPress"],
    status: "in-development",
    year: 2025,
    tech: ["WordPress", "PHP", "HTML/CSS"],
  },
  {
    slug: "portfolio",
    name: "mahmoud.jp",
    category: "Portfolio",
    accent: "#475569",
    glyph: "M",
    logo: "/apps/portfolio.svg",
    tagline: "The personal site behind Koryuu.",
    description:
      "Mahmoud's personal portfolio — trilingual DTP specialist and interpreter based in Tokyo. The human side of the work; Koryuu is where the software lives.",
    platforms: ["Web"],
    status: "in-development",
    year: 2025,
    tech: ["Next.js", "Tailwind CSS"],
    href: "https://mahmoud.jp",
    external: true,
  },
];

export function getApp(slug: string): App | undefined {
  return apps.find((a) => a.slug === slug);
}

/** Slugs that get their own landing page (external-only apps are skipped). */
export function getAppSlugs(): string[] {
  return apps.filter((a) => !a.external).map((a) => a.slug);
}

export function getCategories(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const a of apps) counts.set(a.category, (counts.get(a.category) ?? 0) + 1);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
