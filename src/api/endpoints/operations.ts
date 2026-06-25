import { apiClient } from '@/api/client';
import type { AgentActivityInput, DailyOperationsPayload, OpsActivity, OpsChecklist } from '@/types-ops';

const BASE = '/api/admin/daily-operations';

/** Full operations console for a date (defaults to today). `team` is null for agents. */
export async function operationsOverview(date?: string): Promise<DailyOperationsPayload> {
  const { data } = await apiClient.get(BASE, { params: date ? { date } : undefined });
  return data.data;
}

/** Upsert the current agent's numbers (admins may pass agent_id; RBAC enforced server-side). */
export async function saveActivity(payload: AgentActivityInput): Promise<OpsActivity> {
  const { data } = await apiClient.put(`${BASE}/activity`, payload);
  return data.data.activity;
}

export async function saveChecklist(checked: Record<string, boolean>, date?: string): Promise<OpsChecklist> {
  const { data } = await apiClient.put(`${BASE}/checklist`, { checked, ...(date ? { date } : {}) });
  return data.data.checklist;
}

/** CSV of the team table (credentialed blob so the session cookie travels). */
export async function exportCsv(date?: string): Promise<Blob> {
  const { data } = await apiClient.get(`${BASE}/export`, {
    params: date ? { date } : undefined,
    responseType: 'blob',
  });
  return data as Blob;
}
