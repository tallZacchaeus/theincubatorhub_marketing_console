<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { apiErrorMessage } from '@/api/errors';
import {
  createTemplate,
  deleteTemplate,
  listTemplates,
  previewTemplate,
  updateTemplate,
} from '@/api/endpoints/templates';
import type { RenderedPreview, Template } from '@/types';

const templates = ref<Template[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const saving = ref(false);

const editing = ref<Template | null>(null);
const form = reactive({ name: '', subject: '', html_body: '', text_body: '' });
const preview = ref<RenderedPreview | null>(null);

// Literal placeholder hint (kept in script so the double-brace doesn't confuse
// the Vue template compiler).
const placeholderHint = '{{ first_name }}, {{ name }}, {{ email }}';

async function load() {
  loading.value = true;
  error.value = null;
  try {
    templates.value = await listTemplates();
  } catch (e) {
    error.value = apiErrorMessage(e);
  } finally {
    loading.value = false;
  }
}

function newTemplate() {
  editing.value = { id: 0 } as Template;
  Object.assign(form, { name: '', subject: '', html_body: '<p>Hi {{ first_name }},</p>\n<p></p>', text_body: '' });
  preview.value = null;
}

function edit(t: Template) {
  editing.value = t;
  Object.assign(form, { name: t.name, subject: t.subject, html_body: t.html_body ?? '', text_body: t.text_body ?? '' });
  preview.value = null;
}

async function runPreview() {
  error.value = null;
  try {
    preview.value = await previewTemplate({ subject: form.subject, html_body: form.html_body, text_body: form.text_body || undefined });
  } catch (e) {
    error.value = apiErrorMessage(e);
  }
}

async function save() {
  saving.value = true;
  error.value = null;
  try {
    if (editing.value && editing.value.id) {
      await updateTemplate(editing.value.id, { name: form.name, subject: form.subject, html_body: form.html_body, text_body: form.text_body || null });
    } else {
      await createTemplate({ name: form.name, subject: form.subject, html_body: form.html_body, text_body: form.text_body || undefined });
    }
    editing.value = null;
    await load();
  } catch (e) {
    error.value = apiErrorMessage(e);
  } finally {
    saving.value = false;
  }
}

async function doDelete(t: Template) {
  if (!confirm(`Delete template “${t.name}”?`)) return;
  try {
    await deleteTemplate(t.id);
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
      <h1>Templates</h1>
      <button class="btn btn-primary" @click="newTemplate">New template</button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="editing">
      <div class="split">
        <div>
          <div class="field"><label>Name</label><input v-model="form.name" required /></div>
          <div class="field"><label>Subject</label><input v-model="form.subject" /></div>
          <div class="field"><label>HTML body</label><textarea v-model="form.html_body"></textarea></div>
          <div class="field"><label>Text body (optional)</label><textarea v-model="form.text_body"></textarea></div>
          <div class="actions">
            <button class="btn" @click="runPreview">Preview</button>
            <button class="btn btn-primary" :disabled="saving" @click="save">{{ saving ? 'Saving…' : 'Save' }}</button>
            <button class="btn" @click="editing = null">Cancel</button>
          </div>
          <p class="muted" style="margin-top:.5rem">Placeholders: <code class="mono">{{ placeholderHint }}</code>. Values are HTML-escaped.</p>
        </div>
        <div>
          <label class="muted">Preview (sample recipient)</label>
          <div class="preview-pane">
            <template v-if="preview">
              <div class="muted" style="font-size:.8rem">Subject</div>
              <div style="margin-bottom:.75rem"><strong>{{ preview.subject }}</strong></div>
              <hr class="sep" />
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="preview.html"></div>
            </template>
            <p v-else class="muted">Click Preview to render.</p>
          </div>
        </div>
      </div>
      <hr class="sep" />
    </div>

    <p v-if="loading" class="state">Loading…</p>
    <table v-else>
      <thead><tr><th>Name</th><th>Subject</th><th>Variables</th><th></th></tr></thead>
      <tbody>
        <tr v-for="t in templates" :key="t.id">
          <td>{{ t.name }}</td>
          <td>{{ t.subject }}</td>
          <td class="mono">{{ (t.variables || []).join(', ') || '—' }}</td>
          <td class="actions">
            <button class="btn btn-sm" @click="edit(t)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="doDelete(t)">Delete</button>
          </td>
        </tr>
        <tr v-if="!templates.length"><td colspan="4" class="state">No templates yet.</td></tr>
      </tbody>
    </table>
  </section>
</template>
