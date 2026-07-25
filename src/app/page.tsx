import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { LogoStory } from "@/components/LogoStory";
import { AppGrid } from "@/components/AppGrid";
import { apps } from "@/data/apps";

export default function HomePage() {
  const liveCount = apps.filter((a) => a.status === "live").length;

  return (
    <>
      <Nav />

      <main>
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-5 pb-20 pt-20 sm:px-8 sm:pt-28">
          <div className="reveal inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-muted">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            {apps.length} projects · {liveCount} live · more on the way
          </div>

          <h1 className="reveal reveal-2 display mt-7 max-w-4xl text-[clamp(40px,7vw,76px)] font-extrabold leading-[1.04] text-foreground">
            A home for{" "}
            <span className="text-accent">everything</span> Koryuu builds.
          </h1>

          <p className="reveal reveal-3 mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Koryuu is a software studio and the home for every app and tool built under
            its name — from macOS utilities to study apps to client work. One place, many
            projects, each with its own page.
          </p>

          <div className="reveal reveal-4 mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/apps/"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
            >
              Browse the apps
            </Link>
            <a
              href="#the-name"
              className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-border-strong"
            >
              What “Koryuu” means
            </a>
          </div>
        </section>

        {/* ── The name / logo story (most important) ───────── */}
        <LogoStory />

        {/* ── Apps showcase ────────────────────────────────── */}
        <section id="apps" className="mx-auto mt-28 max-w-6xl px-5 sm:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                The catalogue
              </span>
              <h2 className="display mt-2 text-3xl font-bold text-foreground sm:text-4xl">
                Every app, in one place.
              </h2>
            </div>
            <Link
              href="/apps/"
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              Open full directory →
            </Link>
          </div>

          <AppGrid />
        </section>
      </main>

      <Footer />
    </>
  );
}
