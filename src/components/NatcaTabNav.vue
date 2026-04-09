<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { NatcaTab } from '../types'

const props = defineProps<{
  tabs: NatcaTab[]
}>()

const route = useRoute()

function isActive(tab: NatcaTab): boolean {
  const resolved = typeof tab.to === 'string' ? tab.to : (tab.to as any).path ?? ''
  if (route.path === resolved) return true
  if (!route.path.startsWith(resolved + '/')) return false
  // This tab's path is a prefix — but only match if it's the longest matching prefix among all tabs
  return !props.tabs.some(other => {
    if (other.id === tab.id) return false
    const otherPath = typeof other.to === 'string' ? other.to : (other.to as any).path ?? ''
    return otherPath.length > resolved.length && (route.path.startsWith(otherPath + '/') || route.path === otherPath)
  })
}
</script>

<template>
  <nav class="natca-shell-tabs">
    <router-link
      v-for="tab in tabs"
      :key="tab.id"
      :to="tab.to"
      class="natca-shell-tab"
      :class="{ 'natca-shell-tab-active': isActive(tab) }"
    >
      <v-icon
        v-if="tab.icon"
        class="natca-shell-tab-icon"
        :icon="tab.icon"
        size="14"
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
  </nav>
</template>
