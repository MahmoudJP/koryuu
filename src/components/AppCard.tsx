import Link from "next/link";
import { type App } from "@/data/apps";
import { AppIcon } from "./AppIcon";
import { StatusDot } from "./StatusDot";

export function AppCard({ app }: { app: App }) {
  const isExternal = !!(app.external && app.href);
  const href = isExternal ? app.href! : `/apps/${app.slug}/`;

  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <AppIcon app={app} size="md" />
        <span className="opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-1 text-accent">
          {isExternal ? "↗" : "→"}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-center gap-2">
          <h3 className="display text-lg font-semibold text-foreground">{app.name}</h3>
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
          {app.tagline}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs">
        <StatusDot status={app.status} />
        <span className="font-medium text-muted">{app.platforms.join(" · ")}</span>
      </div>
    </>
  );

  const cls =
    "group flex h-full flex-col rounded-2xl border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)]";

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
