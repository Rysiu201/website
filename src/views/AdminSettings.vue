<template>
  <main class="settings-page">
    <h1>Ustawienia</h1>
    <div class="settings-form">
      <div v-for="( _val, key) in localSettings" :key="key" class="setting-item">
        <label>{{ key }}</label>
        <input v-model.number="localSettings[key]" type="number" />
      </div>
      <button @click="save">Zapisz</button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const localSettings = ref<Record<string, number>>({})

onMounted(async () => {
  const res = await fetch('/api/admin/settings', { credentials: 'include' })
  if (res.ok) {
    const data = await res.json()
    Object.assign(localSettings.value, data)
  }
})

async function save() {
  await fetch('/api/admin/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(localSettings.value)
  })
}
</script>

<style scoped>
.settings-page {
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #1b1032 0%, #0a0a1a 100%);
  color: #fff;
}
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
  margin: 0 auto;
}
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
