<template>
  <main class="applications-page">
    <h1 class="page-title">Aktualne <span class="title-accent">Podania</span></h1>
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
          <p class="app-discord"><b>Nazwa:</b> {{ cleanDiscord(app.discord) }}</p>
          <p class="app-time"><b>Data:</b> {{ formatDate(app.timestamp) }}</p>
          <p class="app-status"><b>Status:</b> <span :class="['status-text', statusClass(app.status)]">{{ app.status }}</span></p>
          <p class="app-number"><b>Numer:</b> {{ app.number }}</p>
          <button class="preview-btn" @click="openDetail(app)">
            <i class="fa-solid fa-eye"></i> Podgląd
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface Application {
  id: string
  userId: string
  discord: string
  status: string
  timestamp: number
  number: number
}

const applications = ref<Application[]>([])
const router = useRouter()

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

function statusClass(status: string) {
  switch (status) {
    case statuses.SENT:
      return 'gray'
    case statuses.PENDING:
      return 'orange'
    case statuses.IN_REVIEW:
      return 'blue'
    case statuses.APPROVED:
    case 'Rozpatrzone Pozytywnie':
      return 'green'
    case statuses.REJECTED:
    case 'Rozpatrzone negatywnie (Napisz nowe podanie w ciągu 24/48h)':
      return 'red'
    default:
      return ''
  }
}

async function openDetail(app: Application) {
  if (app.status === statuses.SENT) {
    await fetch('/api/admin/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userId: app.userId, status: statuses.PENDING })
    })
    app.status = statuses.PENDING
  }
  router.push(`/admin/applications/${app.id}`)
}
</script>

<style scoped>
.applications-page {
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #1b1032 0%, #0a0a1a 100%);
  color: #fff;
}

.page-title {
  text-align: center;
  margin: 0;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.title-normal {
  color: #fff;
}

.title-accent {
  background: linear-gradient(90deg, #8A2BE2, #00FFFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  background: linear-gradient(90deg, #8A2BE2, #00FFFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-card {
  background: rgba(138, 43, 226, 0.15);
  border: 1px solid rgba(138, 43, 226, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
}

.app-card p {
  margin: 0.2rem 0;
}

.status-text {
  font-weight: bold;
}
.gray {
  color: gray;
}
.orange {
  color: orange;
}
.blue {
  color: #00aaff;
}
.green {
  color: #00aa00;
}
.red {
  color: #dd0000;
}

.preview-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  margin-top: auto;
  font-size: 0.85rem;
  color: #fff;
  background: rgba(138, 43, 226, 0.3);
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  transition: background 0.2s ease;
  align-self: center;
}

.preview-btn:hover {
  background: rgba(138, 43, 226, 0.5);
}
</style>
