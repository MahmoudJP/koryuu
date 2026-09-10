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

export interface AppScreenshot {
  src: string;
  alt: string;
  title: string;
  caption: string;
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
  /** Function-first summary used on compact directory cards. */
  cardSummary: string;
  /** A paragraph or two for the landing page */
  description: string;
  /** The concrete problem that made this product worth building. */
  problem: string;
  /** Representative situations where the product is useful. */
  useCases: string[];
  /** Honest next milestone for an in-progress product. */
  nextStep: string;
  platforms: Platform[];
  status: Status;
  year: number;
  tech?: string[];
  features?: string[];
  /** Optional origin story shown as a pull-quote */
  story?: string;
  /** Real product screenshot shown on the portfolio and app page. */
  screenshot?: string;
  /** Short caption describing what is visible in the screenshot. */
  screenshotCaption?: string;
  /** Use contain for narrow/native windows that should not be cropped. */
  screenshotFit?: "cover" | "contain";
  /** Quick, factual context for portfolio visitors. */
  facts?: { label: string; value: string }[];
  /** Additional product views shown as an interface tour. */
  gallery?: AppScreenshot[];
  /** Optional context shown above the interface tour. */
  galleryIntro?: string;

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
    category: "Work tool",
    accent: "#0891b2",
    glyph: "組",
    logo: "/apps/dtp-master.png",
    logoContain: true,
    tagline: "The trilingual desktop-publishing workflow, automated.",
    cardSummary: "Checks, compares, and prepares multilingual files for production.",
    description:
      "A production tool built for translators and DTP specialists working across Arabic, Japanese and English. It handles the tedious parts of the job — outline checks, layout-error catching, font verification — so the work itself can stay craft.",
    problem:
      "Multilingual DTP quality assurance is usually spread across checklists, file viewers, conversion scripts, and repeated manual inspection. That fragmentation makes small production mistakes easy to miss and every handoff slower than it should be.",
    useCases: [
      "Compare source and translated PDF, Word, text, or translation-memory files",
      "Inspect fonts, bleed, metadata, and layout risks before delivery",
      "Run repeatable batch cleanup and conversion jobs",
      "Keep quotes, invoices, and production work in one studio workflow",
    ],
    nextStep: "Expand production checks and package a stable cross-platform beta.",
    platforms: ["macOS", "Windows"],
    status: "in-development",
    year: 2025,
    tech: ["Tauri", "React", "Rust", "Python"],
    features: [
      "Compare Hub for PDF, Word, text, and translation-memory checks",
      "PDF Studio for page organization, compression, and preview",
      "File inspection for metadata, fonts, bleed, and production risks",
      "Batch image, text, font, and filename utilities",
      "Quotes, invoices, job tracking, and reusable studio workflows",
    ],
    story:
      "Born from a decade of doing trilingual DTP work by hand. Every feature replaces a checklist that used to live on paper.",
    screenshot: "/apps/screenshots/showcase/dtp-master.png",
    screenshotCaption:
      "A single production workspace for PDF comparison, inspection, cleanup, and repeatable DTP utilities.",
    facts: [
      { label: "Toolkit", value: "20 focused production tools" },
      { label: "For", value: "Translators and DTP specialists" },
      { label: "Languages", value: "Arabic · Japanese · English" },
    ],
    gallery: [
      {
        src: "/apps/screenshots/dtp-master-v15.png",
        alt: "The real Koryuu DTP Master workspace",
        title: "The production workspace",
        caption:
          "The real interface groups comparison, inspection, PDF, conversion, and studio tools without exposing client material.",
      },
    ],
  },
  {
    slug: "jlpt-master",
    name: "JLPT Master",
    category: "Learning",
    accent: "#e11d48",
    glyph: "日",
    logo: "/apps/jlpt-master.svg",
    logoContain: true,
    tagline: "Japanese, the way Arabic speakers actually learn it.",
    cardSummary: "Teaches JLPT Japanese with Arabic support, SRS, drills, and reading.",
    description:
      "A Japanese study companion built around SRS flashcards, real N5–N1 grammar drills, and an immersive reader with furigana, tokenization and audio. Toggle between English and Arabic translations — most JLPT tools assume English is your first language. This one doesn't.",
    problem:
      "Most serious JLPT resources are built around English-first explanations or split vocabulary, grammar, reading, and review across unrelated tools. Arabic-speaking learners end up translating the lesson before they can study it.",
    useCases: [
      "Run a focused daily SRS review",
      "Practice grammar by JLPT level from N5 through N1",
      "Read Japanese with furigana, tokenization, and audio",
      "Switch explanations between Arabic and English when a concept needs another angle",
    ],
    nextStep: "Complete the N5–N1 content pass and refine adaptive study planning.",
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
    screenshot: "/apps/screenshots/showcase/jlpt-master.png",
    screenshotCaption:
      "The study coach starts from a clean local profile and prioritizes the next useful review or lesson.",
    facts: [
      { label: "For", value: "Arabic-speaking Japanese learners" },
      { label: "Levels", value: "JLPT N5–N1" },
      { label: "Modes", value: "SRS · Practice · Reader" },
    ],
    gallery: [
      {
        src: "/apps/screenshots/jlpt-master.png",
        alt: "The real JLPT Master study dashboard",
        title: "A clean study starting point",
        caption:
          "The real dashboard surfaces the next useful study action while keeping review queues and progress visible.",
      },
    ],
  },
  {
    slug: "supernotch",
    name: "SuperNotch",
    category: "Mac utility",
    accent: "#7c3aed",
    glyph: "S",
    logo: "/apps/supernotch.svg",
    tagline: "A native control center that grows out of your MacBook's notch.",
    cardSummary: "Puts 19 everyday Mac tools into one compact notch-native panel.",
    description:
      "SuperNotch is a native macOS utility that turns unused space around the camera notch into a compact home for everyday actions and live information. It expands when you need it, keeps tools one gesture away, then folds back into the top edge of the display instead of becoming another window to manage.",
    problem:
      "Small everyday actions—checking system health, opening a work setup, recovering copied text, starting a timer, or capturing the screen—are scattered across separate windows and menu-bar utilities. The result is constant context switching for things that should take one gesture.",
    useCases: [
      "Open a complete work, code, web, or chat workspace",
      "Recover clipboard items and reuse saved snippets",
      "Start focus sessions, countdowns, and quick tasks",
      "Capture or record the screen and check Mac health without another window",
    ],
    nextStep:
      "Polish permissions, reliability, and configurable modules ahead of a distributable beta.",
    platforms: ["macOS"],
    status: "in-development",
    year: 2025,
    tech: ["Swift", "SwiftUI", "AppKit"],
    features: [
      "A two-stage spring animation that grows naturally from the hardware notch",
      "Focus workspaces that open groups of apps for work, code, web, or chat",
      "Clipboard history, reusable snippets, tasks, countdowns, and Pomodoro sessions",
      "Area, window, and full-screen capture plus quick screen recording",
      "At-a-glance CPU, memory, battery, storage, network, weather, and world clocks",
      "Media controls, file shelf, calendar, shortcuts, mirror, spaces, and app tracking",
      "Multi-display support, a floating mode for notchless Macs, gestures, and haptics",
    ],
    story:
      "The notch is fixed hardware. SuperNotch treats the space around it as useful interface instead of dead area.",
    screenshot: "/apps/screenshots/supernotch/gallery/supernotch-focus.png",
    screenshotCaption:
      "Focus workspaces keep related apps together without turning SuperNotch into a full-screen dashboard.",
    galleryIntro:
      "Every tool uses the same notch-native panel, so switching from a workspace to a countdown, system reading, capture action, or saved clipboard item stays quick and visually consistent.",
    gallery: [
      {
        src: "/apps/screenshots/supernotch/gallery/supernotch-countdowns.png",
        alt: "SuperNotch Countdowns tool open on a MacBook",
        title: "Countdowns",
        caption:
          "Name a deadline, choose its duration, and keep the remaining time visible without opening a separate timer app.",
      },
      {
        src: "/apps/screenshots/supernotch/gallery/supernotch-system.png",
        alt: "SuperNotch System monitor open on a MacBook",
        title: "System at a glance",
        caption:
          "CPU, memory, battery, and storage readings sit together in a compact health check for the Mac.",
      },
      {
        src: "/apps/screenshots/supernotch/gallery/supernotch-capture.png",
        alt: "SuperNotch Screenshot and recording controls open on a MacBook",
        title: "Capture and record",
        caption:
          "Start an area, window, or full-screen capture—or begin recording—directly from the top edge of the display.",
      },
      {
        src: "/apps/screenshots/supernotch/gallery/supernotch-clipboard.png",
        alt: "SuperNotch Clipboard history with privacy-safe sample text",
        title: "Clipboard history",
        caption:
          "Bring recent text back when you need it. The examples shown here are privacy-safe sample entries, not personal clipboard data.",
      },
    ],
    facts: [
      { label: "For", value: "MacBook users" },
      { label: "Tools", value: "19 built-in modules" },
      { label: "Form", value: "Native menu-bar utility" },
      { label: "System", value: "macOS 14+" },
    ],
  },
  {
    slug: "switcher",
    name: "Switcher",
    category: "Mac utility",
    accent: "#059669",
    glyph: "⌘",
    logo: "/apps/switcher.png",
    tagline: "Two thumb-keys. One window away.",
    cardSummary: "Hides windows and switches apps from two configurable thumb-keys.",
    description:
      "A tiny native macOS app (~600 lines of Swift) that binds any two keys to hide the frontmost window or open a fast app switcher. Designed for the 英数 and かな keys on a JIS keyboard — they sit under your thumbs and clash with nothing. Configurable for ANSI too.",
    problem:
      "Combining keyboard remappers with separate window switchers introduces synthetic events, visible flicker, and configuration that breaks as macOS changes. A basic navigation action ends up depending on several moving parts.",
    useCases: [
      "Move through open apps without reaching for Command-Tab",
      "Hide or minimize the frontmost window, including fullscreen apps",
      "Turn the JIS 英数 and かな keys into useful thumb controls",
      "Map the same two actions to comfortable ANSI keyboard keys",
    ],
    nextStep: "Finalize preferences, signing, and a repeatable macOS distribution build.",
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
    screenshot: "/apps/screenshots/showcase/switcher.png",
    screenshotCaption:
      "A privacy-safe visualization of Switcher's compact native HUD, shown at the scale it occupies during real use.",
    facts: [
      { label: "Size", value: "About 600 lines of Swift" },
      { label: "Architecture", value: "Single native process" },
      { label: "Keyboards", value: "JIS and ANSI" },
    ],
  },
  {
    slug: "mylife",
    name: "Mylife",
    category: "Personal system",
    accent: "#d97706",
    glyph: "M",
    logo: "/apps/mylife.png",
    tagline: "A quiet place to track the parts of life that matter.",
    cardSummary: "Brings daily routines, health, study, finance, and goals together.",
    description:
      "A cross-platform personal app for the small recurring rituals of life — the things that fall through the cracks of generic productivity tools. Built for myself first, refined into something shareable.",
    problem:
      "General productivity apps handle tasks well, but recurring personal signals—prayer, water, study, health, spending, and long-term goals—often end up scattered across unrelated trackers or ignored altogether.",
    useCases: [
      "Check in on daily prayer, water, health, and workout habits",
      "Track study, reading, tasks, goals, and personal finances together",
      "Review a calm daily dashboard without social pressure or noise",
      "Keep the same local-first system available on mobile and the web",
    ],
    nextStep: "Finish tracker depth and validate mobile and web data flows before wider testing.",
    platforms: ["iOS", "Android", "Web"],
    status: "in-development",
    year: 2025,
    tech: ["React Native", "Expo"],
    features: [
      "A modular dashboard for daily trackers and routines",
      "Prayer, health, study, finance, task, and goal tracking",
      "Local-first data with mobile and web support",
      "A calm dark interface designed for quick daily check-ins",
    ],
    screenshot: "/apps/screenshots/showcase/mylife.png",
    screenshotCaption:
      "A fresh local profile: daily trackers are ready without exposing any personal history or account data.",
    facts: [
      { label: "For", value: "Personal daily routines" },
      { label: "Data", value: "Local-first" },
      { label: "Platforms", value: "Mobile and web" },
    ],
    gallery: [
      {
        src: "/apps/screenshots/mylife.png",
        alt: "The real Mylife local-first dashboard",
        title: "A fresh local dashboard",
        caption:
          "The real interface is shown with a clean profile, so the product can be understood without exposing personal history.",
      },
    ],
  },
  {
    slug: "cloudops-associate",
    name: "CloudOps Associate",
    category: "Learning",
    accent: "#0284c7",
    glyph: "A",
    logo: "/apps/cloudops-associate.png",
    logoContain: true,
    tagline: "AWS SOA-C03, drilled the right way.",
    cardSummary: "Combines bilingual AWS lessons, exams, labs, and incident practice.",
    description:
      "A local-first learning system for the AWS Certified CloudOps Engineer Associate exam. It combines bilingual lessons, practice and timed exam modes, guided labs, incident simulations, adaptive study planning, and encrypted progress backup without asking for AWS credentials.",
    problem:
      "Cloud certification study is often split between passive lessons, unrelated question banks, and risky hands-on experiments. Learners can memorize services without practicing how monitoring, incidents, and operational decisions connect.",
    useCases: [
      "Follow bilingual lessons mapped to the current exam blueprint",
      "Practice by topic or sit a timed full mock exam",
      "Work through guided labs with verification and cleanup steps",
      "Rehearse incident response and review weak areas adaptively",
    ],
    nextStep:
      "Finish blueprint verification and expand feedback around hands-on labs and mock exams.",
    platforms: ["Web"],
    status: "in-development",
    year: 2025,
    tech: ["React", "TypeScript", "Vite", "Tauri"],
    features: [
      "23 bilingual modules mapped to the SOA-C03 and CLF-C02 blueprints",
      "948 original bilingual questions and seven full mock exams",
      "30 guided labs with cost labels, verification, and cleanup steps",
      "Adaptive practice, confidence tracking, and spaced-repetition review",
      "Local-first progress with encrypted export and optional sync",
    ],
    screenshot: "/apps/screenshots/showcase/cloudops-associate.png",
    screenshotCaption:
      "A training dashboard used inside the learning material to make monitoring and incident-response concepts concrete.",
    facts: [
      { label: "Curriculum", value: "23 bilingual modules" },
      { label: "Practice", value: "948 original questions" },
      { label: "Hands-on", value: "30 guided labs" },
    ],
    gallery: [
      {
        src: "/apps/screenshots/cloudops-associate.png",
        alt: "The real CloudOps Associate monitoring dashboard",
        title: "Operational concepts made visible",
        caption:
          "The real training interface turns monitoring, topology, and incident signals into something learners can inspect rather than memorize.",
      },
    ],
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
