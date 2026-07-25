# Project Status

Last reviewed: 2026-07-26

## State

- Intended GitHub visibility: Public
- Local Git branch: `main`
- Framework: Next.js 16, React 19, Tailwind CSS 4
- Deployment target: Cloudflare Pages
- Next.js and eslint-config-next were updated to 16.2.11.
- No deploy has been performed.

## Selected source

`mac_20260720\Me\koryuu` was selected as the active base because it contains
the newer package version and additional legal, loading, and application
components.

The separate `mac_20260720\test\koryuu` copy is not identical. Candidate
features that exist only there and still need product review include:

- Contact page
- `AppsCatalogue`
- `Hero`
- `HomeSections`
- `LoadedGate`
- `Preloader`
- `KORYUU_DESIGN_CONTEXT.md`

These files must not be merged automatically because many shared components
also differ.

## Import exclusions

- `.env.local`
- `.wrangler`
- `node_modules`
- `.next`
- `out`
- logs and TypeScript build metadata
- `.DS_Store` and AppleDouble `._*` files

## Validation completed

- `.env.local.example` contains placeholders only.
- Public-source secrets scan passed.
- ESLint and the production build passed on Windows.

## Follow-up

- Review branding, contact details, and legal pages before deployment.
- Decide whether to merge any features from the test copy.
- Dependency audit still reports upstream Next.js/tooling advisories; do not use
  `npm audit fix --force`.
