import './styles/shell.css'

import type { App } from 'vue'
import NatcaShell from './components/NatcaShell.vue'
import NatcaTopBar from './components/NatcaTopBar.vue'
import NatcaTabNav from './components/NatcaTabNav.vue'
import NatcaBreadcrumbRow from './components/NatcaBreadcrumbRow.vue'
import NatcaSidebar from './components/NatcaSidebar.vue'
import NatcaSearchDrawer from './components/NatcaSearchDrawer.vue'
import NatcaAppSwitcher from './components/NatcaAppSwitcher.vue'

export {
  NatcaShell,
  NatcaTopBar,
  NatcaTabNav,
  NatcaBreadcrumbRow,
  NatcaSidebar,
  NatcaSearchDrawer,
  NatcaAppSwitcher,
}

export * from './types'
export { useShellState } from './composables/useShellState'

export const NatcaUiShell = {
  install(app: App) {
    app.component('NatcaShell', NatcaShell)
    app.component('NatcaTopBar', NatcaTopBar)
    app.component('NatcaTabNav', NatcaTabNav)
    app.component('NatcaBreadcrumbRow', NatcaBreadcrumbRow)
    app.component('NatcaSidebar', NatcaSidebar)
    app.component('NatcaSearchDrawer', NatcaSearchDrawer)
    app.component('NatcaAppSwitcher', NatcaAppSwitcher)
  },
}

export default NatcaUiShell
