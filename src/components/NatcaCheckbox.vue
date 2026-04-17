<script setup lang="ts">
/**
 * NatcaCheckbox — Native Vue checkbox matching the design system.
 *
 * Replaces VCheckbox. Uses native <input type="checkbox"> with
 * custom styling — clean, lightweight, no Vuetify overhead.
 *
 * @example
 * <NatcaCheckbox v-model="welcome" label="Send welcome email" />
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  label?: string
  disabled?: boolean
  id?: string
}>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const uid = computed(() => props.id || `natca-checkbox-${Math.random().toString(36).slice(2, 10)}`)

function toggle() {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <label class="natca-checkbox" :class="{ 'natca-checkbox--disabled': disabled }" :for="uid">
    <input
      :id="uid"
      type="checkbox"
      class="natca-checkbox__input"
      :checked="modelValue"
      :disabled="disabled"
      @change="toggle"
    />
    <span class="natca-checkbox__box" :class="{ 'natca-checkbox__box--checked': modelValue }">
      <svg
        v-if="modelValue"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
    <span v-if="label" class="natca-checkbox__label">{{ label }}</span>
  </label>
</template>

<style>
.natca-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--color-text-body);
}

.natca-checkbox--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.natca-checkbox__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.natca-checkbox__box {
  width: 16px;
  height: 16px;
  border: 1.5px solid var(--color-border);
  border-radius: 3px;
  background: var(--color-bg-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 150ms ease;
  color: #FFFFFF;
}

.natca-checkbox:hover .natca-checkbox__box:not(.natca-checkbox__box--checked) {
  border-color: var(--color-text-muted);
}

.natca-checkbox__box--checked {
  background: var(--natca-navy);
  border-color: var(--natca-navy);
}

[data-theme="dark"] .natca-checkbox__box--checked,
.v-theme--natcaDark .natca-checkbox__box--checked {
  background: var(--natca-red);
  border-color: var(--natca-red);
}

.natca-checkbox__input:focus-visible + .natca-checkbox__box {
  outline: 2px solid var(--color-border-focus, var(--color-info));
  outline-offset: 2px;
}

.natca-checkbox__label {
  line-height: 1;
}
</style>
