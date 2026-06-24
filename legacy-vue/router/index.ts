import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { auth, ensureAuthReady } from '@/stores/auth';

const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'login', component: () => import('@/pages/Login.vue'), meta: { public: true } },
  { path: '/', name: 'dashboard', component: () => import('@/pages/Dashboard.vue') },
  { path: '/contacts', name: 'contacts', component: () => import('@/pages/Contacts.vue') },
  { path: '/categories', name: 'categories', component: () => import('@/pages/Categories.vue') },
  { path: '/templates', name: 'templates', component: () => import('@/pages/Templates.vue') },
  { path: '/campaigns', name: 'campaigns', component: () => import('@/pages/Campaigns.vue') },
  { path: '/analytics', name: 'analytics', component: () => import('@/pages/Analytics.vue') },
  { path: '/settings', name: 'settings', component: () => import('@/pages/Settings.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Gate every non-public route on an authenticated admin session.
router.beforeEach(async (to) => {
  await ensureAuthReady();

  if (to.meta.public) {
    return auth.isAdmin.value && to.name === 'login' ? { name: 'dashboard' } : true;
  }

  if (!auth.isAdmin.value) {
    return { name: 'login', query: to.fullPath !== '/' ? { redirect: to.fullPath } : undefined };
  }

  return true;
});
