import { apiClient } from '@/api/client';
import type { RenderedPreview, Template } from '@/types';

const BASE = '/api/admin/marketing/email-templates';

export async function listTemplates(): Promise<Template[]> {
  const { data } = await apiClient.get(BASE);
  return data.data.templates;
}

export async function createTemplate(payload: {
  name: string;
  subject: string;
  html_body: string;
  text_body?: string;
}): Promise<Template> {
  const { data } = await apiClient.post(BASE, payload);
  return data.data.template;
}

export async function updateTemplate(id: number, payload: Partial<Template>): Promise<Template> {
  const { data } = await apiClient.patch(`${BASE}/${id}`, payload);
  return data.data.template;
}

export async function deleteTemplate(id: number): Promise<void> {
  await apiClient.delete(`${BASE}/${id}`);
}

export async function previewTemplate(payload: {
  subject?: string;
  html_body?: string;
  text_body?: string;
  sample?: Record<string, string>;
}): Promise<RenderedPreview> {
  const { data } = await apiClient.post(`${BASE}/preview`, payload);
  return data.data;
}
