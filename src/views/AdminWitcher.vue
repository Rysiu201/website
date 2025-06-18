<template>
  <main class="witcher-page">
    <RouterLink to="/admin" class="back-link">
      <i class="fa-solid fa-arrow-left"></i> Powrót
    </RouterLink>
    <h1 class="page-title">Witcher</h1>
    <div class="sections">
      <RouterLink class="admin-section" to="/admin/settings">
        <i class="fa-solid fa-gear"></i>
        <span>Ustawienia</span>
      </RouterLink>
      <RouterLink class="admin-section" to="/admin/questions">
        <i class="fa-solid fa-question"></i>
        <span>Pytania</span>
      </RouterLink>
      <RouterLink class="admin-section" to="/admin/changelog">
        <i class="fa-solid fa-clock-rotate-left"></i>
        <span>Changelog</span>
      </RouterLink>
    </div>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.witcher-page {
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #1b1032 0%, #0a0a1a 100%);
  color: #fff;
}
.page-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1rem;
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.sections {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
}
.admin-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.admin-section:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
}
.admin-section i {
  color: var(--primary);
}
.admin-section span {
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-bottom: 1rem;
  padding: 0.3rem 0.6rem;
  background: var(--gradient-accent);
  color: #fff;
  border-radius: 4px;
  text-decoration: none;
}
</style>
