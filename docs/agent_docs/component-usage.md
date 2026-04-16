# UI Shell Component Usage Guide

Quick reference for building pages in NATCA apps. **Read this before writing any UI code.**

## Setup (every app)

```ts
// plugins/vuetify.ts
import { createVuetify } from 'vuetify'
import { natcaVuetifyTheme, natcaDefaults } from '@natca-itc/ui-shell'
import '@natca-itc/ui-shell/tokens'

export default createVuetify({
  theme: natcaVuetifyTheme,
  defaults: natcaDefaults,   // <-- THIS IS MANDATORY
})
```

```ts
// main.ts
import { useNatcaTheme } from '@natca-itc/ui-shell'
const { setTheme } = useNatcaTheme()
setTheme(localStorage.getItem('natca-theme') ?? 'dark')
```

```vue
<!-- layouts/default.vue -->
<NatcaShell :app-id="..." :app-name="..." :tabs="..." :user="..." />
```

## Rules

### NEVER hardcode colors

| Instead of | Use |
|---|---|
| `style="color: #CE0E2D"` | `color="secondary"` (Vuetify prop) |
| `style="color: #003366"` | `color="primary"` (Vuetify prop) |
| `style="background: #0a0f1a"` | `var(--color-bg-page)` (CSS var) |
| `style="border-color: #2E3347"` | `var(--color-border)` (CSS var) |

**Vuetify color prop mapping:**

| Intent | Prop value | Light | Dark |
|--------|-----------|-------|------|
| Primary action | `color="primary"` | Navy #003366 | Red #CE0E2D |
| Secondary / brand | `color="secondary"` | Red #CE0E2D | Navy #003366 |
| Accent / highlight | `color="accent"` | Sky #6AC9FF | Sky #6AC9FF |
| Success | `color="success"` | #2E7D32 | #66BB6A |
| Warning | `color="warning"` | #A65D00 | #FFA726 |
| Error / danger | `color="error"` | #CE0E2D | #EF5350 |
| Info | `color="info"` | #003366 | #5BA3D9 |

### NEVER hardcode spacing

| Instead of | Use |
|---|---|
| `style="padding: 16px"` | Vuetify class `pa-4` |
| `style="margin-top: 8px"` | Vuetify class `mt-2` |
| `style="gap: 12px"` | Vuetify class `ga-3` or CSS `var(--space-3)` |
| `style="gap: 1.5rem"` | CSS `var(--space-6)` |

Vuetify spacing scale: 1=4px, 2=8px, 3=12px, 4=16px, 5=20px, 6=24px, 8=32px, 10=40px, 12=48px, 16=64px.

### NEVER hardcode fonts

| Instead of | Use |
|---|---|
| `font-family: 'Barlow'` | `var(--font-display)` (headings) |
| `font-family: 'Public Sans'` | `var(--font-body)` (body text) |
| `font-size: 12px` | `var(--text-xs)` |
| `font-size: 13px` | `var(--text-sm)` |
| `font-size: 15px` | `var(--text-base)` |

### NEVER set density or variant manually

`natcaDefaults` handles all of this. Just use the component:

```vue
<!-- WRONG: redundant props already set by natcaDefaults -->
<v-text-field variant="outlined" density="compact" color="primary" label="Email" />

<!-- RIGHT: natcaDefaults already sets outlined/compact/primary -->
<v-text-field label="Email" />
```

### NEVER use !important in app code

If you need `!important` to override a style, the fix belongs in `@natca-itc/ui-shell`, not in the app. File an issue.

## Component Patterns

### Page header

```vue
<div class="d-flex align-center justify-space-between pa-4">
  <div>
    <h2 style="font-family: var(--font-display); font-size: 18px; font-weight: 700;">
      Member Accounts
    </h2>
    <p class="text-medium-emphasis text-body-2">1,247 accounts across all facilities</p>
  </div>
  <v-btn color="primary">Create Account</v-btn>
</div>
```

### Card with actions

