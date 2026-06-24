<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import Modal from '@/components/Modal.vue';
import { apiErrorMessage } from '@/api/errors';
import {
  createContact,
  deleteContact,
  importContacts,
  importStatus,
  listContacts,
  unsubscribeContact,
} from '@/api/endpoints/contacts';
import type { Contact, ImportSummary, PageMeta } from '@/types';

const contacts = ref<Contact[]>([]);
const meta = ref<PageMeta>({ total: 0, limit: 25, offset: 0, has_more: false });
const loading = ref(false);
const error = ref<string | null>(null);

const filters = reactive({ q: '', status: '' });

const showCreate = ref(false);
const showImport = ref(false);
const saving = ref(false);
const form = reactive({ email: '', name: '', consent_marketing: true, consent_source: '' });

const importForm = reactive({ file: null as File | null, consent_marketing: true, consent_source: '', source: '' });
const importResult = ref<ImportSummary | null>(null);

async function load(offset = 0) {
  loading.value = true;
  error.value = null;
  try {
    const res = await listContacts({ q: filters.q || undefined, status: filters.status || undefined, offset, limit: meta.value.limit });
    contacts.value = res.contacts;
    meta.value = res.meta;
  } catch (e) {
    error.value = apiErrorMessage(e);
  } finally {
    loading.value = false;
  }
}

async function submitCreate() {
  saving.value = true;
  error.value = null;
  try {
    await createContact({ email: form.email, name: form.name || undefined, consent_marketing: form.consent_marketing, consent_source: form.consent_source || undefined });
    showCreate.value = false;
    Object.assign(form, { email: '', name: '', consent_marketing: true, consent_source: '' });
    await load();
  } catch (e) {
    error.value = apiErrorMessage(e);
  } finally {
    saving.value = false;
  }
}

function onFile(e: Event) {
  importForm.file = (e.target as HTMLInputElement).files?.[0] ?? null;
}

async function submitImport() {
  if (!importForm.file) return;
  saving.value = true;
  error.value = null;
  importResult.value = null;
  try {
    const { import_id } = await importContacts({
      file: importForm.file,
      consent_marketing: importForm.consent_marketing,
      consent_source: importForm.consent_source,
      source: importForm.source || undefined,
    });
    // Poll the import status a few times (sync queue completes fast).
    for (let i = 0; i < 6; i++) {
      const summary = await importStatus(import_id);
      importResult.value = summary;
      if (summary.status === 'completed' || summary.status === 'failed') break;
      await new Promise((r) => setTimeout(r, 600));
    }
    await load();
  } catch (e) {
    error.value = apiErrorMessage(e);
  } finally {
    saving.value = false;
  }
}

async function doUnsubscribe(c: Contact) {
  if (!confirm(`Unsubscribe ${c.email}?`)) return;
  try {
    await unsubscribeContact(c.id);
    await load(meta.value.offset);
  } catch (e) {
    error.value = apiErrorMessage(e);
  }
}

async function doDelete(c: Contact) {
  if (!confirm(`Delete ${c.email}? This cannot be undone.`)) return;
  try {
    await deleteContact(c.id);
    await load(meta.value.offset);
  } catch (e) {
    error.value = apiErrorMessage(e);
  }
}

function statusBadge(s: string): string {
  return s === 'subscribed' ? 'badge-green' : s === 'unsubscribed' ? 'badge-gray' : 'badge-red';
}

onMounted(() => load());
</script>

