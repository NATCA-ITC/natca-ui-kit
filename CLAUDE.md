# NATCA UI Kit

Design system and style guide for all NATCA web properties.

## Project Context

- **Status:** Draft — design proposals, not production code yet
- **Org:** NATCA-ITC
- **Repo:** `NATCA-ITC/natca-ui-kit`
- **Purpose:** Single source of truth for visual direction, design tokens, component patterns, and navigation architecture across all MyNATCA apps

## What This Repo Contains

Static HTML design documents (no build step):
- `natca-design-system.html` — Full token reference + component library (colors, typography, spacing, buttons, cards, badges, alerts, forms, tables, light/dark themes)
- `natca-header-variants.html` — 5 public nav options + 2 authenticated shell options for team review

## Relationship to Other Projects

This repo defines the visual language that all other MyNATCA apps should follow:
- **Platform** owns auth and data — UI Kit owns the look
- **Hub, BID, DMS, Pay, GATS** should consume tokens from this design system
- Tokens use CSS custom properties with `data-theme` attribute for light/dark switching

## Key Design Decisions

- **Fonts:** Outfit/Barlow (display), DM Sans/Inter (body)
- **Light theme:** Public-facing pages (`data-theme="light"`)
- **Dark theme:** Authenticated/member views (`data-theme="dark"`)
- **Brand colors:** Red (#CB092F), Navy (#032449), Blue (#1490D7), Sky (#6AC9FF)

## Rules

- Do not add build tooling until the team has finalized design direction
- Keep HTML files self-contained — they're meant to be opened directly in a browser
- Any token changes here should be propagated to consuming apps once finalized
