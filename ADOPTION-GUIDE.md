# NATCA Design System — Adoption Guide

> **BETA / DRAFT** — Package is published but design direction is still under team review. Tokens and component classes may change before v1.0.

## Install

```bash
# 1. Configure GitHub Packages registry (one-time, in project .npmrc)
echo "@natca-itc:registry=https://npm.pkg.github.com" >> .npmrc

# 2. Install the package
npm install @natca-itc/ui-shell@beta
```

## Vue App Setup

```js
// main.js or main.ts — import BEFORE Vuetify or app-specific styles
import '@natca-itc/ui-shell/tokens'
import '@natca-itc/ui-shell/components'
```

```html
<!-- index.html — set theme on root element -->
<html data-theme="dark">   <!-- authenticated/member apps -->
<html data-theme="light">  <!-- public-facing pages -->
```

## WordPress Setup

Copy CSS files from `node_modules/@natca-itc/ui-shell/dist/` into your theme:

```php
// functions.php
function natca_enqueue_design_system() {
    wp_enqueue_style('natca-tokens', get_template_directory_uri() . '/assets/css/natca-tokens.css', [], '0.1.0-beta.1');
    wp_enqueue_style('natca-components', get_template_directory_uri() . '/assets/css/natca-components.css', ['natca-tokens'], '0.1.0-beta.1');
}
add_action('wp_enqueue_scripts', 'natca_enqueue_design_system');
```

Copy `dist/theme.json` into your theme root for block editor token support.

WordPress is always `data-theme="light"` — dark theme is for authenticated Vue apps only.

## Rules

1. Import `natca-tokens.css` as the first stylesheet (before components, before app styles)
2. Import `natca-components.css` second (it depends on tokens)
3. Replace all hardcoded colors with CSS token variables (e.g. `var(--natca-blue)`)
4. Apply `data-theme="light"` to `<html>` for public pages
5. Apply `data-theme="dark"` to `<html>` for authenticated/member/admin pages
6. Use `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-accent` for all buttons
7. Use `.card`, `.card--accent`, `.card--alert` for content panels
8. Use `.badge-*` for status indicators
9. Use `.ds-table` for all data tables
10. Use `.alert-*` for system messages
11. Use `.form-input`, `.form-label`, `.form-select`, `.form-textarea` for all forms
12. Replace `font-family` declarations with `var(--font-display)` or `var(--font-body)`
13. Navigation must use the two-tier pattern: `.nav-utility` (top dark) + `.nav-primary` (sticky)
14. Use `.skeleton-*` for loading placeholders, `.spinner` for action loading, `.progress-bar` for uploads/sync
15. Use `.empty-state` for empty lists/tables — always include a message and action when possible
16. Use `.error-page` for 403/404/500, `.error-inline` for component-level failures with retry
17. Use `.toast--success/error/warning/info` for transient feedback — errors persist, all others auto-dismiss at 5s

## Do NOT

- Hardcode any hex values — always use CSS tokens
- Use inline styles for color, font, or spacing
- Introduce new color variables — use the existing token set
- Change the token file — only consume it
- Import `natca-components.css` without `natca-tokens.css` — components depend on tokens

## Updating

When a new version is published:

```bash
npm update @natca-itc/ui-shell
```

For WordPress, re-copy the CSS files from `dist/` and bump the version in the enqueue call.
