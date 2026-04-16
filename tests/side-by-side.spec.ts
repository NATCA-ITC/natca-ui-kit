import { test } from '@playwright/test'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const BASE = 'http://localhost:1310'
const OUT = resolve(__dirname, '../TEMP/side-by-side')

// Take matched pairs of screenshots — design system auth (reference) vs playground (actual).
// Structured so each pair is side-by-side for visual diff.

const SECTIONS = [
  { name: 'button-tiers', dsTitle: 'Button Tiers', pgTitle: 'Button Tiers' },
  { name: 'cards', dsTitle: 'Cards', pgTitle: 'Cards' },
  { name: 'data-table', dsTitle: 'Data Table', pgTitle: 'Data Table' },
  { name: 'forms', dsTitle: 'Forms', pgTitle: 'Forms' },
  { name: 'alerts', dsTitle: 'Alerts', pgTitle: 'Alerts' },
  { name: 'chips', dsTitle: 'Chips & Status Badges', pgTitle: 'Chips & Status Badges' },
  { name: 'tabs', dsTitle: 'Tabs', pgTitle: 'Tabs' },
  { name: 'states', dsTitle: 'States', pgTitle: 'States' },
  { name: 'dialogs', dsTitle: 'Dialogs', pgTitle: 'Dialogs' },
]

for (const theme of ['dark', 'light'] as const) {
  test(`design-system-sections-${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto(`${BASE}/natca-design-system.html`)
    await page.waitForLoadState('networkidle')
    await page.evaluate((t) => {
      (window as any).setContext('auth');
      (window as any).setTheme(t)
    }, theme)
    await page.waitForTimeout(500)

    for (const section of SECTIONS) {
      const el = page.locator('.auth-only .ds-section').filter({ has: page.locator(`.ds-section-title:text("${section.dsTitle}")`) })
      if (await el.count() > 0) {
        await el.first().screenshot({ path: `${OUT}/${theme}-${section.name}-DS.png` })
      }
    }
  })

  test(`playground-sections-${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto(`${BASE}/admin/design-standards`)
    await page.evaluate((t) => localStorage.setItem('natca-theme', t), theme)
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    for (const section of SECTIONS) {
      const el = page.locator(`section`).filter({ has: page.locator(`h3:text("${section.pgTitle}")`) })
      if (await el.count() > 0) {
        await el.first().screenshot({ path: `${OUT}/${theme}-${section.name}-PG.png` })
      }
    }
  })
}
