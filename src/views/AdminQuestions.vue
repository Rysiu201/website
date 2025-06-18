<template>
  <main class="questions-page">
    <RouterLink to="/admin" class="back-link">
      <i class="fa-solid fa-arrow-left"></i> Powrót
    </RouterLink>
    <h1 class="page-title">Pytania</h1>
    <select v-model="section" class="select">
      <option value="whitelist">Whitelist</option>
      <option value="checker">WhiteListChecker</option>
      <option value="moderator">Moderator</option>
      <option value="administrator">Administrator</option>
      <option value="developer">Developer</option>
    </select>
    <textarea v-model="text" rows="10" class="textarea"></textarea>
    <button class="save-btn" @click="save">💾 Zapisz</button>
  </main>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const section = ref('whitelist')
const text = ref('')

watch(section, load)
load()

async function load() {
  const res = await fetch(`/api/admin/questions/${section.value}`, { credentials: 'include' })
  if (res.ok) {
    const data = await res.json()
    text.value = (data.questions || []).join('\n')
  }
}

async function save() {
  const questions = text.value.split('\n').filter(q => q.trim())
  await fetch(`/api/admin/questions/${section.value}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ questions })
  })
  load()
}
</script>

<style scoped>
.questions-page {
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #1b1032 0%, #0a0a1a 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
}
textarea {
  width: 100%;
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
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.select {
  @apply bg-white/10 border border-white/20 rounded p-2;
  color: #fff;
}

.textarea {
  @apply bg-white/10 border border-white/20 rounded p-2;
  color: #fff;
}

.save-btn {
  @apply mt-2 px-4 py-2 rounded text-white;
  background: var(--gradient-accent);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
}
</style>
