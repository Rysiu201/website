<template>
  <main class="app-detail-page">
    <RouterLink to="/admin/applications" class="back-link">
      <i class="fa-solid fa-arrow-left"></i> Powrót
    </RouterLink>
    <div v-if="app" class="detail-container">
      <h1 class="detail-title">Podanie użytkownika <span class="logo-accent discord-name">{{ cleanDiscord(app.data.ooc.discord) }}</span></h1>
      <table class="app-table">
        <tr>
          <th>Status</th>
          <td><span :class="['status-text', statusClass]">{{ app.status }}</span></td>
        </tr>
        <tr>
          <th>Data zgłoszenia</th>
          <td>{{ formatDate(ts) }}</td>
        </tr>
        <tr v-if="decisionInfo">
          <th>Decyzja</th>
          <td>{{ decisionInfo }}</td>
        </tr>
      </table>
      <h2>Informacje IC</h2>
      <table class="app-table">
        <tr><th>Imię i nazwisko</th><td>{{ app.data.ic.name }}</td></tr>
        <tr><th>Wiek</th><td>{{ app.data.ic.age }}</td></tr>
        <tr><th>Historia</th><td>{{ app.data.ic.story }}</td></tr>
        <tr><th>Charakter</th><td>{{ app.data.ic.personality }}</td></tr>
        <tr><th>Umiejętności</th><td>{{ app.data.ic.skills }}</td></tr>
        <tr><th>Motywacja</th><td>{{ app.data.ic.motivation }}</td></tr>
      </table>
      <h2>Informacje OOC</h2>
      <table class="app-table">
        <tr><th>Discord</th><td>{{ app.data.ooc.discord }}</td></tr>
        <tr><th>Doświadczenie</th><td>{{ app.data.ooc.experience }}</td></tr>
        <tr>
          <th>Zgody</th>
          <td>
            Dane: {{ app.data.consents.data ? 'Tak' : 'Nie' }},
            Zasady: {{ app.data.consents.rules ? 'Tak' : 'Nie' }},
            Prawdziwość: {{ app.data.consents.truth ? 'Tak' : 'Nie' }}
          </td>
        </tr>
      </table>
      <h2>Pytania sytuacyjne</h2>
      <table class="app-table">
        <template v-for="(qa, idx) in scenarioPairs" :key="idx">
          <tr>
            <th colspan="2" class="question-cell">{{ qa.question }}</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ qa.answer }}</td>
          </tr>
        </template>
      </table>
      <h2>Dodatkowo</h2>
      <table class="app-table">
        <tr><th>Portfolio</th><td>{{ app.data.extra.portfolio }}</td></tr>
        <tr><th>Frakcja</th><td>{{ app.data.extra.faction }}</td></tr>
      </table>
      <div class="decision-box">
        <label for="status-select">Decyzja</label>
        <select id="status-select" v-model="selectedStatus">
          <option v-for="(label, key) in decisionOptions" :key="key" :value="label">
            {{ label }}
          </option>
        </select>
        <button @click="updateStatus" class="update-btn">Zmień status</button>
      </div>
    </div>
    <p v-else>Ładowanie...</p>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

interface Application {
  id: string
  userId: string
  status: string
  data: any
  history?: { status: string; timestamp: number; by?: string }[]
}

const route = useRoute()
const app = ref<Application | null>(null)
const currentUser = ref<any>(null)
const selectedStatus = ref('')

const statuses = {
  SENT: 'Wysłane',
  PENDING: 'Przyjęte, oczekuje na rozpatrzenie',
  IN_REVIEW: 'W trakcie rozpatrywania',
  APPROVED: 'Pozytywnie',
  REJECTED: 'Negatywnie'
}

const decisionOptions = {
  PENDING: statuses.PENDING,
  IN_REVIEW: statuses.IN_REVIEW,
  APPROVED: statuses.APPROVED,
  REJECTED: statuses.REJECTED
}

onMounted(async () => {
  const userRes = await fetch('/api/user', { credentials: 'include' })
  if (userRes.ok) {
    const userData = await userRes.json()
    currentUser.value = userData.user
  }
  const res = await fetch(`/api/admin/applications/${route.params.id}`, { credentials: 'include' })
  if (res.ok) {
    const data = await res.json()
    app.value = data.application || null
    if (app.value) {
      selectedStatus.value = app.value.status
      if (app.value.status === statuses.SENT) {
        await updateStatusInternal(statuses.PENDING)
        selectedStatus.value = statuses.PENDING
      }
    }
  }
})

const ts = computed(() => {
  if (!app.value) return 0
  return app.value.history && app.value.history[0] ? app.value.history[0].timestamp : Number(app.value.id)
})

const scenarioPairs = computed(() => {
  if (!app.value) return [] as { question: string; answer: string }[]
  const qs: string[] = app.value.data.questions || []
  const ans: string[] = app.value.data.scenarios || []
  return qs.map((q, i) => ({ question: q, answer: ans[i] || '' }))
})

const statusClass = computed(() => {
  if (!app.value) return ''
  switch (app.value.status) {
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
})

function formatDate(t: number) {
  const d = new Date(t)
  return d.toLocaleString()
}

function cleanDiscord(d: string) {
  return d.split('#')[0]
}

async function updateStatusInternal(newStatus: string) {
  if (!app.value) return
  await fetch('/api/admin/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ userId: app.value.userId, status: newStatus })
  })
  app.value.status = newStatus
  if (!app.value.history) app.value.history = []
  app.value.history.push({
    status: newStatus,
    timestamp: Date.now(),
    by: currentUser.value?.username || 'Admin'
  })
}

function updateStatus() {
  if (!selectedStatus.value || !app.value) return
  if (selectedStatus.value !== app.value.status) {
    updateStatusInternal(selectedStatus.value)
  }
}

const decisionInfo = computed(() => {
  if (!app.value || !app.value.history) return ''
  const latest = [...app.value.history]
    .reverse()
    .find(h => h.status === statuses.APPROVED || h.status === statuses.REJECTED)
  if (!latest) return ''
  const date = new Date(latest.timestamp).toLocaleString()
  return `${latest.status} przez ${latest.by || 'Admin'} - ${date}`
})
</script>

<style scoped>
.app-detail-page {
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #1b1032 0%, #0a0a1a 100%);
  color: #fff;
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

.detail-title {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.6rem;
}

.status-text {
  font-weight: bold;
}

.detail-container {
  max-width: 800px;
  margin: 0 auto;
}

.app-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.05);
}
.app-table th,
.app-table td {
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  vertical-align: top;
  word-wrap: break-word;
  white-space: pre-wrap;
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

.decision-box {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.update-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid transparent;
  background: var(--gradient-accent);
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
}

.question-cell {
  font-weight: 600;
}

.answer-cell {
  white-space: pre-wrap;
}
</style>
