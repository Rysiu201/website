<template>
  <main class="apply-menu" :style="{ backgroundImage: `url(${backgroundImageUrl})` }">
    <div class="menu-overlay"></div>
<<<<<<< 95vg3o-codex/dostosuj-wygląd-podania-na-whitelist
    <div class="menu-container">
      <h1 class="page-title">Wybierz rodzaj podania</h1>
      <p class="page-desc">Dołącz do naszej społeczności – wybierz jedną z dostępnych ścieżek i złóż podanie.</p>

      <RouterLink to="/apply" class="card main-card">
        <span class="card-title">🧾 <span class="white">Podanie n</span> <span class="gradient">a Whitelistę</span></span>
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

      <section class="process">
        <h2>Jak wygląda proces</h2>
        <ol>
          <li>Wybierz rodzaj podania</li>
          <li>Uzupełnij formularz</li>
          <li>Poczekaj na decyzję</li>
          <li>Wynik otrzymasz na stronie z podaniem!</li>
        </ol>
      </section>
=======
    <h1>Wybierz rodzaj podania</h1>
    <div class="tiles">
      <RouterLink to="/apply" class="tile main">
        <div class="emoji">📜</div>
        <span class="wh-title"><span class="white">Podanie n</span><span class="gradient">a Whiteliste</span></span>
      </RouterLink>
      <div class="tile-grid">
        <RouterLink to="/apply-checker" class="tile small">
          <div class="emoji">🔍</div>
          <span>Podanie na WhiteListCheckera</span>
        </RouterLink>
        <RouterLink to="/apply-moderator" class="tile small">
          <div class="emoji">🛡️</div>
          <span>Podanie na Moderatora</span>
        </RouterLink>
        <RouterLink to="/apply-administrator" class="tile small">
          <div class="emoji">👮</div>
          <span>Podanie na Administratora</span>
        </RouterLink>
        <RouterLink to="/apply-developer" class="tile small">
          <div class="emoji">💻</div>
          <span>Podanie na Developera</span>
        </RouterLink>
      </div>
>>>>>>> main
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import backgroundImage from '../assets/background.jpg'

const backgroundImageUrl = ref(backgroundImage)
</script>

<style scoped>
.apply-menu {
  position: relative;
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  align-items: center;
<<<<<<< 95vg3o-codex/dostosuj-wygląd-podania-na-whitelist
  justify-content: center;
=======
  justify-content: flex-start;
>>>>>>> main
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
<<<<<<< 95vg3o-codex/dostosuj-wygląd-podania-na-whitelist
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
}

.menu-container {
  position: relative;
  z-index: 2;
=======
  background: rgba(0, 0, 0, 0.7);
  z-index: 1;
}
.tiles {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
>>>>>>> main
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

<<<<<<< 95vg3o-codex/dostosuj-wygląd-podania-na-whitelist
.card-grid {
=======
.tile-grid {
>>>>>>> main
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
<<<<<<< 95vg3o-codex/dostosuj-wygląd-podania-na-whitelist

.card {
=======
.tile {
>>>>>>> main
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
}

.card-desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
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

.process {
  margin-top: 2rem;
  text-align: left;
}

.process h2 {
  margin-bottom: 0.5rem;
}

.process ol {
  list-style: decimal inside;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: rgba(255, 255, 255, 0.8);
}

@media (max-width: 640px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
  .main-card {
    grid-column: span 1;
  }
}

.tile.small {
  font-size: 0.9rem;
}

.wh-title {
  display: inline-block;
}

.wh-title .white {
  color: #fff;
}

.wh-title .gradient {
  background: linear-gradient(90deg, #8A2BE2, #00FFFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
