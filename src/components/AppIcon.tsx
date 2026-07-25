import type { App } from "@/data/apps";

const SIZES = {
  sm: { box: 44, radius: 12, font: 20 },
  md: { box: 64, radius: 16, font: 28 },
  lg: { box: 88, radius: 22, font: 40 },
  xl: { box: 120, radius: 28, font: 54 },
} as const;

type Size = keyof typeof SIZES;

/**
 * An app's logo. If `app.logo` points to an image under /public it is used
 * directly; otherwise a colored tile with the app's glyph is generated from
 * its accent color — so every app reads clearly even before it has artwork.
 */
export function AppIcon({
  app,
  size = "md",
  className = "",
}: {
  app: App;
  size?: Size;
  className?: string;
}) {
  const s = SIZES[size];

  if (app.logo) {
    // Full-bleed app icons (their own background) fill the tile. Logos that are
    // a mark on a transparent/odd background are framed on a clean white tile.
    if (app.logoContain) {
      return (
        <div
          className={`grid shrink-0 place-items-center bg-white ${className}`}
          style={{ width: s.box, height: s.box, borderRadius: s.radius, padding: s.box * 0.14 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={app.logo}
            alt={`${app.name} logo`}
            className="h-full w-full object-contain"
          />
        </div>
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={app.logo}
        alt={`${app.name} logo`}
        width={s.box}
        height={s.box}
        style={{ width: s.box, height: s.box, borderRadius: s.radius }}
        className={`shrink-0 object-cover ${className}`}
      />
    );
  }

  const isLatin = /^[A-Za-z0-9]$/.test(app.glyph);

  return (
    <div
      aria-hidden
      className={`grid shrink-0 place-items-center font-display font-semibold text-white ${className}`}
      style={{
        width: s.box,
        height: s.box,
        borderRadius: s.radius,
        fontSize: s.font,
        fontFamily: isLatin ? undefined : "var(--font-jp)",
        background: `linear-gradient(150deg, ${app.accent}, ${shade(app.accent, -22)})`,
        boxShadow: `0 8px 22px -10px ${app.accent}88, inset 0 1px 0 rgba(255,255,255,0.18)`,
      }}
    >
      {app.glyph}
    </div>
  );
}

/** Darken (or lighten) a hex color by a percentage for the gradient. */
function shade(hex: string, percent: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent) / 100;
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  const to = (c: number) => Math.round((t - c) * p) + c;
  return `#${((1 << 24) + (to(r) << 16) + (to(g) << 8) + to(b)).toString(16).slice(1)}`;
}
