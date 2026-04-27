import { test, expect } from '@playwright/test'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const BASE = 'http://localhost:1310'
const SCREENSHOTS = resolve(__dirname, '../TEMP/tabnav-switcher')

test.describe('Tab Nav — switcher dropdown (NAT-304)', () => {
  test('desktop — switcher tab opens dropdown with children', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(`${BASE}/member`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(800)

    const switcher = page.locator('.natca-shell-tab-switcher')
    await expect(switcher).toBeVisible()

    // Switcher should not be a router-link — pressing it must not navigate.
    const beforeUrl = page.url()
    await switcher.click()
    expect(page.url()).toBe(beforeUrl)

    const dropdown = page.locator('.natca-shell-tab-dropdown')
    await expect(dropdown).toBeVisible()
    const childCount = await dropdown.locator('.natca-shell-tab-dropdown-item').count()
    expect(childCount).toBe(5)

    await page.screenshot({ path: `${SCREENSHOTS}/desktop-open.png`, fullPage: false })
  })

  test('desktop — clicking a child navigates and updates parent label', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(`${BASE}/member`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(800)

    const switcher = page.locator('.natca-shell-tab-switcher')
    await switcher.click()

    const dropdown = page.locator('.natca-shell-tab-dropdown')
    const southLink = dropdown.getByRole('link', { name: 'South' })
    await southLink.click()

    await expect(page).toHaveURL(/\/member\/area\/south$/)
    await expect(dropdown).not.toBeVisible()

    // Parent label reflects the active child + parent gets the active state.
    await expect(switcher).toContainText('South')
    await expect(switcher).toHaveClass(/natca-shell-tab-active/)
  })

  test('desktop — Escape closes the switcher dropdown', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(`${BASE}/member`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(800)

    const switcher = page.locator('.natca-shell-tab-switcher')
    await switcher.click()
    const dropdown = page.locator('.natca-shell-tab-dropdown')
    await expect(dropdown).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(dropdown).not.toBeVisible()
  })

  test('mobile — switcher children flatten into More with indent class', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`${BASE}/member`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1200)

    const moreButton = page.locator('.natca-shell-tab-more')
    await expect(moreButton).toBeVisible()
    await moreButton.click()

    const dropdown = page.locator('.natca-shell-tab-dropdown')
    await expect(dropdown).toBeVisible()

    // Switcher children appear with the indent/child class — at minimum the 5 area children.
    const childItems = dropdown.locator('.natca-shell-tab-dropdown-item-child')
    expect(await childItems.count()).toBeGreaterThanOrEqual(5)

    // Indent + left rail are applied (border-left + non-zero margin-left).
    const firstChild = childItems.first()
    const styles = await firstChild.evaluate(el => {
      const cs = getComputedStyle(el)
      return { marginLeft: cs.marginLeft, borderLeftWidth: cs.borderLeftWidth }
    })
    expect(parseFloat(styles.marginLeft)).toBeGreaterThan(0)
    expect(parseFloat(styles.borderLeftWidth)).toBeGreaterThan(0)

    await page.screenshot({ path: `${SCREENSHOTS}/mobile-more-open.png`, fullPage: false })
  })

  test('switcher button uses NATCA display font (no UA <button> font leak)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(`${BASE}/member`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(800)

    const switcher = page.locator('.natca-shell-tab-switcher')
    const fontSpec = await switcher.evaluate(el => {
      const cs = getComputedStyle(el)
      return { fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight }
    })

    // Compare to a plain link tab in the same row — switcher must match.
    const linkTab = page.locator('.natca-shell-tabs > a.natca-shell-tab').first()
    const linkSpec = await linkTab.evaluate(el => {
      const cs = getComputedStyle(el)
      return { fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight }
    })

    expect(fontSpec.fontFamily).toBe(linkSpec.fontFamily)
    expect(fontSpec.fontSize).toBe(linkSpec.fontSize)
    expect(fontSpec.fontWeight).toBe(linkSpec.fontWeight)
    // The Barlow display font should be present in the family.
    expect(fontSpec.fontFamily).toMatch(/barlow/i)
  })
})
