<script setup lang="ts">
import { ref } from 'vue'
import {
  NatcaTabs,
  NatcaHeaderCard,
  NatcaStatCard,
  NatcaStatGrid,
  NatcaEmptyState,
  NatcaPageHeader,
  NatcaAnnotation,
  NatcaMemberCard,
  NatcaButton,
  NatcaAlert,
  NatcaChip,
  NatcaProgressBar,
  NatcaPillNav,
} from '@/index'
import type { NatcaTabItem } from '@/components/NatcaTabs.vue'
import type { MemberCardData } from '@/components/NatcaMemberCard.vue'
import {
  VCard, VCardTitle, VCardSubtitle, VCardText, VCardActions, VSpacer,
  VTextField, VSelect, VAutocomplete, VCheckbox, VSwitch,
  VDataTable, VDialog, VDivider,
} from 'vuetify/components'

// ── Tabs demo ──
const localTab = ref('details')
const localTabItems: NatcaTabItem[] = [
  { id: 'details', label: 'Details', icon: 'mdi-information-outline' },
  { id: 'members', label: 'Members', badge: 198 },
  { id: 'history', label: 'History' },
]

// ── Pill nav demo ──
const timeRange = ref('30d')
const viewMode = ref('list')
const filterStatus = ref('all')

// ── Data table demo ──
const tableHeaders = [
  { title: 'Member', key: 'name' },
  { title: 'Facility', key: 'facility' },
  { title: 'Email', key: 'email' },
  { title: 'Provider', key: 'provider' },
  { title: 'Status', key: 'status' },
  { title: '', key: 'actions', sortable: false },
]
const tableItems = [
  { name: 'Jason Doss', facility: 'ZJX', email: 'jason.doss@natca.net', provider: 'Mailcow', status: 'Active' },
  { name: 'Sarah Mitchell', facility: 'ZDC', email: 's.mitchell@natca.net', provider: 'O365', status: 'Active' },
  { name: 'Marcus Chen', facility: 'ZLA', email: 'm.chen@natca.net', provider: 'Mailcow', status: 'Pending' },
  { name: 'Emily Rodriguez', facility: 'ZAU', email: 'e.rodriguez@natca.net', provider: 'Mailcow', status: 'Disabled' },
]

function statusChipType(status: string): 'success' | 'warning' | 'danger' | 'default' {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
    Active: 'success', Pending: 'warning', Disabled: 'danger'
  }
  return map[status] || 'default'
}

// ── Dialog demo ──
const showConfirmDialog = ref(false)
const showDangerDialog = ref(false)

// ── Form demo ──
const formProvider = ref('Mailcow')
const formQuota = ref(5)
const formWelcome = ref(true)
const formForward = ref(false)

// ── Member card demo ──
const members: MemberCardData[] = [
  { name: 'Jason Doss', initials: 'JD', facility: 'ZJX', region: 'Southern', memberType: 'BUE', memberNumber: '12345' },
  { name: 'Sarah Mitchell', initials: 'SM', facility: 'ZDC', region: 'Eastern', memberType: 'CPC', memberNumber: '23456' },
]
</script>

