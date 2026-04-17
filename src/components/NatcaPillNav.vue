<script setup lang="ts">
/**
 * NatcaPillNav — Native Vue pill toggle group matching the design system exactly.
 *
 * Replaces VBtnToggle for the `.auth-pills` pattern. Inline pill container with
 * active state showing a raised pill on subtle background.
 *
 * @example
 * <NatcaPillNav
 *   v-model="filter"
 *   :items="[
 *     { value: 'all', label: 'All' },
 *     { value: 'active', label: 'Active' },
 *     { value: 'pending', label: 'Pending' },
 *   ]"
 * />
 */
export interface NatcaPillItem {
  value: string | number
  label: string
}

const props = defineProps<{
  modelValue: string | number
  items: NatcaPillItem[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

function select(value: string | number) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="natca-pills" role="tablist">
    <button
      v-for="item in items"
      :key="item.value"
      type="button"
      role="tab"
      class="natca-pill"
      :class="{ 'natca-pill--active': item.value === modelValue }"
      :aria-selected="item.value === modelValue"
      @click="select(item.value)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<style scoped>
.natca-pills {
  display: inline-flex;
  gap: 2px;
  background: var(--overlay-subtle);
  border-radius: var(--radius-full);
  padding: 2px;
}

.natca-pill {
  display: flex;
  align-items: center;
  padding: 3px 12px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-muted);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 150ms;
  background: none;
  border: none;
  font-family: var(--font-body);
  white-space: nowrap;
}

.natca-pill:hover {
  color: var(--color-text-primary);
}

.natca-pill--active {
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  box-shadow: var(--shadow-sm);
}
</style>
