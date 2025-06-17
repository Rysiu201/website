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
          Wiek
          <input type="number" v-model.number="form.age" required />
        </label>
        <label>
          Od jak dawna jesteś na serwerze?
          <input v-model="form.serverTime" required />
        </label>
        <label>
          Ile czasu dziennie jesteś aktywny/a na Discordzie?
          <input v-model="form.activeTime" required />
        </label>

        <h2>2. Doświadczenie i podejście</h2>
        <label>
          Czy pełniłaś/eś wcześniej funkcję moderatora? Gdzie i jak wyglądała ta rola?
          <textarea v-model="form.moderatorExp" required></textarea>
        </label>
        <label>
          Dlaczego chcesz zostać Moderatorem u nas?
          <textarea v-model="form.motivation" required></textarea>
        </label>
        <label>
          Jakie są Twoje mocne strony w kontakcie z ludźmi?
          <textarea v-model="form.strengths" required></textarea>
        </label>

        <h2>3. Sytuacje i zachowanie</h2>
        <label>
          Jak reagujesz, gdy użytkownik prowokuje innych, ale nie łamie regulaminu bezpośrednio?
          <textarea v-model="form.provocation" required></textarea>
        </label>
        <label>
          Co robisz, jeśli ktoś wysyła zgłoszenie w stylu \"XD lol\" – bez konkretów?
          <textarea v-model="form.lolReport" required></textarea>
        </label>
        <label>
          Jak rozpoznać, że zgłoszenie nie jest trollowaniem, tylko realnym problemem?
          <textarea v-model="form.realProblem" required></textarea>
        </label>
        <div class="question-block">
          <p class="question">🎲 PYTANIE LOSOWE</p>
          <p>{{ randomScenario }}</p>
          <textarea v-model="form.randomAnswer" required></textarea>
        </div>

        <h2>4. Praca w zespole</h2>
        <label>
          Jak widzisz współpracę z innymi członkami zespołu, takimi jak Community Manager, Admin czy Developer?
          <textarea v-model="form.teamwork" required></textarea>
        </label>
        <label>
          Jak rozumiesz swoją rolę w przekazywaniu zgłoszeń dalej? Kiedy decydujesz się rozwiązać coś samodzielnie, a kiedy informujesz innych członków zespołu?
          <textarea v-model="form.escalation" required></textarea>
        </label>
        <label>
          Czy potrafisz pozostać neutralny, nawet gdy temat dotyczy znajomej osoby?
          <textarea v-model="form.neutrality" required></textarea>
        </label>

        <h2>5. Zgody</h2>
        <label class="checkbox">
          <input type="checkbox" v-model="form.consentData" required />
          Zgoda na przetwarzanie danych (Discord ID)
        </label>
        <label class="checkbox">
          <input type="checkbox" v-model="form.consentDuties" required />
          Akceptuję obowiązki Moderatora
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
const pageTitle = 'Podanie na Moderatora'
const appType = 'moderator'
const success = ref(false)
const router = useRouter()

const scenarioPool = [
  'Ktoś pisze na publicznym czacie: „admin to idiota”.',
  'Gracz spamuje memami w poważnej dyskusji mimo ostrzeżeń.',
  'Ktoś wstawia wulgarną nazwę użytkownika i pisze nią na czacie.',
  'Gracz podaje link do innego serwera Discord.',
  'Rozpoczyna się kłótnia między dwiema frakcjami — Discord płonie.',
  'Gracz prowokuje pytaniami typu „ile macie IQ?” wśród innych.',
  'Ktoś zgłasza rasistowski lub homofobiczny komentarz — nie ma screena.',
  'Gracz pisze do Ciebie na DM z groźbą zgłoszenia do właściciela.',
  'W ticketach ktoś pisze same „XD” i „lol” — nie wiadomo o co chodzi.',
  'Grupa graczy spamuje jednocześnie w kilku kanałach (np. @everyone, .gif).',
  'Ktoś zgłasza oszustwo IC na czacie OOC — temat eskaluje.',
  'Gracz oznacza właściciela bez powodu, mimo ostrzeżeń.',
  'Ktoś publikuje screen z prywatnej rozmowy z innym graczem.',
  'Gracz celowo psuje zgłoszenia — usuwa wiadomości, edytuje odpowiedzi.',
  'Ktoś przesyła zdjęcie kontrowersyjnego contentu NSFW (mimo zakazu).',
  'Zgłoszenie „moderator nie reaguje, więc piszę tu!” — co robisz?',
  'Na kanale IC ktoś zaczyna pisać czystym OOC-em i robi burdel.',
  'Gracz trolluje tickety pisząc o „duchach w systemie” – nic konkretnego.',
  'Współpracownik z ekipy odpowiada z ironią do gracza — co robisz?',
  'Ktoś pisze „to nie złamanie regulaminu, ale zachował się jak frajer” — co robisz?'
]

const randomScenario = ref('')

interface FormData {
  discord: string
  age: number | null
  serverTime: string
  activeTime: string
  moderatorExp: string
  motivation: string
  strengths: string
  provocation: string
  lolReport: string
  realProblem: string
  randomAnswer: string
  teamwork: string
  escalation: string
  neutrality: string
  consentData: boolean
  consentDuties: boolean
  consentTruth: boolean
}

const form = ref<FormData>({
  discord: '',
  age: null,
  serverTime: '',
  activeTime: '',
  moderatorExp: '',
  motivation: '',
  strengths: '',
  provocation: '',
  lolReport: '',
  realProblem: '',
  randomAnswer: '',
  teamwork: '',
  escalation: '',
  neutrality: '',
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
  randomScenario.value = scenarioPool[Math.floor(Math.random() * scenarioPool.length)]

  const statusRes = await fetch('/api/status?type=moderator', {
    credentials: 'include'
  })
  const statusData = await statusRes.json()
  if (
    statusData.status &&
    (statusData.status !== 'Negatywnie' ||
      (statusData.reapplyAfter && Date.now() < statusData.reapplyAfter))
  ) {
    router.push('/status-moderator')
    return
  }
})

async function submitForm() {
  const response = await fetch('/api/apply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...form.value, scenario: randomScenario.value, type: appType })
  })
  if (response.ok) {
    success.value = true
    router.push('/status-moderator')
  } else if (response.status === 400) {
    router.push('/status-moderator')
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
