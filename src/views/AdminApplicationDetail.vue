<template>
  <main class="app-detail-page">
    <RouterLink to="/admin/applications" class="back-link">
      <i class="fa-solid fa-arrow-left"></i> Powrót
    </RouterLink>
    <div v-if="app" class="detail-container">
      <h1 class="detail-title">Podanie użytkownika {{ cleanDiscord(app.data.ooc.discord) }}</h1>
      <table class="app-table">
        <tr>
          <th>Status</th>
          <td><span :class="['status-text', statusClass]">{{ app.status }}</span></td>
        </tr>
        <tr>
          <th>Data zgłoszenia</th>
          <td>{{ formatDate(ts) }}</td>
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
        <tr v-for="(qa, idx) in scenarioPairs" :key="idx">
          <th>{{ qa.question }}</th>
          <td>{{ qa.answer }}</td>
        </tr>
      </table>
      <h2>Dodatkowo</h2>
      <table class="app-table">
        <tr><th>Portfolio</th><td>{{ app.data.extra.portfolio }}</td></tr>
        <tr><th>Frakcja</th><td>{{ app.data.extra.faction }}</td></tr>
      </table>
    </div>
    <p v-else>Ładowanie...</p>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

interface Application {
  id: string
  status: string
  data: any
  history?: { status: string; timestamp: number }[]
}

const route = useRoute()
const app = ref<Application | null>(null)

onMounted(async () => {
  const res = await fetch(`/api/admin/applications/${route.params.id}`, { credentials: 'include' })
  if (res.ok) {
    const data = await res.json()
    app.value = data.application || null
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
    case 'Wysłane':
      return 'gray'
    case 'Przyjęte, oczekuje na rozpatrzenie':
      return 'orange'
    case 'W trakcie rozpatrywania':
      return 'blue'
    case 'Rozpatrzone Pozytywnie':
      return 'green'
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
  color: #fff;
}

.detail-title {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.6rem;
}

.status-text {
  background: linear-gradient(90deg, #8A2BE2, #00FFFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.detail-container {
  max-width: 800px;
  margin: 0 auto;
}

.app-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}
.app-table th,
.app-table td {
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  vertical-align: top;
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
</style>
