<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiErrorMessage } from '@/api/errors';
import { listBroadcasts } from '@/api/endpoints/broadcasts';
import { auth } from '@/stores/auth';
import type { Broadcast } from '@/types';

const router = useRouter();
const campaigns = ref<Broadcast[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const counts = computed(() => {
  const c: Record<string, number> = {};
  for (const b of campaigns.value) c[b.status] = (c[b.status] ?? 0) + 1;
  return c;
});

async function load() {
  loading.value = true;
  error.value = null;
  try {
    campaigns.value = (await listBroadcasts({ limit: 10 })).campaigns;
  } catch (e) {
    error.value = apiErrorMessage(e);
  } finally {
    loading.value = false;
  }
}

function statusBadge(s: string): string {
  if (s === 'sent') return 'badge-green';
  if (s === 'draft') return 'badge-gray';
  if (s === 'paused' || s === 'failed') return 'badge-red';
  return 'badge-amber';
}

onMounted(() => load());
</script>

<template>
  <section class="page">
    <h1>Welcome, {{ auth.user.value?.name }}</h1>
    <p class="muted">Marketing Campaign Console</p>

    <div class="cards">
      <div class="stat"><div class="n">{{ campaigns.length }}</div><div class="l">Recent campaigns</div></div>
      <div class="stat"><div class="n">{{ counts['draft'] ?? 0 }}</div><div class="l">Drafts</div></div>
      <div class="stat"><div class="n">{{ counts['sending'] ?? 0 }}</div><div class="l">Sending</div></div>
      <div class="stat"><div class="n">{{ counts['sent'] ?? 0 }}</div><div class="l">Sent</div></div>
    </div>

    <div class="page-head">
      <h3 style="margin:0">Recent campaigns</h3>
      <button class="btn btn-primary" @click="router.push('/campaigns')">New campaign</button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="loading" class="state">Loading…</p>
    <table v-else>
      <thead><tr><th>Name</th><th>Status</th><th>Segment</th><th>Sent</th></tr></thead>
      <tbody>
        <tr v-for="c in campaigns" :key="c.id">
          <td>{{ c.name ?? '—' }}</td>
          <td><span class="badge" :class="statusBadge(c.status)">{{ c.status }}</span></td>
          <td>{{ c.category.name ?? '—' }}</td>
          <td>{{ c.sent_at ? new Date(c.sent_at).toLocaleDateString() : '—' }}</td>
        </tr>
        <tr v-if="!campaigns.length"><td colspan="4" class="state">No campaigns yet. Create your first one.</td></tr>
      </tbody>
    </table>
  </section>
</template>