```vue
<v-card>
  <v-card-title>Email Account</v-card-title>
  <v-card-subtitle>jason@natca.net</v-card-subtitle>
  <v-card-text>
    <!-- content -->
  </v-card-text>
  <v-card-actions>
    <!-- Buttons here AUTO-SIZE to default (not compact) via natcaDefaults -->
    <v-spacer />
    <v-btn variant="text">Cancel</v-btn>
    <v-btn color="primary">Save Changes</v-btn>
  </v-card-actions>
</v-card>
```

### Data table

```vue
<!-- natcaDefaults sets hover: true, density: 'compact' -->
<v-data-table :headers="headers" :items="items">
  <template #item.status="{ item }">
    <v-chip :color="item.status === 'active' ? 'success' : 'warning'">
      {{ item.status }}
    </v-chip>
  </template>
  <template #item.actions="{ item }">
    <v-btn variant="text" size="small" @click="view(item)">View</v-btn>
  </template>
</v-data-table>
```

### Form in card

```vue
<v-card>
  <v-card-title>Create Account</v-card-title>
  <v-card-text>
    <!-- All fields get outlined/compact/primary automatically -->
    <v-text-field label="Email" />
    <v-select label="Provider" :items="['Mailcow', 'O365']" />
    <v-checkbox label="Send welcome email" />
    <v-switch label="Enable forwarding" />
  </v-card-text>
  <v-card-actions>
    <v-spacer />
    <v-btn variant="text">Cancel</v-btn>
    <v-btn color="primary">Create</v-btn>
  </v-card-actions>
</v-card>
```

### Dialog

```vue
<!-- natcaDefaults: maxWidth 600, inner card gets rounded-lg, elevation 8, no border -->
<v-dialog v-model="showDialog">
  <v-card>
    <v-card-title>Confirm Migration</v-card-title>
    <v-card-text>Are you sure you want to migrate 34 accounts?</v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn variant="text" @click="showDialog = false">Cancel</v-btn>
      <v-btn color="primary" @click="migrate">Migrate Now</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
```

### Status chip

```vue
<!-- natcaDefaults: rounded pill, size small, density compact -->
<v-chip color="success">Active</v-chip>
<v-chip color="warning">Pending</v-chip>
<v-chip color="error">Disabled</v-chip>
<v-chip color="info">Migrating</v-chip>
```

### Alert

```vue
<!-- natcaDefaults: tonal, compact, rounded md, border start -->
<v-alert type="info">Migration batch scheduled for tonight.</v-alert>
<v-alert type="success">47 accounts migrated successfully.</v-alert>
<v-alert type="warning">3 accounts have exceeded quota.</v-alert>
<v-alert type="error">Failed to connect to Mailcow API.</v-alert>
```

### Loading state

```vue
<v-progress-linear :model-value="progress" />
<!-- or indeterminate: -->
<v-progress-linear indeterminate />
<!-- natcaDefaults: color primary, rounded, height 4 -->
```

### Empty state

```vue
<div class="d-flex flex-column align-center pa-10">
  <v-icon size="48" color="disabled" class="mb-3">mdi-file-document-outline</v-icon>
  <h3 style="font-family: var(--font-display);">No accounts found</h3>
  <p class="text-medium-emphasis text-body-2 mb-4">Try adjusting your filters.</p>
  <v-btn variant="text" @click="resetFilters">Reset Filters</v-btn>
</div>
```

### Login / unauthenticated page

```vue
<!-- Use Vuetify theme background, not hardcoded hex -->
<div class="d-flex align-center justify-center" style="min-height: 100vh; background: rgb(var(--v-theme-background));">
  <v-card max-width="440" class="pa-6">
    <v-card-title>Sign In</v-card-title>
    <v-card-text>
      <!-- Auth0 button or form -->
    </v-card-text>
  </v-card>
</div>
```

## Theme Toggle

```vue
<NatcaThemeToggle @change="pref => localStorage.setItem('natca-theme', pref)" />
```

Default options: Light, Dark, System. Customize with `:themes` prop.

## Design Reference

- **Static reference:** Open `natca-design-system.html` in browser (toggle Public/Authenticated)
- **Interactive playground:** Run `npm run dev` in ui-shell repo, visit http://localhost:1310
- **Tokens:** See `src/css/natca-tokens.css` for all CSS custom properties
- **Vuetify defaults:** See `src/theme/index.ts` for all component defaults
