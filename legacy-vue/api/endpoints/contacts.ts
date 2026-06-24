import { apiClient } from '@/api/client';
import type { Contact, ImportSummary, PageMeta } from '@/types';

const BASE = '/api/admin/marketing/contacts';

export interface ContactFilters {
  q?: string;
  status?: string;
  source?: string;
  limit?: number;
  offset?: number;
}

export async function listContacts(filters: ContactFilters = {}): Promise<{ contacts: Contact[]; meta: PageMeta }> {
  const { data } = await apiClient.get(BASE, { params: filters });
  return { contacts: data.data.contacts, meta: data.meta };
}

export async function createContact(payload: {
  email: string;
  name?: string;
  phone?: string;
  source?: string;
  consent_marketing: boolean;
  consent_source?: string;
}): Promise<Contact> {
  const { data } = await apiClient.post(BASE, payload);
  return data.data.contact;
}

export async function updateContact(id: number, payload: Partial<Contact>): Promise<Contact> {
  const { data } = await apiClient.patch(`${BASE}/${id}`, payload);
  return data.data.contact;
}

export async function unsubscribeContact(id: number): Promise<Contact> {
  const { data } = await apiClient.post(`${BASE}/${id}/unsubscribe`);
  return data.data.contact;
}

export async function deleteContact(id: number): Promise<void> {
  await apiClient.delete(`${BASE}/${id}`);
}

export async function importContacts(payload: {
  file: File;
  consent_marketing: boolean;
  consent_source: string;
  source?: string;
}): Promise<{ import_id: string }> {
  const form = new FormData();
  form.append('file', payload.file);
  form.append('consent_marketing', payload.consent_marketing ? '1' : '0');
  form.append('consent_source', payload.consent_source);
  if (payload.source) form.append('source', payload.source);
  const { data } = await apiClient.post(`${BASE}/import`, form);
  return data.data;
}

export async function importStatus(importId: string): Promise<ImportSummary> {
  const { data } = await apiClient.get(`${BASE}/import/${importId}`);
  return data.data;
}
