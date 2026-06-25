import { apiClient } from '@/api/client';
import type { ReportOnboarding, ReportOverview, ReportParams, ReportRegistration } from '@/types';

const BASE = '/api/admin/reports';

export async function reportOverview(params: ReportParams = {}): Promise<ReportOverview> {
  const { data } = await apiClient.get(`${BASE}/overview`, { params });
  return data.data;
}

export async function reportRegistration(params: ReportParams = {}): Promise<ReportRegistration> {
  const { data } = await apiClient.get(`${BASE}/registration`, { params });
  return data.data;
}

export async function reportOnboarding(params: ReportParams = {}): Promise<ReportOnboarding> {
  const { data } = await apiClient.get(`${BASE}/onboarding`, { params });
  return data.data;
}
