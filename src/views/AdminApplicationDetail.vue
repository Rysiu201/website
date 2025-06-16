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
        <tr v-if="archiveInfo">
          <th>Archiwizacja</th>
          <td>{{ archiveInfo }}</td>
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
        <textarea
          v-if="selectedStatus === statuses.REJECTED"
          v-model="rejectionReason"
          placeholder="Powód odrzucenia"
          class="reason-input"
          required
        ></textarea>
        <button @click="updateStatus" class="update-btn">Zmień status</button>
        <button
          v-if="app && !app.archived && (app.status === statuses.APPROVED || app.status === statuses.REJECTED)"
          @click="archive"
          class="archive-btn"
        >
          <i class="fa-solid fa-box-archive"></i> Archiwizuj
        </button>
        <p v-if="updateMessage" class="update-msg">{{ updateMessage }}</p>
      </div>
      <div v-if="app && app.status === statuses.APPROVED" class="notes-box">
        <h3>
          Notatki Administratora
          <span v-if="adminNotes && !editAdmin" class="edit-icon" @click="editAdmin = true">📝</span>
        </h3>
        <p v-if="adminNotes && !editAdmin" class="notes-text">{{ adminNotes }}</p>
        <textarea
          v-if="!adminNotes || editAdmin"
          v-model="adminNotes"
          class="notes-input"
          placeholder="(Opcjonalnie) Tutaj możesz wpisać swoje spostrzeżenia na temat podania gracza"
        ></textarea>
        <h3>
          Notatki po rozmowie
          <span v-if="interviewNotes && !editInterview" class="edit-icon" @click="editInterview = true">📝</span>
        </h3>
        <p v-if="interviewNotes && !editInterview" class="notes-text">{{ interviewNotes }}</p>
        <textarea
          v-if="!interviewNotes || editInterview"
          v-model="interviewNotes"
          class="notes-input"
          placeholder="(Opcjonalne) Tutaj możesz wpisać swoje spostrzeżenia po rozmowie rekrutacyjnej z graczem"
        ></textarea>
        <button
          v-if="editAdmin || editInterview || !adminNotes || !interviewNotes"
          class="save-notes-btn"
          @click="saveNotes"
        >
          Zapisz notatki
        </button>
      </div>
      <div v-if="app && app.archived" class="archive-extra">
        <div v-if="app.rejectionReason" class="reason-box">
          <h3>Powód odrzucenia</h3>
          <p>{{ app.rejectionReason }}</p>
        </div>
        <div v-if="app.adminNotes" class="reason-box">
          <h3>Notatki Administratora</h3>
          <p class="notes-text">{{ app.adminNotes }}</p>
        </div>
        <div v-if="app.interviewNotes" class="reason-box">
          <h3>Notatki po rozmowie</h3>
          <p class="notes-text">{{ app.interviewNotes }}</p>
        </div>
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
  rejectionReason?: string
  adminNotes?: string
  interviewNotes?: string
  archived?: { by: string; timestamp: number } | null
}

const route = useRoute()
const app = ref<Application | null>(null)
const currentUser = ref<any>(null)

const selectedStatus = ref('')
const rejectionReason = ref('')
const adminNotes = ref('')
const interviewNotes = ref('')
const updateMessage = ref('')

const editAdmin = ref(false)
const editInterview = ref(false)

const statuses = {
  SENT: 'Wysłane',
  PENDING: 'Przyjęte, oczekuje na rozpatrzenie',
  IN_REVIEW: 'W trakcie rozpatrywania',
  APPROVED: 'Pozytywnie',
  REJECTED: 'Negatywnie',
  ARCHIVED: 'Zarchiwizowane'
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
      rejectionReason.value = app.value.rejectionReason || ''
      adminNotes.value = app.value.adminNotes || ''
      interviewNotes.value = app.value.interviewNotes || ''
      editAdmin.value = !adminNotes.value
      editInterview.value = !interviewNotes.value

      if (app.value.status === statuses.SENT) {
        await updateStatusInternal(statuses.PENDING)
        selectedStatus.value = statuses.PENDING
      }
    }
  }
})

const ts = computed(() => {
  if (!app.value) return 0
  return app.value.history?.[0]?.timestamp || Number(app.value.id)
})

const scenarioPairs = computed(() => {
  if (!app.value) return []
  const qs: string[] = app.value.data.questions || []
  const ans: string[] = app.value.data.scenarios || []
  return qs.map((q, i) => ({ question: q, answer: ans[i] || '' }))
})