<template>
  <section class="page">
    <div class="page-head">
      <h1>Contacts</h1>
      <div class="actions">
        <button class="btn" @click="showImport = true">Import CSV</button>
        <button class="btn btn-primary" @click="showCreate = true">Add contact</button>
      </div>
    </div>

    <div class="toolbar">
      <input v-model="filters.q" placeholder="Search email or name" @keyup.enter="load()" />
      <select v-model="filters.status" @change="load()">
        <option value="">All statuses</option>
        <option value="subscribed">Subscribed</option>
        <option value="unsubscribed">Unsubscribed</option>
        <option value="bounced">Bounced</option>
        <option value="complained">Complained</option>
      </select>
      <button class="btn" @click="load()">Filter</button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="loading" class="state">Loading…</p>

    <table v-else>
      <thead>
        <tr><th>Email</th><th>Name</th><th>Status</th><th>Consent</th><th>Source</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="c in contacts" :key="c.id">
          <td class="mono">{{ c.email }}</td>
          <td>{{ c.name ?? '—' }}</td>
          <td><span class="badge" :class="statusBadge(c.status)">{{ c.status }}</span></td>
          <td>{{ c.consent_marketing ? 'Yes' : 'No' }}</td>
          <td>{{ c.source ?? '—' }}</td>
          <td class="actions">
            <button v-if="c.status === 'subscribed'" class="btn btn-sm" @click="doUnsubscribe(c)">Unsubscribe</button>
            <button class="btn btn-sm btn-danger" @click="doDelete(c)">Delete</button>
          </td>
        </tr>
        <tr v-if="!contacts.length"><td colspan="6" class="state">No contacts.</td></tr>
      </tbody>
    </table>

    <div class="pager">
      <button class="btn btn-sm" :disabled="meta.offset === 0" @click="load(Math.max(0, meta.offset - meta.limit))">Prev</button>
      <span class="muted">{{ meta.total ? meta.offset + 1 : 0 }}–{{ meta.offset + contacts.length }} of {{ meta.total }}</span>
      <button class="btn btn-sm" :disabled="!meta.has_more" @click="load(meta.offset + meta.limit)">Next</button>
    </div>

    <Modal v-if="showCreate" title="Add contact" @close="showCreate = false">
      <form @submit.prevent="submitCreate">
        <div class="field"><label>Email</label><input v-model="form.email" type="email" required /></div>
        <div class="field"><label>Name</label><input v-model="form.name" /></div>
        <div class="field"><label><input type="checkbox" v-model="form.consent_marketing" /> Has marketing consent</label></div>
        <div class="field"><label>Consent source</label><input v-model="form.consent_source" placeholder="e.g. signup form" /></div>
        <button class="btn btn-primary" :disabled="saving">{{ saving ? 'Saving…' : 'Create' }}</button>
      </form>
    </Modal>

    <Modal v-if="showImport" title="Import contacts (CSV)" @close="showImport = false">
      <form @submit.prevent="submitImport">
        <p class="muted">Columns: email (required), name, phone, source, consent_marketing, consent_source.</p>
        <div class="field"><label>CSV file</label><input type="file" accept=".csv,text/csv" @change="onFile" required /></div>
        <div class="field"><label><input type="checkbox" v-model="importForm.consent_marketing" /> Default consent for rows without a value</label></div>
        <div class="field"><label>Consent source (lawful basis)</label><input v-model="importForm.consent_source" required /></div>
        <div class="field"><label>Source tag</label><input v-model="importForm.source" placeholder="e.g. partner-event" /></div>
        <button class="btn btn-primary" :disabled="saving || !importForm.file">{{ saving ? 'Importing…' : 'Import' }}</button>
      </form>
      <div v-if="importResult" class="cards" style="margin-top:1rem">
        <div class="stat"><div class="n">{{ importResult.imported ?? 0 }}</div><div class="l">Imported</div></div>
        <div class="stat"><div class="n">{{ (importResult.duplicates_in_file ?? 0) + (importResult.duplicates_existing ?? 0) }}</div><div class="l">Duplicates</div></div>
        <div class="stat"><div class="n">{{ importResult.suppressed ?? 0 }}</div><div class="l">Suppressed</div></div>
        <div class="stat"><div class="n">{{ importResult.invalid ?? 0 }}</div><div class="l">Invalid</div></div>
      </div>
    </Modal>
  </section>
</template>
