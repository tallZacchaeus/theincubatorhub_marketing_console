<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <section class="page">
    <h1>{{ title }}</h1>
    <p class="muted">This page is wired in Phase 10.</p>
  </section>
</template>
