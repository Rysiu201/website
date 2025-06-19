<template>
  <main class="witcher-questions-page">
    <RouterLink to="/admin/witcher" class="back-link">
      <i class="fa-solid fa-arrow-left"></i> Powrót
    </RouterLink>
    <h1 class="section-title"><span class="accent">Pytania</span></h1>
    <div class="question-manager">
      <h2 class="manager-title">Zarządzaj pulą pytań</h2>
      <select v-model="activeType" class="type-select">
        <option v-for="(label, type) in labels" :key="type" :value="type">
          {{ label }}
        </option>
      </select>
      <div class="actions">
        <button v-if="!editing" class="edit-btn" @click="editing = true">Edytuj</button>
        <button v-else class="save-btn" @click="saveQuestions">Zapisz</button>
      </div>
      <div class="questions-frame" :class="{ editing }">
        <div v-for="(_, i) in displayedQuestions" :key="i" class="item">
          <textarea v-model="questions[activeType][i]" :disabled="!editing"></textarea>
        </div>
      </div>
    </div>
    <p v-if="message" class="save-message">{{ message }}</p>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { onMounted, ref, computed } from 'vue'

const editing = ref(false)
const message = ref('')
const activeType = ref('whitelist')
const visibleCount = 10

const questions = ref<Record<string, string[]>>({
  whitelist: [],
  checker: [],
  moderator: [],
  administrator: [],
  developer: []
})

const labels: Record<string, string> = {
  whitelist: 'WhiteLista',
  checker: 'WhiteListChecker',
  moderator: 'Moderator',
  administrator: 'Administrator',
  developer: 'Developer'
}

const displayedQuestions = computed(() => {
  const list = questions.value[activeType.value] || []
  return editing.value ? list : list.slice(0, visibleCount)
})

onMounted(async () => {
  const res = await fetch('/api/admin/witcher-questions', {
    credentials: 'include'
  })
  if (res.ok) {
    const data = await res.json()
    if (data.questions) {
      questions.value = { ...questions.value, ...data.questions }
    }
  }
})

async function saveQuestions() {
  const res = await fetch('/api/admin/witcher-questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(questions.value)
  })
  if (res.ok) {
    message.value = 'Zapisano zmiany'
    editing.value = false
    setTimeout(() => (message.value = ''), 3000)
  }
}
</script>

<style scoped>
.witcher-questions-page {
  padding: 4rem 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #1b1032 0%, #0a0a1a 100%);
  color: #fff;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.section-title .accent {
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-bottom: 1rem;
  padding: 0.3rem 0.6rem;
  color: #fff;
  background: var(--gradient-accent);
  border-radius: 4px;
  text-decoration: none;
}

.question-manager {
  width: 100%;
  max-width: 900px;
  margin: 0 auto 2rem;
  padding: 1.5rem;
  border-radius: 16px;
  background: rgba(30, 30, 30, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  text-align: center;
}

.manager-title {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.actions {
  text-align: center;
  margin-bottom: 1rem;
}

.edit-btn,
.save-btn {
  padding: 0.5rem 1rem;
  background: var(--gradient-accent);
  border: none;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
}

.type-select {
  width: 100%;
  max-width: 300px;
  margin: 0 auto 1rem;
  padding: 0.5rem;
  background: #222;
  color: #fff;
  border: 1px solid #444;
  border-radius: 4px;
}

.questions-frame {
  max-width: 800px;
  margin: 0 auto;
  max-height: 400px;
  overflow: hidden;
  transition: var(--transition);
}

.questions-frame.editing {
  overflow-y: auto;
}

.item textarea {
  width: 100%;
  min-height: 60px;
  padding: 0.4rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: inherit;
}

.save-message {
  text-align: center;
  color: #0f0;
  margin-top: 0.5rem;
}
</style>
