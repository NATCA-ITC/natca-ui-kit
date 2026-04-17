import { test } from '@playwright/test'

const BASE = 'http://localhost:1310'

test('trace red field background', async ({ page }) => {
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('DOM.enable')
  await cdp.send('CSS.enable')

  await page.goto(`${BASE}/admin/design-standards`)
  await page.evaluate(() => localStorage.setItem('natca-theme', 'dark'))
  await page.reload()
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)

  const formsSection = page.locator('section:has(h3:text("Forms"))').first()
  await formsSection.scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)

  // Get the node ID of the first .v-field
  const { root } = await cdp.send('DOM.getDocument', { depth: -1, pierce: true })
  const { nodeId: fieldNodeId } = await cdp.send('DOM.querySelector', {
    nodeId: root.nodeId,
    selector: '.v-field',
  })

  if (fieldNodeId === 0) {
    console.log('NO FIELD FOUND')
    return
  }

  const matched = await cdp.send('CSS.getMatchedStylesForNode', { nodeId: fieldNodeId })

  // Find all rules that mention background
  const allRules = [
    ...(matched.matchedCSSRules || []),
    ...(matched.inherited?.flatMap(i => i.matchedCSSRules || []) || []),
  ]

  for (const m of allRules) {
    const props = m.rule?.style?.cssProperties || []
    const bgProps = props.filter(p => /^background/i.test(p.name))
    if (bgProps.length > 0) {
      const selector = m.rule?.selectorList?.text
      const sheet = m.rule?.styleSheetId
      console.log('\n---')
      console.log('Selector:', selector)
      console.log('StyleSheet:', sheet)
      for (const bp of bgProps) {
        console.log(`  ${bp.name}: ${bp.value}`, bp.disabled ? '[DISABLED]' : '')
      }
    }
  }
})
