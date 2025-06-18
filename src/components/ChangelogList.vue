<template>
  <div class="rules-updates" v-if="updates.length" data-aos="fade-up" data-aos-delay="200">
    <h3 data-aos="fade-right"><i class="fa-solid fa-clock-rotate-left"></i> Recent Updates</h3>
    <div class="update-list">
      <div
        v-for="(u, idx) in updates"
        :key="idx"
        class="update-item"
        :data-aos="'fade-left'"
        :data-aos-delay="250 + idx * 50"
      >
        <div class="update-date">{{ formatDate(u.date) }}</div>
        <div class="update-content">
          <h4>{{ u.title }}</h4>
          <p>{{ u.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Entry { date: string; title: string; description: string }
const updates = ref<Entry[]>([])

onMounted(async () => {
  const res = await fetch('/api/changelog')
  if (res.ok) {
    const data = await res.json()
    updates.value = data.changelog || []
  }
})

function formatDate(d: string) {
  const dt = new Date(d)
  return dt.toLocaleDateString()
}
</script>

<style scoped>
.rules-updates {
  background: rgba(25, 25, 25, 0.6);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  margin: 60px 0;
  padding: 30px;
}

.rules-updates h3 {
  margin: 0 0 25px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.rules-updates h3 i {
  color: #8A2BE2;
}

.update-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.update-item {
  display: flex;
  gap: 20px;
  position: relative;
  padding-left: 20px;
}

.update-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 3px;
  background: linear-gradient(to bottom, #8A2BE2, transparent);
}

.update-date {
  font-weight: 600;
  flex-basis: 120px;
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.7);
}

.update-content h4 {
  margin: 0 0 8px;
  font-size: 1.1rem;
}

.update-content p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
}
</style>
