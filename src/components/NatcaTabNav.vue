<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useNatcaTheme } from '../composables/useNatcaTheme'
import type { NatcaTab } from '../types'

const props = defineProps<{
  tabs: NatcaTab[]
}>()

const route = useRoute()
const { resolved: resolvedTheme } = useNatcaTheme()

// ── Refs ──
const containerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const moreButtonRef = ref<HTMLElement | null>(null)

// ── State ──
const overflowStartIndex = ref(Infinity)
const collapsedSet = ref(new Set<string>())
const moreOpen = ref(false)

// ── Helpers ──
function shouldCollapseToIcon(tab: NatcaTab): boolean {
  if (!tab.icon) return false
  if (tab.collapseToIcon) return true
  if (tab.id === 'home') return true
  return false
}

const visibleTabs = computed(() =>
  overflowStartIndex.value >= props.tabs.length
    ? props.tabs
    : props.tabs.slice(0, overflowStartIndex.value)
)
const overflowTabs = computed(() =>
  overflowStartIndex.value >= props.tabs.length
    ? []
    : props.tabs.slice(overflowStartIndex.value)
)
const hasOverflow = computed(() => overflowTabs.value.length > 0)

// ── Active detection (longest prefix match) ──
function isActive(tab: NatcaTab): boolean {
  const resolved = typeof tab.to === 'string' ? tab.to : (tab.to as any).path ?? ''
  if (route.path === resolved) return true
  if (!route.path.startsWith(resolved + '/')) return false
  return !props.tabs.some(other => {
    if (other.id === tab.id) return false
    const otherPath = typeof other.to === 'string' ? other.to : (other.to as any).path ?? ''
    return otherPath.length > resolved.length
      && (route.path.startsWith(otherPath + '/') || route.path === otherPath)
  })
}

const overflowHasActive = computed(() => overflowTabs.value.some(t => isActive(t)))

// Position the dropdown below the More button (since it's teleported to body)
const dropdownStyle = computed(() => {
  const btn = moreButtonRef.value
  if (!btn) return {}
  const rect = btn.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  // Align right edge of dropdown with right edge of More button
  let right = viewportWidth - rect.right
  // Ensure it doesn't go off-screen left
  if (right > viewportWidth - 200) right = 8
  return {
    position: 'fixed' as const,
    top: `${rect.bottom + 2}px`,
    right: `${right}px`,
  }
})

// ── Overflow detection ──
// Strategy: show all tabs, check which overflow the container, then hide them.
// Uses actual DOM positions — no width caching, no timing issues.

let settling = false
let settleTimer: ReturnType<typeof setTimeout> | null = null

function settle() {
  // Debounce rapid calls (ResizeObserver can fire during our own DOM changes)
  if (settleTimer) clearTimeout(settleTimer)
  settleTimer = setTimeout(doSettle, 16)
}

function doSettle() {
  if (settling) return
  settling = true

  // Reset to show everything
  overflowStartIndex.value = Infinity
  collapsedSet.value = new Set()

  // Wait for DOM update with all tabs visible
  nextTick(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        doOverflowCheck()
        settling = false
      })
    })
  })
}

function doOverflowCheck() {
  const container = containerRef.value
  if (!container) return

  const containerRight = container.getBoundingClientRect().right
  const tabEls = container.querySelectorAll<HTMLElement>(':scope > .natca-shell-tab')
  if (!tabEls.length) return

  // Phase 1: check if all tabs fit
  const lastTab = tabEls[tabEls.length - 1]
  if (lastTab.getBoundingClientRect().right <= containerRight) {
    // All fit — done
    return
  }

  // Phase 2: collapse icon-eligible tabs first
  const newCollapsed = new Set<string>()
  for (let i = 0; i < props.tabs.length; i++) {
    if (shouldCollapseToIcon(props.tabs[i])) {
      newCollapsed.add(props.tabs[i].id)
    }
  }
  collapsedSet.value = newCollapsed

  // Wait for collapse to render, then re-check
  nextTick(() => {
    requestAnimationFrame(() => {
      doOverflowCheckPhase2()
    })
  })
}

const MORE_BUTTON_WIDTH = 80

