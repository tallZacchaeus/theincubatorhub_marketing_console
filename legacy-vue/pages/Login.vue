<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { auth } from '@/stores/auth';

const email = ref('');
const password = ref('');
const error = ref<string | null>(null);
const busy = ref(false);

const route = useRoute();
const router = useRouter();

async function submit() {
  error.value = null;
  busy.value = true;
  try {
    const user = await auth.login(email.value, password.value);
    if (user.role !== 'admin') {
      await auth.logout();
      error.value = 'This console is for administrators only.';
      return;
    }
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/';
    router.push(redirect);
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string }; status?: number } };
    error.value = err.response?.data?.message ?? 'Sign in failed. Check your credentials.';
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <div class="login-wrap">
    <form class="login-card" @submit.prevent="submit">
      <h1>Marketing Console</h1>
      <p class="muted">Sign in with your admin account.</p>

      <label for="email">Email</label>
      <input id="email" v-model="email" type="email" autocomplete="username" required />

      <label for="password">Password</label>
      <input id="password" v-model="password" type="password" autocomplete="current-password" required />

      <p v-if="error" class="error">{{ error }}</p>

      <button type="submit" :disabled="busy">{{ busy ? 'Signing in…' : 'Sign in' }}</button>
    </form>
  </div>
</template>
