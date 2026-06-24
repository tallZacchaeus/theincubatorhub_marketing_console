<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import Modal from '@/components/Modal.vue';
import { apiErrorMessage } from '@/api/errors';
import {
  createBroadcast,
  deleteBroadcast,
  getBroadcast,
  listBroadcasts,
  pauseBroadcast,
  previewBroadcast,
  scheduleBroadcast,
  sendBroadcast,
  testSendBroadcast,
} from '@/api/endpoints/broadcasts';
import { createLink, deleteLink, listLinks } from '@/api/endpoints/links';
import { listCategories } from '@/api/endpoints/categories';
import { listTemplates } from '@/api/endpoints/templates';
import type { Broadcast, Category, RenderedPreview, Template, TrackedLink } from '@/types';

const campaigns = ref<Broadcast[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const notice = ref<string | null>(null);

const templates = ref<Template[]>([]);
const categories = ref<Category[]>([]);

const showCreate = ref(false);
const saving = ref(false);
const form = reactive({ name: '', marketing_template_id: 0, marketing_category_id: 0, from_name: 'The Incubator', from_email: '', cost: '' });

const selected = ref<Broadcast | null>(null);
const links = ref<TrackedLink[]>([]);
const preview = ref<(RenderedPreview & { from: { name: string | null; email: string | null } }) | null>(null);
const scheduleAt = ref('');
const linkForm = reactive({ destination_url: '', link_type: 'reengagement', label: '', utm_source: '', utm_medium: '', utm_campaign: '' });

function flash(msg: string) {
  notice.value = msg;
  setTimeout(() => (notice.value = null), 4000);
}

async function load() {
  loading.value = true;
  error.value = null;
  try {
    campaigns.value = (await listBroadcasts({ limit: 50 })).campaigns;
  } catch (e) {
    error.value = apiErrorMessage(e);
  } finally {
    loading.value = false;
  }
}

async function openCreate() {
  error.value = null;
  try {
    [templates.value, categories.value] = await Promise.all([listTemplates(), listCategories()]);
    showCreate.value = true;
  } catch (e) {
    error.value = apiErrorMessage(e);
  }
}

async function submitCreate() {
  saving.value = true;
  error.value = null;
  try {
    const campaign = await createBroadcast({
      name: form.name,
      marketing_template_id: Number(form.marketing_template_id),
      marketing_category_id: Number(form.marketing_category_id),
      from_name: form.from_name,
      from_email: form.from_email,
      cost: form.cost ? Number(form.cost) : undefined,
    });
    showCreate.value = false;
    Object.assign(form, { name: '', marketing_template_id: 0, marketing_category_id: 0, from_name: 'The Incubator', from_email: '', cost: '' });
    await load();
    await select(campaign);
  } catch (e) {
    error.value = apiErrorMessage(e);
  } finally {
    saving.value = false;
  }
}

async function select(c: Broadcast) {
  error.value = null;
  preview.value = null;
  try {
    selected.value = await getBroadcast(c.id);
    links.value = await listLinks({ marketing_campaign_id: c.id });
  } catch (e) {
    error.value = apiErrorMessage(e);
  }
}

async function refreshSelected() {
  if (selected.value) {
    await select(selected.value);
    await load();
  }
}

async function addLink() {
  if (!selected.value) return;
  saving.value = true;
  error.value = null;
  try {
    await createLink({
      destination_url: linkForm.destination_url,
      link_type: linkForm.link_type,
      label: linkForm.label || undefined,
      marketing_campaign_id: selected.value.id,
      marketing_category_id: selected.value.category.id ?? undefined,
      utm_source: linkForm.utm_source || undefined,
      utm_medium: linkForm.utm_medium || undefined,
      utm_campaign: linkForm.utm_campaign || undefined,
    });
    Object.assign(linkForm, { destination_url: '', link_type: 'reengagement', label: '', utm_source: '', utm_medium: '', utm_campaign: '' });
    links.value = await listLinks({ marketing_campaign_id: selected.value.id });
  } catch (e) {
    error.value = apiErrorMessage(e);
  } finally {
    saving.value = false;
  }
}

async function removeLink(l: TrackedLink) {
  try {
    await deleteLink(l.id);
    if (selected.value) links.value = await listLinks({ marketing_campaign_id: selected.value.id });
  } catch (e) {
    error.value = apiErrorMessage(e);
  }
}

async function doPreview() {
  if (!selected.value) return;
  try {
    preview.value = await previewBroadcast(selected.value.id);
  } catch (e) {
    error.value = apiErrorMessage(e);
  }
}

async function doTestSend() {
  if (!selected.value) return;
  try {
    const { sent_to } = await testSendBroadcast(selected.value.id);
    flash(`Test email sent to ${sent_to}.`);
  } catch (e) {
    error.value = apiErrorMessage(e);
  }
}

async function doSchedule() {
  if (!selected.value || !scheduleAt.value) return;
  try {
    await scheduleBroadcast(selected.value.id, new Date(scheduleAt.value).toISOString());
    flash('Campaign scheduled.');
    await refreshSelected();
  } catch (e) {
    error.value = apiErrorMessage(e);
  }
}

async function doSend() {
  if (!selected.value) return;
  if (!confirm('Send this campaign now to the full segment?')) return;
  try {
    await sendBroadcast(selected.value.id);
    flash('Campaign send dispatched.');
    await refreshSelected();
  } catch (e) {
    error.value = apiErrorMessage(e);
  }
}

async function doPause() {
  if (!selected.value) return;
  try {
    await pauseBroadcast(selected.value.id);
    flash('Campaign paused.');
    await refreshSelected();
  } catch (e) {
    error.value = apiErrorMessage(e);
  }
}

async function doDelete(c: Broadcast) {
  if (!confirm(`Delete draft “${c.name}”?`)) return;
  try {
    await deleteBroadcast(c.id);
    if (selected.value?.id === c.id) selected.value = null;
    await load();
  } catch (e) {
    error.value = apiErrorMessage(e);
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
    <div class="page-head">
      <h1>Campaigns</h1>
      <button class="btn btn-primary" @click="openCreate">New campaign</button>
    </div>

    <p v-if="notice" class="badge badge-green" style="padding:.4rem .7rem">{{ notice }}</p>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="loading" class="state">Loading…</p>

    <table v-else>
      <thead><tr><th>Name</th><th>Status</th><th>Template</th><th>Segment</th><th>Scheduled</th><th></th></tr></thead>
      <tbody>
        <tr v-for="c in campaigns" :key="c.id">
          <td>{{ c.name ?? '—' }}</td>
          <td><span class="badge" :class="statusBadge(c.status)">{{ c.status }}</span></td>
          <td>{{ c.template.name ?? '—' }}</td>
          <td>{{ c.category.name ?? '—' }}</td>
          <td>{{ c.scheduled_at ? new Date(c.scheduled_at).toLocaleString() : '—' }}</td>
          <td class="actions">
            <button class="btn btn-sm" @click="select(c)">Open</button>
            <button v-if="c.status === 'draft'" class="btn btn-sm btn-danger" @click="doDelete(c)">Delete</button>
          </td>
        </tr>
        <tr v-if="!campaigns.length"><td colspan="6" class="state">No campaigns yet.</td></tr>
      </tbody>
    </table>

    <!-- Detail -->
    <div v-if="selected" style="margin-top:1.5rem">
      <hr class="sep" />
      <div class="page-head">
        <h2 style="margin:0">{{ selected.name }} <span class="badge" :class="statusBadge(selected.status)">{{ selected.status }}</span></h2>
        <button class="link-button" @click="selected = null">Close</button>
      </div>
      <p class="muted">From {{ selected.from.name }} &lt;{{ selected.from.email }}&gt; · Subject: <strong>{{ selected.subject }}</strong></p>

      <h3>Tracked links</h3>
      <table>
        <thead><tr><th>Label</th><th>Type</th><th>Destination</th><th>Tracked URL</th><th>Clicks</th><th></th></tr></thead>
        <tbody>
          <tr v-for="l in links" :key="l.id">
            <td>{{ l.label ?? '—' }}</td>
            <td><span class="badge badge-gray">{{ l.link_type }}</span></td>
            <td class="mono">{{ l.destination_url }}</td>
            <td class="mono">{{ l.tracked_url }}</td>
            <td>{{ l.click_count }}</td>
            <td><button class="btn btn-sm btn-danger" @click="removeLink(l)">×</button></td>
          </tr>
          <tr v-if="!links.length"><td colspan="6" class="state">No tracked links. Links inside the template are auto-tracked at send.</td></tr>
        </tbody>
      </table>

      <form class="toolbar" style="margin-top:.5rem" @submit.prevent="addLink">
        <input v-model="linkForm.destination_url" placeholder="https://destination" required style="min-width:16rem" />
        <select v-model="linkForm.link_type">
          <option value="reengagement">reengagement</option>
          <option value="acquisition">acquisition</option>
          <option value="referral">referral</option>
        </select>
        <input v-model="linkForm.label" placeholder="label" />
        <input v-model="linkForm.utm_source" placeholder="utm_source" />
        <button class="btn" :disabled="saving">Add link</button>
      </form>

      <hr class="sep" />
      <div class="toolbar">
        <button class="btn" @click="doPreview">Preview</button>
        <button class="btn" @click="doTestSend">Test-send to me</button>
        <input v-model="scheduleAt" type="datetime-local" />
        <button class="btn" :disabled="!scheduleAt" @click="doSchedule">Schedule</button>
        <button class="btn btn-primary" @click="doSend">Send now</button>
        <button class="btn" @click="doPause">Pause</button>
      </div>

      <div v-if="preview" class="preview-pane">
        <div class="muted" style="font-size:.8rem">Subject</div>
        <div style="margin-bottom:.75rem"><strong>{{ preview.subject }}</strong></div>
        <hr class="sep" />
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="preview.html"></div>
      </div>
    </div>

    <Modal v-if="showCreate" title="New campaign" @close="showCreate = false">
      <form @submit.prevent="submitCreate">
        <div class="field"><label>Name</label><input v-model="form.name" required /></div>
        <div class="field">
          <label>Template</label>
          <select v-model="form.marketing_template_id" required>
            <option :value="0" disabled>Choose a template…</option>
            <option v-for="t in templates" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>
        </div>
        <div class="field">
          <label>Segment (category)</label>
          <select v-model="form.marketing_category_id" required>
            <option :value="0" disabled>Choose a segment…</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }} ({{ c.audience_type }})</option>
          </select>
        </div>
        <div class="row">
          <div class="field"><label>From name</label><input v-model="form.from_name" required /></div>
          <div class="field"><label>From email</label><input v-model="form.from_email" type="email" required /></div>
        </div>
        <div class="field"><label>Cost (optional, for ROI)</label><input v-model="form.cost" type="number" min="0" step="0.01" /></div>
        <button class="btn btn-primary" :disabled="saving">{{ saving ? 'Creating…' : 'Create draft' }}</button>
      </form>
    </Modal>
  </section>
</template>
