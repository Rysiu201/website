<template>
  <main class="status-page">
    <h1>Twoje podanie zostało Wysłane</h1>
    <h1>Obecny status twojego zgłoszenia: <b><span :class="statusClass">{{ status }}</span></b></h1>
    <p v-if="status === statuses.APPROVED" class="approved-msg">
      Twoje podanie zostało rozpatrzone {{ status }}.
      <a :href="discordLink" target="_blank">Dołącz na Discorda</a>
      i zgłoś się w celu dalszej rekrutacji.
    </p>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const statuses = {
  SENT: 'Wysłane',
  PENDING: 'Przyjęte, oczekuje na rozpatrzenie',
  IN_REVIEW: 'W trakcie rozpatrywania',
  APPROVED: 'Pozytywnie',
  REJECTED: 'Negatywnie (Napisz nowe podanie w ciągu 24/48h)'
}

const status = ref('')
const discordLink = 'https://discord.gg/your-waiting-room'

onMounted(async () => {
  const res = await fetch('/api/status', { credentials: 'include' })
  const data = await res.json()
  status.value = data.status || ''
})

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
  padding: 2rem;
  text-align: center;
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
</style>
