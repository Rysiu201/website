<template>
  <main class="apply-page" :style="{ backgroundImage: `url(${backgroundImageUrl})` }">
    <div class="apply-overlay"></div>
    <div class="apply-container">
      <h1>{{ pageTitle }}</h1>
      <form @submit.prevent="submitForm" class="app-form">
        <label>
          Nick Discord + ID
          <input v-model="form.discord" readonly />
        </label>
        <label>
          Jakie języki programowania znasz?
          <textarea v-model="form.languages" required></textarea>
        </label>
        <label>
          Czy pracowałeś wcześniej z zasobami FiveM? Jakimi?
          <textarea v-model="form.fivemExp" required></textarea>
        </label>
        <label>
          Jak wygląda Twoja organizacja pracy przy większych zadaniach?
          <textarea v-model="form.workOrg" required></textarea>
        </label>
        <label>
          Opisz projekt/skrypt, z którego jesteś najbardziej dumny/a.
          <textarea v-model="form.proudProject" required></textarea>
        </label>
        <label>
          Jak reagujesz, gdy ktoś zgłasza błąd w Twoim kodzie?
          <textarea v-model="form.bugResponse" required></textarea>
        </label>
        <label>
          Czy potrafisz kodować pod cudze wymagania?
          <textarea v-model="form.requirements" required></textarea>
        </label>
        <label>
          Jakie obszary Cię najbardziej interesują? (UI, systemy RP, joby, zasoby)
          <textarea v-model="form.interests" required></textarea>
        </label>
        <label>
          Czy potrafisz przeprowadzać testy jednostkowe i techniczne?
          <textarea v-model="form.testing" required></textarea>
        </label>
        <label>
          🔗 Link do portfolio (GitHub, Discord bot, skrypt, demo)
          <input v-model="form.portfolio" required />
        </label>
        <label class="checkbox">
          <input type="checkbox" v-model="form.consentData" required />
          Zgoda na przetwarzanie danych (Discord ID)
        </label>
        <label class="checkbox">
          <input type="checkbox" v-model="form.consentDuties" required />
          Akceptuję zakres obowiązków Developera
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
const pageTitle = 'Podanie na Developera'
const appType = 'developer'
const success = ref(false)
const router = useRouter()

interface FormData {
  discord: string
  languages: string
  fivemExp: string
  workOrg: string
  proudProject: string
  bugResponse: string
  requirements: string
  interests: string
  testing: string
  portfolio: string
  consentData: boolean
  consentDuties: boolean
  consentTruth: boolean
}

const form = ref<FormData>({
  discord: '',
  languages: '',
  fivemExp: '',
  workOrg: '',
  proudProject: '',
  bugResponse: '',
  requirements: '',
  interests: '',
  testing: '',
  portfolio: '',
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
})

async function submitForm() {
  const response = await fetch('/api/apply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...form.value, type: appType })
  })
  if (response.ok) {
    success.value = true
    router.push('/status')
  } else if (response.status === 400) {
    router.push('/status')
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
  align-self: flex-start;
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