<template>
  <div class="ds-page">
    <NatcaPageHeader title="Design Standards" subtitle="Every component from @natca-itc/ui-shell, rendered live">
      <template #actions>
        <NatcaButton variant="link" href="/natca-design-system.html" target="_blank">
          Open Static Reference
        </NatcaButton>
      </template>
    </NatcaPageHeader>

    <NatcaAnnotation>
      <strong>This page uses the real package components.</strong>
      Toggle light/dark with the sun/moon button in the topbar. Every pattern below should match the static design system reference exactly.
    </NatcaAnnotation>

    <!-- ═══════════ BUTTONS ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Button Tiers</h3>

      <p class="eyebrow">Button Variants</p>
      <NatcaAnnotation style="margin-bottom: 16px; max-width: 600px;">
        <strong>NatcaButton</strong> has 5 variants and 2 sizes. Primary = filled navy (light) / filled red (dark). Secondary = subtle fill. Danger = outlined red. Ghost = transparent muted. Link = blue text.
      </NatcaAnnotation>

      <table class="ds-props-table">
        <thead><tr><th>Variant</th><th>Usage</th><th>When to Use</th></tr></thead>
        <tbody>
          <tr>
            <td><NatcaButton variant="primary">Primary</NatcaButton></td>
            <td><code>&lt;NatcaButton variant="primary"&gt;</code></td>
            <td>Main action (save, submit, confirm)</td>
          </tr>
          <tr>
            <td><NatcaButton variant="secondary">Secondary</NatcaButton></td>
            <td><code>&lt;NatcaButton variant="secondary"&gt;</code></td>
            <td>Secondary actions (export, edit)</td>
          </tr>
          <tr>
            <td><NatcaButton variant="danger">Danger</NatcaButton></td>
            <td><code>&lt;NatcaButton variant="danger"&gt;</code></td>
            <td>Destructive (delete, remove)</td>
          </tr>
          <tr>
            <td><NatcaButton variant="ghost">Ghost</NatcaButton></td>
            <td><code>&lt;NatcaButton variant="ghost"&gt;</code></td>
            <td>Cancel, dismiss, tertiary</td>
          </tr>
          <tr>
            <td><NatcaButton variant="link">Link</NatcaButton></td>
            <td><code>&lt;NatcaButton variant="link"&gt;</code></td>
            <td>Inline navigation (view details)</td>
          </tr>
        </tbody>
      </table>

      <div class="ds-row" style="margin-top: 16px;">
        <div>
          <p class="eyebrow">Toolbar Tier (size="sm" — default)</p>
          <p class="ds-hint">Filters, table actions, toolbars. 28px height, 12px font.</p>
          <div class="ds-btn-row">
            <NatcaButton variant="primary">Save</NatcaButton>
            <NatcaButton variant="secondary">Export</NatcaButton>
            <NatcaButton variant="danger">Delete</NatcaButton>
            <NatcaButton variant="ghost">Cancel</NatcaButton>
            <NatcaButton variant="link">View Details</NatcaButton>
          </div>
        </div>
        <div>
          <p class="eyebrow">Action Tier (size="md")</p>
          <p class="ds-hint">Card actions, dialog footers. 36px height, 13px font.</p>
          <div class="ds-btn-row">
            <NatcaButton variant="primary" size="md">Submit Request</NatcaButton>
            <NatcaButton variant="danger" size="md">Delete Account</NatcaButton>
            <NatcaButton variant="ghost" size="md">Cancel</NatcaButton>
          </div>
        </div>
      </div>
    </section>

    <VDivider />

    <!-- ═══════════ CARDS ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Cards</h3>

      <p class="eyebrow">Header Card</p>
      <p class="ds-hint">Navy header with icon + title. Use for profile sections, account details, feature cards.</p>
      <div class="ds-row">
        <div style="flex: 1;">
          <NatcaHeaderCard icon="mdi-account" title="My Email Account" subtitle="jason.doss@natca.net · ZJX">
            <div class="ds-field-grid">
              <div><span class="ds-field-label">Provider</span><br><span class="ds-field-value">Mailcow</span></div>
              <div><span class="ds-field-label">Storage</span><br><span class="ds-field-value">2.1 / 5 GB</span></div>
              <div><span class="ds-field-label">Status</span><br><NatcaChip type="success">Active</NatcaChip></div>
            </div>
            <template #actions>
              <NatcaButton variant="ghost" size="md">Settings</NatcaButton>
              <NatcaButton variant="primary" size="md">Manage Account</NatcaButton>
            </template>
          </NatcaHeaderCard>
        </div>
        <div style="flex: 1;">
          <NatcaHeaderCard icon="mdi-briefcase" title="Migration Status" subtitle="Batch #12 · 34 accounts">
            <NatcaProgressBar :value="65" style="margin-bottom: 8px;" />
            <div style="display: flex; justify-content: space-between; font-size: 11px;">
              <span style="color: var(--color-text-muted);">22 of 34 migrated</span>
              <span style="color: var(--color-success); font-weight: 600;">65%</span>
            </div>
          </NatcaHeaderCard>
        </div>
      </div>

      <p class="eyebrow" style="margin-top: 20px;">Card with Actions</p>
      <div class="ds-row">
        <div style="flex: 1;">
          <VCard>
            <VCardTitle>Email Account</VCardTitle>
            <VCardSubtitle>jason@natca.net · Active</VCardSubtitle>
            <VCardText>
              <div class="ds-field-grid">
                <div><span class="ds-field-label">Provider</span><br><span class="ds-field-value">Mailcow</span></div>
                <div><span class="ds-field-label">Quota</span><br><span class="ds-field-value">2.1 / 5 GB</span></div>
                <div><span class="ds-field-label">Status</span><br><NatcaChip type="success">Active</NatcaChip></div>
              </div>
            </VCardText>
            <VCardActions>
              <VSpacer />
              <NatcaButton variant="ghost" size="md">Cancel</NatcaButton>
              <NatcaButton variant="primary" size="md">Save Changes</NatcaButton>
            </VCardActions>
          </VCard>
        </div>
        <div style="flex: 1;">
          <p class="eyebrow">Stat Cards</p>
          <NatcaStatGrid :cols="2">
            <NatcaStatCard label="Total Accounts" value="1,247" change="+12 this week" />
            <NatcaStatCard label="Active" value="1,198" />
            <NatcaStatCard label="Pending Migration" value="34" />
            <NatcaStatCard label="Disabled" value="15" />
          </NatcaStatGrid>
        </div>
      </div>
    </section>

    <VDivider />

    <!-- ═══════════ DATA TABLE ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Data Table</h3>
      <p class="ds-hint">Compact density with hover. Uses <code>&lt;v-data-table&gt;</code> with natcaDefaults.</p>

      <div class="d-flex align-center" style="margin-bottom: 12px; gap: 12px;">
        <NatcaPillNav
          v-model="filterStatus"
          :items="[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'pending', label: 'Pending' },
            { value: 'disabled', label: 'Disabled' },
          ]"
        />
        <VSpacer />
        <VTextField placeholder="Search accounts..." style="max-width: 200px;" hide-details />
      </div>

      <VCard>
        <VDataTable :headers="tableHeaders" :items="tableItems" :items-per-page="-1" hide-default-footer>
          <template #item.status="{ item }">
            <NatcaChip :type="statusChipType(item.status)">{{ item.status }}</NatcaChip>
          </template>
          <template #item.actions="{}">
            <NatcaButton variant="ghost">View</NatcaButton>
          </template>
        </VDataTable>
      </VCard>
    </section>

    <VDivider />

    <!-- ═══════════ FORMS ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Forms</h3>
      <p class="ds-hint">Vuetify form fields with natcaDefaults (outlined, compact, primary focus).</p>

      <div class="ds-row">
        <div style="flex: 1;">
          <VCard>
            <VCardTitle>Create Email Account</VCardTitle>
            <VCardText>
              <VAutocomplete label="Member" placeholder="Search members..." :items="['Jason Doss', 'Sarah Mitchell']" />
              <VTextField label="Email Address" placeholder="first.last@natca.net" />
              <div class="d-flex ga-3">
                <VSelect label="Provider" :items="['Mailcow', 'O365']" v-model="formProvider" style="flex: 1;" />
                <VTextField label="Quota (GB)" type="number" v-model="formQuota" style="flex: 1;" />
              </div>
              <VCheckbox v-model="formWelcome" label="Send welcome email" />
              <VSwitch v-model="formForward" label="Enable forwarding" />
            </VCardText>
            <VCardActions>
              <VSpacer />
              <NatcaButton variant="ghost" size="md">Cancel</NatcaButton>
              <NatcaButton variant="primary" size="md">Create Account</NatcaButton>
            </VCardActions>
          </VCard>
        </div>
        <div style="flex: 1;">
          <NatcaAnnotation style="margin-bottom: 12px;">
            <strong>natcaDefaults handles:</strong><br>
            <code>VTextField</code> → outlined, compact, primary focus<br>
            <code>VSelect</code> → outlined, compact, primary focus<br>
            <code>VAutocomplete</code> → outlined, compact, primary focus<br>
            <code>VCheckbox</code> → compact, primary, hideDetails auto<br>
            <code>VSwitch</code> → compact, primary, inset, hideDetails auto
          </NatcaAnnotation>
          <NatcaAnnotation type="warning">
            <strong>Buttons: use NatcaButton, not v-btn.</strong><br>
            NatcaButton matches the design system exactly (no uppercase, correct fonts, proper fill colors).
          </NatcaAnnotation>
        </div>
      </div>
    </section>

    <VDivider />

    <!-- ═══════════ ALERTS ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Alerts</h3>
      <p class="ds-hint">NatcaAlert — no icons, just colored strong + border-start + tonal background.</p>

      <div style="max-width: 600px; display: flex; flex-direction: column; gap: 8px;">
        <NatcaAlert type="info"><div><strong>Info:</strong> Migration batch #12 is scheduled for tonight at 0200 ET.</div></NatcaAlert>
        <NatcaAlert type="success"><div><strong>Success:</strong> 47 accounts migrated successfully to Mailcow.</div></NatcaAlert>
        <NatcaAlert type="warning"><div><strong>Warning:</strong> 3 accounts have exceeded their quota limit.</div></NatcaAlert>
        <NatcaAlert type="danger"><div><strong>Error:</strong> Failed to connect to Mailcow API. Check credentials.</div></NatcaAlert>
      </div>
    </section>

    <VDivider />

    <!-- ═══════════ CHIPS ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Chips &amp; Status Badges</h3>
      <p class="ds-hint">NatcaChip — pill-shaped, tonal bg + matching text color.</p>

      <div class="d-flex ga-2 flex-wrap" style="margin-bottom: 12px;">
        <NatcaChip type="success">Active</NatcaChip>
        <NatcaChip type="warning">Pending</NatcaChip>
        <NatcaChip type="danger">Disabled</NatcaChip>
        <NatcaChip type="info">Migrating</NatcaChip>
        <NatcaChip>Archived</NatcaChip>
      </div>

      <NatcaAnnotation style="max-width: 500px;">
        <strong>Usage:</strong> <code>&lt;NatcaChip type="success"&gt;Active&lt;/NatcaChip&gt;</code>
      </NatcaAnnotation>
    </section>

    <VDivider />

    <!-- ═══════════ TABS ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Tabs</h3>

      <div class="ds-row">
        <div style="flex: 1;">
          <p class="eyebrow">Underline (Default) — NatcaTabs</p>
          <VCard style="overflow: hidden;">
            <NatcaTabs v-model="localTab" :items="localTabItems">
              <template #panel-details>
                <p style="font-size: 12px; color: var(--color-text-muted);">Tab panel content. Compact 36px height, Barlow font, red slider for active state.</p>
              </template>
              <template #panel-members>
                <p style="font-size: 12px; color: var(--color-text-muted);">198 members assigned.</p>
              </template>
              <template #panel-history>
                <p style="font-size: 12px; color: var(--color-text-muted);">Audit log and change history.</p>
              </template>
            </NatcaTabs>
          </VCard>
        </div>
        <div style="flex: 1;">
          <p class="eyebrow">Pills (Inline Toggle) — NatcaPillNav</p>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <span class="ds-field-label" style="margin-bottom: 4px; display: block;">Time Range</span>
              <NatcaPillNav
                v-model="timeRange"
                :items="[
                  { value: '7d', label: '7d' },
                  { value: '30d', label: '30d' },
                  { value: '90d', label: '90d' },
                  { value: '1y', label: '1y' },
                ]"
              />
            </div>
            <div>
              <span class="ds-field-label" style="margin-bottom: 4px; display: block;">View</span>
              <NatcaPillNav
                v-model="viewMode"
                :items="[
                  { value: 'list', label: 'List' },
                  { value: 'grid', label: 'Grid' },
                  { value: 'map', label: 'Map' },
                ]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <VDivider />

    <!-- ═══════════ DIALOGS ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Dialogs</h3>
      <p class="ds-hint">VDialog handles positioning/focus/escape. NatcaButton for actions.</p>

      <div class="ds-btn-row">
        <NatcaButton variant="primary" @click="showConfirmDialog = true">Open Confirm Dialog</NatcaButton>
        <NatcaButton variant="danger" @click="showDangerDialog = true">Open Danger Dialog</NatcaButton>
      </div>

      <VDialog v-model="showConfirmDialog">
        <VCard>
          <VCardTitle>Confirm Migration</VCardTitle>
          <VCardText>Are you sure you want to migrate <strong>34 accounts</strong> from O365 to Mailcow? This action cannot be undone.</VCardText>
          <VCardActions>
            <VSpacer />
            <NatcaButton variant="ghost" size="md" @click="showConfirmDialog = false">Cancel</NatcaButton>
            <NatcaButton variant="primary" size="md" @click="showConfirmDialog = false">Migrate Now</NatcaButton>
          </VCardActions>
        </VCard>
      </VDialog>

      <VDialog v-model="showDangerDialog">
        <VCard>
          <VCardTitle>Delete Account</VCardTitle>
          <VCardText>This will permanently delete <strong>jason.doss@natca.net</strong> and all associated data.</VCardText>
          <VCardActions>
            <VSpacer />
            <NatcaButton variant="ghost" size="md" @click="showDangerDialog = false">Cancel</NatcaButton>
            <NatcaButton variant="danger" size="md" @click="showDangerDialog = false">Delete Account</NatcaButton>
          </VCardActions>
        </VCard>
      </VDialog>
    </section>

    <VDivider />

    <!-- ═══════════ STATES ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">States</h3>

      <div class="ds-row">
        <div style="flex: 1;">
          <p class="eyebrow">Loading</p>
          <VCard>
            <VCardText>
              <NatcaProgressBar :value="65" style="margin-bottom: 8px;" />
              <span style="font-size: 11px; color: var(--color-text-faint);">Migrating accounts... 22 of 34</span>
            </VCardText>
          </VCard>
        </div>
        <div style="flex: 1;">
          <p class="eyebrow">Empty State</p>
          <VCard>
            <NatcaEmptyState
              icon="mdi-file-document-outline"
              title="No accounts found"
              description="No email accounts match your current filters. Try adjusting the search or filter criteria."
              action-label="Reset Filters"
            />
          </VCard>
        </div>
      </div>

      <div style="max-width: 50%; margin-top: 16px;">
        <p class="eyebrow">Error State (Inline)</p>
        <NatcaAlert type="danger">
          <div style="display: flex; align-items: center; gap: 12px; width: 100%;">
            <div style="flex: 1;">
              <strong>Failed to load accounts</strong>
              <div style="margin-top: 2px; font-size: 11px; color: var(--color-text-muted);">The Mailcow API returned an error.</div>
            </div>
            <NatcaButton variant="danger">Retry</NatcaButton>
          </div>
        </NatcaAlert>
      </div>
    </section>

    <VDivider />

    <!-- ═══════════ ANNOTATION ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Annotations</h3>
      <p class="ds-hint">Info callout boxes for guidance and contextual help.</p>

      <div style="display: flex; flex-direction: column; gap: 8px; max-width: 600px;">
        <NatcaAnnotation>
          <strong>Info:</strong> Use annotations to explain how a feature works or provide guidance to users.
        </NatcaAnnotation>
        <NatcaAnnotation type="tip">
          <strong>Tip:</strong> You can use <code>NatcaAnnotation</code> with type <code>"tip"</code> for positive guidance.
        </NatcaAnnotation>
        <NatcaAnnotation type="warning">
          <strong>Warning:</strong> Breaking changes should always use the warning variant.
        </NatcaAnnotation>
      </div>
    </section>

    <VDivider />

    <!-- ═══════════ MEMBER CARD ═══════════ -->
    <section class="ds-section">
      <h3 class="ds-section-title">Member Card</h3>

      <div class="ds-row">
        <div style="flex: 1;">
          <p class="eyebrow">Default</p>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <NatcaMemberCard v-for="m in members" :key="m.memberNumber" :member="m" clickable />
          </div>
        </div>
        <div style="flex: 1;">
          <p class="eyebrow">Detailed + Actions</p>
          <NatcaMemberCard :member="members[0]" variant="detailed" accent-border>
            <template #actions>
              <NatcaButton variant="link">View Profile</NatcaButton>
              <NatcaButton variant="ghost">Message</NatcaButton>
            </template>
          </NatcaMemberCard>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ds-page {
  padding: 0 20px 40px;
  max-width: 960px;
}

