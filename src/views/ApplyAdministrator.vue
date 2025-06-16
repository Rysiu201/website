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
          Czy byłeś wcześniej adminem na serwerze RP lub społecznościowym?
          <textarea v-model="form.previousAdmin" required></textarea>
        </label>
        <label>
          Jakie obszary administracyjne Cię interesują?
          <textarea v-model="form.adminAreas" required></textarea>
        </label>
        <h2>🎲 Sytuacje organizacyjne</h2>
        <div v-for="(q, i) in scenarioQuestions" :key="i" class="question-block">
          <p class="question">{{ q }}</p>
          <textarea v-model="form.scenarios[i]" required></textarea>
        </div>
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

const scenarioPool = [
  'Gracze zgłaszają, że jedna frakcja dominuje wszystkie inne – jak reagujesz?',
  'System whitelist się zapchał – 50 podań w 1 dzień, tylko 2 osoby do sprawdzania.',
  'Trzy osoby z ekipy pokłóciły się w kanale prywatnym – co robisz?',
  'W środku nocy padła baza danych – Owner śpi, Dev niedostępny.',
  'Ktoś zmienia handlingi bez zgody – jak dojść kto, i co robisz?',
  'Gracze oskarżają frakcję o metagaming – zgłoszenie na kanale publicznym.',
  'Serwer dostał raida na Discordzie – co robisz przez pierwsze 5 minut?',
  'Tester zgłasza błąd krytyczny na produkcji – jak organizujesz reakcję?',
  'W evencie bierze udział 50 osób, event się wysypuje – kto odpowiada?',
  'CM nie odpowiada na ważny temat, mod wchodzi w jego miejsce – co robisz?',
  'Developer wypuścił niedziałający skrypt i nie odbiera wiadomości.',
  'Nowy admin zaczyna wprowadzać zmiany bez ustaleń – jak reagujesz?',
  'Dwie frakcje chcą tę samą lokalizację – jak rozwiązać sprawę?',
  'Masz za mało adminów – kogo szukasz, jak oceniasz kandydata?',
  'WLChecker nagle rezygnuje i zostawia nieprzeczytane 60 podań.',
  'W grze pojawiły się „dzikie pojazdy” spoza listy – jak to zabezpieczasz?',
  'Kanał z logami przestał działać – co robisz jako pierwsze?',
  'CM prowadzi event, ale gracze go wyśmiewają – jak pomagasz?',
  'Zgłasza się osoba z inną rangą, że nie chce pracować z danym Developerem.',
  'Gracze IC wynoszą OOC dramy – jak jako admin reagujesz?'
]

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
  // pick 3 random unique scenarios
  const shuffled = [...scenarioPool].sort(() => Math.random() - 0.5)
  scenarioQuestions.value = shuffled.slice(0, 3)
})

async function submitForm() {
  const response = await fetch('/api/apply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...form.value, type: appType, questions: scenarioQuestions.value })
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

.question-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.question {
  font-weight: 600;
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
