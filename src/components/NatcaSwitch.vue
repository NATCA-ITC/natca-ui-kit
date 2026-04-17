<script setup lang="ts">
/**
 * NatcaSwitch — Native Vue toggle switch matching the design system.
 *
 * Replaces VSwitch. Small (34×18 track, 14px thumb), pill shape,
 * navy-when-on in light / red-when-on in dark.
 *
 * @example
 * <NatcaSwitch v-model="enabled" label="Enable forwarding" />
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

const uid = computed(() => props.id || `natca-switch-${Math.random().toString(36).slice(2, 10)}`)

function toggle() {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <label class="natca-switch" :class="{ 'natca-switch--disabled': disabled }" :for="uid">
    <input
      :id="uid"
      type="checkbox"
      class="natca-switch__input"
      :checked="modelValue"
      :disabled="disabled"
      @change="toggle"
    />
    <span class="natca-switch__track" :class="{ 'natca-switch__track--on': modelValue }">
      <span class="natca-switch__thumb" />
    </span>
    <span v-if="label" class="natca-switch__label">{{ label }}</span>
  </label>
</template>

<style>
.natca-switch {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--color-text-body);
}

.natca-switch--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.natca-switch__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.natca-switch__track {
  position: relative;
  width: 34px;
  height: 18px;
  background: var(--color-border);
  border-radius: 9px;
  transition: background 150ms ease;
  flex-shrink: 0;
}

.natca-switch__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  background: #FFFFFF;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: transform 150ms ease;
}

.natca-switch__track--on {
  background: var(--natca-navy);
}

[data-theme="dark"] .natca-switch__track--on,
.v-theme--natcaDark .natca-switch__track--on {
  background: var(--natca-red);
}

.natca-switch__track--on .natca-switch__thumb {
  transform: translateX(16px);
}

.natca-switch__label {
  line-height: 1;
}

.natca-switch__input:focus-visible + .natca-switch__track {
  outline: 2px solid var(--color-border-focus, var(--color-info));
  outline-offset: 2px;
}
</style>
