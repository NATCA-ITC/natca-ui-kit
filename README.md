# NATCA UI Shell

> **Status: Phase 2 BETA** — Vuetify theme preset, Vue shell components, and shared business components published as `@natca-itc/ui-shell@0.2.0-beta.2`.

Design system, shared Vuetify theme, and component library for all NATCA web properties. Single source of truth for visual direction, design tokens, shell layout, and cross-app components.

## Install

```bash
# .npmrc (one-time)
echo "@natca-itc:registry=https://npm.pkg.github.com" >> .npmrc

# Install
npm install @natca-itc/ui-shell@beta
```

## Setup (Vuetify Apps)

```ts
// main.ts
import { createVuetify } from 'vuetify'
import { natcaVuetifyTheme, natcaDefaults } from '@natca-itc/ui-shell'
import '@natca-itc/ui-shell/tokens'

const vuetify = createVuetify({
  theme: natcaVuetifyTheme,
  defaults: natcaDefaults,
})
```

```vue
<!-- App.vue -->
<script setup>
import { NatcaShell } from '@natca-itc/ui-shell'
</script>

<template>
  <NatcaShell
    app-id="hub"
    app-name="Hub"
    :tabs="tabs"
    :user="user"
    :apps="apps"
  >
    <router-view />
  </NatcaShell>
</template>
```

## What Ships

### For Vuetify Apps (Hub, BID, DMS, Pay, GATS)

| Export | Import | Purpose |
|--------|--------|---------|
| Theme preset | `import { natcaVuetifyTheme, natcaDefaults }` | Shared Vuetify theme config — drop into `createVuetify()` |
| Color palette | `import { natcaColors }` | Brand colors as JS object (for charts, canvas, dynamic styles) |
| Shell components | `import { NatcaShell, NatcaTopBar, ... }` | App shell layout — topbar, tabs, sidebar, breadcrumbs, app switcher |
| Shared components | `import { NatcaTabs, NatcaMemberCard }` | Cross-app Vuetify-wrapped components |
| Composable | `import { useShellState }` | Reactive shell UI state (sidebar, search, etc.) |
| Types | `import type { NatcaTab, NatcaUser, ... }` | TypeScript interfaces |
| Tokens CSS | `import '@natca-itc/ui-shell/tokens'` | CSS custom properties |

### For WordPress / Static Pages

| Export | Import | Purpose |
|--------|--------|---------|
| Tokens CSS | `@natca-itc/ui-shell/tokens` | CSS custom properties (colors, type, spacing) |
| Components CSS | `@natca-itc/ui-shell/components` | Standalone component styles (buttons, cards, tabs, etc.) |
| theme.json | `@natca-itc/ui-shell/theme.json` | WordPress block editor token mapping |

**Important:** Vuetify apps should NOT import `components` CSS — it conflicts with Vuetify's own styles.

## Shell Components

| Component | Purpose |
|-----------|---------|
| `NatcaShell` | Main orchestrator — composes all shell elements |
| `NatcaTopBar` | Logo, wordmark, app chip, facility badge, search, notifications, user avatar/menu |
| `NatcaTabNav` | Shell-level tab navigation (router-linked) |
| `NatcaSidebar` | Collapsible left sidebar with sections and nav items |
| `NatcaBreadcrumbRow` | Breadcrumb trail with hamburger toggle |
| `NatcaSearchDrawer` | Slide-in search panel |
| `NatcaAppSwitcher` | Cross-app navigation dropdown |

## Shared Components

| Component | Wraps | Purpose |
|-----------|-------|---------|
| `NatcaTabs` | `v-tabs` / `v-tab` / `v-window` | Tabs with router or v-model mode, default + pills variants |
| `NatcaMemberCard` | `v-card` / `v-avatar` / `v-chip` | Member display card — default, compact, detailed variants |

## Theme

| Theme | Use | Default? |
|-------|-----|----------|
| `natcaDark` | Authenticated/member views | Yes |
| `natcaLight` | Public-facing pages, WordPress | No |

Both themes map the same brand tokens:
- **Red:** #CE0E2D
- **Navy:** #003366
- **Sky:** #6AC9FF
- **Fonts:** Barlow 600 (display) + Public Sans (body)

`natcaDefaults` enforces compact density globally for all components.

## Development

```bash
npm run dev            # Playground at http://localhost:1310
npm run build          # Build CSS + Vue library
npm publish --tag beta # Publish to GitHub Packages
```

Playground demos:
- `/admin` — Hub admin shell (sidebar + tabs + breadcrumbs)
- `/member` — BID member shell (tabs only)
- `/minimal` — PayChecker minimal shell
- `/admin/components` — NatcaTabs + NatcaMemberCard demos

## Design Previews (Static HTML)

- `natca-design-system.html` — Full token reference + standalone component library
- `natca-header-variants.html` — Public nav options + auth shell options

## Architecture

See [docs/agent_docs/architecture.md](docs/agent_docs/architecture.md) for full details.

See [ADR-001: Wrap Vuetify Rather Than Replace It](docs/architecture/decisions/ADR-001-vuetify-wrapping.md).

## Repo Structure

```
natca-ui-shell/
├── src/
│   ├── components/       # Vue shell + shared components
│   ├── composables/      # useShellState
│   ├── theme/            # Vuetify theme preset (light, dark, defaults)
│   ├── css/              # Design tokens + standalone component CSS
│   ├── styles/           # Shell layout CSS
│   ├── types/            # TypeScript interfaces
│   └── index.ts          # Package entry point
├── playground/           # Dev environment (:1310)
├── docs/
│   ├── agent_docs/       # Architecture context
│   └── architecture/
│       └── decisions/    # ADRs
├── dist/                 # Built output
├── natca-design-system.html
└── natca-header-variants.html
```
