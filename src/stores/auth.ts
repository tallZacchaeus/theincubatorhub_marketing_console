import { computed, reactive } from 'vue';
import type { AuthUser } from '@/api/auth';
import { fetchMe, login as apiLogin, logout as apiLogout } from '@/api/auth';

interface AuthState {
  user: AuthUser | null;
  ready: boolean; // initial session check completed
}

const state = reactive<AuthState>({ user: null, ready: false });

let initPromise: Promise<void> | null = null;

/** Resolve the current session once (cached). Safe to call from the guard. */
export function ensureAuthReady(): Promise<void> {
  if (!initPromise) {
    initPromise = fetchMe()
      .then((user) => {
        state.user = user;
      })
      .catch(() => {
        state.user = null;
      })
      .finally(() => {
        state.ready = true;
      });
  }
  return initPromise;
}

export const auth = {
  state,
  user: computed(() => state.user),
  isAuthenticated: computed(() => state.user !== null),
  isAdmin: computed(() => state.user?.role === 'admin'),

  async login(email: string, password: string): Promise<AuthUser> {
    const user = await apiLogin(email, password);
    state.user = user;
    state.ready = true;
    return user;
  },

  async logout(): Promise<void> {
    try {
      await apiLogout();
    } finally {
      state.user = null;
    }
  },
};
