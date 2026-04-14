# Theme Selection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `useNatcaTheme()` composable, `NatcaThemeToggle` component, and wire `NatcaShell` to support user-controlled Light / Dark / System theme selection.

**Architecture:** A module-level singleton composable (`useNatcaTheme`) holds reactive preference state and watches the OS `prefers-color-scheme` media query. `NatcaShell` owns the Vuetify sync — it watches `resolved` and sets `useTheme().global.name.value`. This keeps the composable free of Vuetify's injection requirements. `NatcaThemeToggle` is a standalone `VSelect` wrapper that reads/writes via the composable.

**Tech Stack:** Vue 3 composition API, Vuetify 3 (`useTheme`), TypeScript, Vite (dev server at :1310). No test framework — verification is TypeScript (`vue-tsc --noEmit`) + playground manual testing + `npm run build`.

**Spec:** `docs/specs/theme-selection.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/types/index.ts` | Modify | Add `NatcaThemeOption` interface |
| `src/composables/useNatcaTheme.ts` | Create | Singleton preference state + OS media query watching |
| `src/components/NatcaShell.vue` | Modify | Replace `data-theme="dark"`, add Vuetify sync watch |
| `src/components/NatcaThemeToggle.vue` | Create | Standalone select dropdown using composable |
| `src/theme/index.ts` | Modify | Change `defaultTheme` from `'natcaDark'` to `'natcaLight'` |
| `src/index.ts` | Modify | Export `useNatcaTheme`, `NatcaThemeToggle`, `NatcaThemeOption` |
| `playground/pages/ComponentsPage.vue` | Modify | Add `NatcaThemeToggle` demo section |

---

## Task 1: Add NatcaThemeOption type

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Add the interface**

Open `src/types/index.ts`. Add after the existing imports at the top of the file:

```ts
export interface NatcaThemeOption {
  value: string   // theme name, e.g. 'glass'
  label?: string  // display label — defaults to title-cased value
  icon?:  string  // emoji or MDI icon name ('mdi-*' renders as <v-icon>, else inline text)
}
```

- [ ] **Step 2: Typecheck**

```bash
cd /Users/user/src/itc/ui-shell/light-mode
npx vue-tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add NatcaThemeOption type"
```

---

## Task 2: Create useNatcaTheme composable

**Files:**
- Create: `src/composables/useNatcaTheme.ts`

This composable is intentionally free of Vuetify imports — Vuetify sync is handled by `NatcaShell` (Task 3). This avoids `inject()` constraints when `setTheme()` is called from `main.ts`.

- [ ] **Step 1: Create the file**

Create `src/composables/useNatcaTheme.ts` with this content:

```ts
import { ref, computed, readonly } from 'vue'

interface NatcaThemeOptions {
  systemLight?: string
  systemDark?:  string
}

// ── Singleton state ──

const _preference = ref('system')
let _systemLight = 'light'
let _systemDark  = 'dark'
const _osDark    = ref(false)
let _initialized = false

export const resolvedTheme = computed(() =>
  _preference.value === 'system'
    ? (_osDark.value ? _systemDark : _systemLight)
    : _preference.value
)

// ── Composable ──

export function useNatcaTheme(options?: NatcaThemeOptions) {
  if (!_initialized) {
    _initialized = true
    if (options?.systemLight) _systemLight = options.systemLight
    if (options?.systemDark)  _systemDark  = options.systemDark

    if (typeof window !== 'undefined') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)')
      _osDark.value = mql.matches
      mql.addEventListener('change', e => { _osDark.value = e.matches })
    }
  }

  return {
    preference: readonly(_preference),
    resolved:   resolvedTheme,
    isDark:     computed(() => resolvedTheme.value === _systemDark),
    setTheme(pref: string) { _preference.value = pref },
  }
}
```

- [ ] **Step 2: Typecheck**

```bash
npx vue-tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/composables/useNatcaTheme.ts
git commit -m "feat: add useNatcaTheme singleton composable"
```

---

## Task 3: Wire NatcaShell to use resolved theme

**Files:**
- Modify: `src/components/NatcaShell.vue`

