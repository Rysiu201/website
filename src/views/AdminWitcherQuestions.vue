<template>
  <main class="witcher-questions-page">
    <RouterLink to="/admin/witcher" class="back-link">
      <i class="fa-solid fa-arrow-left"></i> Powrót
    </RouterLink>
    <h1 class="section-title"><span class="accent">Pytania</span></h1>
    <div class="actions">
      <button v-if="!editing" class="edit-btn" @click="editing = true">Edytuj</button>
      <button v-else class="save-btn" @click="saveQuestions">Zapisz</button>
    </div>
    <div class="lists">
      <div class="list" v-for="type in Object.keys(questions)" :key="type">
        <h2>{{ labels[type] }}</h2>
        <div v-for="(_, i) in questions[type]" :key="i" class="item">
          <textarea v-model="questions[type][i]" :disabled="!editing"></textarea>
        </div>
      </div>
    </div>
    <p v-if="message" class="save-message">{{ message }}</p>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { onMounted, ref } from 'vue'

const editing = ref(false)
const message = ref('')

const questions = ref<Record<string, string[]>>({
  whitelist: [],
  moderator: [],
  administrator: []
})

const labels: Record<string, string> = {
  whitelist: 'Podania WL',
  moderator: 'Podania Moderator',
  administrator: 'Podania Administrator'
}

onMounted(async () => {
  const res = await fetch('/api/admin/witcher-questions', { credentials: 'include' })
  if (res.ok) {
    const data = await res.json()
    if (data.questions) questions.value = data.questions
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

.lists {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.list h2 {
  margin-bottom: 0.5rem;
}

.item textarea {
  width: 100%;
  min-height: 60px;
  padding: 0.4rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.save-message {
  text-align: center;
  color: #0f0;
  margin-top: 0.5rem;
}
</style>
