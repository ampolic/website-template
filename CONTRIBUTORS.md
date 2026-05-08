# Contributor Guide

See `AGENTS.md` for architecture, styling, and workflow guidelines.

## Quick Reference

- **Commits:** `npm run commit` (conventional commits enforced)
- **Checks:** `npm run check && npm run lint && npm run format:check`
- **Build:** `npm run build`
- **Release:** `npm run release` (from clean `main` only)

## Content

Edit business settings, navigation, and content in their respective `src/config/`, `src/content/`, and `src/styles/` directories.

## Deployment

Upload `dist/` to any static host. For releases, extract `release-artifacts/dist.tar.gz` from the GitHub Release.

## Quality Checklist

- `npm run check` passes
- `npm run lint` passes
- `npm run format:check` passes
- `npm run build` passes
- Pages are mobile-friendly
- Navigation matches active modules
- Contact details are correct
- Images are optimized with alt text
- Removed example modules don't generate public pages
