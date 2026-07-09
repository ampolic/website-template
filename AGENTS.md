# Agent Instructions

## Stack

- Astro static site. Prefer `.astro` for static UI.
- Use React only for interactive islands.
- Use Tailwind utilities and tokens in `src/styles/global.css`.
- Use existing shadcn UI primitives from `src/components/ui/`.

## Structure

- Layout/shared UI: `src/layouts/`, `src/components/layout/`, `src/components/shared/`.
- Config: `src/config/site.ts`, `src/config/navigation.ts`.
- Content collections: `src/content/`, schemas in `src/lib/content-schemas.ts`, helpers in `src/features/`.
- Pages: `src/pages/`.
- Public assets: `public/`.

## File Placement

- Route files live in `src/pages/`. Keep pages thin: compose layouts, shared sections, feature helpers, and config/content data.
- Page shells belong in `src/layouts/`; site chrome belongs in `src/components/layout/`.
- Reusable static UI belongs in `.astro` files under `src/components/shared/`.
- Generic shadcn UI primitives belong in `src/components/ui/`. Treat these files as registry-owned: regenerate with the shadcn CLI instead of manually rewriting them to match local lint preferences.
- Feature-specific helpers, data mappers, and interactive islands belong in `src/features/<feature>/`.
- Business-editable structured data belongs in `src/config/` or `src/content/`, not hardcoded into page templates.
- Content collection schemas belong in `src/lib/content-schemas.ts`; collection registration belongs in `src/content.config.ts`.
- Public assets belong in descriptive subfolders under `public/`, such as `public/images/team/`, `public/images/services/`, and `public/resumes/`.

## Naming

- Use PascalCase for authored Astro and React components outside `src/components/ui/`, including layout/shared components and React islands.
- Use kebab-case for `src/components/ui/` files, route files, config files, lib files, content files, feature helper files, scripts, and folders.
- Use `@/` imports inside `src/`; avoid relative imports between source modules.
- Prefer descriptive public asset names in lowercase kebab-case. Public files are not linted, but final assets should avoid spaces, uppercase letters, and vague names.

## Rules

- Keep output compatible with static `astro build`.
- Every page needs title, description, and canonical handling through layouts/SEO.
- Use semantic HTML, labels, visible focus states, and sufficient contrast.
- Minimize client JS; use Astro islands sparingly.
- For small React islands, prefer local state and native form behavior over heavy client form libraries unless complexity clearly justifies them.
- Do not import theme providers or theme hooks into client islands unless the site explicitly supports theme switching.
- Prefer Astro's built-in `astro:assets` pipeline for raster site images. Store optimizable images under `src/assets/`, and for content collections use schema-owned image fields via Astro's `image()` helper instead of string paths or manual lookup maps.
- Reserve `public/` for files that should stay as passthrough assets, such as SVGs, favicons, robots files, downloads, and assets that must keep a stable URL.
- Do not add dark/light mode unless requested.

## Performance & Accessibility

### LCP images in mapped lists

When a page renders a list of cards or items where the first card's image is above the fold, that first image is the LCP element. Do not use `loading="lazy"` uniformly across the whole list. Use the map `index` to apply `loading="eager"` and `fetchpriority="high"` to index 0, and `loading="lazy"` / `fetchpriority="auto"` to the rest.

### Third-party scripts

Do not load third-party scripts (analytics, captchas, chat widgets, etc.) unconditionally on mount. Load them only when needed:

- Defer via `IntersectionObserver` when the script serves a UI element that may be off-screen (e.g. a contact form captcha). Use a `rootMargin` of `200px` so the script starts loading slightly before the element is visible.
- Eager loading of third-party scripts on every page damages Best-Practices scores due to third-party cookies and deprecated APIs that are outside our control.

### `aria-label` on links with visible text

When a link or button has visible text, `aria-label` must contain that text (WCAG 2.5.3). A mismatch breaks the accessibility audit and confuses screen reader users who activate controls by speaking what they see. Use `aria-label` to augment, not replace, the visible label — for example `` `${businessName} - Home` `` instead of just `"Home"` on a branded logo link.

## Template Notes

- This repo is a template. Bootstrap a duplicated repo with `npm run bootstrap:site` (see `scripts/bootstrap-site.ts --help`).
- Example modules (blog, projects, faq, testimonials, services) are removable: delete the feature folder, content folder, route files, and unregister from `src/content.config.ts`.
- To add a new content type: add a collection folder, a feature folder with schema/helpers, route files, and a navigation link.
- `SITE_URL` env var sets the production URL for canonical links, sitemap, and robots.txt.
- Deploys target Cloudflare (static assets served by Wrangler; config in `wrangler.jsonc`, `public/.assetsignore` excludes worker files from asset upload). Update the `name` in `wrangler.jsonc` when bootstrapping a new site.

## Commands

- Dev: `npm run dev`
- Type check: `npm run check`
- Lint: `npm run lint`
- Format: `npm run format`
- Build: `npm run build`
- Test: `npm run test`
- Preview (Cloudflare local): `npm run preview`
- Deploy (Cloudflare): `npm run deploy`
- Commit: `npm run commit`
- Release: `npm run release` from clean `main`
