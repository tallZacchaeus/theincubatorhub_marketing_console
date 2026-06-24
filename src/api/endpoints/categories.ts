import { apiClient } from '@/api/client';
import type { Category, FilterOptions, PreviewCount } from '@/types';

const BASE = '/api/admin/marketing/categories';

export async function listCategories(): Promise<Category[]> {
  const { data } = await apiClient.get(BASE);
  return data.data.categories;
}

export async function filterOptions(): Promise<FilterOptions> {
  const { data } = await apiClient.get(`${BASE}/filter-options`);
  return data.data;
}

export async function createCategory(payload: {
  name: string;
  audience_type: string;
  description?: string;
  filter_definition?: Record<string, unknown>;
}): Promise<Category> {
  const { data } = await apiClient.post(BASE, payload);
  return data.data.category;
}

export async function updateCategory(id: number, payload: Partial<Category>): Promise<Category> {
  const { data } = await apiClient.patch(`${BASE}/${id}`, payload);
  return data.data.category;
}

export async function deleteCategory(id: number): Promise<void> {
  await apiClient.delete(`${BASE}/${id}`);
}

export async function previewCount(id: number): Promise<PreviewCount> {
  const { data } = await apiClient.get(`${BASE}/${id}/preview-count`);
  return data.data;
}
