<script setup lang="ts">
import { useShellState } from '../composables/useShellState'
import type { NatcaBreadcrumb } from '../types'

defineProps<{
  breadcrumbs: NatcaBreadcrumb[]
  hasSidebar?: boolean
}>()

defineSlots<{
  right?: () => any
}>()

const { state, toggleSidebar, toggleMobileDrawer } = useShellState()

function handleHamburgerClick() {
  // On mobile, toggle the drawer; on desktop, toggle sidebar collapse
  if (window.innerWidth <= 768) {
    toggleMobileDrawer()
  } else {
    toggleSidebar()
  }
}
</script>

<template>
  <div class="natca-shell-breadcrumb-row">
    <!-- Hamburger toggle (visible when sidebar exists) -->
    <button
      v-if="hasSidebar"
      class="natca-shell-breadcrumb-hamburger"
      type="button"
      aria-label="Toggle sidebar"
      @click="handleHamburgerClick"
    >
      <!-- Left arrow when sidebar expanded, hamburger when collapsed -->
      <svg v-if="!state.sidebarCollapsed" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>

    <!-- Breadcrumb trail -->
    <nav class="natca-shell-breadcrumb">
      <template v-for="(crumb, i) in breadcrumbs" :key="i">
        <span v-if="i > 0" class="natca-shell-sep">/</span>
        <router-link
          v-if="crumb.to && i < breadcrumbs.length - 1"
          :to="crumb.to"
        >
          {{ crumb.label }}
        </router-link>
        <span v-else class="natca-shell-current">{{ crumb.label }}</span>
      </template>
    </nav>

    <!-- Right slot -->
    <div class="natca-shell-breadcrumb-right">
      <slot name="right" />
    </div>
  </div>
</template>
