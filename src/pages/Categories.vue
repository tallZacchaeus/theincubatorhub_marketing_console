<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import Modal from '@/components/Modal.vue';
import { apiErrorMessage } from '@/api/errors';
import {
  createCategory,
  deleteCategory,
  filterOptions,
  listCategories,
  previewCount,
} from '@/api/endpoints/categories';
import type { Category, FilterOptions, PreviewCount } from '@/types';

const categories = ref<Category[]>([]);
const options = ref<FilterOptions | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const showCreate = ref(false);
const saving = ref(false);
const form = reactive({
  name: '',
  audience_type: 'app_users' as string,
  description: '',
  stage: '',
  programme_of_interest: '',
  source: '',
});

const counts = ref<Record<number, PreviewCount>>({});

async function load() {
  loading.value = true;
  error.value = null;
  try {
    const [cats, opts] = await Promise.all([listCategories(), options.value ? Promise.resolve(options.value) : filterOptions()]);
    categories.value = cats;
    options.value = opts;
  } catch (e) {
    error.value = apiErrorMessage(e);
  } finally {
    loading.value = false;
  }
}

function buildFilterDefinition(): Record<string, unknown> {
  const def: Record<string, unknown> = {};
  if (form.audience_type !== 'contacts') {
    if (form.stage) def.stage = form.stage;
    if (form.programme_of_interest) def.programme_of_interest = form.programme_of_interest;
  }
  if (form.audience_type !== 'app_users' && form.source) def.source = form.source;
  return def;
}

async function submitCreate() {
  saving.value = true;
  error.value = null;
  try {
    await createCategory({
      name: form.name,
      audience_type: form.audience_type,
      description: form.description || undefined,
      filter_definition: buildFilterDefinition(),
    });
    showCreate.value = false;
    Object.assign(form, { name: '', audience_type: 'app_users', description: '', stage: '', programme_of_interest: '', source: '' });
    await load();
  } catch (e) {
    error.value = apiErrorMessage(e);
  } finally {
    saving.value = false;
  }
}

async function preview(c: Category) {
  try {
    counts.value = { ...counts.value, [c.id]: await previewCount(c.id) };
  } catch (e) {
    error.value = apiErrorMessage(e);
  }
}

async function doDelete(c: Category) {
  if (!confirm(`Delete category “${c.name}”?`)) return;
  try {
    await deleteCategory(c.id);
    await load();
  } catch (e) {
    error.value = apiErrorMessage(e);
  }
}

onMounted(() => load());
</script>

<template>
  <section class="page">
    <div class="page-head">
      <h1>Categories &amp; segments</h1>
      <button class="btn btn-primary" @click="showCreate = true">New segment</button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="loading" class="state">Loading…</p>

    <table v-else>
      <thead>
        <tr><th>Name</th><th>Audience</th><th>Filter</th><th>Live count</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="c in categories" :key="c.id">
          <td>{{ c.name }}<div class="muted" style="font-size:.8rem">{{ c.slug }}</div></td>
          <td><span class="badge badge-gray">{{ c.audience_type }}</span></td>
          <td class="mono">{{ Object.keys(c.filter_definition || {}).length ? JSON.stringify(c.filter_definition) : '—' }}</td>
          <td>
            <strong v-if="counts[c.id]">{{ counts[c.id].count }}</strong>
            <span v-else class="muted">—</span>
          </td>
          <td class="actions">
            <button class="btn btn-sm" @click="preview(c)">Preview count</button>
            <button class="btn btn-sm btn-danger" @click="doDelete(c)">Delete</button>
          </td>
        </tr>
        <tr v-if="!categories.length"><td colspan="5" class="state">No segments yet.</td></tr>
      </tbody>
    </table>

    <Modal v-if="showCreate" title="New segment" @close="showCreate = false">
      <form @submit.prevent="submitCreate">
        <div class="field"><label>Name</label><input v-model="form.name" required /></div>
        <div class="field">
          <label>Audience type</label>
          <select v-model="form.audience_type">
            <option v-for="t in options?.audience_types ?? []" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>

        <template v-if="form.audience_type !== 'contacts'">
          <div class="field">
            <label>Journey stage (app users)</label>
            <select v-model="form.stage">
              <option value="">Any stage</option>
              <option v-for="s in options?.app_user_stages ?? []" :key="s.key" :value="s.key">{{ s.label }}</option>
            </select>
          </div>
          <div class="field">
            <label>Programme of interest</label>
            <select v-model="form.programme_of_interest">
              <option value="">Any</option>
              <option v-for="p in options?.app_user_filters?.programme_of_interest ?? []" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>
        </template>

        <div v-if="form.audience_type !== 'app_users'" class="field">
          <label>Contact source filter</label>
          <input v-model="form.source" placeholder="e.g. partner-event" />
        </div>

        <div class="field"><label>Description</label><input v-model="form.description" /></div>
        <button class="btn btn-primary" :disabled="saving">{{ saving ? 'Saving…' : 'Create segment' }}</button>
      </form>
    </Modal>
  </section>
</template>
