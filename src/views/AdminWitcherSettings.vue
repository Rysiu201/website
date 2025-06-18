<template>
  <main class="witcher-settings-page">
    <RouterLink to="/admin/witcher" class="back-link">
      <i class="fa-solid fa-arrow-left"></i> Powrót
    </RouterLink>
    <h1 class="section-title"><span class="accent">Ustawienia</span></h1>
    <table class="settings-table">
      <thead>
        <tr>
          <th>Nazwa</th>
          <th>Opis</th>
          <th>Wartość</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in settings" :key="s.key">
          <td>{{ s.label }}</td>
          <td>{{ s.desc }}</td>
          <td><input type="number" v-model.number="s.value" /></td>
        </tr>
      </tbody>
    </table>
    <button class="save-btn" @click="saveSettings">Zapisz</button>
    <p v-if="message" class="save-message">{{ message }}</p>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { onMounted, ref } from 'vue'

interface Setting {
  key: string
  label: string
  desc: string
  value: number
}

const settings = ref<Setting[]>([
  {
    key: 'REAPPLY_COOLDOWN_HOURS',
    label: 'Cooldown Podania (h)',
    desc: 'Podstawowy czas oczekiwania przed ponownym złożeniem podania',
    value: 0
  },
  {
    key: 'EXTRA_COOLDOWN_HOURS',
    label: 'Dodatkowy Cooldown (h)',
    desc: 'Dodatkowy czas oczekiwania po wielu odrzuceniach',
    value: 0
  },
  {
    key: 'REJECTION_HISTORY_WINDOW_HOURS',
    label: 'Okno historii (h)',
    desc: 'Ile godzin wstecz liczy się odrzucenia',
    value: 0
  },
  {
    key: 'REJECTIONS_BEFORE_EXTRA_COOLDOWN',
    label: 'Ilość odrzuceń',
    desc: 'Liczba odrzuceń wymagająca dodatkowego cooldownu',
    value: 0
  },
  {
    key: 'ADMIN_REAPPLY_COOLDOWN_DAYS',
    label: 'Cooldown ról admin. (dni)',
    desc: 'Czas w dniach przed ponownym podaniem na role administracyjne',
    value: 0
  },
  {
    key: 'UNBAN_COOLDOWN_PERCENT',
    label: 'Procent bana',
    desc: 'Procent długości bana potrzebny do ponownego wniosku o unban',
    value: 0
  }
])

const message = ref('')
onMounted(async () => {
  const res = await fetch('/api/admin/witcher-settings', {
    credentials: 'include'
  })
  if (res.ok) {
    const data = await res.json()
    const cfg = data.settings || {}
    settings.value.forEach(s => {
      if (cfg[s.key] !== undefined) s.value = cfg[s.key]
    })
  }
})

async function saveSettings() {
  const payload: Record<string, number> = {}
  settings.value.forEach(s => {
    payload[s.key] = s.value
  })
  const res = await fetch('/api/admin/witcher-settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  })
  if (res.ok) {
    message.value = 'Zapisano zmiany'
    setTimeout(() => (message.value = ''), 3000)
  }
}
</script>

<style scoped>
.witcher-settings-page {
  padding: 4rem 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #1b1032 0%, #0a0a1a 100%);
  color: #fff;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.section-title .accent {
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-bottom: 1rem;
  padding: 0.3rem 0.6rem;
  color: #fff;
  background: var(--gradient-accent);
  border-radius: 4px;
  text-decoration: none;
}

.settings-table {
  width: 100%;
  max-width: 800px;
  margin: 2rem auto;
  border-collapse: collapse;
}

.settings-table th,
.settings-table td {
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.settings-table input {
  width: 100%;
  padding: 0.3rem;
  border-radius: 4px;
}

.save-btn {
  display: block;
  margin: 1rem auto;
  padding: 0.5rem 1rem;
  background: var(--gradient-accent);
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.save-message {
  text-align: center;
  margin-top: 0.5rem;
  color: #0f0;
}
</style>
