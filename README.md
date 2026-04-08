# NATCA UI Shell

> **Status: BETA / DRAFT** — CSS tokens and components are extracted and published as `@natca-itc/ui-shell`. Design direction still under team review. Vue shell components coming in Phase 2.

Unified design system and style guide for all NATCA web properties (natca.org, MyNATCA portal, Hub, BID, DMS, Pay, GATS, Discord). This repo is the single source of truth for visual direction, design tokens, component patterns, and navigation architecture across the ecosystem.

## Package: `@natca-itc/ui-shell`

Published to GitHub Packages as `@natca-itc/ui-shell@0.1.0-beta.1`.

### What Ships

| File | What it is | Consumers |
|------|-----------|-----------|
| `dist/natca-tokens.css` | CSS custom properties — colors, typography, spacing, radii, shadows, light/dark themes | Everything — WordPress, Vue apps, email templates |
| `dist/natca-components.css` | Buttons, cards, badges, alerts, forms, tables, nav, loading/empty/error/toast states | WordPress theme + Vue apps |
| `dist/theme.json` | WordPress block editor token mapping (colors, fonts, spacing) | WordPress theme only |

### Install (Vue Apps)

```bash
# Add to .npmrc in your project root:
echo "@natca-itc:registry=https://npm.pkg.github.com" >> .npmrc

# Install:
npm install @natca-itc/ui-shell@beta
```

```js
// main.js or main.ts — import BEFORE Vuetify/app styles
import '@natca-itc/ui-shell/tokens'
import '@natca-itc/ui-shell/components'
```

```html
<!-- Set theme on root element -->
<html data-theme="dark">  <!-- authenticated apps -->
<html data-theme="light"> <!-- public/WordPress -->
```

### Install (WordPress)

Copy `dist/natca-tokens.css` and `dist/natca-components.css` into your theme's `assets/css/` directory:

```php
// functions.php
function natca_enqueue_design_system() {
    wp_enqueue_style('natca-tokens', get_template_directory_uri() . '/assets/css/natca-tokens.css', [], '0.1.0-beta.1');
    wp_enqueue_style('natca-components', get_template_directory_uri() . '/assets/css/natca-components.css', ['natca-tokens'], '0.1.0-beta.1');
}
add_action('wp_enqueue_scripts', 'natca_enqueue_design_system');
```

Copy `dist/theme.json` into your theme root to register tokens in the block editor.

## Design Previews

Open these HTML files in a browser — they consume the same `src/` CSS files that the package ships:

### `natca-design-system.html`
Full design token reference and component library covering:
- **Color tokens** — Brand palette (red, navy, blue, sky), neutrals, semantic colors
- **Light + Dark themes** — `data-theme="light"` for public pages, `data-theme="dark"` for authenticated views
- **Typography** — Barlow (display/headings), Inter (body), type scale from 12px-48px
- **Spacing** — 4px base grid system
- **Components** — Buttons (primary, secondary, danger, ghost, accent), cards, badges, alerts, form elements, data tables
- **Loading states** — Skeletons, spinners, progress bars
- **Feedback** — Toasts, empty states, error pages, inline errors
- **Navigation** — Two-tier pattern (utility bar + primary nav) with dropdowns

### `natca-header-variants.html`
Navigation design proposals for team review:
- **Option 1 - Classic Refined** — White primary bar, navy utility, red accent border
- **Option 2 - Navy Command** — Full navy primary bar, bold brand presence
- **Option 3 - Red Impact** — Red utility bar, white primary, strong CTA focus
- **Option 4 - Compact Modern** — Single-bar minimal layout with sub-nav
- **Option 5 - Floating Glass** — Glassmorphism nav over hero, modern/editorial feel
- **Auth Option A - Admin Portal Shell** — Full sidebar for admins, light variant for focused admin tasks
- **Auth Option B - Member App Shell** — Horizontal nav for all BUEs, app switcher in system chip

## Brand Tokens (Quick Reference)

| Token | Value | Use |
|-------|-------|-----|
| `--natca-red` | `#CE0E2D` | Primary brand red |
| `--natca-blue` | `#003366` | Primary brand navy/blue |
| `--natca-sky` | `#6AC9FF` | Accent / dark surfaces |

## Theme Architecture

