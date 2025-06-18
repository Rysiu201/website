<template>
  <main class="changelog-page">
    <h1>Changelog</h1>
    <div v-for="(entry, idx) in changelog" :key="idx" class="log-item">
      <input v-model="entry.date" type="date" />
      <input v-model="entry.title" placeholder="Tytuł" />
      <textarea v-model="entry.description"></textarea>
      <button @click="remove(idx)">Usuń</button>
    </div>
    <button @click="add">Dodaj</button>
    <button @click="save">Zapisz</button>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Entry { date: string; title: string; description: string }
const changelog = ref<Entry[]>([])

onMounted(load)

async function load() {
  const res = await fetch('/api/changelog')
  if (res.ok) {
    const data = await res.json()
    changelog.value = data.changelog || []
  }
}

function add() {
  changelog.value.push({ date: '', title: '', description: '' })
}

function remove(i: number) {
  changelog.value.splice(i, 1)
}

async function save() {
  for (let i = 0; i < changelog.value.length; i++) {
    await fetch(`/api/admin/changelog/${i}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(changelog.value[i])
    })
  }
}
</script>

<style scoped>
.changelog-page {
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #1b1032 0%, #0a0a1a 100%);
  color: #fff;
}
.log-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
</style>
