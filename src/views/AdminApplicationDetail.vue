<template>
  <main class="app-detail-page">
    <RouterLink to="/admin/applications" class="back-link">
      <i class="fa-solid fa-arrow-left"></i> Powrót
    </RouterLink>
    <div v-if="app" class="detail-container">
      <h1 class="detail-title">Podanie użytkownika {{ cleanDiscord(app.data.ooc.discord) }}</h1>
      <p><b>Status:</b> <span class="status-text">{{ app.status }}</span></p>
      <p><b>Data zgłoszenia:</b> {{ formatDate(ts) }}</p>
      <h2>Informacje IC</h2>
      <ul>
        <li><b>Imię i nazwisko:</b> {{ app.data.ic.name }}</li>
        <li><b>Wiek:</b> {{ app.data.ic.age }}</li>
        <li><b>Historia:</b> {{ app.data.ic.story }}</li>
        <li><b>Charakter:</b> {{ app.data.ic.personality }}</li>
        <li><b>Umiejętności:</b> {{ app.data.ic.skills }}</li>
        <li><b>Motywacja:</b> {{ app.data.ic.motivation }}</li>
      </ul>
      <h2>Informacje OOC</h2>
      <ul>
        <li><b>Discord:</b> {{ app.data.ooc.discord }}</li>
        <li><b>Doświadczenie:</b> {{ app.data.ooc.experience }}</li>
        <li><b>Znajomość zasad:</b> {{ app.data.ooc.knowsRules ? 'Tak' : 'Nie' }}</li>
      </ul>
      <h2>Pytania sytuacyjne</h2>
      <ol>
        <li v-for="(sc, idx) in app.data.scenarios" :key="idx">{{ sc }}</li>
      </ol>
      <h2>Dodatkowo</h2>
      <ul>
        <li><b>Portfolio:</b> {{ app.data.extra.portfolio }}</li>
        <li><b>Frakcja:</b> {{ app.data.extra.faction }}</li>
      </ul>
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
</style>
