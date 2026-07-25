import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Legal",
  description:
    "Privacy Policy, Terms of Use, and licensing for Koryuu's applications.",
};

const DOCS = [
  {
    href: "/legal/privacy/",
    title: "Privacy Policy",
    app: "All Koryuu apps",
    desc: "What personal data we process, how it's stored and protected, and the choices and rights you have.",
  },
  {
    href: "/legal/terms/",
    title: "Terms of Use & EULA",
    app: "All Koryuu apps",
    desc: "The license and terms that govern installing and using any Koryuu app, including any BYOK AI features.",
  },
];

export default function LegalHub() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-5 pt-16 sm:px-8">
        <header className="reveal max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Legal
          </span>
          <h1 className="display mt-2 text-[clamp(32px,6vw,52px)] font-extrabold leading-tight text-foreground">
            Legal & privacy.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            One Privacy Policy and one set of Terms cover{" "}
            <span className="text-foreground">every Koryuu app</span> — current and
            future. Each applies to a given app only where that app has the relevant
            feature (such as an account, cloud sync, or AI). For general questions
            write{" "}
            <a
              href="mailto:hello@koryuu.com"
              className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
            >
              hello@koryuu.com
            </a>
            ; for privacy requests,{" "}
            <a
              href="mailto:privacy@koryuu.com"
              className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
            >
              privacy@koryuu.com
            </a>
            .
          </p>
        </header>

        <section className="reveal reveal-2 mt-12 grid gap-4 pb-10 sm:grid-cols-2">
          {DOCS.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className="group rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-border-strong"
            >
              <div className="text-xs font-medium uppercase tracking-wider text-accent">
                {d.app}
              </div>
              <h2 className="display mt-1 text-lg font-semibold text-foreground">
                {d.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{d.desc}</p>
              <span className="mt-4 inline-block text-sm font-medium text-foreground">
                Read{" "}
                <span className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
