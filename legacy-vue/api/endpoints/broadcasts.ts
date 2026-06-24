import { apiClient } from '@/api/client';
import type { Broadcast, PageMeta, RenderedPreview } from '@/types';

const BASE = '/api/admin/marketing/broadcasts';

export async function listBroadcasts(params: { limit?: number; offset?: number } = {}): Promise<{ campaigns: Broadcast[]; meta: PageMeta }> {
  const { data } = await apiClient.get(BASE, { params });
  return { campaigns: data.data.campaigns, meta: data.meta };
}

export async function getBroadcast(id: number): Promise<Broadcast> {
  const { data } = await apiClient.get(`${BASE}/${id}`);
  return data.data.campaign;
}

export async function createBroadcast(payload: {
  name: string;
  marketing_template_id: number;
  marketing_category_id: number;
  from_name: string;
  from_email: string;
  cost?: number;
}): Promise<Broadcast> {
  const { data } = await apiClient.post(BASE, payload);
  return data.data.campaign;
}

export async function updateBroadcast(id: number, payload: Record<string, unknown>): Promise<Broadcast> {
  const { data } = await apiClient.patch(`${BASE}/${id}`, payload);
  return data.data.campaign;
}

export async function deleteBroadcast(id: number): Promise<void> {
  await apiClient.delete(`${BASE}/${id}`);
}

export async function previewBroadcast(id: number): Promise<RenderedPreview & { from: { name: string | null; email: string | null } }> {
  const { data } = await apiClient.get(`${BASE}/${id}/preview`);
  return data.data;
}

export async function testSendBroadcast(id: number): Promise<{ sent_to: string }> {
  const { data } = await apiClient.post(`${BASE}/${id}/test-send`);
  return data.data;
}

export async function scheduleBroadcast(id: number, scheduledAt: string): Promise<Broadcast> {
  const { data } = await apiClient.post(`${BASE}/${id}/schedule`, { scheduled_at: scheduledAt });
  return data.data.campaign;
}

export async function sendBroadcast(id: number): Promise<Broadcast> {
  const { data } = await apiClient.post(`${BASE}/${id}/send`);
  return data.data.campaign;
}

export async function pauseBroadcast(id: number): Promise<Broadcast> {
  const { data } = await apiClient.post(`${BASE}/${id}/pause`);
  return data.data.campaign;
}
