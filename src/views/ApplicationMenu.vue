<template>
  <main class="apply-menu" :style="{ backgroundImage: `url(${backgroundImageUrl})` }">
    <div class="menu-overlay"></div>
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
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
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
  background: rgba(0, 0, 0, 0.7);
  z-index: 1;
}
.tiles {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
  margin-top: 1.5rem;
}

.tile-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 8px;
  background: rgba(138, 43, 226, 0.15);
  border: 1px solid rgba(138, 43, 226, 0.3);
  text-decoration: none;
  color: #fff;
  font-weight: 600;
  transition: background 0.2s ease;
}
.tile:hover {
  background: rgba(138, 43, 226, 0.3);
}
.tile .emoji {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
.tile.main {
  font-size: 1.2rem;
  background: rgba(138, 43, 226, 0.3);
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
