<template>
  <main class="apply-menu" :style="{ backgroundImage: `url(${backgroundImageUrl})` }">
    <div class="menu-overlay"></div>
    <div class="menu-container">
      <h1 class="page-title gradient">Wybierz rodzaj podania</h1>
      <p class="page-desc">Dołącz do naszej społeczności – wybierz jedną z dostępnych ścieżek i złóż podanie.</p>

      <RouterLink to="/apply" class="card main-card">
        <span class="card-title">🧾 Podanie na Whitelistę</span>
        <p class="card-desc">Pierwszy krok, aby dołączyć do gry.</p>
      </RouterLink>

      <div class="card-grid">
        <RouterLink to="/apply-checker" class="card">
          <span class="card-title">🔍 Podanie na WhiteListCheckera</span>
          <p class="card-desc">Pomóż nam weryfikować nowych graczy.</p>
        </RouterLink>
        <RouterLink to="/apply-moderator" class="card">
          <span class="card-title">🛡️ Podanie na Moderatora</span>
          <p class="card-desc">Zostań częścią zespołu moderatorów.</p>
        </RouterLink>
        <RouterLink to="/apply-administrator" class="card">
          <span class="card-title">👮 Podanie na Administratora</span>
          <p class="card-desc">Wspieraj administrację serwera.</p>
        </RouterLink>
        <RouterLink to="/apply-developer" class="card">
          <span class="card-title">💻 Podanie na Developera</span>
          <p class="card-desc">Twórz i rozwijaj nasze skrypty.</p>
        </RouterLink>
      </div>

      <section class="process-steps">
        <h2 class="process-title">Jak wygląda proces</h2>
        <div class="steps-grid">
          <div class="step-tile" v-for="step in steps" :key="step.id">
            <div class="step-number">{{ step.id }}</div>
            <div class="step-icon"><i :class="step.icon"></i></div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-desc">{{ step.description }}</p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import backgroundImage from '../assets/background.jpg'

const backgroundImageUrl = ref(backgroundImage)

const steps = ref([
  {
    id: 1,
    title: 'Dołącz na Discord',
    description: 'Bądź na bieżąco i uzyskaj pomoc w razie pytań.',
    icon: 'fa-brands fa-discord'
  },
  {
    id: 2,
    title: 'Wybierz rodzaj podania',
    description: 'Zdecyduj, o jaką rolę chcesz aplikować.',
    icon: 'fa-solid fa-user-plus'
  },
  {
    id: 3,
    title: 'Uzupełnij formularz',
    description: 'Podaj wymagane informacje i prześlij zgłoszenie.',
    icon: 'fa-solid fa-book'
  },
  {
    id: 4,
    title: 'Oczekuj na decyzję',
    description: 'Wynik znajdziesz na stronie statusu.',
    icon: 'fa-solid fa-server'
  }
])
</script>

<style scoped>
.apply-menu {
  position: relative;
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: #fff;
}

.menu-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
}

.menu-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 900px;
  text-align: center;
  padding: 2rem;
  border-radius: 16px;
  background: rgba(25, 25, 25, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.page-title {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.page-desc {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  padding: 1.5rem;
  border-radius: 12px;
  background: rgba(30, 30, 30, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
  background: rgba(45, 45, 55, 0.6);
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--secondary);
}

.card-desc {
  font-size: 0.9rem;
  color: #ffffff;
  opacity: 0.8;
}

.main-card {
  margin-bottom: 1.5rem;
  grid-column: span 2;
  background: rgba(45, 45, 55, 0.6);
}

.gradient {
  background: linear-gradient(90deg, #8A2BE2, #00FFFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.white {
  color: #fff;
}

.process-steps {
  margin-top: 2rem;
}

.process-title {
  margin-bottom: 1rem;
  text-align: center;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.step-tile {
  position: relative;
  padding: 2rem 1rem;
  background: rgba(30, 30, 30, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  text-align: center;
}

.step-number {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 3rem;
  font-weight: 700;
  opacity: 0.07;
  color: var(--secondary);
}

.step-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--secondary);
}

.step-title {
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.step-desc {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}


@media (max-width: 640px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
  .main-card {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .steps-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

</style>
