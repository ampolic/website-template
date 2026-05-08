# AI Agent Instructions

Do **not** read `README.md` or `CONTRIBUTORS.md` — they are redundant with this file.

## Architecture

- Prefer Astro components for static UI.
- Use React only for interactive islands (mobile nav, accordion, contact form, toasts).
- Use ShadCN UI primitives for buttons, cards, accordions, sheets, forms, inputs.
- Create site-specific sections in `src/components/sections/`.
- Keep shared components foundational: layout, SEO, wrappers, UI primitives.

## Repository Workflow

- All pushes go to `main` — no feature branches.
- Use conventional commits via `npm run commit`.
- Respect Husky hooks (commitlint, lint-staged).
- Use `npm run release` only from a clean `main` working tree.
- Release artifacts include `dist/` as `release-artifacts/dist.tar.gz`.

## Styling

- Use Tailwind utilities and CSS tokens in `src/styles/global.css`.
- Color tokens (`--background`, `--foreground`, `--primary`, `--accent`, etc.) are defined in `:root` as OKLCH values.
- Keep visual style clean, modern, mobile-first.
- Use the system font stack (`ui-sans-serif, system-ui, sans-serif`).
- Do not add dark/light mode.

## Content

- Editable content lives in Astro content collections under `src/content/`.
- Each collection has an independent folder, schema, helpers in `src/features/`, and route files when needed.
- Example modules (blog, projects, faq, testimonials) are removable — delete the feature folder, content folder, route, and unregister from `src/content.config.ts`.
- To add a new content type: add collection folder, feature folder with schema/helpers, route files, and navigation link.

## Images

- Store images in `public/images/`.
- Required placeholder replacements:
  - `public/images/hero.svg` — hero/home page banner
  - `public/images/placeholder.svg` — generic content photo
- Use `<img>` with `width`, `height`, `loading="lazy"` (non-critical), `decoding="async"`.
- Use `fetchpriority="high"` for hero images.

## SEO

- Every page must have a title and description.
- Canonical URLs, OpenGraph, sitemap, robots.txt are configured.
- Use `getLocalBusinessSchema()`, `getServiceSchema()`, `getBreadcrumbSchema()`, `getBlogPostingSchema()`, `getFAQPageSchema()` from `src/lib/schema.ts`.
- All schema helpers are modular — use as needed, omit what isn't relevant.

## Environment Variables

| Variable                     | Purpose                                                 |
| ---------------------------- | ------------------------------------------------------- |
| `SITE_URL`                   | Production URL for canonical links, sitemap, robots.txt |
| `PUBLIC_CONTACT_FORM_ACTION` | Form endpoint URL (e.g., FormSpree)                     |

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build (without type checking)
- `npm run check` — type checking only
- `npm run lint` — ESLint
- `npm run format` — Prettier
- `npm run commit` — interactive conventional commit
- `npm run release` — full release pipeline

## Site Configuration

All site settings in `src/config/site.ts`:

- `business` — name, legal name, phone, email, address, hours
- `serviceAreas` — string array of served locations
- `social` — social media URLs (empty strings hide the icon)
- `contactAction` — form endpoint URL
- `seo` — default title, description, image, theme color

Navigation in `src/config/navigation.ts`: array of `{ label, href }` objects.

## Performance & Accessibility

- Minimize client-side JS.
- Use `client:idle`, `client:visible`, `client:load` sparingly.
- Use semantic HTML landmarks and form labels.
- Maintain visible focus states and sufficient color contrast.
- Keep the site compatible with `astro build` static output.
