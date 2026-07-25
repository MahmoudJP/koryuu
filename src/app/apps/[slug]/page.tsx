import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AppIcon } from "@/components/AppIcon";
import { StatusDot } from "@/components/StatusDot";
import { apps, getApp, getAppSlugs } from "@/data/apps";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAppSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app) return {};
  return { title: app.name, description: app.tagline };
}

export default async function AppLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app || app.external) notFound();

  // "More from Koryuu" — the next few non-external apps after this one.
  const pool = apps.filter((a) => !a.external && a.slug !== slug);
  const start = Math.max(0, pool.findIndex((a) => apps.indexOf(a) > apps.indexOf(app)));
  const more = [...pool.slice(start), ...pool.slice(0, start)].slice(0, 3);

  return (
    <>
      <Nav />

      <main>
        {/* Tinted hero band, colored by the app's own accent. */}
        <section
          className="border-b border-border"
          style={{
            background: `linear-gradient(180deg, ${app.accent}1a, transparent)`,
          }}
        >
          <div className="mx-auto max-w-5xl px-5 pb-14 pt-10 sm:px-8">
            <Link
              href="/apps/"
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              ← All apps
            </Link>

            <div className="reveal mt-10 flex flex-col gap-7 sm:flex-row sm:items-center">
              <AppIcon app={app} size="xl" />
              <div>
                <span
                  className="text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{ color: app.accent }}
                >
                  {app.category}
                </span>
                <h1 className="display mt-2 text-[clamp(36px,6vw,60px)] font-extrabold leading-none text-foreground">
                  {app.name}
                </h1>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
                  {app.tagline}
                </p>
              </div>
            </div>

            <div className="reveal reveal-2 mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <StatusDot status={app.status} />
              <span className="font-medium text-muted">{app.platforms.join(" · ")}</span>
              <span className="font-medium text-muted">{app.year}</span>
              {app.href && (
                <a
                  href={app.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-full px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: app.accent }}
                >
                  Visit ↗
                </a>
              )}
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-5xl gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Main column */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Overview
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-foreground">
              {app.description}
            </p>

            {app.story && (
              <blockquote
                className="mt-10 rounded-2xl border-l-4 bg-surface p-6 text-lg italic leading-relaxed text-foreground"
                style={{ borderColor: app.accent }}
              >
                “{app.story}”
              </blockquote>
            )}

            {app.features && app.features.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  What it does
                </h2>
                <ul className="mt-5 space-y-3">
                  {app.features.map((f) => (
                    <li key={f} className="flex gap-3 text-foreground">
                      <span
                        className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: app.accent }}
                      />
                      <span className="leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {app.tech && app.tech.length > 0 && (
              <Panel title="Built with">
                <div className="flex flex-wrap gap-2">
                  {app.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border bg-surface-2 px-3 py-1 text-sm font-medium text-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Panel>
            )}

            <Panel title="Platforms">
              <div className="flex flex-wrap gap-2">
                {app.platforms.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-border bg-surface-2 px-3 py-1 text-sm font-medium text-foreground"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </Panel>

            {app.links && app.links.length > 0 && (
              <Panel title="Links">
                <div className="flex flex-col gap-2">
                  {app.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-sm font-medium text-accent hover:underline"
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              </Panel>
            )}
          </aside>
        </div>

        {/* More from Koryuu */}
        {more.length > 0 && (
          <section className="mx-auto max-w-5xl px-5 pb-4 sm:px-8">
            <h2 className="display mb-6 text-2xl font-bold text-foreground">
              More from Koryuu
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {more.map((a) => (
                <Link
                  key={a.slug}
                  href={`/apps/${a.slug}/`}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-border-strong"
                >
                  <AppIcon app={a} size="sm" />
                  <div className="min-w-0">
                    <div className="display truncate font-semibold text-foreground">
                      {a.name}
                    </div>
                    <div className="truncate text-sm text-muted">{a.category}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        {title}
      </h3>
      {children}
    </div>
  );
}
