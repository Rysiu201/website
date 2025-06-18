<template>
  <main class="changelog-page">
    <RouterLink to="/admin" class="back-link">
      <i class="fa-solid fa-arrow-left"></i> Powrót
    </RouterLink>
    <h1 class="page-title">Changelog</h1>
    <div v-for="(entry, idx) in changelog" :key="idx" class="log-item">
      <div class="card">
        <div class="flex gap-2 mb-2">
          <input v-model="entry.date" type="date" class="input" />
          <input v-model="entry.title" placeholder="Tytuł" class="flex-1 input" />
          <button class="delete-btn" @click="remove(idx)"><i class="fa-solid fa-trash"></i> Usuń</button>
        </div>
        <textarea v-model="entry.description" class="textarea"></textarea>
      </div>
    </div>
    <div class="actions">
      <button class="add-btn" @click="add"><i class="fa-solid fa-plus"></i> Dodaj</button>
      <button class="save-btn" @click="save"><i class="fa-solid fa-floppy-disk"></i> Zapisz</button>
    </div>
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
  margin-bottom: 1rem;
}

.card {
  @apply bg-white/5 p-4 rounded-lg flex flex-col gap-2;
}

.input {
  @apply bg-white/10 border border-white/20 text-white rounded px-2 py-1;
}

.textarea {
  @apply bg-white/10 border border-white/20 text-white rounded p-2 w-full;
}

.delete-btn {
  @apply px-2 rounded text-white bg-red-600 hover:bg-red-700 flex items-center gap-1;
}

.actions {
  @apply mt-4 flex gap-2;
}

.add-btn {
  @apply px-4 py-2 rounded text-white bg-purple-600 hover:bg-purple-700 flex items-center gap-1;
}

.save-btn {
  @apply px-4 py-2 rounded text-white bg-cyan-600 hover:bg-cyan-700 flex items-center gap-1;
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

.page-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
</style>
