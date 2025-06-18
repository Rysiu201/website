<template>
  <main class="settings-page">
    <RouterLink to="/admin" class="back-link">
      <i class="fa-solid fa-arrow-left"></i> Powrót
    </RouterLink>
    <h1 class="page-title">Ustawienia</h1>
    <div class="settings-form">
      <div v-for="(_val, key) in localSettings" :key="key" class="setting-item">
        <label class="label">{{ labels[key] || key }}</label>
        <input
          v-model.number="localSettings[key]"
          type="number"
          min="0"
          class="input"
          required
        />
      </div>
      <button class="save-btn" @click="save">💾 Zapisz</button>
    </div>
    <Footer />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Footer from '../components/Footer.vue'

const labels: Record<string, string> = {
  REAPPLY_COOLDOWN_HOURS: 'Czas ponownego zgłoszenia (godz.)',
  EXTRA_COOLDOWN_HOURS: 'Dodatkowy cooldown po odrzuceniach',
  REJECTION_HISTORY_WINDOW_HOURS: 'Okres zliczania odrzuceń (godz.)',
  REJECTIONS_BEFORE_EXTRA_COOLDOWN: 'Ile odrzuceń aktywuje dodatkowy cooldown',
  ADMIN_REAPPLY_COOLDOWN_DAYS: 'Cooldown admina (dni)',
  UNBAN_COOLDOWN_PERCENT: 'Skrócenie cooldownu unbana (%)'
}

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
  gap: 0.75rem;
  max-width: 500px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 0.5rem;
}
.setting-item {
  display: flex;
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

.label {
  flex: 1;
}

.input {
  @apply bg-white/10 border border-white/20 rounded px-2 py-1 w-24;
  color: #ccc;
}

.save-btn {
  @apply mt-4 px-4 py-2 rounded text-white;
  background: var(--gradient-accent);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
