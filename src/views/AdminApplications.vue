<template>
  <main class="applications-page">
    <RouterLink to="/admin" class="back-link">
      <i class="fa-solid fa-arrow-left"></i> Powrót
    </RouterLink>
    <h1 class="page-title">Aktualne <span class="title-accent">Podania</span></h1>
    <div class="status-columns">
      <div
        v-for="col in columns"
        :key="col.key"
        class="status-column"
      >
        <h2>{{ col.label }} ({{ filtered(col.key).length }})</h2>
        <div class="search-box">
          <input
            v-model="searchTerms[col.key]"
            placeholder="Nazwa"
            @keyup.enter="performSearch(col.key)"
          />
          <button @click="performSearch(col.key)">Szukaj</button>
        </div>
        <div class="apps" :class="{ scrollable: showMore[col.key] }">
        <div
          v-for="app in displayed(col.key)"
          :key="app.id"
          :class="['app-card', { highlight: isHighlighted(app, col.key) }]"
        >
          <p
            v-if="showArchivedOnly && app.type === 'administrator'"
            class="app-type"
          >
            Podanie Administratora
          </p>
          <p
            v-else-if="showArchivedOnly && app.type === 'moderator'"
            class="app-type"
          >
            Podanie Moderatora
          </p>
          <p
            v-else-if="showArchivedOnly && app.type === 'checker'"
            class="app-type"
          >
            Podanie WhiteListCheckera
          </p>
          <p
            v-else-if="showArchivedOnly && app.type === 'developer'"
            class="app-type"
          >
            Podanie Developera
          </p>
          <button
            v-if="!app.archived &&
              (app.status === statuses.APPROVED || app.status === statuses.REJECTED)"
            class="archive-btn top-right"
            @click="archiveApplication(app)"
          >
            <i class="fa-solid fa-box-archive"></i> Archiwizuj
          </button>
          <p class="app-discord"><b>Nazwa:</b> {{ cleanDiscord(app.discord) }}</p>
          <p class="app-time"><b>Data:</b> {{ formatDate(app.timestamp) }}</p>
          <p class="app-status"><b>Status:</b> <span :class="['status-text', statusClass(app.status)]">{{ app.status }}</span></p>
          <p class="app-number"><b>Numer:</b> {{ app.number }}</p>
          <p v-if="app.archived" class="app-archived"><b>Archiwum:</b> {{ app.archived.by }} - {{ formatDate(app.archived.timestamp) }}</p>
          <button class="preview-btn" @click="openDetail(app)">
            <i class="fa-solid fa-eye"></i> Podgląd
          </button>
          </div>
        </div>
        <button
          v-if="filtered(col.key).length > 3 && !showMore[col.key]"
          class="show-more-btn"
          @click="showAll(col.key)"
        >
          Pokaż więcej
        </button>
        <button
          v-if="showMore[col.key]"
          class="show-more-btn"
          @click="showLess(col.key)"
        >
          Pokaż mniej
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { useRouter, RouterLink, useRoute } from 'vue-router'

interface Application {
  id: string
  userId: string
  discord: string
  status: string
  timestamp: number
  number: number
  archived?: { by: string; timestamp: number } | null
  type?: string
}

const applications = ref<Application[]>([])
const router = useRouter()
const route = useRoute()
const appType = computed(() => (route.meta.type as string) || 'whitelist')

