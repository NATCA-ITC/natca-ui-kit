# UI Shell Architecture

## Overview

`@natca-itc/ui-shell` is the shared design system and component library for all NATCA web properties. It wraps Vuetify and exports a unified theme, shell layout components, and shared business components.

## Package Layers

| Layer | Export Path | Consumers |
|-------|------------|-----------|
| CSS Tokens | `@natca-itc/ui-shell/tokens` | All (Vuetify apps, WordPress, static) |
| Vuetify Theme Preset | `import { natcaVuetifyTheme, natcaDefaults }` | Vuetify apps only |
| Shell Components | `import { NatcaShell, NatcaTopBar, ... }` | Vuetify apps only |
| Shared Components | `import { NatcaTabs, NatcaMemberCard }` | Vuetify apps only |
| Standalone CSS | `@natca-itc/ui-shell/components` | WordPress, static HTML — NOT Vuetify apps |
| WordPress theme.json | `@natca-itc/ui-shell/theme.json` | WordPress block editor |

## Vuetify Integration Strategy

UI Shell does NOT replace Vuetify — it wraps it:

- **Tokens CSS** provides design values as CSS custom properties
- **Vuetify theme preset** maps those tokens into Vuetify's `createVuetify()` config
- **natcaDefaults** sets component-level defaults (compact density, rounded corners, etc.)
- **Shared components** wrap Vuetify components internally (v-tabs, v-card, v-avatar) and expose a simplified NATCA-specific API

Apps should use Vuetify components directly for standard UI (buttons, forms, dialogs, tables). They should use ui-shell components for:
- Shell layout (NatcaShell, NatcaTopBar, NatcaSidebar, NatcaTabNav)
- Cross-app patterns (NatcaTabs, NatcaMemberCard)

## Shell Contract

**Shell provides:** topbar, tab navigation, sidebar, breadcrumbs, search drawer, app switcher, theme

**App provides via props:**
- `appId` / `appName` — identifies the app in the switcher
- `tabs: NatcaTab[]` — top-level navigation tabs
- `sidebarSections?: NatcaNavSection[]` — sidebar nav (omit for no sidebar)
- `breadcrumbs?: NatcaBreadcrumb[]` — contextual breadcrumb trail (from route meta)
- `user: NatcaUser` — current user info for avatar/menu
- `apps?: NatcaApp[]` — apps available in the switcher

## Theme Architecture

- **Light theme (`natcaLight`):** Public-facing pages, WordPress
- **Dark theme (`natcaDark`):** All authenticated/member views (default)
- Compact density enforced globally for auth'd pages
- Brand: Red #CE0E2D, Navy #003366, Sky #6AC9FF
- Fonts: Barlow 600 (display), Public Sans (body)

## Build Pipeline

- `npm run build:css` — copies `src/css/` + `src/theme.json` to `dist/`
- `npm run build:vue` — Vite library build: `src/index.ts` → `dist/vue/natca-ui-shell.js` + `.css`
- Externals: vue, vue-router, vuetify (peer deps, not bundled)

## Consuming App Setup

```ts
import { createVuetify } from 'vuetify'
import { natcaVuetifyTheme, natcaDefaults } from '@natca-itc/ui-shell'
import '@natca-itc/ui-shell/tokens'

const vuetify = createVuetify({
  theme: natcaVuetifyTheme,
  defaults: natcaDefaults,
})
```

## Key Files

| Path | Purpose |
|------|---------|
| `src/theme/index.ts` | Vuetify theme definitions + defaults |
| `src/components/NatcaShell.vue` | Main shell orchestrator |
| `src/components/NatcaTabs.vue` | Shared tabs (wraps v-tabs) |
| `src/components/NatcaMemberCard.vue` | Member display card (wraps v-card) |
| `src/composables/useShellState.ts` | Reactive shell UI state |
| `src/types/index.ts` | All TypeScript interfaces |
| `src/css/natca-tokens.css` | Design token definitions |
| `src/css/natca-components.css` | Standalone component CSS (non-Vuetify) |
