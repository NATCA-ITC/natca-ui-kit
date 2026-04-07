# NATCA Design System — Adoption Guide

When refactoring a system to adopt the NATCA Design System, follow these rules.

## Rules

1. Import `natca-design-system.css` as the first stylesheet
2. Replace all hardcoded colors with CSS token variables (e.g. `var(--natca-blue)`)
3. Apply `data-theme="light"` to `<html>` for public pages
4. Apply `data-theme="dark"` to `<html>` for authenticated/member/admin pages
5. Use `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-accent` for all buttons
6. Use `.card`, `.card--accent`, `.card--alert` for content panels
7. Use `.badge-*` for status indicators
8. Use `.ds-table` for all data tables
9. Use `.alert-*` for system messages
10. Use `.form-input`, `.form-label`, `.form-select`, `.form-textarea` for all forms
11. Replace `font-family` declarations with `var(--font-display)` or `var(--font-body)`
12. Navigation must use the two-tier pattern: `.nav-utility` (top dark) + `.nav-primary` (sticky)
13. Use `.skeleton-*` for loading placeholders, `.spinner` for action loading, `.progress-bar` for uploads/sync
14. Use `.empty-state` for empty lists/tables — always include a message and action when possible
15. Use `.error-page` for 403/404/500, `.error-inline` for component-level failures with retry
16. Use `.toast--success/error/warning/info` for transient feedback — errors persist, all others auto-dismiss at 5s

## Do NOT

- Hardcode any hex values — always use CSS tokens
- Use inline styles for color, font, or spacing
- Introduce new color variables — use the existing token set
- Change the token file — only consume it
