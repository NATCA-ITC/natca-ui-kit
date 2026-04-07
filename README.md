# NATCA UI Kit

> **Status: DRAFT** — Design proposals ready for team review. Not yet implemented as production code.

Unified design system and style guide for all NATCA web properties (natca.org, MyNATCA portal, Hub, BID, DMS, Pay, GATS, Discord). This repo is the single source of truth for visual direction, design tokens, component patterns, and navigation architecture across the ecosystem.

## What's Inside

### `natca-design-system.html`
Full design token reference and component library covering:
- **Color tokens** — Brand palette (red, navy, blue, sky), neutrals, semantic colors
- **Light + Dark themes** — `data-theme="light"` for public pages, `data-theme="dark"` for authenticated views
- **Typography** — Barlow (display/headings), Inter (body), type scale from 12px–48px
- **Spacing** — 4px base grid system
- **Components** — Buttons (primary, secondary, danger, ghost, accent), cards, badges, alerts, form elements, data tables
- **Navigation** — Two-tier pattern (utility bar + primary nav) with dropdowns

### `natca-header-variants.html`
Navigation design proposals for team review:
- **Option 1 — Classic Refined** — White primary bar, navy utility, red accent border
- **Option 2 — Navy Command** — Full navy primary bar, bold brand presence
- **Option 3 — Red Impact** — Red utility bar, white primary, strong CTA focus
- **Option 4 — Compact Modern** — Single-bar minimal layout with sub-nav
- **Option 5 — Floating Glass** — Glassmorphism nav over hero, modern/editorial feel
- **Auth Option A — Command Shell** — Deep navy, icon-rail collapsible sidebar (data-dense)
- **Auth Option B — Horizontal Nav Shell** — No sidebar, two-bar strip like GitHub/Stripe

## How to View

Open either HTML file in a browser. No build step or dependencies required.

## Brand Tokens (Quick Reference)

| Token | Value | Use |
|-------|-------|-----|
| `--natca-red` | `#CB092F` | Primary brand red |
| `--natca-navy` | `#032449` | Primary brand navy |
| `--natca-blue` | `#1490D7` | UI action blue |
| `--natca-sky` | `#6AC9FF` | Accent / dark surfaces |
| `--natca-gold` | `#D4A017` | Accent highlight |

## Typography

| Role | Font | Fallback |
|------|------|----------|
| Display / Headings | Outfit, Barlow | sans-serif |
| Body | DM Sans, Inter | sans-serif |
| Monospace | Courier New | monospace |

## Theme Architecture

- **Public pages** (`data-theme="light"`) — Light backgrounds, dark text, warm off-white (#FAF9F5)
- **Authenticated views** (`data-theme="dark"`) — Dark navy backgrounds, light text, elevated surfaces

All NATCA apps should consume these tokens. The design system CSS can be dropped into any project and themed via the `data-theme` attribute.

## Where This Fits

This repo sits alongside the other MyNATCA ecosystem projects:

| Project | Purpose |
|---------|---------|
| **natca-ui-kit** (this repo) | Design system, tokens, style guide |
| **Platform** | Auth, Supabase, data sync, API services |
| **Hub** | Admin dashboard (Vue 3 + Vuetify) |
| **BID** | Facility bid management (Laravel + Vue) |
| **Discord** | Bot — verification, role sync |
| **DMS** | Document management |
| **Pay** | PayChecker — LES parsing |
| **GATS** | Grievance tracking viewer |

## Next Steps

1. Team reviews nav options (1–5) and picks public navigation direction
2. Team reviews auth shell (Option A vs B) for authenticated apps
3. Finalize token values and extract CSS into standalone `natca-tokens.css`
4. Build as importable package for Vue/Vuetify apps (Hub, BID, DMS, Pay, GATS)
5. Enable GitHub Pages for shareable review link