.ds-section {
  padding: 20px 0;
}

.ds-section-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 4px;
  padding-bottom: 4px;
  border-bottom: 3px solid var(--natca-red);
  display: inline-block;
}

.eyebrow {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-text-faint);
  margin-bottom: 6px;
}

.ds-hint {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: 12px;
}

.ds-hint code {
  font-size: 11px;
  background: var(--overlay-hover);
  padding: 1px 4px;
  border-radius: 3px;
}

.ds-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.ds-btn-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.ds-field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

.ds-field-label {
  font-size: 10px;
  color: var(--color-text-faint);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 700;
}

.ds-field-value {
  font-weight: 600;
  font-size: 13px;
}

.ds-props-table {
  width: 100%;
  max-width: 700px;
  border-collapse: collapse;
  font-size: 13px;
  margin-bottom: 16px;
}

.ds-props-table th {
  background: var(--color-bg-subtle);
  padding: 6px 12px;
  text-align: left;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-muted);
}

.ds-props-table td {
  padding: 8px 12px;
  border-bottom: 1px solid var(--color-border-light);
  vertical-align: middle;
}

.ds-props-table code {
  font-size: 11px;
  background: var(--overlay-subtle);
  padding: 1px 4px;
  border-radius: 3px;
  font-family: var(--font-mono);
}
</style>
