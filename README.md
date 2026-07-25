# Koryuu — koryuu.com

A house for everything I build. One site, many apps — each project gets its own
landing page here instead of a separate website.

**Brand:** 交流 (kōryū) — Japanese for *exchange*. Romanized "Koryu", plus a
trailing **u** that stands for *you*, the person on the other side of the exchange.

## Stack

- **Next.js 16** (App Router) with **static export** (`output: "export"`)
- **Tailwind CSS v4** (CSS-first `@theme`, light + dark themes)
- **React 19**
- **Sora** (display) · **Inter** (UI) · **Noto Sans JP** (kanji)
- Deploys to **Cloudflare Pages** via `wrangler`

## Local dev

```bash
npm install
npm run dev          # http://localhost:3000
```

## Build & deploy

```bash
npm run build        # produces /out
npm run deploy       # uploads /out to Cloudflare Pages (production)
```

## Adding a new app  ← the important part

Every app on the site is generated from one file:
[`src/data/apps.ts`](./src/data/apps.ts). Add one entry and you automatically get:

- a card in the home grid and the `/apps` directory, and
- a full landing page at `/apps/<slug>/`.

```ts
{
  slug: "my-new-app",
  name: "My New App",
  category: "Productivity",
  accent: "#5b5bd6",          // icon + landing-page color
  glyph: "M",                  // shown in the generated icon tile
  // logo: "/apps/my-new-app.png",  // optional: real logo image overrides the glyph
  tagline: "One sharp sentence.",
  description: "A paragraph or two for the landing page.",
  platforms: ["macOS"],
  status: "live",              // live | beta | in-development | internal
  year: 2026,
  tech: ["Swift", "SwiftUI"],
  features: ["Thing one", "Thing two"],
  href: "https://...",         // optional download / live link
}
```

### Real app logos

Drop a square image in `public/apps/` (e.g. `public/apps/my-new-app.png`) and set
`logo: "/apps/my-new-app.png"` on the entry. Until then, the colored glyph tile is
used so every app still reads clearly.
