import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Base URL: Vite env first, else the Laravel dev default. Trailing slashes are
// trimmed so endpoint paths stay absolute (`/api/...`, `/sanctum/...`).
const rawBase = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8080';
export const API_BASE_URL = rawBase.replace(/\/+$/, '');

// Sanctum stateful SPA: cookies travel on every request, and the XSRF-TOKEN
// cookie is mirrored into the X-XSRF-TOKEN header on mutating calls. The console
// shares the admin session with the main app via SESSION_DOMAIN.
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

const MUTATING = new Set(['post', 'put', 'patch', 'delete']);
let csrfPromise: Promise<void> | null = null;

// Lazily ensure a session + XSRF cookie before the first mutating call; the
// promise is cached so a burst of writes triggers one round-trip.
export function ensureCsrf(force = false): Promise<void> {
  if (force) csrfPromise = null;
  if (!csrfPromise) {
    csrfPromise = apiClient
      .get('/sanctum/csrf-cookie')
      .then(() => undefined)
      .catch((error) => {
        csrfPromise = null;
        throw error;
      });
  }
  return csrfPromise;
}

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const method = (config.method ?? 'get').toLowerCase();
  if (MUTATING.has(method) && !config.url?.includes('/sanctum/csrf-cookie')) {
    await ensureCsrf();
  }
  return config;
});