onMounted(async () => {
  const res = await fetch(`/api/admin/applications?type=${appType.value}`, {
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
  REJECTED: 'Negatywnie',
  ARCHIVED: 'Zarchiwizowane'
}
const showArchivedOnly = computed(() => route.path.includes('archived'))

const columns = computed<{ key: keyof typeof statuses; label: string }[]>(() =>
  showArchivedOnly.value
    ? [{ key: 'ARCHIVED' as const, label: statuses.ARCHIVED }]
    : [
        { key: 'SENT' as const, label: statuses.SENT },
        { key: 'PENDING' as const, label: statuses.PENDING },
        { key: 'IN_REVIEW' as const, label: statuses.IN_REVIEW },
        { key: 'APPROVED' as const, label: statuses.APPROVED },
        { key: 'REJECTED' as const, label: statuses.REJECTED }
      ]
)

const showMore = reactive<Record<keyof typeof statuses, boolean>>({
  SENT: false,
  PENDING: false,
  IN_REVIEW: false,
  APPROVED: false,
  REJECTED: false,
  ARCHIVED: false
})

const searchTerms = reactive<Record<keyof typeof statuses, string>>({
  SENT: '',
  PENDING: '',
  IN_REVIEW: '',
  APPROVED: '',
  REJECTED: '',
  ARCHIVED: ''
})

function filtered(key: keyof typeof statuses) {
  let list = applications.value
  if (key === 'ARCHIVED') {
    list = list.filter(a => a.archived)
  } else {
    const status = statuses[key]
    list = list.filter(a => a.status === status && !a.archived)
  }
  list = list.sort((a, b) => a.timestamp - b.timestamp)

  const term = searchTerms[key].toLowerCase()
  if (term) {
    list = list.filter(a =>
      cleanDiscord(a.discord).toLowerCase().includes(term)
    )
  }
  return list
}

function displayed(key: keyof typeof statuses) {
  const list = filtered(key)
  if (searchTerms[key]) return list
  return showMore[key] ? list : list.slice(0, 3)
}

function showAll(key: keyof typeof statuses) {
  showMore[key] = true
}

function showLess(key: keyof typeof statuses) {
  showMore[key] = false
}

function performSearch(key: keyof typeof statuses) {
  searchTerms[key] = searchTerms[key].trim()
  if (searchTerms[key]) {
    showMore[key] = true
  }
}

function isHighlighted(app: Application, key: keyof typeof statuses) {
  const term = searchTerms[key].toLowerCase()
  if (!term) return false
  return cleanDiscord(app.discord).toLowerCase().includes(term)
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
    case 'Rozpatrzone negatywnie':
    case 'Negatywnie (Napisz nowe podanie w ciągu 24/48h)':
      return 'red'
    case statuses.ARCHIVED:
      return 'yellow'
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
      body: JSON.stringify({ id: app.id, userId: app.userId, type: app.type, status: statuses.PENDING })
    })
    app.status = statuses.PENDING
  }
  const map: Record<string, string> = {
    whitelist: '/admin/applications',
    checker: '/admin/checker-applications',
    moderator: '/admin/moderator-applications',
    administrator: '/admin/administrator-applications',
    developer: '/admin/developer-applications',
    unban: '/admin/unban'
  }
  const typeForDetail = showArchivedOnly.value ? (app.type || 'whitelist') : appType.value
  const prefix = map[typeForDetail] || '/admin/applications'
  router.push(`${prefix}/${app.id}`)
}

async function archiveApplication(app: Application) {
  if (
    !confirm(
      'Pamiętaj, że przenosząc zgloszenie do archiwizacji, restartujesz czas potrzebny na złożenie nowego pytania do 0. Czy kontynuować?'
    )
  ) {
    return
  }
  await fetch(`/api/admin/archive/${app.id}`, {
    method: 'POST',
    credentials: 'include'
  })
  app.archived = { by: 'Admin', timestamp: Date.now() }
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

.apps {
  display: flex;
  flex-direction: column;
}

.apps.scrollable {
  max-height: 60vh;
  overflow-y: auto;
}

.search-box {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.search-box input {
  padding: 0.4rem;
  border-radius: 4px;
  border: 1px solid rgba(138, 43, 226, 0.3);
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
}

.search-box button {
  padding: 0.4rem 0.8rem;
  color: #fff;
  background: rgba(138, 43, 226, 0.3);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.search-box button:hover {
  background: rgba(138, 43, 226, 0.5);
}

.highlight {
  background: rgba(255, 255, 255, 0.1);
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
  position: relative;
}

.app-card p {
  margin: 0.2rem 0;
}
.app-type {
  color: orange;
  font-weight: bold;
}
.app-archived {
  color: #ffd700;
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

.archive-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: #fff;
  background: rgba(255, 165, 0, 0.3);
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  transition: background 0.2s ease;
  align-self: center;
}

.archive-btn.top-right {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  margin: 0;
}

.archive-btn:hover {
  background: rgba(255, 165, 0, 0.5);
}

.show-more-btn {
  display: block;
  margin: 0 auto 0.75rem;
  padding: 0.4rem 0.8rem;
  color: #fff;
  background: rgba(138, 43, 226, 0.3);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.show-more-btn:hover {
  background: rgba(138, 43, 226, 0.5);
}
</style>
