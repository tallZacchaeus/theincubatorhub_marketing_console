<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { auth } from '@/stores/auth';

const route = useRoute();
const router = useRouter();

const nav = [
  { to: '/', label: 'Dashboard' },
  { to: '/contacts', label: 'Contacts' },
  { to: '/categories', label: 'Categories' },
  { to: '/templates', label: 'Templates' },
  { to: '/campaigns', label: 'Campaigns' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/settings', label: 'Settings' },
];

async function signOut() {
  await auth.logout();
  router.push({ name: 'login' });
}
</script>

<template>
  <!-- Login renders bare; everything else inside the authed shell. -->
  <router-view v-if="route.meta.public" />

  <div v-else class="shell">
    <aside class="sidebar">
      <div class="brand">Marketing Console</div>
      <nav>
        <router-link v-for="item in nav" :key="item.to" :to="item.to" class="nav-link">
          {{ item.label }}
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <div class="who">{{ auth.user.value?.name }}</div>
        <button class="link-button" @click="signOut">Sign out</button>
      </div>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>
