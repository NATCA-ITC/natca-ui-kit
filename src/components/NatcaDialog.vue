<script setup lang="ts">
/**
 * NatcaDialog — Modal dialog with distinct header zone + icon + body + actions.
 *
 * Wraps Vuetify's VDialog for positioning/focus/escape/backdrop — uses native
 * markup for the header (with colored bg + icon) and body/footer styling.
 *
 * Variants: 'default' (navy header), 'danger' (red header + alert icon).
 *
 * @example Confirm dialog
 * <NatcaDialog v-model="showDialog" title="Confirm Migration" subtitle="Batch #12">
 *   Are you sure you want to migrate <strong>34 accounts</strong>?
 *   <template #actions>
 *     <NatcaButton variant="ghost" size="md" @click="showDialog = false">Cancel</NatcaButton>
 *     <NatcaButton variant="primary" size="md" @click="confirm">Migrate Now</NatcaButton>
 *   </template>
 * </NatcaDialog>
 *
 * @example Danger dialog
 * <NatcaDialog v-model="showDialog" variant="danger" title="Delete Account">
 *   This will permanently delete <strong>jason.doss@natca.net</strong>. Cannot be undone.
 *   <template #actions>
 *     <NatcaButton variant="ghost" size="md" @click="showDialog = false">Cancel</NatcaButton>
 *     <NatcaButton variant="danger" size="md" @click="confirmDelete">Delete Account</NatcaButton>
 *   </template>
 * </NatcaDialog>
 */
import { computed } from 'vue'
import { VDialog, VIcon } from 'vuetify/components'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title: string
  subtitle?: string
  icon?: string
  variant?: 'default' | 'danger'
  maxWidth?: number | string
  persistent?: boolean
}>(), {
  variant: 'default',
  maxWidth: 480,
  persistent: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const resolvedIcon = computed(() => {
  if (props.icon) return props.icon
  return props.variant === 'danger' ? 'mdi-alert-octagon' : 'mdi-help-circle'
})

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
})

defineSlots<{
  default?: () => any
  actions?: () => any
}>()
</script>

<template>
  <VDialog v-model="open" :max-width="maxWidth" :persistent="persistent">
    <div class="natca-dialog">
      <div class="natca-dialog__header" :class="`natca-dialog__header--${variant}`">
        <div class="natca-dialog__icon">
          <VIcon :icon="resolvedIcon" size="20" />
        </div>
        <div class="natca-dialog__text">
          <h3 class="natca-dialog__title">{{ title }}</h3>
          <p v-if="subtitle" class="natca-dialog__subtitle">{{ subtitle }}</p>
        </div>
      </div>

      <div class="natca-dialog__body">
        <slot />
      </div>

      <div v-if="$slots.actions" class="natca-dialog__actions">
        <slot name="actions" />
      </div>
    </div>
  </VDialog>
</template>

<style scoped>
.natca-dialog {
  background: var(--color-bg-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  font-family: var(--font-body);
  box-shadow: var(--shadow-lg);
}

.natca-dialog__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
}

.natca-dialog__header--default {
  background: var(--natca-navy);
  color: #FFFFFF;
}

.natca-dialog__header--danger {
  background: var(--color-danger);
  color: #FFFFFF;
}

.natca-dialog__icon {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.9);
  flex-shrink: 0;
}

.natca-dialog__text {
  flex: 1;
  min-width: 0;
}

.natca-dialog__title {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0;
  line-height: 1.2;
}

.natca-dialog__subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin: 2px 0 0;
  line-height: 1.3;
}

.natca-dialog__body {
  padding: 16px 20px;
  font-size: 13px;
  color: var(--color-text-body);
  line-height: 1.5;
}

.natca-dialog__body :deep(strong) {
  font-weight: 700;
  color: var(--color-text-primary);
}

.natca-dialog__actions {
  padding: 8px 16px 16px;
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
  align-items: center;
}
</style>
