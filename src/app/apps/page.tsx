import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AppGrid } from "@/components/AppGrid";

export const metadata: Metadata = {
  title: "Product directory",
  description: "Explore every software product, utility, and experiment in Koryuu.",
};

export default function AppsPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-5 pt-16 sm:px-8">
        <header className="reveal mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Product directory
          </span>
          <h1 className="display mt-2 text-4xl font-bold text-foreground sm:text-5xl">
            Everything Koryuu is building.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Native utilities, learning systems, and cross-platform tools — with real
            interface screenshots, product context, and implementation details.
          </p>
        </header>

        <AppGrid />
      </main>
      <Footer />
    </>
  );
}
