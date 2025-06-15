<template>
  <main class="applications-page">
    <h1>Aktualne podania</h1>
    <div class="status-columns">
      <div
        v-for="col in columns"
        :key="col.key"
        class="status-column"
      >
        <h2>{{ col.label }}</h2>
        <div
          v-for="app in filtered(col.key)"
          :key="app.id"
          class="app-card"
        >
          <p class="app-discord">{{ cleanDiscord(app.discord) }}</p>
          <p class="app-time">{{ formatDate(app.timestamp) }}</p>
          <p class="app-status">{{ app.status }}</p>
          <p class="app-number">Podanie #{{ app.number }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Application {
  id: string
  userId: string
  discord: string
  status: string
  timestamp: number
  number: number
}

const applications = ref<Application[]>([])

onMounted(async () => {
  const res = await fetch('/api/admin/applications', {
    credentials: 'include'
  })
  if (res.ok) {
    const data = await res.json()
    applications.value = data.applications || []
  }
})

const statuses = {
  SENT: 'Wysłane',
  PENDING: 'Przyjęte, oczekuje na rozpatrzenie',
  IN_REVIEW: 'W trakcie rozpatrywania',
  APPROVED: 'Pozytywnie',
  REJECTED: 'Negatywnie'
}

const columns: { key: keyof typeof statuses; label: string }[] = [
  { key: 'SENT', label: statuses.SENT },
  { key: 'PENDING', label: statuses.PENDING },
  { key: 'IN_REVIEW', label: statuses.IN_REVIEW },
  { key: 'APPROVED', label: statuses.APPROVED },
  { key: 'REJECTED', label: statuses.REJECTED }
]

function filtered(key: keyof typeof statuses) {
  const status = statuses[key]
  return applications.value
    .filter(a => a.status === status)
    .sort((a, b) => a.timestamp - b.timestamp)
}

function cleanDiscord(d: string) {
  return d.split('#')[0]
}

function formatDate(t: number) {
  const d = new Date(t)
  return d.toLocaleString()
}
</script>

<style scoped>
.applications-page {
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #1b1032 0%, #0a0a1a 100%);
  color: #fff;
}

.status-columns {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  margin-top: 1rem;
}

.status-column {
  flex: 1;
  min-width: 220px;
}

.status-column h2 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  text-align: center;
  color: var(--primary);
}

.app-card {
  background: rgba(138, 43, 226, 0.15);
  border: 1px solid rgba(138, 43, 226, 0.3);
  border-radius: 8px;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.app-card p {
  margin: 0.2rem 0;
}
</style>
