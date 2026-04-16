<script setup lang="ts">
/**
 * NatcaCard — Native Vue card matching the design system exactly.
 *
 * Replaces Vuetify's VCard + VCardTitle/Subtitle/Text/Actions for auth'd pages.
 * No Vuetify dependency — exact visual fidelity to `.auth-card-*`.
 *
 * @example Simple card with title + actions
 * <NatcaCard title="Email Account" subtitle="jason@natca.net · Active">
 *   <!-- body content -->
 *   <div>Provider: Mailcow, Quota: 2.1/5 GB</div>
 *   <template #actions>
 *     <NatcaButton variant="ghost" size="md">Cancel</NatcaButton>
 *     <NatcaButton variant="primary" size="md">Save Changes</NatcaButton>
 *   </template>
 * </NatcaCard>
 *
 * @example Body without padding (tables, full-bleed content)
 * <NatcaCard title="Members" no-body-padding>
 *   <v-data-table ... />
 * </NatcaCard>
 *
 * @example Fully custom with slots
 * <NatcaCard>
 *   <template #header>...custom header zone...</template>
 *   <template #default>...body...</template>
 *   <template #actions>...footer buttons...</template>
 * </NatcaCard>
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  noBodyPadding?: boolean
}>(), {
  noBodyPadding: false,
})

defineSlots<{
  default?: () => any
  header?: () => any
  actions?: () => any
}>()

const bodyClasses = computed(() => ({
  'natca-card__body': true,
  'natca-card__body--no-padding': props.noBodyPadding,
}))
</script>

<template>
  <div class="natca-card">
    <!-- Custom header slot overrides title/subtitle -->
    <div v-if="$slots.header" class="natca-card__header">
      <slot name="header" />
    </div>
    <template v-else>
      <h3 v-if="title" class="natca-card__title">{{ title }}</h3>
      <p v-if="subtitle" class="natca-card__subtitle">{{ subtitle }}</p>
    </template>

    <div v-if="$slots.default" :class="bodyClasses">
      <slot />
    </div>

    <div v-if="$slots.actions" class="natca-card__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.natca-card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  font-family: var(--font-body);
}

.natca-card__title {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-text-primary);
  padding: 12px 16px 4px;
  margin: 0;
  line-height: 1.3;
}

.natca-card__subtitle {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  padding: 0 16px 8px;
  margin: 0;
  line-height: 1.4;
}

.natca-card__body {
  padding: 12px 16px;
  font-size: var(--text-sm);
  color: var(--color-text-body);
}

.natca-card__body--no-padding {
  padding: 0;
}

.natca-card__actions {
  padding: 8px 16px 12px;
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
  align-items: center;
}

/* When a card has BOTH title/subtitle AND body, the body loses its top padding
   because the subtitle already provides the gap. */
.natca-card__title + .natca-card__body,
.natca-card__subtitle + .natca-card__body {
  padding-top: 4px;
}
</style>
