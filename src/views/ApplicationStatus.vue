<template>
  <main class="status-page" :style="{ backgroundImage: `url(${backgroundImageUrl})` }">
    <div class="status-overlay"></div>
    <div class="status-content">
      <h1>{{ headerText }}</h1>
      <h1>
        Obecny status twojego zgłoszenia:
        <b><span :class="statusClass">{{ status }}</span></b>
      </h1>
      <p v-if="status === statuses.APPROVED" class="approved-msg">
        <template v-if="appType === 'administrator' || appType === 'moderator'">
          Gratulacje! Twoje podanie zostało rozpatrzone {{ status }}. Poniżej znajdziesz kolejne kroki.
        </template>
        <template v-else>
          Twoje podanie zostało rozpatrzone {{ status }}.
          <a :href="discordLink" target="_blank">Dołącz na Discorda</a>
          i zgłoś się w celu dalszej rekrutacji.
        </template>
      </p>
      <p v-if="archived" class="approved-msg">
        Twoje podanie zostało zarchiwizowane.
      </p>
      <div v-if="status === statuses.APPROVED" class="next-steps">
        <h2><span class="logo-accent">Dalsze kroki</span></h2>
        <div class="steps-grid">
          <div v-for="step in joinSteps" :key="step.id" class="step-card">
            <div class="step-number">{{ step.id }}</div>
            <div class="step-icon">
              <i :class="step.icon"></i>
            </div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-description">{{ step.description }}</p>
            <a
              v-if="step.link"
              class="step-button"
              :href="step.link"
            >
              Kliknij tutaj!
            </a>
          </div>
        </div>
      </div>

      <div v-if="status === statuses.REJECTED" class="rejected-box">
        <div v-if="rejectionReason" class="reason-box">
          <h3>Powód odrzucenia</h3>
          <p>{{ rejectionReason }}</p>
        </div>
        <p v-if="timeRemaining">
          W ciągu {{ cooldownText }} możesz ponownie złożyć podanie.
        </p>
        <button
          class="reapply-btn"
          :class="{ ready: !timeRemaining }"
          @click="gotoApply"
        >
          <span v-if="timeRemaining">{{ timeRemaining }}</span>
          <span v-else>Napisz nowe podanie</span>
        </button>
      </div>

      <div v-if="rejectedHistory.length" class="history">
        <h2>Historia podań</h2>
        <ul>
          <li v-for="(h, idx) in rejectedHistory" :key="idx">
            {{ formatHistory(h) }}
          </li>
        </ul>
        <p class="rejections-info">
          Odrzucone: {{ recentRejections }}/{{ rejectionsBeforeExtra }}
        </p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import backgroundImage from '../assets/background.jpg'

const backgroundImageUrl = backgroundImage

const statuses = {
  SENT: 'Wysłane',
  PENDING: 'Przyjęte, oczekuje na rozpatrzenie',
  IN_REVIEW: 'W trakcie rozpatrywania',
  APPROVED: 'Pozytywnie',
  REJECTED: 'Negatywnie',
  ARCHIVED: 'Zarchiwizowane'
}

const defaultSteps = [
  {
    id: 1,
    title: 'Wskakuj na kanał  🎢Kolejka',
    description:
      'Dużo już nie zostało! Oczekuj na godziny przepytywania i dołącz na kanał 🎢Kolejka.',
    icon: 'fa-brands fa-discord',
    link: 'https://discord.com/channels/1370536825638355154/1370545312527286405'
  },
  {
    id: 2,
    title: 'Aktywne Godziny Przepytywania',
    description:
      'W aktywnych godzinach Admin sam przeniesie Cię na kanał do przepytywania.',
    icon: 'fa-brands fa-discord'
  },
  {
    id: 3,
    title: 'Przeczytaj Zasady i przypomnij Sobie historie postaci',
    description:
      'Przypomnij Sobie zasady oraz Historię postaci, bo z tego będziesz pytany/a.',
    icon: 'fa-solid fa-book'
  },
  {
    id: 4,
    title: 'Przejdź Rozmowę Rekrutacyjną',
    description: 'Po pozytywnym przejściu rozmowy zostało Ci już tylko połączenie się z serwerem!',
    icon: 'fa-solid fa-server',
    link: '/join'
  }
]

const adminSteps = [
  {
    id: 1,
    title: 'Skontaktuj się na kanale',
    description: 'Użyj wskazanego kanału Discord aby umówić się na rozmowę.',
    icon: 'fa-brands fa-discord',
    link: undefined
  },
  {
    id: 2,
    title: 'Poczekaj na swoją kolej',
    description: 'Gdy nadejdzie Twoja kolej przejdź rozmowę kwalifikacyjną.',
    icon: 'fa-solid fa-comments',
    link: undefined
  },
  {
    id: 3,
    title: 'Wspomagaj serwer',
    description: 'Angażuj się i pomagaj innym tworzyć lepszą społeczność.',
    icon: 'fa-solid fa-handshake',
    link: undefined
  }
]

