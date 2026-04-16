<script setup lang="ts">
/**
 * NatcaButton — Native Vue button matching the design system exactly.
 *
 * Replaces VBtn for the 5 design-system button variants. No Vuetify dependency.
 *
 * @example
 * <NatcaButton variant="primary" @click="save">Save</NatcaButton>
 * <NatcaButton variant="secondary">Export</NatcaButton>
 * <NatcaButton variant="danger">Delete</NatcaButton>
 * <NatcaButton variant="ghost">Cancel</NatcaButton>
 * <NatcaButton variant="link">View Details</NatcaButton>
 *
 * @example Action tier (use inside dialog/card actions)
 * <NatcaButton variant="primary" size="md">Submit Request</NatcaButton>
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link'
  size?: 'sm' | 'md'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  block?: boolean
  href?: string
}>(), {
  variant: 'primary',
  size: 'sm',
  type: 'button',
  disabled: false,
  block: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const classes = computed(() => [
  'natca-btn',
  `natca-btn--${props.variant}`,
  `natca-btn--${props.size}`,
  { 'natca-btn--block': props.block, 'natca-btn--disabled': props.disabled },
])

function handleClick(e: MouseEvent) {
  if (props.disabled) {
    e.preventDefault()
    return
  }
  emit('click', e)
}
</script>

<template>
  <a
    v-if="href"
    :href="href"
    :class="classes"
    :aria-disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </a>
  <button
    v-else
    :type="type"
    :class="classes"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<style>
.natca-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: var(--font-body);
  font-weight: 600;
  letter-spacing: 0.2px;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 150ms;
  text-decoration: none;
  white-space: nowrap;
  text-transform: none; /* override any ambient uppercase */
  box-sizing: border-box;
}

.natca-btn:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 1px;
}

/* ── Sizes ── */
.natca-btn--sm {
  font-size: 12px;
  padding: 4px 12px;
  height: 28px;
}

.natca-btn--md {
  font-size: 13px;
  padding: 6px 18px;
  height: 36px;
}

.natca-btn--block {
  display: flex;
  width: 100%;
}

.natca-btn--disabled,
.natca-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* ── Variants ── */

/* Primary — navy in light, red in dark */
.natca-btn--primary {
  background: var(--natca-navy);
  color: #FFFFFF;
}
.natca-btn--primary:hover { opacity: 0.9; }
[data-theme="dark"] .natca-btn--primary,
.v-theme--natcaDark .natca-btn--primary {
  background: var(--natca-red);
}

/* Secondary — subtle bg with border */
.natca-btn--secondary {
  background: var(--color-bg-subtle);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}
.natca-btn--secondary:hover { background: var(--overlay-hover); }

/* Danger — outlined red, fills on hover */
.natca-btn--danger {
  background: transparent;
  color: var(--color-danger);
  border: 1px solid var(--color-danger);
}
.natca-btn--danger:hover {
  background: var(--color-danger);
  color: #FFFFFF;
}

/* Ghost — transparent, muted text */
.natca-btn--ghost {
  background: transparent;
  color: var(--color-text-muted);
}
.natca-btn--ghost:hover {
  background: var(--overlay-hover);
  color: var(--color-text-primary);
}

/* Link — blue text, no border */
.natca-btn--link {
  background: transparent;
  color: var(--natca-blue);
}
.natca-btn--link:hover {
  background: var(--overlay-hover);
}
</style>
