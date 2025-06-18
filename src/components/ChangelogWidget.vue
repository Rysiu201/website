<template>
  <div class="changelog-widget" v-if="entries.length">
    <h2 class="text-xl font-semibold mb-4">Ostatnie zmiany</h2>
    <div
      v-for="(c, idx) in entries"
      :key="idx"
      class="widget-entry flex items-start gap-3 p-4 mb-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition"
    >
      <div class="w-1 rounded bg-gradient-to-b from-purple-600 to-cyan-500"></div>
      <i class="fa-solid fa-rotate text-purple-400 mt-1"></i>
      <div class="flex-1">
        <p class="text-sm text-gray-400">{{ c.date }}</p>
        <p class="font-medium">{{ c.title }}</p>
      </div>
    </div>
    <RouterLink to="/panel/changelog" class="more-link text-purple-400 hover:underline">Zobacz wszystkie</RouterLink>
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
  @apply mt-8 bg-white/5 rounded-lg p-4 text-white backdrop-blur;
}
</style>