const moderatorSteps = [
  {
    id: 1,
    title: 'Skontaktuj się na kanale',
    description: 'Użyj wskazanego kanału Discord aby umówić się na rozmowę.',
    icon: 'fa-brands fa-discord',
    link: undefined
  },
  {
    id: 2,
    title: 'Poczekaj na swoją kolej',
    description: 'Gdy nadejdzie Twoja kolej przejdź rozmowę kwalifikacyjną.',
    icon: 'fa-solid fa-comments',
    link: undefined
  },
  {
    id: 3,
    title: 'Wspomagaj serwer',
    description: 'Angażuj się i pomagaj innym tworzyć lepszą społeczność.',
    icon: 'fa-solid fa-handshake',
    link: undefined
  }
]

const joinSteps = computed(() =>
  appType.value === 'administrator'
    ? adminSteps
    : appType.value === 'moderator'
      ? moderatorSteps
      : defaultSteps
)

const route = useRoute()
const appType = computed(() => (route.meta.type as string) || 'whitelist')

const status = ref('')
const headerText = ref('')
const discordLink = 'https://discord.gg/your-waiting-room'
const reapplyAfter = ref<number | null>(null)
const history = ref<any[]>([])
const rejectionReason = ref('')
const archived = ref(false)
const timeRemaining = ref('')
const cooldownHours = ref(0)
const recentRejections = ref(0)
const rejectionsBeforeExtra = ref(0)
const rejectedHistory = computed(() =>
  history.value.filter(h => h.status === statuses.REJECTED)
)
const cooldownText = computed(() =>
  appType.value === 'administrator' || appType.value === 'moderator'
    ? `${Math.round(cooldownHours.value / 24)} dni`
    : `${cooldownHours.value}h`
)
let interval: number | null = null

onMounted(async () => {
  const res = await fetch(`/api/status?type=${appType.value}`, {
    credentials: 'include'
  })
  const data = await res.json()
  status.value = data.status || ''
  rejectionReason.value = data.rejectionReason || ''
  history.value = Array.isArray(data.history) ? data.history : []
  archived.value = !!data.archived
  reapplyAfter.value = data.reapplyAfter || null
  cooldownHours.value = data.baseCooldownHours || 0
  recentRejections.value = data.recentRejections || 0
  rejectionsBeforeExtra.value = data.rejectionsBeforeExtra || 0
  if (status.value === statuses.APPROVED) {
    headerText.value = 'Posiadasz już zaakceptowane podanie'
  } else if (archived.value) {
    headerText.value = 'Twoje podanie zostało zarchiwizowane'
  } else {
    headerText.value =
      appType.value === 'administrator'
        ? 'Twoje podanie na Administratora zostało wysłane'
        : appType.value === 'moderator'
          ? 'Twoje podanie na Moderatora zostało wysłane'
          : 'Twoje podanie zostało Wysłane'
  }
  updateRemaining()
  if (reapplyAfter.value && Date.now() < reapplyAfter.value) {
    interval = setInterval(updateRemaining, 1000)
  }
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

function updateRemaining() {
  if (!reapplyAfter.value) {
    timeRemaining.value = ''
    return
  }
  const diff = reapplyAfter.value - Date.now()
  if (diff <= 0) {
    timeRemaining.value = ''
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  } else {
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    timeRemaining.value = `${h}h ${m}m ${s}s`
  }
}

function formatHistory(h: any) {
  const date = new Date(h.timestamp)
  return `${h.status} - ${date.toLocaleString()}`
}

function gotoApply() {
  if (!timeRemaining.value) {
    const paths: Record<string, string> = {
      whitelist: '/apply',
      checker: '/apply-checker',
      moderator: '/apply-moderator',
      administrator: '/apply-administrator',
      developer: '/apply-developer'
    }
    window.location.href = paths[appType.value] || '/apply'
  }
}

const statusClass = computed(() => {
  switch (status.value) {
    case statuses.SENT:
      return 'gray'
    case statuses.PENDING:
      return 'yellow'
    case statuses.IN_REVIEW:
      return 'blue'
    case statuses.APPROVED:
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
})
</script>

<style scoped>
.status-page {
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.status-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1;
}

.status-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 2rem;
}
.gray {
  color: gray;
}
.yellow {
  color: #ffcc00;
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
.approved-msg {
  margin-top: 1rem;
}

.rejected-box {
  margin-top: 1.5rem;
}
.reason-box {
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.reapply-btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  color: #fff;
  background: #dd0000;
  cursor: pointer;
}

.reapply-btn.ready {
  background: #00aa00;
}

.history {
  margin-top: 2rem;
}

.rejections-info {
  margin-top: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
}

.next-steps {
  margin-top: 2rem;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-top: 1rem;
}

.step-card {
  background: rgba(25, 25, 25, 0.7);
  border-radius: 16px;
  padding: 3rem 2rem;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  text-align: center;
  overflow: hidden;
}

.step-number {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 5rem;
  font-weight: 900;
  opacity: 0.1;
  color: #8A2BE2;
}

.step-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(0, 255, 255, 0.1));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  border: 2px solid rgba(138, 43, 226, 0.3);
}

.step-icon i {
  font-size: 2.5rem;
  background: linear-gradient(90deg, #8A2BE2, #00FFFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.step-title {
  font-size: 1.5rem;
  margin-bottom: 1.2rem;
}

.step-description {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.step-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #8A2BE2;
  font-weight: 600;
  text-decoration: none;
}
</style>