const statusClass = computed(() => {
  if (!app.value) return ''
  switch (app.value.status) {
    case statuses.SENT: return 'gray'
    case statuses.PENDING: return 'orange'
    case statuses.IN_REVIEW: return 'blue'
    case statuses.APPROVED:
    case 'Rozpatrzone Pozytywnie': return 'green'
    case statuses.REJECTED:
    case 'Rozpatrzone negatywnie':
    case 'Negatywnie (Napisz nowe podanie w ciągu 24/48h)': return 'red'
    case statuses.ARCHIVED: return 'yellow'
    default: return ''
  }
})

function formatDate(t: number) {
  return new Date(t).toLocaleString()
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
    body: JSON.stringify({
      userId: app.value.userId,
      status: newStatus,
      rejectionReason: rejectionReason.value,
      adminNotes: adminNotes.value,
      interviewNotes: interviewNotes.value
    })
  })

  app.value.status = newStatus
  app.value.rejectionReason = newStatus === statuses.REJECTED ? rejectionReason.value : ''
  app.value.adminNotes = adminNotes.value
  app.value.interviewNotes = interviewNotes.value

  if (!app.value.history) app.value.history = []
  const idx = app.value.history.findIndex(h => h.status === newStatus)
  const entry = {
    status: newStatus,
    timestamp: Date.now(),
    by: currentUser.value?.username || 'Admin'
  }

  if (idx >= 0) {
    app.value.history[idx] = entry
  } else {
    app.value.history.push(entry)
  }

  if (newStatus === statuses.APPROVED) {
    app.value.history = app.value.history.filter(h => h.status !== statuses.REJECTED)
  }

  updateMessage.value = 'Status zaktualizowany pomyślnie'
  setTimeout(() => updateMessage.value = '', 3000)
}

async function updateStatus() {
  if (!selectedStatus.value || !app.value) return

  if (selectedStatus.value !== app.value.status) {
    if (selectedStatus.value === statuses.REJECTED && !rejectionReason.value.trim()) {
      window.alert('Powód odrzucenia jest wymagany')
      return
    }

    await updateStatusInternal(selectedStatus.value)
    window.alert(`Status zmieniono na ${selectedStatus.value}`)
  }
}

async function saveNotes() {
  if (!app.value) return

  await updateStatusInternal(app.value.status)
  editAdmin.value = false
  editInterview.value = false
  updateMessage.value = 'Notatki zapisane'
  setTimeout(() => updateMessage.value = '', 3000)
}

async function archive() {
  if (!app.value) return
  await fetch(`/api/admin/archive/${app.value.id}`, {
    method: 'POST',
    credentials: 'include'
  })
  app.value.archived = {
    timestamp: Date.now(),
    by: currentUser.value?.username || 'Admin'
  }
  app.value.history = app.value.history || []
  app.value.history.push({
    status: statuses.ARCHIVED,
    timestamp: Date.now(),
    by: currentUser.value?.username || 'Admin'
  })
}

const decisionInfo = computed(() => {
  if (!app.value?.history) return ''
  const latest = [...app.value.history].reverse()
    .find(h => h.status === statuses.APPROVED || h.status === statuses.REJECTED)

  if (!latest) return ''
  const date = new Date(latest.timestamp).toLocaleString()
  return `${latest.status} przez ${latest.by || 'Admin'} - ${date}`
})

const archiveInfo = computed(() => {
  if (!app.value?.archived) return ''
  const date = new Date(app.value.archived.timestamp).toLocaleString()
  return `Zarchiwizowane przez ${app.value.archived.by || 'System'} - ${date}`
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
.app-table th {
  color: #5bc0de;
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
.reason-input {
  width: 100%;
  min-height: 80px;
  border-radius: 6px;
  padding: 0.4rem;
}
.update-msg {
  color: #00ff7f;
}
.notes-box {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.edit-icon {
  cursor: pointer;
  margin-left: 0.5rem;
}
.notes-text {
  white-space: pre-wrap;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.4rem;
  border-radius: 6px;
}
.notes-input {
  width: 100%;
  min-height: 80px;
  border-radius: 6px;
  padding: 0.4rem;
}
.save-notes-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid transparent;
  background: var(--gradient-accent);
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-start;
}

.update-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid transparent;
  background: var(--gradient-accent);
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
}

.archive-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid transparent;
  background: rgba(255, 165, 0, 0.3);
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
}
.archive-btn.top-right {
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
}

.archive-extra {
  margin-top: 1.5rem;
}

.archive-btn:hover {
  background: rgba(255, 165, 0, 0.5);
}

.question-cell {
  font-weight: 600;
}

.answer-cell {
  white-space: pre-wrap;
}
</style>
