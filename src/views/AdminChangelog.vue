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
          <button class="delete-btn" @click="remove(idx)">🗑️ Usuń</button>
        </div>
        <textarea v-model="entry.description" class="textarea"></textarea>
      </div>
    </div>
    <div class="actions">
      <button class="add-btn" @click="add">➕ Dodaj</button>
      <button class="save-btn" @click="save">💾 Zapisz</button>
    </div>
    <Footer />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Footer from '../components/Footer.vue'

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
  max-width: 700px;
  margin: 0 auto;
}
.log-item {
  margin-bottom: 1rem;
}

.card {
  @apply bg-white/5 p-4 rounded-lg flex flex-col gap-2;
}

.input {
  @apply bg-white/10 border border-white/20 rounded px-2 py-1;
  color: #ccc;
}

.textarea {
  @apply bg-white/10 border border-white/20 rounded p-2 w-full;
  color: #ccc;
}

.delete-btn {
  @apply px-2 rounded text-white bg-red-600 hover:bg-red-700 flex items-center gap-1;
}

.actions {
  @apply mt-4 flex gap-2;
}

.add-btn {
  @apply px-4 py-2 rounded text-white;
  background: var(--gradient-accent);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.save-btn {
  @apply px-4 py-2 rounded text-white;
  background: var(--gradient-accent);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
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
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