function doOverflowCheckPhase2() {
  const container = containerRef.value
  if (!container) return

  const containerRight = container.getBoundingClientRect().right
  const tabEls = container.querySelectorAll<HTMLElement>(':scope > .natca-shell-tab')

  // Check if collapsing was enough
  if (tabEls.length > 0) {
    const lastTab = tabEls[tabEls.length - 1]
    if (lastTab.getBoundingClientRect().right <= containerRight) {
      return // fits now
    }
  }

  // Phase 3: find the cutoff — reserve space for More button
  const budget = containerRight - MORE_BUTTON_WIDTH
  let cutoff = props.tabs.length

  for (let i = 0; i < tabEls.length; i++) {
    if (tabEls[i].getBoundingClientRect().right > budget) {
      cutoff = i
      break
    }
  }

  overflowStartIndex.value = Math.max(1, cutoff)
}

// ── Resize ──
let resizeObserver: ResizeObserver | null = null

// ── More dropdown ──
function toggleMore() {
  moreOpen.value = !moreOpen.value
}

function onOverflowLinkClick() {
  moreOpen.value = false
}

function onClickOutside(e: MouseEvent) {
  if (!moreOpen.value) return
  const target = e.target as Node
  if (moreButtonRef.value?.contains(target)) return
  if (dropdownRef.value?.contains(target)) return
  moreOpen.value = false
}

// ── Lifecycle ──
onMounted(() => {
  settle()

  // Re-settle after fonts load
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => settle())
  }

  resizeObserver = new ResizeObserver(() => settle())
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }
  document.addEventListener('click', onClickOutside, true)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  document.removeEventListener('click', onClickOutside, true)
})

// Re-measure when tabs prop changes
watch(() => props.tabs, () => settle(), { deep: true })

// Close dropdown on route change
watch(() => route.path, () => { moreOpen.value = false })
</script>

<template>
  <nav ref="containerRef" class="natca-shell-tabs">
    <!-- Visible tabs -->
    <router-link
      v-for="tab in visibleTabs"
      :key="tab.id"
      :to="tab.to"
      class="natca-shell-tab"
      :class="{
        'natca-shell-tab-active': isActive(tab),
        'natca-shell-tab-icon-only': collapsedSet.has(tab.id),
      }"
      :title="collapsedSet.has(tab.id) ? tab.label : undefined"
    >
      <v-icon
        v-if="tab.icon"
        class="natca-shell-tab-icon"
        :icon="tab.icon"
        size="14"
      />
      <span v-if="!collapsedSet.has(tab.id)">{{ tab.label }}</span>
      <span
        v-if="tab.badge != null && !collapsedSet.has(tab.id)"
        class="natca-shell-nav-badge"
        style="font-size: 9px;"
      >
        {{ tab.badge }}
      </span>
    </router-link>

    <!-- More button -->
    <button
      v-if="hasOverflow"
      ref="moreButtonRef"
      class="natca-shell-tab-more"
      :class="{ 'natca-shell-tab-more-active': moreOpen || overflowHasActive }"
      @click.stop="toggleMore"
    >
      <v-icon :icon="moreOpen ? 'mdi-close' : 'mdi-dots-horizontal'" size="14" />
      <span>{{ moreOpen ? 'Close' : 'More' }}</span>
    </button>

  </nav>

  <!-- Dropdown rendered outside the overflow:hidden tab bar via Teleport -->
  <Teleport to="body">
    <div
      v-if="hasOverflow && moreOpen"
      ref="dropdownRef"
      class="natca-shell-tab-dropdown"
      :data-theme="resolvedTheme"
      :style="dropdownStyle"
    >
      <router-link
        v-for="tab in overflowTabs"
        :key="tab.id"
        :to="tab.to"
        class="natca-shell-tab-dropdown-item"
        :class="{ 'natca-shell-tab-dropdown-item-active': isActive(tab) }"
        @click="onOverflowLinkClick"
      >
        <v-icon
          v-if="tab.icon"
          :icon="tab.icon"
          size="14"
          class="natca-shell-tab-dropdown-icon"
        />
        <span>{{ tab.label }}</span>
        <span
          v-if="tab.badge != null"
          class="natca-shell-nav-badge"
          style="font-size: 9px;"
        >
          {{ tab.badge }}
        </span>
      </router-link>
    </div>
  </Teleport>
</template>
