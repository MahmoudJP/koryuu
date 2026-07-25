import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AppGrid } from "@/components/AppGrid";

export const metadata: Metadata = {
  title: "Apps",
  description: "Every app and tool built under the Koryuu umbrella — search and browse the full catalogue.",
};

export default function AppsPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-5 pt-16 sm:px-8">
        <header className="reveal mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            The catalogue
          </span>
          <h1 className="display mt-2 text-4xl font-bold text-foreground sm:text-5xl">
            All apps
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            A living directory. Search by name or idea, or filter by category. Click any
            app to open its own page.
          </p>
        </header>

        <AppGrid />
      </main>
      <Footer />
    </>
  );
}
