<script setup lang="ts">
import { API_BASE_URL } from '@/api/client';
import { auth } from '@/stores/auth';
</script>

<template>
  <section class="page">
    <h1>Settings</h1>

    <h3>Account</h3>
    <table style="max-width:32rem">
      <tbody>
        <tr><th>Name</th><td>{{ auth.user.value?.name }}</td></tr>
        <tr><th>Email</th><td>{{ auth.user.value?.email }}</td></tr>
        <tr><th>Role</th><td><span class="badge">{{ auth.user.value?.role }}</span></td></tr>
      </tbody>
    </table>

    <h3>Console</h3>
    <table style="max-width:32rem">
      <tbody>
        <tr><th>API base URL</th><td class="mono">{{ API_BASE_URL }}</td></tr>
        <tr><th>Session</th><td>Shared with the main app (cross-subdomain cookie).</td></tr>
      </tbody>
    </table>

    <p class="muted" style="margin-top:1rem">
      Sending uses the dedicated marketing mailer/ESP, isolated from transactional email.
      Suppression + consent are enforced on every send.
    </p>
  </section>
</template>