`NatcaShell` now owns the Vuetify sync — it watches `resolvedTheme` and calls `useTheme()` (Vuetify), which is safe here because `NatcaShell` is always in a component setup context.

- [ ] **Step 1: Update the script block**

In `src/components/NatcaShell.vue`, replace:

```ts
import { computed, watch } from 'vue'
import { useShellState } from '../composables/useShellState'
```

with:

```ts
import { computed, watch } from 'vue'
import { useTheme } from 'vuetify'
import { useShellState } from '../composables/useShellState'
import { resolvedTheme } from '../composables/useNatcaTheme'
```

Then add this block after the existing `const { state, closeSearch, closeAppSwitcher } = useShellState()` line:

```ts
const vuetifyTheme = useTheme()

// Sync resolved NATCA theme → Vuetify active theme
// 'light' → 'natcaLight', 'dark' → 'natcaDark', 'glass' → 'natcaGlass', etc.
watch(
  resolvedTheme,
  (theme) => {
    vuetifyTheme.global.name.value = `natca${theme.charAt(0).toUpperCase()}${theme.slice(1)}`
  },
  { immediate: true }
)
```

- [ ] **Step 2: Update the template attribute**

In the `<template>` block, replace:

```html
<div
  :class="shellClasses"
  data-theme="dark"
  @click="handleShellClick"
>
```

with:

```html
<div
  :class="shellClasses"
  :data-theme="resolvedTheme"
  @click="handleShellClick"
>
```

- [ ] **Step 3: Start playground and verify**

```bash
npm run dev
```

Open http://localhost:1310. The shell should render. If your OS is dark-mode, the dark theme should be active (same as before). If your OS is light-mode, you'll see the light theme — this is correct.

Check the browser DevTools: the root `.natca-shell` div should have `data-theme="light"` or `data-theme="dark"` (not hardcoded `dark`).

- [ ] **Step 4: Typecheck**

```bash
npx vue-tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/NatcaShell.vue
git commit -m "feat: wire NatcaShell to useNatcaTheme, sync Vuetify on resolved change"
```

---

## Task 4: Create NatcaThemeToggle component

**Files:**
- Create: `src/components/NatcaThemeToggle.vue`

- [ ] **Step 1: Create the component**

Create `src/components/NatcaThemeToggle.vue`:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { VSelect, VIcon } from 'vuetify/components'
import { useNatcaTheme } from '../composables/useNatcaTheme'
import type { NatcaThemeOption } from '../types'

const props = withDefaults(defineProps<{
  themes?:  (string | NatcaThemeOption)[]
  label?:   string
  density?: 'default' | 'comfortable' | 'compact'
}>(), {
  themes:  () => ['light', 'dark', 'system'],
  label:   'Theme',
  density: 'compact',
})

const emit = defineEmits<{
  change: [preference: string]
}>()

const THEME_DEFAULTS: Record<string, NatcaThemeOption> = {
  light:  { value: 'light',  label: 'Light',  icon: '☀️' },
  dark:   { value: 'dark',   label: 'Dark',   icon: '🌙' },
  system: { value: 'system', label: 'System', icon: '💻' },
}

function toOption(entry: string | NatcaThemeOption): Required<NatcaThemeOption> {
  const base = typeof entry === 'string' ? { value: entry } : entry
  const defaults = THEME_DEFAULTS[base.value] ?? {
    value: base.value,
    label: base.value.charAt(0).toUpperCase() + base.value.slice(1),
    icon: '🎨',
  }
  return {
    value: base.value,
    label: base.label ?? defaults.label,
    icon:  base.icon  ?? defaults.icon,
  }
}

const items = computed(() => props.themes.map(toOption))

const { preference, setTheme } = useNatcaTheme()

const selected = computed({
  get: () => preference.value,
  set: (val: string) => {
    setTheme(val)
    emit('change', val)
  },
})
</script>

