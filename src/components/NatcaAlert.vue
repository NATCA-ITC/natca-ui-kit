<script setup lang="ts">
/**
 * NatcaAlert — Native Vue alert matching the design system exactly.
 *
 * Replaces VAlert. No icons — just tonal bg + colored border-start + colored <strong>.
 *
 * @example
 * <NatcaAlert type="info">
 *   <strong>Info:</strong> Migration scheduled for tonight.
 * </NatcaAlert>
 *
 * @example
 * <NatcaAlert type="success">
 *   <strong>Success:</strong> 47 accounts migrated.
 * </NatcaAlert>
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  type?: 'info' | 'success' | 'warning' | 'danger'
}>(), {
  type: 'info',
})

const classes = computed(() => [
  'natca-alert',
  `natca-alert--${props.type}`,
])
</script>

<template>
  <div :class="classes" role="alert">
    <slot />
  </div>
</template>

<style scoped>
.natca-alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  font-size: 12px;
  line-height: 1.5;
  border-left: 3px solid;
  color: var(--color-text-body);
  font-family: var(--font-body);
}

.natca-alert :deep(strong) {
  font-weight: 700;
}

.natca-alert--info {
  background: var(--color-info-bg);
  border-left-color: var(--color-info);
}
.natca-alert--info :deep(strong) { color: var(--color-info); }

.natca-alert--success {
  background: var(--color-success-bg);
  border-left-color: var(--color-success);
}
.natca-alert--success :deep(strong) { color: var(--color-success); }

.natca-alert--warning {
  background: var(--color-warning-bg);
  border-left-color: var(--color-warning);
}
.natca-alert--warning :deep(strong) { color: var(--color-warning); }

.natca-alert--danger {
  background: var(--color-danger-bg);
  border-left-color: var(--color-danger);
}
.natca-alert--danger :deep(strong) { color: var(--color-danger); }
</style>
