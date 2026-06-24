import { apiClient, ensureCsrf } from '@/api/client';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

/** Log in with admin credentials over the shared Sanctum session. */
export async function login(email: string, password: string): Promise<AuthUser> {
  await ensureCsrf();
  const { data } = await apiClient.post('/api/login', { email, password });
  return data.data.user as AuthUser;
}

/** Rehydrate the authenticated user (throws 401 when not signed in). */
export async function fetchMe(): Promise<AuthUser> {
  const { data } = await apiClient.get('/api/student/me');
  return data.data.user as AuthUser;
}

export async function logout(): Promise<void> {
  await apiClient.post('/api/logout');
}
