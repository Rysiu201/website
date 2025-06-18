<template>
  <div class="changelog-widget" v-if="entries.length">
    <div v-for="(c, idx) in entries" :key="idx" class="widget-entry">
      <div class="date">{{ c.date }}</div>
      <div class="title">{{ c.title }}</div>
    </div>
    <RouterLink to="/changelog" class="more-link">Zobacz wszystkie</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

interface Entry { date: string; title: string; description: string }
const entries = ref<Entry[]>([])

onMounted(async () => {
  const res = await fetch('/api/changelog')
  if (res.ok) {
    const data = await res.json()
    entries.value = (data.changelog || []).slice(-3).reverse()
  }
})
</script>

<style scoped>
.changelog-widget {
  padding: 1rem;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  color: #fff;
  margin-top: 2rem;
}
.widget-entry {
  margin-bottom: 0.5rem;
}
.more-link {
  color: #8A2BE2;
}
</style>
