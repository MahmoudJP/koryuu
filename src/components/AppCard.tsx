import Image from "next/image";
import Link from "next/link";
import { type App } from "@/data/apps";
import { AppIcon } from "./AppIcon";
import { StatusDot } from "./StatusDot";

export function AppCard({ app }: { app: App }) {
  const isExternal = !!(app.external && app.href);
  const href = isExternal ? app.href! : `/apps/${app.slug}/`;

  const visual = (
    <div
      className="relative grid aspect-[3/2] place-items-center overflow-hidden border-b border-border bg-surface-2"
      style={{
        backgroundImage: app.screenshot
          ? undefined
          : `radial-gradient(circle at 50% 35%, ${app.accent}2e, transparent 55%), linear-gradient(145deg, ${app.accent}12, transparent)`,
      }}
    >
      {app.screenshot ? (
        <Image
          src={app.screenshot}
          alt={`${app.name} interface`}
          width={1600}
          height={1000}
          className={`h-full w-full ${
            app.screenshotFit === "contain"
              ? "object-contain p-4"
              : "object-cover object-top"
          }`}
        />
      ) : (
        <AppIcon app={app} size="xl" />
      )}
      <span
        aria-hidden="true"
        className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-black/45 text-sm text-white backdrop-blur-md transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      >
        {isExternal ? "↗" : "→"}
      </span>
    </div>
  );

  const details = (
    <div className="flex flex-1 flex-col p-5">
      <div className="flex items-center justify-between gap-4">
        <span
          className="text-xs font-semibold uppercase tracking-[0.18em]"
          style={{ color: app.accent }}
        >
          {app.category}
        </span>
        <span className="text-sm font-medium text-muted">{app.year}</span>
      </div>

      <h3 className="display mt-3 text-xl font-bold text-foreground">
        {app.name}
      </h3>
      <p className="mt-2 min-h-[3rem] line-clamp-2 text-sm leading-relaxed text-muted">
        {app.cardSummary}
      </p>

      {app.tech && app.tech.length > 0 && (
        <div className="mt-4 flex min-h-7 flex-wrap content-start gap-1.5">
          {app.tech.slice(0, 2).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-muted"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm">
        <StatusDot status={app.status} />
        <span className="font-medium text-muted" title={app.platforms.join(" · ")}>
          {app.platforms.length} {app.platforms.length === 1 ? "platform" : "platforms"}
        </span>
      </div>
    </div>
  );

  const cls =
    "group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_18px_40px_-28px_rgba(0,0,0,0.5)]";

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={cls}>
        {visual}
        {details}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {visual}
      {details}
    </Link>
  );
}
