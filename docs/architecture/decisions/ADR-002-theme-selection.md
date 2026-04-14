# ADR-002: User-Controlled Theme Selection (Light / Dark / System)

## Status
Accepted

## Date
2026-04-14

## Context
All authenticated NATCA apps (Hub, BID, DMS, Pay, GATS) hard-code the dark theme by relying on `NatcaShell`'s `data-theme="dark"` attribute. There is no way for users to choose their preferred theme, and no way to respect OS-level dark/light mode preferences.

The design system already has fully specified `natcaLight` and `natcaDark` Vuetify themes plus matching `[data-theme]` CSS token blocks. The infrastructure for both themes exists — it was just never exposed as a user-controllable setting.

Two constraints shaped this decision:
1. **UI Shell owns the themes** — persistence and storage are entirely the consuming app's concern.
2. **Extensibility** — the solution must not require breaking changes to add future themes (glass, high-contrast, etc.).

## Decision

### 1. Composable-first theme management (`useNatcaTheme`)
A singleton composable manages the active theme preference (`'light' | 'dark' | 'system' | …`). It:
- Resolves `'system'` by watching `window.matchMedia('(prefers-color-scheme: dark)')` reactively
- Syncs the resolved theme to Vuetify's active theme (`'light'` → `'natcaLight'`, etc.)
- Accepts `{ systemLight, systemDark }` options on first initialization for custom system mappings
- Defaults to `'system'` if no preference is set

Apps call `setTheme(savedPreference)` on boot to restore a persisted preference. Where the preference is stored (localStorage, API, cookie) is entirely up to each app.

### 2. Extensible open-string type system
Theme preference is typed as `string` rather than a closed union (`'light' | 'dark'`). Adding a new theme (e.g. `'glass'`) requires no type changes to the UI Shell — only registering a new Vuetify theme definition and a matching CSS `[data-theme]` block.

### 3. Standalone `NatcaThemeToggle` component
A pre-built `VSelect`-wrapped component drops in anywhere (settings page, profile view). It accepts a `themes` prop accepting `(string | NatcaThemeOption)[]` — plain strings use built-in defaults (label, icon); option objects override them per-entry. Apps are not required to use this component.

### 4. `NatcaShell` made theme-aware
The hardcoded `data-theme="dark"` attribute is replaced with `:data-theme="resolved"` from `useNatcaTheme()`. This is the only behavioral change in the shell itself.

## Consequences

### Positive
- Users can choose Light, Dark, or System on any app that exposes `NatcaThemeToggle`
- System mode respects OS preference and updates reactively (e.g. auto-dark at sunset)
- Adding new themes (glass, high-contrast) requires only: a Vuetify theme definition + CSS block + no type changes
- Apps that don't expose the toggle are unaffected beyond needing one `setTheme()` call on boot to preserve their current dark default

### Negative / Migration Required
- **Breaking behavior change** — `NatcaShell` defaults to `'system'` instead of `'dark'` after upgrade
- Every consuming app (Hub, BID, DMS, Pay, GATS) must add one line to `main.ts` or `App.vue`:

  ```ts
  import { useNatcaTheme } from '@natca-itc/ui-shell'
  const { setTheme } = useNatcaTheme()
  setTheme(localStorage.getItem('natca-theme') ?? 'dark')
  ```

### Version bump
`0.2.0-beta.1` → `0.3.0-beta.1`

### Files changed
| File | Change |
|------|--------|
| `src/composables/useNatcaTheme.ts` | **New** — theme preference composable |
| `src/components/NatcaThemeToggle.vue` | **New** — standalone select toggle |
| `src/components/NatcaShell.vue` | `data-theme="dark"` → `:data-theme="resolved"` |
| `src/index.ts` | Export `useNatcaTheme`, `NatcaThemeToggle`, `NatcaThemeOption` |
| `src/types/index.ts` | Add `NatcaThemeOption` interface |
| `src/theme/index.ts` | `defaultTheme` → `'natcaLight'` (composable drives runtime) |
