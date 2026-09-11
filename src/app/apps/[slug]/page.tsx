import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AppIcon } from "@/components/AppIcon";
import { ProductGallery } from "@/components/ProductGallery";
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

  const pool = apps.filter((candidate) => !candidate.external && candidate.slug !== slug);
  const start = Math.max(
    0,
    pool.findIndex((candidate) => apps.indexOf(candidate) > apps.indexOf(app)),
  );
  const more = [...pool.slice(start), ...pool.slice(0, start)].slice(0, 3);
  const primaryAction = app.href
    ? { label: "Open product ↗", href: app.href, external: true }
    : app.screenshot
      ? { label: "Explore the interface ↓", href: "#interface", external: false }
      : { label: "How it works ↓", href: "#overview", external: false };

  return (
    <>
      <Nav />

      <main>
        <section
          className="border-b border-border"
          style={{ background: `linear-gradient(180deg, ${app.accent}1a, transparent)` }}
        >
          <div className="mx-auto max-w-6xl px-5 pb-14 pt-10 sm:px-8 sm:pb-16">
            <Link
              href="/"
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              ← All products
            </Link>

            <div className="reveal mt-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
                <AppIcon app={app} size="xl" />
                <div>
                  <span
                    className="text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{ color: app.accent }}
                  >
                    {app.category}
                  </span>
                  <h1 className="display mt-2 text-[clamp(36px,6vw,64px)] font-extrabold leading-none text-foreground">
                    {app.name}
                  </h1>
                  <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
                    {app.tagline}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 lg:justify-end">
                <a
                  href={primaryAction.href}
                  target={primaryAction.external ? "_blank" : undefined}
                  rel={primaryAction.external ? "noreferrer noopener" : undefined}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:opacity-90"
                  style={{ background: app.accent }}
                >
                  {primaryAction.label}
                </a>
                <a
                  href="#project-status"
                  className="rounded-full border border-border-strong bg-surface/70 px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:bg-surface"
                >
                  Development status ↓
                </a>
              </div>
            </div>

            <div className="reveal reveal-2 mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <StatusDot status={app.status} />
              <span className="font-medium text-muted">
                {app.platformLabel ?? app.platforms.join(" · ")}
              </span>
              <span className="font-medium text-muted">Started {app.year}</span>
            </div>
          </div>
        </section>

        {app.screenshot && (
          <ProductGallery
            appName={app.name}
            accent={app.accent}
            fit={app.screenshotFit}
            primary={{
              src: app.screenshot,
              alt: `${app.name} shown in a product setting`,
              title: "Product overview",
              caption: app.screenshotCaption ?? `The ${app.name} product interface.`,
            }}
            gallery={app.gallery}
            intro={
              app.galleryIntro ??
              "Open any image for a closer look. Product mockups and interface captures use privacy-safe content."
            }
          />
        )}

        <section
          id="overview"
          className="mx-auto grid max-w-6xl scroll-mt-24 gap-12 px-5 pb-16 sm:px-8 lg:grid-cols-[1.65fr_1fr]"
        >
          <div className="space-y-12">
            <ContentSection eyebrow="The problem" title="Why this needed to exist.">
              <p>{app.problem}</p>
            </ContentSection>

            <ContentSection eyebrow="How it works" title="One focused system, built around the job.">
              <p>{app.description}</p>
              {app.story && (
                <blockquote
                  className="mt-7 rounded-2xl border-l-4 bg-surface p-6 text-base italic leading-relaxed text-foreground sm:text-lg"
                  style={{ borderColor: app.accent }}
                >
                  “{app.story}”
                </blockquote>
              )}
            </ContentSection>

            <ContentSection eyebrow="Useful for" title="Where it earns its place.">
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {app.useCases.map((useCase) => (
                  <li
                    key={useCase}
                    className="flex gap-3 rounded-2xl border border-border bg-surface p-4 text-sm leading-relaxed text-foreground sm:text-base"
                  >
                    <span
                      className="mt-2 h-2 w-2 shrink-0 rounded-full"
                      style={{ background: app.accent }}
                    />
                    {useCase}
                  </li>
                ))}
              </ul>
            </ContentSection>

            {app.features && app.features.length > 0 && (
              <ContentSection eyebrow="Capabilities" title="What it does today.">
                <ul className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
                  {app.features.map((feature) => (
                    <li key={feature} className="flex gap-3 px-5 py-4 text-foreground">
                      <span
                        className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: app.accent }}
                      />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </ContentSection>
            )}
          </div>

          <aside className="space-y-6">
            <div id="project-status" className="scroll-mt-24">
              <Panel title="Project status">
                <StatusDot status={app.status} />
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  <span className="font-semibold text-foreground">Next:</span> {app.nextStep}
                </p>
              </Panel>
            </div>

            {app.facts && app.facts.length > 0 && (
              <Panel title="Project snapshot">
                <dl className="space-y-4">
                  {app.facts.map((fact) => (
                    <div key={fact.label}>
                      <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                        {fact.label}
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-foreground">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </Panel>
            )}

            {app.tech && app.tech.length > 0 && (
              <Panel title="Built with">
                <div className="flex flex-wrap gap-2">
                  {app.tech.map((technology) => (
                    <Tag key={technology}>{technology}</Tag>
                  ))}
                </div>
              </Panel>
            )}

            <Panel title="Platforms">
              <div className="flex flex-wrap gap-2">
                {app.platforms.map((platform) => (
                  <Tag key={platform}>{platform}</Tag>
                ))}
              </div>
            </Panel>

            {app.links && app.links.length > 0 && (
              <Panel title="Links">
                <div className="flex flex-col gap-2">
                  {app.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-sm font-medium text-accent hover:underline"
                    >
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              </Panel>
            )}
          </aside>
        </section>

        {more.length > 0 && (
          <section className="mx-auto max-w-6xl border-t border-border px-5 pb-4 pt-12 sm:px-8">
            <h2 className="display mb-6 text-2xl font-bold text-foreground">More from Koryuu</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {more.map((candidate) => (
                <Link
                  key={candidate.slug}
                  href={`/apps/${candidate.slug}/`}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-border-strong"
                >
                  <AppIcon app={candidate} size="sm" />
                  <div className="min-w-0">
                    <div className="display truncate font-semibold text-foreground">
                      {candidate.name}
                    </div>
                    <div className="truncate text-sm text-muted">{candidate.cardSummary}</div>
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

function ContentSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{eyebrow}</p>
      <h2 className="display mt-3 text-2xl font-bold text-foreground sm:text-3xl">{title}</h2>
      <div className="mt-4 text-base leading-relaxed text-foreground sm:text-lg">{children}</div>
    </section>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">{title}</h3>
      {children}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-surface-2 px-3 py-1 text-sm font-medium text-foreground">
      {children}
    </span>
  );
}
