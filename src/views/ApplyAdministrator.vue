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

        <h2>2. Doświadczenie i obowiązki</h2>
        <label>
          Czy byłeś wcześniej adminem na serwerze RP lub społecznościowym?
          <textarea v-model="form.previousAdmin" required></textarea>
        </label>
        <label>
          Jakie obszary administracyjne Cię interesują?
          <textarea v-model="form.adminAreas" required></textarea>
        </label>

        <h2>3. 🎲 Sytuacje organizacyjne</h2>
        <div v-for="(q, i) in scenarioQuestions" :key="i" class="question-block">
          <p class="question">{{ q }}</p>
          <textarea v-model="form.scenarios[i]" required></textarea>
        </div>

        <h2>4. Zarządzanie</h2>
        <label>
          Co to jest zdrowa struktura administracyjna?
          <textarea v-model="form.healthyStructure" required></textarea>
        </label>
        <label>
          Czy jesteś skory do współpracy z rolami wyżej? Jak to sobie wyobrażasz?
          <textarea v-model="form.cooperation" required></textarea>
        </label>
        <label>
          Co Twoim zdaniem warto byłoby usprawnić w administracji?
          <textarea v-model="form.improvements" required></textarea>
        </label>

        <h2>5. Zgody</h2>
        <label class="checkbox">
          <input type="checkbox" v-model="form.consentData" required />
          Zgoda na przetwarzanie danych (Discord ID)
        </label>
        <label class="checkbox">
          <input type="checkbox" v-model="form.consentDuties" required />
          Akceptuję obowiązki Administratora
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
const pageTitle = 'Podanie na Administratora'
const appType = 'administrator'
const success = ref(false)
const router = useRouter()

// Lista pytań pobierana jest z API

const scenarioQuestions = ref<string[]>([])

interface FormData {
  discord: string
  previousAdmin: string
  adminAreas: string
  scenarios: string[]
  healthyStructure: string
  cooperation: string
  improvements: string
  consentData: boolean
  consentDuties: boolean
  consentTruth: boolean
}

const form = ref<FormData>({
  discord: '',
  previousAdmin: '',
  adminAreas: '',
  scenarios: ['', '', ''],
  healthyStructure: '',
  cooperation: '',
  improvements: '',
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
  const qRes = await fetch('/api/questions?type=administrator', {
    credentials: 'include'
  })
  const qData = await qRes.json()
  if (Array.isArray(qData.questions)) {
    scenarioQuestions.value = qData.questions
  }

  const statusRes = await fetch('/api/status?type=administrator', {
    credentials: 'include'
  })
  const statusData = await statusRes.json()
  if (
    statusData.status &&
    (statusData.status !== 'Negatywnie' ||
      (statusData.reapplyAfter && Date.now() < statusData.reapplyAfter))
  ) {
    router.push('/status-administrator')
    return
  }
})

async function submitForm() {
  const response = await fetch('/api/apply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...form.value, type: appType, questions: scenarioQuestions.value })
  })
  if (response.ok) {
    success.value = true
    router.push('/status-administrator')
  } else if (response.status === 400) {
    router.push('/status-administrator')
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

.question-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.question {
  font-weight: 600;
  white-space: pre-wrap;
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