- **Public pages** (`data-theme="light"`) — Light backgrounds, dark text, warm off-white (#FAF9F5)
- **Authenticated views** (`data-theme="dark"`) — Dark navy backgrounds, light text, elevated surfaces

## Architecture Direction

This repo evolves through three phases:

- **Phase 1 (current - BETA):** Extracted CSS tokens + components published as `@natca-itc/ui-shell`. HTML design previews for team review.
- **Phase 2:** `@natca-itc/ui-shell` Vue + Vuetify layout components — shared shell (Auth A admin, Auth B member), app switcher, contextual nav
- **Phase 3:** Module Federation — Hub becomes a unified portal that loads app admin modules at runtime

### Shell Contract (Tentative)

**Shell provides:**
| Concern | Details |
|---------|---------|
| Topbar | Logo, app switcher, notifications, avatar |
| Sidebar / horizontal nav | Renders from app-provided `navItems[]` |
| Contextual second row | Reads route `meta.subNav` or `meta.breadcrumb` |
| Auth context | User, facility, permissions (from Platform) |
| Theme tokens | CSS custom properties, light/dark switching |

**App provides:**
| Concern | Details |
|---------|---------|
| `appId` / `appName` | Identifies the app in the switcher |
| `navItems[]` | Array of `{ label, icon, to }` objects |
| Route `meta.subNav` | Array of sub-links for section roots |
| Route `meta.breadcrumb` | Function returning breadcrumb trail for deep pages |

### WordPress Integration

The NATCA public site (natca.org) consumes the design system through CSS, not Vue components:
- **Tokens:** WordPress theme enqueues `natca-tokens.css` as the first stylesheet
- **Components:** `natca-components.css` provides `.btn`, `.card`, `.alert`, `.badge`, etc.
- **`theme.json`:** Colors appear in the block editor palette, fonts in the typography picker
- **Theme:** WordPress is always `data-theme="light"`. Dark theme is for authenticated Vue apps only

WordPress does NOT use the Vue shell components, app switcher, or auth context.

## Repo Structure

```
natca-ui-shell/
├── src/                         # Source CSS + WordPress theme.json
│   ├── natca-tokens.css         # Design tokens (custom properties)
│   ├── natca-components.css     # Component styles
│   └── theme.json               # WordPress block editor mapping
├── dist/                        # Built output (gitignored, built via npm run build)
├── natca-design-system.html     # Design preview (consumes src/ CSS)
├── natca-header-variants.html   # Nav variant preview (consumes src/ tokens)
├── assets/                      # Logo and static assets
├── build.js                     # Build script (copies src → dist)
├── package.json                 # @natca-itc/ui-shell package config
└── .npmrc                       # GitHub Packages registry config
```

## Updating the Design System

1. Edit files in `src/` (tokens, components, or theme.json)
2. Open HTML preview files in browser to verify changes
3. Run `npm run build` to regenerate `dist/`
4. Bump version in `package.json` (semver + beta tag)
5. `npm publish --tag beta` to GitHub Packages
6. Consuming apps run `npm update @natca-itc/ui-shell` to pull changes

## Where This Fits

| Project | Purpose |
|---------|---------|
| **natca-ui-shell** (this repo) | Design system, tokens, style guide |
| **Platform** | Auth, Supabase, data sync, API services |
| **Hub** | Admin dashboard (Vue 3 + Vuetify) — first consumer |
| **BID** | Facility bid management (Laravel + Vue) |
| **Discord** | Bot — verification, role sync |
| **DMS** | Document management |
| **Pay** | PayChecker — LES parsing |
| **GATS** | Grievance tracking viewer |

## Next Steps

1. ~~Extract CSS into standalone files~~ Done
2. ~~Publish as `@natca-itc/ui-shell` package~~ Done (beta)
3. ~~Integrate into Hub as proof of concept~~ Done
4. Team reviews nav options (1-5) and picks public navigation direction
5. Team reviews auth shell (Option A vs B) for authenticated apps
6. Finalize font decision (Barlow+Inter vs Public Sans vs Outfit+DM Sans)
7. Build Vue layout components (Auth A, Auth B, app switcher) — Phase 2
8. Roll out to remaining apps (BID, DMS, Pay, GATS)
9. WordPress theme build with design system CSS + theme.json
