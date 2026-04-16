<script setup lang="ts">
/**
 * NatcaChip — Native Vue chip/badge matching the design system exactly.
 *
 * Replaces VChip for status indicators. Pill-shaped, colored tonal bg + matching text color.
 *
 * @example
 * <NatcaChip type="success">Active</NatcaChip>
 * <NatcaChip type="warning">Pending</NatcaChip>
 * <NatcaChip type="danger">Disabled</NatcaChip>
 * <NatcaChip type="info">Migrating</NatcaChip>
 * <NatcaChip>Archived</NatcaChip>
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  type?: 'success' | 'warning' | 'danger' | 'info' | 'default'
}>(), {
  type: 'default',
})

const classes = computed(() => [
  'natca-chip',
  `natca-chip--${props.type}`,
])
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>

<style scoped>
.natca-chip {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  font-size: 11px;
  font-weight: 600;
  font-family: var(--font-body);
  border-radius: var(--radius-full);
  white-space: nowrap;
  line-height: 1;
}

.natca-chip--success { background: var(--color-success-bg); color: var(--color-success); }
.natca-chip--warning { background: var(--color-warning-bg); color: var(--color-warning); }
.natca-chip--danger  { background: var(--color-danger-bg);  color: var(--color-danger); }
.natca-chip--info    { background: var(--color-info-bg);    color: var(--color-info); }
.natca-chip--default { background: var(--color-bg-subtle);  color: var(--color-text-muted); }
</style>
