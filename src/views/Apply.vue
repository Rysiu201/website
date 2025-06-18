<template>
  <main class="apply-page" :style="{ backgroundImage: `url(${backgroundImageUrl})` }">
    <div class="apply-overlay"></div>
    <div class="apply-container">
    <h1>{{ pageTitle }}</h1>
    <p class="intro">
      Przed wypełnieniem formularza zapoznaj się z poniższymi wskazówkami. Odpowiadaj wyczerpująco i zgodnie z zasadami roleplay. Pamiętaj, aby unikać informacji OOC w części IC.
    </p>
    <form @submit.prevent="submitForm" class="app-form">
      <!-- Sekcja 1 -->
      <h2>1. Informacje ogólne (IC)</h2>
      <label>
        Imię i nazwisko postaci
        <input v-model="form.ic.name" required placeholder="Cezary Soplica" />
      </label>
      <label>
        Wiek postaci
        <input type="number" v-model.number="form.ic.age" required placeholder="26" />
      </label>
      <label>
        Krótki opis postaci / Historia
        <textarea v-model="form.ic.story" required placeholder="Krótka historia postaci..."></textarea>
      </label>
      <label>
        Charakter / cechy osobowości
        <textarea v-model="form.ic.personality" required placeholder="Opis cech charakteru..."></textarea>
      </label>
      <label>
        Umiejętności, zawód, hobby
        <textarea v-model="form.ic.skills" required placeholder="Np. mechanik, granie na gitarze..."></textarea>
      </label>
      <label>
        Motywacja przyjazdu do miasta
        <textarea v-model="form.ic.motivation" required placeholder="Co Cię skłoniło do przyjazdu?"></textarea>
      </label>

      <!-- Sekcja 2 -->
      <h2>2. Informacje OOC</h2>
      <label>
        Nick Discord + ID
        <input v-model="form.ooc.discord" readonly />
      </label>
      <label>
        Doświadczenie w RP
        <textarea v-model="form.ooc.experience" required placeholder="Twoje doświadczenie w RP..."></textarea>
      </label>

      <!-- Sekcja 3 -->
      <h2>3. Pytania sytuacyjne</h2>
      <div v-for="(q, index) in questions" :key="index" class="question-block">
        <p class="question">{{ q }}</p>
        <textarea v-model="form.scenarios[index]" required placeholder="Twoja odpowiedź..."></textarea>
      </div>

      <!-- Sekcja 4 -->
      <h2>4. Zgody</h2>
      <label class="checkbox">
        <input type="checkbox" v-model="form.consents.data" required />
        Zgoda na przetwarzanie danych (Discord ID)
      </label>
      <label class="checkbox">
        <input type="checkbox" v-model="form.consents.rules" required />
        Znam zasady RP i Akceptuję regulamin serwera
      </label>
      <label class="checkbox">
        <input type="checkbox" v-model="form.consents.truth" required />
        Potwierdzam prawdziwość podanych informacji
      </label>

      <!-- Sekcja 5 -->
      <h2>5. Dodatkowo (opcjonalnie)</h2>
      <label>
        Link do portfolio RP
        <input v-model="form.extra.portfolio" placeholder="URL do portfolio" />
      </label>
      <label>
        Preferowana frakcja lub rola
        <input v-model="form.extra.faction" placeholder="Np. EMS, cywil..." />
      </label>

      <button type="submit" class="submit-btn">Wyślij podanie</button>
    </form>
    <p v-if="success" class="success-message">Dziękujemy za wysłanie podania!</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import backgroundImage from '../assets/background.jpg'
const backgroundImageUrl = ref(backgroundImage)
const route = useRoute()
const appType = computed(() => (route.meta.type as string) || 'whitelist')
const pageTitle = computed(() => {
  switch (appType.value) {
    case 'checker':
      return 'Podanie na WhiteListCheckera'
    case 'moderator':
      return 'Podanie na Moderatora'
    case 'administrator':
      return 'Podanie na Administratora'
    case 'developer':
      return 'Podanie na Developera'
    default:
      return 'Złóż podanie na WhiteListe'
  }
})

interface FormData {
  ic: {
    name: string
    age: number | null
    story: string
    personality: string
    skills: string
    motivation: string
  }
  ooc: {
    discord: string
    experience: string
    knowsRules: boolean
  }
  scenarios: string[]
  questions: string[]
  consents: {
    data: boolean
    rules: boolean
    truth: boolean
  }
  extra: {
    portfolio: string
    faction: string
  }
}


const questions = ref<string[]>([])
const success = ref(false)
const router = useRouter()

const form = ref<FormData>({
  ic: {
    name: '',
    age: null,
    story: '',
    personality: '',
    skills: '',
    motivation: ''
  },
  ooc: {
    discord: '',
    experience: '',
    knowsRules: false
  },
  scenarios: ['', '', '', '', ''],
  questions: [],
  consents: {
    data: false,
    rules: false,
    truth: false
  },
  extra: {
    portfolio: '',
    faction: ''
  }
})


onMounted(async () => {
  // Pobierz dane użytkownika z API
  const res = await fetch('/api/user', { credentials: 'include' })
  const data = await res.json()
  if (data.user) {
    form.value.ooc.discord = `${data.user.username}#${data.user.id}`
  }

  if (appType.value === 'whitelist') {
    const statusRes = await fetch('/api/status', { credentials: 'include' })
    const statusData = await statusRes.json()
    if (
      statusData.status &&
      (statusData.status !== 'Negatywnie' ||
        (statusData.reapplyAfter && Date.now() < statusData.reapplyAfter))
    ) {
      router.push('/status')
      return
    }
  }

  // Odbierz przypisane do użytkownika pytania
  const qRes = await fetch(`/api/questions?type=${appType.value}`, {
    credentials: 'include'
  })
  const qData = await qRes.json()
  if (Array.isArray(qData.questions)) {
    questions.value = qData.questions
  }
})

async function submitForm() {
  form.value.questions = questions.value
  const response = await fetch('/api/apply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...form.value, type: appType.value })
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
</style>