import { apiClient } from '@/api/client';
import type { CampaignAnalytics } from '@/types';

export async function campaignAnalytics(broadcastId: number): Promise<CampaignAnalytics> {
  const { data } = await apiClient.get(`/api/admin/marketing/broadcasts/${broadcastId}/analytics`);
  return data.data;
}
