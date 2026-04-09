import { reactive, readonly } from 'vue'

const state = reactive({
  sidebarCollapsed: false,
  searchOpen: false,
  appSwitcherOpen: false,
  mobileDrawerOpen: false,
})

export function useShellState() {
  function toggleSidebar() {
    state.sidebarCollapsed = !state.sidebarCollapsed
  }

  function setSidebarCollapsed(value: boolean) {
    state.sidebarCollapsed = value
  }

  function toggleSearch() {
    state.searchOpen = !state.searchOpen
    if (state.searchOpen) {
      state.appSwitcherOpen = false
    }
  }

  function closeSearch() {
    state.searchOpen = false
  }

  function toggleAppSwitcher() {
    state.appSwitcherOpen = !state.appSwitcherOpen
    if (state.appSwitcherOpen) {
      state.searchOpen = false
    }
  }

  function closeAppSwitcher() {
    state.appSwitcherOpen = false
  }

  function toggleMobileDrawer() {
    state.mobileDrawerOpen = !state.mobileDrawerOpen
  }

  function closeMobileDrawer() {
    state.mobileDrawerOpen = false
  }

  return {
    state: readonly(state),
    toggleSidebar,
    setSidebarCollapsed,
    toggleSearch,
    closeSearch,
    toggleAppSwitcher,
    closeAppSwitcher,
    toggleMobileDrawer,
    closeMobileDrawer,
  }
}
