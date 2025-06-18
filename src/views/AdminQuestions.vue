<template>
  <main class="questions-page">
    <h1>Pytania</h1>
    <select v-model="section">
      <option value="whitelist">Whitelist</option>
      <option value="administrator">Administrator</option>
      <option value="moderator">Moderator</option>
    </select>
    <textarea v-model="text" rows="10"></textarea>
    <button @click="save">Zapisz</button>
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
</style>
