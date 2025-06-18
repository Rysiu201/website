<template>
  <main class="changelog-list">
    <h1 class="title"><i class="fa-solid fa-rotate"></i> Changelog</h1>
    <div v-for="(c, idx) in changelog" :key="idx" class="entry">
      <div class="date">{{ c.date }}</div>
      <div class="details">
        <h3>{{ c.title }}</h3>
        <p>{{ c.description }}</p>
      </div>
    </div>
    <Footer />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Footer from '../components/Footer.vue'

interface Entry { date: string; title: string; description: string }
const changelog = ref<Entry[]>([])

onMounted(async () => {
  const res = await fetch('/api/changelog')
  if (res.ok) {
    const data = await res.json()
    changelog.value = data.changelog || []
  }
})
</script>

<style scoped>
.changelog-list {
  padding: 2rem;
  min-height: 100vh;
  background: #0a0a0a;
  color: #fff;
  max-width: 800px;
  margin: 0 auto;
}
.title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.entry {
  display: flex;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}
.date {
  width: 110px;
  flex-shrink: 0;
  color: #ccc;
}
.details h3 {
  margin: 0 0 0.25rem;
}
.details p {
  margin: 0;
  color: #ccc;
}
</style>
