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
        Twoje podanie zostało rozpatrzone {{ status }}.
        <a :href="discordLink" target="_blank">Dołącz na Discorda</a>
        i zgłoś się w celu dalszej rekrutacji.
      </p>
      <div v-if="status === statuses.APPROVED" class="next-steps">
        <h2>Dalsze kroki</h2>
        <div class="steps-grid">
          <div v-for="step in joinSteps" :key="step.id" class="step-card">
            <div class="step-number">{{ step.id }}</div>
            <div class="step-icon">
              <i :class="step.icon"></i>
            </div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-description">{{ step.description }}</p>
            <a :href="step.link" class="step-button"
              >Czytaj więcej <i class="fa-solid fa-arrow-right"></i
            ></a>
          </div>
        </div>
      </div>

      <div v-if="status === statuses.REJECTED" class="rejected-box">
        <p v-if="timeRemaining">
          W ciągu {{ cooldownHours }}h możesz ponownie złożyć podanie.
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
import backgroundImage from '../assets/background.jpg'

const backgroundImageUrl = backgroundImage

const statuses = {
  SENT: 'Wysłane',
  PENDING: 'Przyjęte, oczekuje na rozpatrzenie',
  IN_REVIEW: 'W trakcie rozpatrywania',
  APPROVED: 'Pozytywnie',
  REJECTED: 'Negatywnie (Napisz nowe podanie w ciągu 24/48h)'
}

const joinSteps = ref([
  {
    id: 1,
    title: 'Dołącz na Discord',
    description:
      'Połącz się z naszą społecznością i otrzymuj najnowsze informacje na Discordzie.',
    icon: 'fa-brands fa-discord',
    link: '#'
  },
  {
    id: 2,
    title: 'Stwórz Swoją Postać',
    description:
      'Skorzystaj z poradnika tworzenia postaci i przygotuj swoją tożsamość na serwerze.',
    icon: 'fa-solid fa-user-plus',
    link: '#'
  },
  {
    id: 3,
    title: 'Przeczytaj Zasady',
    description:
      'Zapoznaj się z regulaminem serwera, by zapewnić sobie i innym dobrą rozgrywkę.',
    icon: 'fa-solid fa-book',
    link: '#'
  },
  {
    id: 4,
    title: 'Połącz się z Serwerem',
    description: 'Użyj klienta FiveM i danych z Discorda, aby wejść na nasz serwer.',
    icon: 'fa-solid fa-server',
    link: '#'
  }
])

const status = ref('')
const headerText = ref('Twoje podanie zostało Wysłane')
const discordLink = 'https://discord.gg/your-waiting-room'
const reapplyAfter = ref<number | null>(null)
const history = ref<any[]>([])
const timeRemaining = ref('')
const cooldownHours = ref(0)
const recentRejections = ref(0)
const rejectionsBeforeExtra = ref(0)
const rejectedHistory = computed(() =>
  history.value.filter(h => h.status === statuses.REJECTED)
)
let interval: number | null = null

onMounted(async () => {
  const res = await fetch('/api/status', { credentials: 'include' })
  const data = await res.json()
  status.value = data.status || ''
  history.value = Array.isArray(data.history) ? data.history : []
  reapplyAfter.value = data.reapplyAfter || null
  cooldownHours.value = data.baseCooldownHours || 0
  recentRejections.value = data.recentRejections || 0
  rejectionsBeforeExtra.value = data.rejectionsBeforeExtra || 0
  if (status.value === statuses.APPROVED) {
    headerText.value = 'Posiadasz już zaakceptowane podanie'
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
    window.location.href = '/apply'
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
      return 'red'
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
