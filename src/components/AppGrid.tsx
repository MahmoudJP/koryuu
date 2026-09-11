"use client";

import { useMemo, useState } from "react";
import { apps as allApps, type App } from "@/data/apps";
import { AppCard } from "./AppCard";

export function AppGrid({ apps = allApps }: { apps?: App[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const app of apps) {
      counts.set(app.category, (counts.get(app.category) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [apps]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps.filter((app) => {
      if (category && app.category !== category) return false;
      if (!q) return true;
      const hay = [app.name, app.category, app.tagline, app.description, ...(app.tech ?? []), ...app.platforms]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [apps, query, category]);

  return (
    <div>
      <div className="grid gap-5 border-b border-border pb-7 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] lg:items-center">
        <div className="relative w-full">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, tools, platforms…"
            aria-label="Search products"
            className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-4 text-base text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-[var(--ring)]"
          />
        </div>

        <div className="no-scrollbar -mx-1 flex min-w-0 gap-2 overflow-x-auto px-1 pb-1">
          <Pill active={category === null} onClick={() => setCategory(null)}>
            All <span className="opacity-60">{apps.length}</span>
          </Pill>
          {categories.map((c) => (
            <Pill
              key={c.name}
              active={category === c.name}
              onClick={() => setCategory(category === c.name ? null : c.name)}
            >
              {c.name} <span className="opacity-60">{c.count}</span>
            </Pill>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-border p-12 text-center">
          <p className="text-base text-muted">No products match “{query}”.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory(null);
            }}
            className="mt-4 text-sm font-semibold text-accent hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((app) => (
            <AppCard key={app.slug} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-accent bg-accent text-accent-fg"
          : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
