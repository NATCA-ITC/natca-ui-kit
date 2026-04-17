import { test } from '@playwright/test'

const BASE = 'http://localhost:1310'

test('inspect form input DOM structure', async ({ page }) => {
  await page.goto(`${BASE}/admin/design-standards`)
  await page.evaluate(() => localStorage.setItem('natca-theme', 'dark'))
  await page.reload()
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)

  // Scroll to Forms section
  const formsSection = page.locator('section:has(h3:text("Forms"))').first()
  await formsSection.scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)

  // Dump structure of a VTextField
  const textFieldDOM = await page.evaluate(() => {
    const tf = document.querySelector('.v-text-field')
    return tf ? tf.outerHTML : 'not found'
  })
  console.log('=== VTextField OUTER HTML ===')
  console.log(textFieldDOM)

  // Dump structure of a VSelect
  const selectDOM = await page.evaluate(() => {
    const sel = document.querySelector('.v-select')
    return sel ? sel.outerHTML : 'not found'
  })
  console.log('=== VSelect OUTER HTML ===')
  console.log(selectDOM)

  // Dump structure of a VSwitch
  const switchDOM = await page.evaluate(() => {
    const sw = document.querySelector('.v-switch')
    return sw ? sw.outerHTML : 'not found'
  })
  console.log('=== VSwitch OUTER HTML ===')
  console.log(switchDOM)

  // Get computed styles of key elements
  const computed = await page.evaluate(() => {
    const get = (sel: string, props: string[]) => {
      const el = document.querySelector(sel)
      if (!el) return { error: 'not found' }
      const cs = window.getComputedStyle(el)
      const result: Record<string, string> = {}
      for (const p of props) result[p] = cs.getPropertyValue(p)
      return result
    }
    return {
      vField: get('.v-field', ['background-color', 'border-color', 'font-family', 'color']),
      vFieldOverlay: get('.v-field__overlay', ['background-color', 'opacity']),
      vFieldOutline: get('.v-field__outline', ['color']),
      vInput: get('.v-input', ['font-family']),
      vTextFieldInput: get('.v-text-field .v-field__input', ['background-color', 'color', 'font-family']),
      vSwitchTrack: get('.v-switch__track', ['width', 'height', 'background-color']),
      vSwitchThumb: get('.v-switch__thumb', ['width', 'height']),
    }
  })
  console.log('=== COMPUTED STYLES ===')
  console.log(JSON.stringify(computed, null, 2))

  // Take a closeup screenshot of the form card
  const formCard = page.locator('section:has(h3:text("Forms")) .natca-card').first()
  await formCard.screenshot({ path: 'TEMP/visual-audit/form-card-closeup-dark.png' })
})
