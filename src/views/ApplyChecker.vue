<template>
  <main class="apply-page" :style="{ backgroundImage: `url(${backgroundImageUrl})` }">
    <div class="apply-overlay"></div>
    <div class="apply-container">
      <h1>{{ pageTitle }}</h1>
      <form @submit.prevent="submitForm" class="app-form">
        <h2>1. Informacje ogólne (OOC)</h2>
        <label>
          Nick Discord + ID
          <input v-model="form.discord" readonly />
        </label>
        <label>
          Od jak dawna jesteś na naszym serwerze?
          <input
            v-model="form.serverTime"
            required
            placeholder="Np. od 3 miesięcy"
          />
        </label>

        <h2>2. Doświadczenie i podejście</h2>
        <label>
          Czy miałeś styczność z weryfikacją lub selekcją graczy?
          <textarea
            v-model="form.verificationExp"
            required
            placeholder="Opisz swoje wcześniejsze doświadczenia"
          ></textarea>
        </label>
        <label>
          Jak rozpoznać gracza, który "tylko wypełnił, żeby wejść", od gracza z potencjałem?
          <textarea
            v-model="form.differentiate"
            required
            placeholder="Wyjaśnij swoje kryteria oceny"
          ></textarea>
        </label>
        <label>
          Na co zwracasz uwagę przy czytaniu podania na WL?
          <textarea
            v-model="form.reviewFocus"
            required
            placeholder="Wymień najważniejsze elementy"
          ></textarea>
        </label>
        <label>
          Co Twoim zdaniem oznacza dobre RP i jakbyś je promował?
          <textarea
            v-model="form.goodRp"
            required
            placeholder="Twoja definicja dobrego RP"
          ></textarea>
        </label>

        <h2>3. Praca</h2>
        <label>
          Ile podań jesteś w stanie realnie sprawdzić dziennie / tygodniowo?
          <input
            v-model="form.workload"
            required
            placeholder="Np. 5 dziennie lub 20 tygodniowo"
          />
        </label>
        <label>
          Co robisz, jeśli masz wątpliwości co do kandydata?
          <textarea
            v-model="form.doubts"
            required
            placeholder="Opisz swoje działania w takiej sytuacji"
          ></textarea>
        </label>
        <label>
          Wolisz działać samodzielnie czy w parze z innym Checkerem?
          <input
            v-model="form.teamwork"
            required
            placeholder="Opisz preferowany styl pracy"
          />
        </label>

        <h2>4. Zgody</h2>
        <label class="checkbox">
          <input type="checkbox" v-model="form.consentData" required />
          Zgoda na przetwarzanie danych (Discord ID)
        </label>
        <label class="checkbox">
          <input type="checkbox" v-model="form.consentDuties" required />
          Akceptuję obowiązki Checkera
        </label>
        <label class="checkbox">
          <input type="checkbox" v-model="form.consentTruth" required />
          Potwierdzam prawdziwość podanych informacji
        </label>
        <button type="submit" class="submit-btn">Wyślij podanie</button>
      </form>
      <p v-if="success" class="success-message">Dziękujemy za wysłanie podania!</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import backgroundImage from '../assets/background.jpg'

const backgroundImageUrl = ref(backgroundImage)
const pageTitle = 'Podanie na WhiteListCheckera'
const appType = 'checker'
const success = ref(false)
const router = useRouter()

interface FormData {
  discord: string
  serverTime: string
  verificationExp: string
  differentiate: string
  reviewFocus: string
  goodRp: string
  workload: string
  doubts: string
  teamwork: string
  consentData: boolean
  consentDuties: boolean
  consentTruth: boolean
}

const form = ref<FormData>({
  discord: '',
  serverTime: '',
  verificationExp: '',
  differentiate: '',
  reviewFocus: '',
  goodRp: '',
  workload: '',
  doubts: '',
  teamwork: '',
  consentData: false,
  consentDuties: false,
  consentTruth: false
})

onMounted(async () => {
  const res = await fetch('/api/user', { credentials: 'include' })
  const data = await res.json()
  if (data.user) {
    form.value.discord = `${data.user.username}#${data.user.id}`
  }

  const statusRes = await fetch('/api/status?type=checker', {
    credentials: 'include'
  })
  const statusData = await statusRes.json()
  if (
    statusData.status &&
    (statusData.status !== 'Negatywnie' ||
      (statusData.reapplyAfter && Date.now() < statusData.reapplyAfter))
  ) {
    router.push('/status-checker')
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
    success.value = true
    router.push('/status-checker')
  } else if (response.status === 400) {
    router.push('/status-checker')
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

.intro {
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.8);
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
