<script setup lang="ts">
/**
 * NatcaProgressBar — Native Vue progress bar matching the design system exactly.
 *
 * Replaces VProgressLinear for design-system progress displays.
 * 4px height, blue fill on subtle track, pill-rounded.
 *
 * @example
 * <NatcaProgressBar :value="65" />
 *
 * @example Indeterminate
 * <NatcaProgressBar indeterminate />
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  value?: number      // 0–100
  indeterminate?: boolean
  color?: 'blue' | 'success' | 'warning' | 'danger'
}>(), {
  value: 0,
  indeterminate: false,
  color: 'blue',
})

const clampedValue = computed(() => Math.max(0, Math.min(100, props.value)))
const fillStyle = computed(() => props.indeterminate ? {} : { width: `${clampedValue.value}%` })

const fillClasses = computed(() => [
  'natca-progress__fill',
  `natca-progress__fill--${props.color}`,
  { 'natca-progress__fill--indeterminate': props.indeterminate },
])
</script>

<template>
  <div
    class="natca-progress"
    role="progressbar"
    :aria-valuenow="indeterminate ? undefined : clampedValue"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div :class="fillClasses" :style="fillStyle" />
  </div>
</template>

<style scoped>
.natca-progress {
  height: 4px;
  background: var(--overlay-subtle);
  border-radius: 2px;
  overflow: hidden;
  width: 100%;
}

.natca-progress__fill {
  height: 100%;
  border-radius: 2px;
  transition: width 300ms ease-out;
}

.natca-progress__fill--blue    { background: var(--natca-blue); }
.natca-progress__fill--success { background: var(--color-success); }
.natca-progress__fill--warning { background: var(--color-warning); }
.natca-progress__fill--danger  { background: var(--color-danger); }

.natca-progress__fill--indeterminate {
  width: 30%;
  animation: natca-progress-indeterminate 1.4s linear infinite;
}

@keyframes natca-progress-indeterminate {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}
</style>
