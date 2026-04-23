import { test, expect } from '@playwright/test'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const BASE = 'http://localhost:1310'
const SCREENSHOTS = resolve(__dirname, '../TEMP/responsive-tabnav')

const viewports = [
  { name: 'iphone-12-pro', width: 390, height: 844 },
  { name: 'iphone-se', width: 375, height: 667 },
  { name: 'pixel-5', width: 393, height: 851 },
  { name: 'ipad-mini', width: 768, height: 1024 },
  { name: 'ipad-pro', width: 1024, height: 1366 },
  { name: 'desktop-small', width: 1280, height: 800 },
  { name: 'desktop-wide', width: 1920, height: 1080 },
]

test.describe('Responsive Tab Nav', () => {
  for (const vp of viewports) {
    test(`${vp.name} (${vp.width}x${vp.height}) — no horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto(`${BASE}/admin`)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1200)

      // Shell should not cause horizontal scroll
      const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth)
      const bodyClientWidth = await page.evaluate(() => document.body.clientWidth)
      expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 1) // 1px tolerance

      // Tab bar: visible tabs (including More if shown) must not extend past container
      const tabsFit = await page.evaluate(() => {
        const container = document.querySelector('.natca-shell-tabs') as HTMLElement
        if (!container) return true
        const containerRight = container.getBoundingClientRect().right
        const children = container.querySelectorAll(':scope > *')
        for (const child of children) {
          if (child.getBoundingClientRect().right > containerRight + 2) return false
        }
        return true
      })
      expect(tabsFit).toBe(true)

      // Topbar clips content on narrow viewports (overflow:hidden) — that's fine.
      // What matters is that nothing causes page-level horizontal scroll (already tested above).

      // Screenshot
      await page.screenshot({
        path: `${SCREENSHOTS}/${vp.name}-admin.png`,
        fullPage: false,
      })
    })

    test(`${vp.name} — More button appears only when needed`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto(`${BASE}/admin`)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1200)

      const moreButton = page.locator('.natca-shell-tab-more')
      const visibleTabs = page.locator('.natca-shell-tabs > .natca-shell-tab')

      if (vp.width < 768) {
        // On narrow viewports with 9 tabs, More should be visible
        await expect(moreButton).toBeVisible()

        // Click More → dropdown appears
        await moreButton.click()
        const dropdown = page.locator('.natca-shell-tab-dropdown')
        await expect(dropdown).toBeVisible()

        // Dropdown has items
        const dropdownItems = page.locator('.natca-shell-tab-dropdown-item')
        expect(await dropdownItems.count()).toBeGreaterThan(0)

        // Screenshot with dropdown open
        await page.screenshot({
          path: `${SCREENSHOTS}/${vp.name}-more-open.png`,
          fullPage: false,
        })

        // Click a dropdown link → closes
        await dropdownItems.first().click()
        await expect(dropdown).not.toBeVisible()
      } else {
        // On wide viewports — verify visible tabs don't extend past container
        const tabsFit = await page.evaluate(() => {
          const container = document.querySelector('.natca-shell-tabs') as HTMLElement
          if (!container) return true
          const containerRight = container.getBoundingClientRect().right
          const children = container.querySelectorAll(':scope > *')
          for (const child of children) {
            if (child.getBoundingClientRect().right > containerRight + 2) return false
          }
          return true
        })
        expect(tabsFit).toBe(true)
      }
    })
  }

  // Mobile-specific checks
  test('iphone-12-pro — no breadcrumb hamburger when sidebar hidden', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`${BASE}/admin`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    // Hamburger should be hidden on mobile even for admin variant
    const hamburger = page.locator('.natca-shell-breadcrumb-hamburger')
    if (await hamburger.count() > 0) {
      await expect(hamburger).not.toBeVisible()
    }
  })

  // Member variant (7 tabs, no sidebar)
  test('iphone-12-pro — member variant overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`${BASE}/member`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    // Should have More on narrow viewport with 7 tabs
    const moreButton = page.locator('.natca-shell-tab-more')
    await expect(moreButton).toBeVisible()

    // No horizontal overflow
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth)
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth)
    expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 1)

    await page.screenshot({
      path: `${SCREENSHOTS}/iphone-12-pro-member.png`,
      fullPage: false,
    })
  })

  // Desktop wide — all tabs should fit, no More
  test('desktop-wide — all tabs visible, no More button', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto(`${BASE}/admin`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    const moreButton = page.locator('.natca-shell-tab-more')
    await expect(moreButton).not.toBeVisible()

    // All 9 tabs should be visible
    const visibleTabs = page.locator('.natca-shell-tabs > .natca-shell-tab')
    expect(await visibleTabs.count()).toBe(9)
  })
})
