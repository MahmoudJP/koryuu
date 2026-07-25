import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { LogoStory } from "@/components/LogoStory";

export const metadata: Metadata = {
  title: "About",
  description:
    "Koryuu (交流) is a software studio building apps and tools at the crossroads of cultures — one home for many products, each with its own page.",
};

const PILLARS = [
  {
    title: "Apps & tools",
    body: "Native macOS utilities, study apps, and cross-platform products — built to feel considered and quiet.",
  },
  {
    title: "Client work",
    body: "Websites and software for clients, delivered with the same craft as the in-house catalogue.",
  },
  {
    title: "Across cultures",
    body: "A focus on the spaces between Arabic, Japanese, and English — trilingual interfaces, RTL, and more.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-5 pt-16 sm:px-8">
        <header className="reveal mb-14 max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            About
          </span>
          <h1 className="display mt-2 text-[clamp(36px,6vw,64px)] font-extrabold leading-tight text-foreground">
            Software at the crossroads of cultures.
          </h1>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
            <p>
              <span className="text-foreground">Koryuu</span> is a software studio and a
              growing home for apps, tools, and creative work. Instead of a separate
              website for every project, each one gets its own page here — one cohesive
              brand, many products.
            </p>
            <p>
              The work spans macOS utilities, study apps, client projects, and research,
              united by a single idea: software made for the spaces between languages and
              cultures — and built to last.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/apps/"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
            >
              See the apps
            </Link>
            <a
              href="mailto:hello@koryuu.com"
              className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-border-strong"
            >
              Get in touch
            </a>
          </div>
        </header>

        {/* What Koryuu does */}
        <section className="reveal mb-20 grid gap-4 sm:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.title} className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="display text-lg font-semibold text-foreground">{p.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
            </div>
          ))}
        </section>

        <LogoStory />

        <p className="mx-auto mt-10 max-w-6xl text-center text-sm text-muted">
          Founded and based in Tokyo · 東京
        </p>
      </main>
      <Footer />
    </>
  );
}
