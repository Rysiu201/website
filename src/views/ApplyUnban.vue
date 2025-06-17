<template>
  <main class="apply-page" :style="{ backgroundImage: `url(${backgroundImageUrl})` }">
    <div class="apply-overlay"></div>
    <div class="apply-container">
      <h1><span class="logo-accent">Wniosek o odbanowanie</span></h1>
      <form @submit.prevent="submitForm" class="app-form">
        <h2>1. Dane Gracza</h2>
        <label>
          Nick Discord + ID
          <input v-model="form.discord" readonly />
        </label>
        <label>
          SteamID
          <input v-model="form.steamId" required placeholder="Twoje SteamID np. 110000112345678" />
        </label>
        <label>
          Nick na serwerze w momencie bana
          <input v-model="form.serverNick" required placeholder="Twój nick na serwerze" />
        </label>
        <label>
          Data bana
          <input type="date" v-model="form.banDate" required />
        </label>
        <label>
          Długość bana w dniach
          <input type="number" min="0" v-model.number="form.banDurationDays" required />
        </label>

        <h2>2. Szczegóły Bana</h2>
        <label>
          Kto nałożył bana
          <input v-model="form.bannedBy" required placeholder="Nick osoby banującej" />
        </label>
        <label>
          Powód bana
          <textarea v-model="form.banReason" required placeholder="Powód otrzymania bana"></textarea>
        </label>

        <h2>3. Wyjaśnienie</h2>
        <label>
          Twoja wersja wydarzeń
          <textarea v-model="form.events" required placeholder="Opisz sytuację swoimi słowami"></textarea>
        </label>
        <label>
          Czy przyznajesz się do złamania zasad?
          <textarea v-model="form.admit" placeholder="tak / nie + uzasadnienie"></textarea>
        </label>
        <label>
          Co zmieniło się od momentu bana?
          <textarea v-model="form.change" placeholder="Czy coś zrozumiałeś, poprawiłeś, wracasz z nowym nastawieniem..."></textarea>
        </label>

        <h2>4. Dodatki (Opcjonalne)</h2>
        <label>
          Dowody/screeny/nagrania
          <textarea v-model="form.evidence" placeholder="Linki do dowodów lub opis"></textarea>
        </label>
        <label>
          Dodatkowe uwagi
          <textarea v-model="form.notes" placeholder="Inne informacje dla administracji"></textarea>
        </label>

        <h2>5. Zgoda i potwierdzenie</h2>
        <label class="checkbox">
          <input type="checkbox" v-model="form.consentTruth" required />
          Oświadczam, że powyższe dane są zgodne z prawdą
        </label>
        <label class="checkbox">
          <input type="checkbox" v-model="form.consentRules" required />
          Zapoznałem się z regulaminem serwera i odwołania od bana
        </label>
        <button type="submit" class="submit-btn">Wyślij podanie</button>
      </form>
      <p v-if="success" class="success-message">
        Twój wniosek o odbanowanie został wysłany. Obecnie twój wniosek ma status: {{ status }}
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import backgroundImage from '../assets/background.jpg'

const backgroundImageUrl = ref(backgroundImage)
const router = useRouter()
const appType = 'unban'
const success = ref(false)
const status = ref('')

interface FormData {
  discord: string
  steamId: string
  serverNick: string
  banDate: string
  bannedBy: string
  banReason: string
  banDurationDays: number
  events: string
  admit: string
  change: string
  evidence: string
  notes: string
  consentTruth: boolean
  consentRules: boolean
}

const form = ref<FormData>({
  discord: '',
  steamId: '',
  serverNick: '',
  banDate: '',
  bannedBy: '',
  banReason: '',
  banDurationDays: 0,
  events: '',
  admit: '',
  change: '',
  evidence: '',
  notes: '',
  consentTruth: false,
  consentRules: false
})

onMounted(async () => {
  const res = await fetch('/api/user', { credentials: 'include' })
  const data = await res.json()
  if (data.user) {
    form.value.discord = `${data.user.username}#${data.user.id}`
  }
  const statusRes = await fetch('/api/status?type=unban', { credentials: 'include' })
  const statusData = await statusRes.json()
  if (
    statusData.status &&
    (statusData.status !== 'Negatywnie' || (statusData.reapplyAfter && Date.now() < statusData.reapplyAfter))
  ) {
    router.push('/status-unban')
    return
  }
})

async function submitForm() {
  const response = await fetch('/api/apply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...form.value, type: appType })
  })
  if (response.ok) {
    const data = await response.json()
    success.value = true
    status.value = data.status
    router.push('/status-unban')
  } else if (response.status === 400) {
    router.push('/status-unban')
  }
}
</script>

<style scoped>
.apply-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem 1rem;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.apply-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1;
}

.apply-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 2;
}

.app-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.app-form label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.app-form input,
.app-form textarea {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #444;
  background: #222;
  color: #fff;
}

.app-form textarea {
  min-height: 80px;
}

.checkbox {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.submit-btn {
  align-self: center;
  padding: 0.6rem 1.2rem;
  background: var(--primary);
  border: none;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.success-message {
  margin-top: 1rem;
  color: var(--secondary);
}
</style>
