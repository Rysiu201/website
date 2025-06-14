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

      <div v-if="history.length" class="history">
        <h2>Historia podań</h2>
        <ul>
          <li v-for="(h, idx) in history" :key="idx">
            {{ formatHistory(h) }}
          </li>
        </ul>
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

const status = ref('')
const headerText = ref('Twoje podanie zostało Wysłane')
const discordLink = 'https://discord.gg/your-waiting-room'
const reapplyAfter = ref<number | null>(null)
const history = ref<any[]>([])
const timeRemaining = ref('')
const cooldownHours = ref(0)
let interval: number | null = null

onMounted(async () => {
  const res = await fetch('/api/status', { credentials: 'include' })
  const data = await res.json()
  status.value = data.status || ''
  history.value = Array.isArray(data.history) ? data.history : []
  reapplyAfter.value = data.reapplyAfter || null
  cooldownHours.value = data.baseCooldownHours || 0
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
</style>
