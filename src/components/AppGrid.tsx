"use client";

import { useMemo, useState } from "react";
import { apps as allApps, getCategories, type App } from "@/data/apps";
import { AppCard } from "./AppCard";

/**
 * The full apps directory: live search + category filter over a responsive
 * grid. Designed to stay usable from 9 apps to well past 100 — the filter
 * rail and search keep the page navigable as the catalogue grows.
 */
export function AppGrid({ apps = allApps }: { apps?: App[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => getCategories(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps.filter((a) => {
      if (category && a.category !== category) return false;
      if (!q) return true;
      const hay = [a.name, a.category, a.tagline, a.description, ...(a.tech ?? []), ...a.platforms]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [apps, query, category]);

  return (
    <div>
      {/* Search */}
      <div className="relative max-w-md">
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
          placeholder="Search apps, platforms, ideas…"
          aria-label="Search apps"
          className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent"
        />
      </div>

      {/* Category filter rail */}
      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
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

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-muted">
          No apps match “{query}”.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-accent bg-accent text-accent-fg"
          : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
