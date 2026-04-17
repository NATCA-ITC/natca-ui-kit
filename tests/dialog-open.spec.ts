import { test } from '@playwright/test'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const BASE = 'http://localhost:1310'
const OUT = resolve(__dirname, '../TEMP/visual-audit')

for (const theme of ['dark', 'light'] as const) {
  test(`dialog-confirm-open-${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto(`${BASE}/admin/design-standards`)
    await page.evaluate((t) => localStorage.setItem('natca-theme', t), theme)
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    // Click the "Open Confirm Dialog" button
    await page.getByRole('button', { name: 'Open Confirm Dialog' }).click()
    await page.waitForTimeout(400)
    await page.screenshot({ path: `${OUT}/dialog-confirm-${theme}.png`, fullPage: false })
  })

  test(`dialog-danger-open-${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto(`${BASE}/admin/design-standards`)
    await page.evaluate((t) => localStorage.setItem('natca-theme', t), theme)
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    await page.getByRole('button', { name: 'Open Danger Dialog' }).click()
    await page.waitForTimeout(400)
    await page.screenshot({ path: `${OUT}/dialog-danger-${theme}.png`, fullPage: false })
  })
}
