# ADR-001: Wrap Vuetify Rather Than Replace It

## Status
Accepted

## Date
2026-04-09

## Context
All MyNATCA apps (Hub, BID, DMS, Pay, GATS) use Vuetify 3 as their component library. The UI Shell design system started as standalone CSS (Phase 1) and needs to evolve into a shared Vue component package (Phase 2).

Two approaches were considered:
1. **Replace Vuetify** — build a fully custom component library from scratch using only NATCA design tokens
2. **Wrap Vuetify** — keep Vuetify as the component foundation, export a shared theme preset and higher-level components that wrap Vuetify internally

## Decision
Wrap Vuetify. UI Shell exports:
- A Vuetify theme preset (`natcaVuetifyTheme`, `natcaDefaults`) that apps pass to `createVuetify()`
- Shell layout components (NatcaShell, NatcaTopBar, etc.) that use Vuetify's `v-icon` and CSS custom properties
- Shared business components (NatcaTabs, NatcaMemberCard) that wrap Vuetify components (`v-tabs`, `v-card`, `v-avatar`, `v-chip`) with NATCA-specific props and styling

Apps continue to use Vuetify components directly for standard UI (buttons, forms, dialogs, data tables). They use ui-shell components for shell layout and cross-app patterns.

## Consequences

### Positive
- No component-building effort for data tables, form validation, date pickers, autocomplete, dialogs, etc.
- Accessibility (keyboard nav, ARIA, focus management) handled by Vuetify
- Ongoing security/bug fixes from Vuetify's maintainer community
- Apps can upgrade incrementally — existing Vuetify usage continues to work
- Small team doesn't take on indefinite component maintenance burden

### Negative
- Tied to Vuetify's release cycle and breaking changes
- Vuetify's default styling (hover overlays, density, padding) requires overrides for NATCA's compact dark theme
- Dual styling concern: standalone CSS (`natca-components.css`) for WordPress, Vuetify theme for Vue apps

### Mitigations
- `natcaDefaults` enforces compact density globally, killing Vuetify's spacious defaults
- Shared components override Vuetify's `v-btn__overlay` and other visual quirks for dark theme
- Standalone CSS is clearly documented as "non-Vuetify pages only" — Vuetify apps never load it
