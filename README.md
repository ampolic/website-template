# Local Business Website Scaffold

Reusable Astro scaffold for static brochure websites for local service businesses.

**Stack:** Astro 6, Tailwind CSS 4, React 19, ShadCN UI, TypeScript, MDX.

## Quick Start

```bash
npm install
npm run dev
```

## Create a New Website

1. Duplicate this repository.
2. Run the bootstrap script:
   ```bash
   npm run bootstrap:site -- --package-name my-client --site-url https://client.example
   ```
3. Edit `src/config/site.ts` with business details.
4. Edit `src/config/navigation.ts` for nav links.
5. Replace sample content in `src/content/`.
6. Remove example modules not needed (blog, projects, faq, testimonials).
7. Add images to `public/images/`.
8. Create client-specific sections in `src/components/sections/`.

## Build & Deploy

```bash
npm run build    # outputs to dist/
npm run preview  # preview production build
```

Output is fully static — deploy `dist/` to any static host.

## Releases

```bash
npm run release:dry
npm run release
```

Uses semantic-release from `main`. Generates changelog, version tag, GitHub Release with `dist.tar.gz`.

## Project Structure

```
src/
  components/    ui/ (ShadCN), layout/ (header, footer), shared/ (SEO, Section, etc.)
  layouts/       BaseLayout, StandardPageLayout
  pages/         Routes
  content/       Content collections (services, blog, projects, faq, testimonials)
  features/      Feature modules (schema, helpers, interactive components)
  config/        site.ts, navigation.ts
  styles/        global.css (Tailwind + design tokens)
  lib/           Schema helpers, utilities, brand icons
public/images/   Static images
scripts/         Bootstrap, release automation
```

## Environment

| Variable                     | Required         | Default                          |
| ---------------------------- | ---------------- | -------------------------------- |
| `SITE_URL`                   | Yes (production) | `https://example.com`            |
| `PUBLIC_CONTACT_FORM_ACTION` | Yes              | `https://formspree.io/f/example` |

See `AGENTS.md` for detailed architecture, styling, and workflow guidelines.
