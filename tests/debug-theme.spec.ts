import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:1310'

test('debug light mode theme classes', async ({ page }) => {
  await page.goto(`${BASE}/admin/design-standards`)
  await page.evaluate(() => localStorage.setItem('natca-theme', 'light'))
  await page.reload()
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)

  const info = await page.evaluate(() => {
    const shell = document.querySelector('.natca-shell')
    const btn = document.querySelector('.natca-btn--primary')
    const btnComputed = btn ? window.getComputedStyle(btn) : null
    return {
      shellDataTheme: shell?.getAttribute('data-theme'),
      shellClass: shell?.className,
      htmlDataTheme: document.documentElement.getAttribute('data-theme'),
      bodyClass: document.body.className,
      btnBackground: btnComputed?.backgroundColor,
      btnText: btnComputed?.color,
      localStorage: localStorage.getItem('natca-theme'),
    }
  })

  console.log('LIGHT MODE DEBUG:', JSON.stringify(info, null, 2))
})

test('debug dark mode theme classes', async ({ page }) => {
  await page.goto(`${BASE}/admin/design-standards`)
  await page.evaluate(() => localStorage.setItem('natca-theme', 'dark'))
  await page.reload()
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)

  const info = await page.evaluate(() => {
    const shell = document.querySelector('.natca-shell')
    const btn = document.querySelector('.natca-btn--primary')
    const btnComputed = btn ? window.getComputedStyle(btn) : null
    return {
      shellDataTheme: shell?.getAttribute('data-theme'),
      shellClass: shell?.className,
      htmlDataTheme: document.documentElement.getAttribute('data-theme'),
      bodyClass: document.body.className,
      btnBackground: btnComputed?.backgroundColor,
      btnText: btnComputed?.color,
      localStorage: localStorage.getItem('natca-theme'),
    }
  })

  console.log('DARK MODE DEBUG:', JSON.stringify(info, null, 2))
})
