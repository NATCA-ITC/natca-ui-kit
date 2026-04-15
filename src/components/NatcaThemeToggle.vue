<script setup lang="ts">
import { computed } from 'vue'
import { VSelect, VIcon } from 'vuetify/components'
import { useNatcaTheme } from '../composables/useNatcaTheme'
import type { NatcaThemeOption } from '../types'

const props = withDefaults(defineProps<{
  themes?:  (string | NatcaThemeOption)[]
  label?:   string
  density?: 'default' | 'comfortable' | 'compact'
}>(), {
  themes:  () => ['light', 'dark', 'system'],
  label:   'Theme',
  density: 'compact',
})

const emit = defineEmits<{
  change: [preference: string]
}>()

const THEME_DEFAULTS: Record<string, Required<NatcaThemeOption>> = {
  light:  { value: 'light',  label: 'Light',  icon: '☀️' },
  dark:   { value: 'dark',   label: 'Dark',   icon: '🌙' },
  system: { value: 'system', label: 'System', icon: '💻' },
}

function toOption(entry: string | NatcaThemeOption): Required<NatcaThemeOption> {
  const base = typeof entry === 'string' ? { value: entry } : entry
  const defaults = THEME_DEFAULTS[base.value] ?? {
    value: base.value,
    label: base.value.charAt(0).toUpperCase() + base.value.slice(1),
    icon: '🎨',
  }
  return {
    value: base.value,
    label: base.label ?? defaults.label,
    icon:  base.icon  ?? defaults.icon,
  }
}

const items = computed(() => props.themes.map(toOption))

const { preference, setTheme } = useNatcaTheme()

const selected = computed({
  get: () => preference.value,
  set: (val: string) => {
    setTheme(val)
    emit('change', val)
  },
})
</script>

<template>
  <VSelect
    v-model="selected"
    :label="label"
    :items="items"
    item-value="value"
    item-title="label"
    :density="density"
    variant="outlined"
  >
    <template #item="{ item, props: itemProps }">
      <v-list-item v-bind="itemProps">
        <template #prepend>
          <VIcon v-if="item.raw.icon?.startsWith('mdi-')" :icon="item.raw.icon" size="small" class="mr-2" />
          <span v-else class="mr-2" style="font-size: 14px; line-height: 1;">{{ item.raw.icon }}</span>
        </template>
      </v-list-item>
    </template>
    <template #selection="{ item }">
      <span style="display: flex; align-items: center; gap: 6px;">
        <VIcon v-if="item.raw.icon?.startsWith('mdi-')" :icon="item.raw.icon" size="small" />
        <span v-else style="font-size: 14px; line-height: 1;">{{ item.raw.icon }}</span>
        {{ item.raw.label }}
      </span>
    </template>
  </VSelect>
</template>
