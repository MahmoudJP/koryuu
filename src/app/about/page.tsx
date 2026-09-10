import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Koryuu",
  description: "Koryuu is a product studio for focused software, utilities, and experiments.",
};

const PILLARS = [
  {
    title: "Focused products",
    body: "Each build starts with a real problem and keeps only what makes the workflow clearer, faster, or calmer.",
  },
  {
    title: "Built across platforms",
    body: "Native macOS software, desktop production tools, web systems, and mobile products all share one home.",
  },
  {
    title: "Multilingual by default",
    body: "Arabic, Japanese, and English are considered where the product needs them — not added as an afterthought.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-5 pt-16 sm:px-8 sm:pt-20">
        <header className="reveal max-w-4xl">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Koryuu
          </span>
          <h1 className="display mt-3 text-[clamp(40px,7vw,76px)] font-extrabold leading-[1.02] text-foreground">
            A product studio for focused software.
          </h1>
          <div className="mt-8 max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
            <p>
              Koryuu brings together independent software products, focused utilities,
              and useful experiments. Some support professional workflows; others make
              learning or everyday systems feel simpler.
            </p>
            <p>
              The catalogue is the point: every product has its own identity, interface,
              and roadmap, while Koryuu gives them a shared home.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
            >
              Explore products
            </Link>
            <a
              href="https://mahmoud.jp"
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-border-strong"
            >
              About the maker ↗
            </a>
          </div>
        </header>

        <section className="reveal reveal-2 mt-20 grid gap-4 border-t border-border pt-10 sm:grid-cols-3">
          {PILLARS.map((pillar, index) => (
            <article key={pillar.title} className="rounded-3xl border border-border bg-surface p-6 sm:p-7">
              <span className="text-xs font-semibold text-muted">0{index + 1}</span>
              <h2 className="display mt-8 text-2xl font-semibold text-foreground">
                {pillar.title}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted">{pillar.body}</p>
            </article>
          ))}
        </section>

        <p className="mt-12 text-center text-sm text-muted">Built in Tokyo · 東京</p>
      </main>
      <Footer />
    </>
  );
}
