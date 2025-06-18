<template>
  <main class="changelog-list">
    <h1>Changelog</h1>
    <div v-for="(c, idx) in changelog" :key="idx" class="entry">
      <h3>{{ c.date }} - {{ c.title }}</h3>
      <p>{{ c.description }}</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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
}
.entry {
  margin-bottom: 1rem;
}
</style>