<template>
  <VSelect
    v-model="selected"
    :label="label"
    :items="items"
    item-value="value"
    item-title="label"
    :density="density"
    variant="outlined"
  >
    <template #item="{ item, props: itemProps }">
      <v-list-item v-bind="itemProps">
        <template #prepend>
          <VIcon v-if="item.raw.icon?.startsWith('mdi-')" :icon="item.raw.icon" size="small" class="mr-2" />
          <span v-else class="mr-2" style="font-size: 14px; line-height: 1;">{{ item.raw.icon }}</span>
        </template>
      </v-list-item>
    </template>
    <template #selection="{ item }">
      <span style="display: flex; align-items: center; gap: 6px;">
        <VIcon v-if="item.raw.icon?.startsWith('mdi-')" :icon="item.raw.icon" size="small" />
        <span v-else style="font-size: 14px; line-height: 1;">{{ item.raw.icon }}</span>
        {{ item.raw.label }}
      </span>
    </template>
  </VSelect>
</template>
```

- [ ] **Step 2: Typecheck**

```bash
npx vue-tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/NatcaThemeToggle.vue
git commit -m "feat: add NatcaThemeToggle standalone select component"
```

---

## Task 5: Update exports

**Files:**
- Modify: `src/index.ts`

- [ ] **Step 1: Add new exports**

In `src/index.ts`, add `NatcaThemeToggle` to the existing component imports block at the top of the file. Replace:

```ts
// Shared Vuetify-wrapped components
import NatcaTabs from './components/NatcaTabs.vue'
import NatcaMemberCard from './components/NatcaMemberCard.vue'
```

with:

```ts
// Shared Vuetify-wrapped components
import NatcaTabs from './components/NatcaTabs.vue'
import NatcaMemberCard from './components/NatcaMemberCard.vue'

// Theme components
import NatcaThemeToggle from './components/NatcaThemeToggle.vue'
```

Then replace:

```ts
// Shared components
export {
  NatcaTabs,
  NatcaMemberCard,
}
```

with:

```ts
// Shared components
export {
  NatcaTabs,
  NatcaMemberCard,
}

// Theme components
export { NatcaThemeToggle }
```

Then replace:

```ts
// Composables
export { useShellState } from './composables/useShellState'
```

with:

```ts
// Composables
export { useShellState } from './composables/useShellState'
export { useNatcaTheme } from './composables/useNatcaTheme'
```

Also add `NatcaThemeToggle` to the plugin installer. Replace:

```ts
export const NatcaUiShell = {
  install(app: App) {
    // Shell
    app.component('NatcaShell', NatcaShell)
    app.component('NatcaTopBar', NatcaTopBar)
    app.component('NatcaTabNav', NatcaTabNav)
    app.component('NatcaBreadcrumbRow', NatcaBreadcrumbRow)
    app.component('NatcaSidebar', NatcaSidebar)
    app.component('NatcaSearchDrawer', NatcaSearchDrawer)
    app.component('NatcaAppSwitcher', NatcaAppSwitcher)
    // Shared components
    app.component('NatcaTabs', NatcaTabs)
    app.component('NatcaMemberCard', NatcaMemberCard)
  },
}
```

with:

```ts
export const NatcaUiShell = {
  install(app: App) {
    // Shell
    app.component('NatcaShell', NatcaShell)
    app.component('NatcaTopBar', NatcaTopBar)
    app.component('NatcaTabNav', NatcaTabNav)
    app.component('NatcaBreadcrumbRow', NatcaBreadcrumbRow)
    app.component('NatcaSidebar', NatcaSidebar)
    app.component('NatcaSearchDrawer', NatcaSearchDrawer)
    app.component('NatcaAppSwitcher', NatcaAppSwitcher)
    // Shared components
    app.component('NatcaTabs', NatcaTabs)
    app.component('NatcaMemberCard', NatcaMemberCard)
    // Theme
    app.component('NatcaThemeToggle', NatcaThemeToggle)
  },
}
```

Also export `NatcaThemeOption` from the types re-export — it is already covered by `export * from './types'` since we added it to `src/types/index.ts` in Task 1.

- [ ] **Step 2: Typecheck**

```bash
npx vue-tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/index.ts
git commit -m "feat: export useNatcaTheme and NatcaThemeToggle from package"
```

---

## Task 6: Update Vuetify theme default

**Files:**
- Modify: `src/theme/index.ts`

The `defaultTheme` in `natcaVuetifyTheme` no longer matters at runtime — `NatcaShell`'s watch fires immediately and sets the correct theme. Changing it to `'natcaLight'` prevents a flash of dark theme before the composable hydrates in edge cases where NatcaShell is not used.

- [ ] **Step 1: Change the default**

In `src/theme/index.ts`, replace:

```ts
export const natcaVuetifyTheme = {
  defaultTheme: 'natcaDark',
  themes: {
    natcaLight: natcaLightTheme,
    natcaDark: natcaDarkTheme,
  },
} as const
```

with:

```ts
export const natcaVuetifyTheme = {
  defaultTheme: 'natcaLight',
  themes: {
    natcaLight: natcaLightTheme,
    natcaDark: natcaDarkTheme,
  },
} as const
```

Also update the JSDoc comment above it. Replace:

```ts
/**
 * Complete Vuetify theme config — drop into createVuetify().
 *
 * Dark theme is default because authenticated NATCA apps use dark.
 * Public-facing pages (WordPress, marketing) use light.
 */
