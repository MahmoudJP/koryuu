import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { LegalDoc } from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Terms of Use & EULA",
  description:
    "The End User License Agreement and Terms of Use that govern installing and using Koryuu's software.",
};

// Read at build time (static export). Source of truth lives in
// versions/v1.5/EULA.txt and is copied to src/legal/terms.txt.
const text = readFileSync(join(process.cwd(), "src/legal/terms.txt"), "utf8");

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-5 pt-16 sm:px-8">
        <Link
          href="/legal/"
          className="text-xs font-semibold uppercase tracking-[0.22em] text-accent"
        >
          ← Legal
        </Link>
        <p className="mt-6 rounded-2xl border border-border bg-surface p-4 text-sm leading-relaxed text-muted">
          This End User License Agreement &amp; Terms of Use applies to{" "}
          <span className="text-foreground">all Koryuu apps</span> — current and
          future — and is also presented for acceptance when you install an app. A
          given clause applies only where the app has that feature. See also the{" "}
          <Link
            href="/legal/privacy/"
            className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <article className="mt-8 pb-10">
          <LegalDoc text={text} />
        </article>
      </main>
      <Footer />
    </>
  );
}
