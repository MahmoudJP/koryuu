import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { LegalDoc } from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Koryuu collects, uses, shares, and protects personal data in connection with its applications.",
};

// Read at build time (static export). Source of truth lives in
// versions/v1.5/PRIVACY_POLICY.txt and is copied to src/legal/privacy.txt.
const text = readFileSync(join(process.cwd(), "src/legal/privacy.txt"), "utf8");

export default function PrivacyPage() {
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
          This Privacy Policy applies to{" "}
          <span className="text-foreground">all Koryuu apps</span> — current and
          future. A given section applies to you only where the app you use has
          that feature (for example, an account, cloud sync, or AI features). See
          also the{" "}
          <Link
            href="/legal/terms/"
            className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
          >
            Terms &amp; EULA
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