```

with:

```ts
/**
 * Complete Vuetify theme config — drop into createVuetify().
 *
 * Light is the Vuetify default. Active theme is controlled at runtime
 * by useNatcaTheme() — NatcaShell syncs it on mount via a watch.
 * Apps call setTheme(savedPreference ?? 'dark') on boot to restore preference.
 */
```

- [ ] **Step 2: Typecheck**

```bash
npx vue-tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/theme/index.ts
git commit -m "feat: change natcaVuetifyTheme defaultTheme to natcaLight"
```

---

## Task 7: Add NatcaThemeToggle demo to playground

**Files:**
- Modify: `playground/pages/ComponentsPage.vue`

- [ ] **Step 1: Add the import**

In `playground/pages/ComponentsPage.vue`, add `NatcaThemeToggle` to the existing import:

```ts
import { NatcaTabs, NatcaMemberCard, NatcaThemeToggle } from '@/index'
```

- [ ] **Step 2: Add the section**

In the `<template>` block of `ComponentsPage.vue`, add a new section at the top (before the first existing section):

```html
<!-- Theme Toggle -->
<section class="demo-section">
  <h2 class="demo-heading">Theme Toggle</h2>
  <p class="demo-desc">
    Drop <code>NatcaThemeToggle</code> anywhere. The <code>@change</code> event carries the
    preference string — persist it however your app wants (localStorage, API, etc.).
  </p>

  <div style="display: flex; gap: 24px; flex-wrap: wrap; align-items: flex-start;">
    <div style="width: 200px;">
      <NatcaThemeToggle
        @change="pref => console.log('theme changed to:', pref)"
      />
    </div>

    <div style="width: 220px;">
      <NatcaThemeToggle
        label="Appearance"
        :themes="[
          'light',
          'dark',
          { value: 'system', label: 'Match OS', icon: '💻' },
        ]"
        @change="pref => console.log('theme changed to:', pref)"
      />
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify in playground**

```bash
npm run dev
```

Open http://localhost:1310/admin/components. You should see a "Theme Toggle" section with two `NatcaThemeToggle` selects. Switching between Light / Dark / System should:
- Update the `data-theme` attribute on the `.natca-shell` div (check DevTools)
- Update the Vuetify theme (background color, surface color, text color all change)
- Log the preference to the browser console

Test all three options in both selects.

- [ ] **Step 4: Typecheck**

```bash
npx vue-tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add playground/pages/ComponentsPage.vue
git commit -m "feat: add NatcaThemeToggle demo to playground ComponentsPage"
```

---

## Task 8: Full build verification

- [ ] **Step 1: Run the full build**

```bash
npm run build
```

Expected: build completes with no errors. Check that `dist/vue/natca-ui-shell.js` and type declarations exist.

- [ ] **Step 2: Verify exports are present in dist**

```bash
grep -l "useNatcaTheme\|NatcaThemeToggle" dist/vue/natca-ui-shell.js
```

Expected: the file contains both symbols.

- [ ] **Step 3: Final typecheck**

```bash
npx vue-tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: verify theme selection build passes"
```

Only commit if there are actually unstaged changes. If nothing changed, skip this step.
