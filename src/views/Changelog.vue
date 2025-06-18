<template>
  <main class="rules-page">
    <div class="container">
      <h1 data-aos="fade-right" class="page-title">
        <i class="fa-solid fa-clock-rotate-left"></i> Changelog
      </h1>
      <ChangelogList />
    </div>
  </main>
</template>

<script setup lang="ts">
import ChangelogList from '../components/ChangelogList.vue'
</script>

<style scoped>
.page-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.rules-page {
  padding: 2rem;
  min-height: 100vh;
  background: #0a0a0a;
  color: #fff;
}
</style>
