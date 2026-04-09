# NATCA UI Shell

Design system and style guide for all NATCA web properties.

## Project Context

- **Status:** BETA / DRAFT — CSS extracted and published, design direction under team review
- **Package:** `@natca-itc/ui-shell@0.1.0-beta.1` on GitHub Packages
- **Org:** NATCA-ITC
- **Repo:** `NATCA-ITC/natca-ui-shell`
- **Purpose:** Single source of truth for visual direction, design tokens, component patterns, and navigation architecture across all MyNATCA apps

## What This Repo Contains

### Published Package (`dist/`)
- `natca-tokens.css` — All CSS custom properties (colors, typography, spacing, radii, shadows, light/dark themes)
- `natca-components.css` — Base reset, nav, buttons, cards, badges, alerts, forms, tables, loading states, empty states, error states, toasts, footer
- `theme.json` — WordPress block editor token mapping

### Design Previews (HTML)
- `natca-design-system.html` — Full token reference + component library (consumes `src/` CSS via `<link>`)
- `natca-header-variants.html` — 5 public nav options + 2 authenticated shell options (consumes `src/` tokens)

### Source (`src/`)
- `natca-tokens.css` — Source tokens
- `natca-components.css` — Source component styles
- `theme.json` — Source WordPress theme.json

## Relationship to Other Projects

This repo defines the visual language that all other MyNATCA apps should follow:
- **Platform** owns auth and data — UI Shell owns the look
- **Hub** — first consumer (proof of concept integration done)
- **BID, DMS, Pay, GATS** — should consume tokens from this design system
- **WordPress (natca.org)** — consumes CSS + theme.json only, not Vue components
- Tokens use CSS custom properties with `data-theme` attribute for light/dark switching

## Architecture Direction

- **Phase 1 (current - BETA):** Extracted CSS tokens + components published as npm package. HTML previews consume the same CSS.
- **Phase 2:** `@natca-itc/ui-shell` Vue + Vuetify component package — shared shell that all apps import
- **Phase 3:** Module Federation — Hub becomes a unified portal that loads app admin modules at runtime

Key patterns documented in header variants:
- **Auth A = Admin portal shell** — full sidebar for admins, light variant for focused admin tasks
- **Auth B = Member app shell** — horizontal nav for all BUEs, app switcher in system chip
- **App switcher** — cross-app navigation within the ecosystem, lives in the system chip area
- **Contextual second row** — sub-links at section roots, breadcrumbs when deep in a record
- **Shell contract (tentative)** — apps provide `appId`, `navItems[]`, and route `meta.subNav` or `meta.breadcrumb`; shell provides layout, auth context, and theme; active states driven by Vue Router automatically

## Key Design Decisions

- **Fonts (finalized):** Barlow 600 (display/headings) + Public Sans (body)
- **Light theme:** Public-facing pages (`data-theme="light"`)
- **Dark theme:** Authenticated/member views (`data-theme="dark"`)
- **Brand colors:** Red (#CE0E2D), Navy/Blue (#003366), Sky (#6AC9FF)

## Build & Publish

```bash
npm run build          # Copies src/ → dist/
npm publish --tag beta # Publishes to GitHub Packages
```

Consuming apps install with:
```bash
npm install @natca-itc/ui-shell@beta
```

## Rules

- Source of truth is `src/` — never edit `dist/` directly
- HTML preview files consume `src/` CSS via `<link>` tags — they are living proof the CSS works
- Any token changes in `src/` should be verified in the HTML previews before publishing
- When building Vue components later, Auth A (admin shell) and Auth B (member shell) are separate layout components — apps choose between them based on user role/permissions, never combine them into one
- Keep the package lightweight — CSS only for now, Vue components in Phase 2
