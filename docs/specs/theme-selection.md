# Theme Selection — Implementation Spec

**ADR:** ADR-002
**Status:** Ready for implementation
**Version:** 0.3.0-beta.1

---

## New files

| File | Purpose |
|------|---------|
| `src/composables/useNatcaTheme.ts` | Theme preference composable |
| `src/components/NatcaThemeToggle.vue` | Standalone select dropdown |

## Modified files

| File | Change |
|------|--------|
| `src/components/NatcaShell.vue` | `data-theme="dark"` → `:data-theme="resolved"` |
| `src/index.ts` | Export `useNatcaTheme`, `NatcaThemeToggle`, `NatcaThemeOption` |
| `src/types/index.ts` | Add `NatcaThemeOption` interface |
| `src/theme/index.ts` | `defaultTheme` → `'natcaLight'` |

---

## Types

```ts
// Open string — 'light' | 'dark' | 'system' | 'glass' | …
// 'system' is the only reserved keyword (not a real Vuetify theme)
type NatcaThemePreference = string

// Per-theme display metadata consumed by NatcaThemeToggle
interface NatcaThemeOption {
  value: string   // theme name, e.g. 'glass'
  label?: string  // display label — defaults to title-cased value
  icon?:  string  // emoji or MDI icon name (e.g. '🪟' or 'mdi-glass-cocktail')
                  // strings starting with 'mdi-' render as <v-icon>; others render as text
}
```

---

## useNatcaTheme()

### Options

```ts
interface NatcaThemeOptions {
  systemLight?: string  // theme when OS is light (default: 'light')
  systemDark?:  string  // theme when OS is dark  (default: 'dark')
}
```

Options are read only on first initialization. Subsequent callers share the singleton and ignore any options passed. To set non-default system mapping, call `useNatcaTheme({ systemDark: 'glass' })` before `NatcaShell` mounts (e.g. in `main.ts`).

### Return value

```ts
{
  preference: Ref<string>           // user's chosen preference, including 'system'
  resolved:   ComputedRef<string>   // concrete active theme name — never 'system'
  isDark:     ComputedRef<boolean>  // resolved === systemDark option value
  setTheme:   (pref: string) => void
}
```

### Behaviour

- **Singleton** — one reactive state shared across all callers.
- **Default** — `preference` starts as `'system'`.
- **System mode** — `window.matchMedia('(prefers-color-scheme: dark)')` listener; updates reactively.
- **Vuetify sync** — on each `resolved` change, sets `useTheme().global.name.value` to the Vuetify theme name: `'light'` → `'natcaLight'`, `'dark'` → `'natcaDark'`, `'glass'` → `'natcaGlass'` (prepend `'natca'` + capitalize).

### Built-in defaults

```ts
const THEME_DEFAULTS: Record<string, NatcaThemeOption> = {
  light:  { value: 'light',  label: 'Light',  icon: '☀️' },
  dark:   { value: 'dark',   label: 'Dark',   icon: '🌙' },
  system: { value: 'system', label: 'System', icon: '💻' },
}
// Unknown names: { label: title-cased value, icon: '🎨' }
```

---

## NatcaThemeToggle

### Props

```ts
{
  themes?:  (string | NatcaThemeOption)[]  // default: ['light', 'dark', 'system']
  label?:   string                          // default: 'Theme'
  density?: 'default' | 'comfortable' | 'compact'  // default: 'compact'
}
```

### Events

```ts
emit('change', preference: string)  // app uses this to persist
```

### Internals

- Wraps `VSelect` — inherits `natcaDefaults` (outlined, compact).
- No local state — reads/writes via `useNatcaTheme()`.
- Plain string entries merge with `THEME_DEFAULTS`, falling back to generic defaults.
- Option object entries override defaults per field.
- Icons: `mdi-*` → `<v-icon>`; anything else → inline text.

### Usage

```vue
<!-- Drop-in, save to localStorage -->
<NatcaThemeToggle @change="pref => localStorage.setItem('natca-theme', pref)" />

<!-- Custom theme list -->
<NatcaThemeToggle
  :themes="['light', 'dark', { value: 'glass', label: 'Glass', icon: '🪟' }, 'system']"
  @change="saveThemePreference"
/>
```

---

## NatcaShell change

```diff
- <div :class="shellClasses" data-theme="dark">
+ <div :class="shellClasses" :data-theme="resolved">
```

```ts
// Add to NatcaShell.vue <script setup>
const { resolved } = useNatcaTheme()
```

---

## Migration — consuming apps

Each app adds to `main.ts` or `App.vue` (before shell mounts):

```ts
import { useNatcaTheme } from '@natca-itc/ui-shell'
const { setTheme } = useNatcaTheme()
setTheme(localStorage.getItem('natca-theme') ?? 'dark')
```

To expose the toggle to users, place `NatcaThemeToggle` in a settings page or profile view.

**Affected apps:** Hub, BID, DMS, Pay, GATS (WordPress unaffected).

---

## Playground

Add a `NatcaThemeToggle` to the admin shell's Components demo page (`/admin/components`) so the toggle can be exercised in both light and dark modes during development.
