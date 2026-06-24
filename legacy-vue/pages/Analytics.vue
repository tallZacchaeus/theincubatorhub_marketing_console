<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { apiErrorMessage } from '@/api/errors';
import { listBroadcasts } from '@/api/endpoints/broadcasts';
import { campaignAnalytics } from '@/api/endpoints/analytics';
import type { Broadcast, CampaignAnalytics } from '@/types';

const campaigns = ref<Broadcast[]>([]);
const selectedId = ref<number | null>(null);
const data = ref<CampaignAnalytics | null>(null);
const error = ref<string | null>(null);
const loading = ref(false);

function pct(v: number): string {
  return `${(v * 100).toFixed(1)}%`;
}

async function load() {
  error.value = null;
  try {
    campaigns.value = (await listBroadcasts({ limit: 50 })).campaigns;
    if (campaigns.value.length && selectedId.value === null) selectedId.value = campaigns.value[0].id;
  } catch (e) {
    error.value = apiErrorMessage(e);
  }
}

watch(selectedId, async (id) => {
  if (!id) return;
  loading.value = true;
  error.value = null;
  try {
    data.value = await campaignAnalytics(id);
  } catch (e) {
    error.value = apiErrorMessage(e);
  } finally {
    loading.value = false;
  }
});

onMounted(() => load());
</script>

<template>
  <section class="page">
    <div class="page-head">
      <h1>Analytics</h1>
      <select v-model.number="selectedId">
        <option v-for="c in campaigns" :key="c.id" :value="c.id">{{ c.name }} ({{ c.status }})</option>
      </select>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="loading" class="state">Loading…</p>
    <p v-else-if="!campaigns.length" class="state">No campaigns to report on yet.</p>

    <template v-if="data && !loading">
      <div class="cards">
        <div class="stat"><div class="n">{{ data.summary.recipients }}</div><div class="l">Recipients</div></div>
        <div class="stat"><div class="n">{{ data.summary.sent }}</div><div class="l">Sent</div></div>
        <div class="stat"><div class="n">{{ data.summary.delivered }}</div><div class="l">Delivered ({{ pct(data.summary.delivery_rate) }})</div></div>
        <div class="stat"><div class="n">{{ data.summary.opened }}</div><div class="l">Opened ({{ pct(data.summary.open_rate) }})</div></div>
        <div class="stat"><div class="n">{{ data.summary.clicked }}</div><div class="l">Clicked ({{ pct(data.summary.click_rate) }})</div></div>
        <div class="stat"><div class="n">{{ data.summary.bounced }}</div><div class="l">Bounced</div></div>
        <div class="stat"><div class="n">{{ data.summary.complained }}</div><div class="l">Complaints</div></div>
        <div class="stat"><div class="n">{{ data.summary.unsubscribed }}</div><div class="l">Unsubscribed</div></div>
      </div>

      <div class="cards">
        <div class="stat"><div class="n">{{ data.conversions.count }}</div><div class="l">Conversions</div></div>
        <div class="stat"><div class="n">{{ data.conversions.cost ?? '—' }}</div><div class="l">Cost</div></div>
        <div class="stat"><div class="n">{{ data.conversions.cost_per_conversion ?? '—' }}</div><div class="l">Cost / conversion</div></div>
      </div>

      <h3>Per-link breakdown</h3>
      <table>
        <thead><tr><th>Label</th><th>Type</th><th>Destination</th><th>Clicks</th><th>Conversions</th></tr></thead>
        <tbody>
          <tr v-for="l in data.links" :key="l.id">
            <td>{{ l.label ?? '—' }}</td>
            <td><span class="badge badge-gray">{{ l.link_type }}</span></td>
            <td class="mono">{{ l.destination_url }}</td>
            <td>{{ l.clicks }}</td>
            <td>{{ l.conversions }}</td>
          </tr>
          <tr v-if="!data.links.length"><td colspan="5" class="state">No tracked links on this campaign.</td></tr>
        </tbody>
      </table>
      <p class="muted" style="margin-top:.5rem">Generated {{ new Date(data.generated_at).toLocaleString() }}.</p>
    </template>
  </section>
</template>
