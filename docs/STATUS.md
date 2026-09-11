# Project Status

Last reviewed: 2026-09-11

## State

- GitHub repository: `MahmoudJP/koryuu`
- Repository visibility: Public
- Local Git branch: `main`
- Framework: Next.js 16, React 19, Tailwind CSS 4
- Deployment target: Cloudflare Pages
- Next.js and eslint-config-next were updated to 16.2.11.
- The public site now opens directly on the full product catalogue.
- The homepage brand line now expands KORYUU as “Keep Outcomes Reliable;
  Yield Uncomplicated Utility,” with the six initials visually highlighted.
- Koryuu is positioned as a product brand for software, utilities, and
  experiments; personal biography and CV content live on `mahmoud.jp`.
- The personal `mahmoud.jp` entry was removed from the product catalogue and
  remains available only as an external creator link.
- Product cards now use a compact, consistent three-column desktop layout with
  equal visual treatment, function-first summaries, technology, project status,
  and an explicit platform count.
- DTP Master, JLPT Master, and CloudOps Associate are now identified as
  cross-platform products across their cards and product pages, with their
  planned Web, Windows, macOS, and Linux availability shown where applicable.
- The long Koryuu name explanation was removed, while the existing cinematic
  Confluence opening effect remains mounted in the root layout and unchanged.
- The experimental intro-audio system and its local evaluation controls were
  removed completely. The visual Confluence opening remains silent and intact.
- SHAMS was removed from the public project catalogue.
- Real, privacy-safe product screenshots were added for DTP Master, JLPT
  Master, SuperNotch, MyLife, and CloudOps Associate.
- Four new SuperNotch source screenshots are preserved under its product assets;
  one Weather screenshot has a MacBook notch treatment saved as a review-only
  preview pending approval before the full set is prepared or published.
- A second review-only Weather mockup places the interface inside a restrained
  MacBook-style product frame; it is not referenced by the site yet.
- The latest review-only Focus mockup corrects the product scale: SuperNotch is
  a compact panel attached to the notch with a privacy-safe abstract desktop
  visible around it. User-provided reference photos were not copied or stored.
- The newest Focus mockup integrates the hardware notch into the exact center
  of the panel header, with the app surface extending to the top edge on both
  sides, matching the real SuperNotch placement more closely.
- A real-scale Focus preview reduces the complete SuperNotch panel to roughly
  46% of display width and 27% of display height, based only on geometry from
  the latest reference screenshot; its personal desktop content was not copied.
- The final review-only Focus spacing mockup widens and deepens the reserved
  notch area, keeps the blue shoulders attached to the display edge, and moves
  the complete toolbar below the notch. The close-up reference was used only
  for geometry; none of its personal screen content was copied.
- SuperNotch now has a published local gallery of five consistent, real-scale
  MacBook mockups covering Focus, Countdowns, System, Capture, and Clipboard.
- The Clipboard example uses purpose-written sample entries; the original
  personal clipboard text is not stored in the project or used by the site.
- The SuperNotch page now describes the native notch interaction, 19 built-in
  modules, platform support, implementation stack, and the purpose of each
  featured interface view using details verified against the app source.
- Product pages now follow one complete case-study structure: the problem, how
  the product works, representative use cases, current capabilities, technology,
  project status, and the next development milestone.
- Every product page has a truthful primary action: open the live product when a
  real destination exists, otherwise jump to the interface or product story. No
  placeholder download or signup links are published.
- Product screenshots open in an accessible lightbox with close, previous, and
  next controls plus Escape and arrow-key navigation.
- DTP Master, JLPT Master, MyLife, CloudOps Associate, and Switcher now use a
  unified dark-studio product image system. Privacy-safe real interface captures
  remain available inside the relevant product galleries; Switcher uses a
  source-faithful, privacy-safe visualization of its compact native HUD.
- DTP Master, JLPT Master, and CloudOps Associate now use platform-neutral card
  artwork: each interface floats directly in its own calm studio environment,
  with laptop shells, keyboards, bezels, and operating-system branding removed.
  SuperNotch keeps its MacBook presentation because the hardware notch is part
  of the product itself.
- The refreshed portfolio was deployed to the existing Cloudflare Pages project
  `koryuu` on 2026-09-11 and is live at `koryuu.com` and `www.koryuu.com`.
- A separate private Vercel static deployment is connected to GitHub and updates
  on every `main` push. It remains a Studio review surface rather than the public
  production host.

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
- ESLint and the full 14-route static production build passed locally on macOS
  after the product-page, gallery, card, CTA, and imagery update.
- The local browser review passed for the product grid, SuperNotch product page,
  Switcher imagery, lightbox controls, keyboard navigation, and console errors.
- Post-deployment checks returned HTTP 200 from `koryuu.com`, `www.koryuu.com`,
  and the immutable Cloudflare deployment URL. The public HTML contains the
  unchanged intro, includes SuperNotch, and contains no SHAMS catalogue entry.
- Direct visits to the private review deployment are rejected. Studio exchanges
  a 30-second signed launch ticket for a secure 12-hour browser session.

## Follow-up

- Continue reviewing branding, contact details, and legal copy as the product
  catalogue evolves.
- Decide whether to merge any features from the test copy.
- Dependency audit still reports upstream Next.js/tooling advisories; do not use
  `npm audit fix --force`.
