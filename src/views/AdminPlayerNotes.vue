<template>
  <main class="player-notes-page">
    <h1>Notatki o graczach</h1>
    <div class="notes-form">
      <input v-model="userId" placeholder="ID użytkownika" />
      <textarea v-model="notes" placeholder="Notatki" class="notes-input"></textarea>
      <div class="buttons">
        <button @click="loadNotes">Wczytaj</button>
        <button @click="saveNotes">Zapisz</button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const userId = ref('')
const notes = ref('')

async function loadNotes() {
  if (!userId.value) return
  const res = await fetch(`/api/admin/player-notes/${userId.value}`, { credentials: 'include' })
  if (res.ok) {
    const data = await res.json()
    notes.value = data.notes || ''
  }
}

async function saveNotes() {
  if (!userId.value) return
  await fetch('/api/admin/player-notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ userId: userId.value, notes: notes.value })
  })
}
</script>

<style scoped>
.player-notes-page {
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #1b1032 0%, #0a0a1a 100%);
  color: #fff;
}
.notes-form {
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.notes-input {
  min-height: 150px;
  padding: 0.5rem;
  border-radius: 6px;
}
.buttons {
  display: flex;
  gap: 0.5rem;
}
</style>
