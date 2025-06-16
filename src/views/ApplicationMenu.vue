<template>
  <main class="apply-menu">
    <h1>Wybierz rodzaj podania</h1>
    <div class="tiles">
      <RouterLink to="/apply" class="tile main">
        <div class="emoji">📜</div>
        <span>Złóż podanie na WhiteListe</span>
      </RouterLink>
      <RouterLink to="/apply-checker" class="tile">
        <div class="emoji">🔍</div>
        <span>Podanie na WhiteListCheckera</span>
      </RouterLink>
      <RouterLink to="/apply-moderator" class="tile">
        <div class="emoji">🛡️</div>
        <span>Podanie na Moderatora</span>
      </RouterLink>
      <RouterLink to="/apply-administrator" class="tile">
        <div class="emoji">👮</div>
        <span>Podanie na Administratora</span>
      </RouterLink>
      <RouterLink to="/apply-developer" class="tile">
        <div class="emoji">💻</div>
        <span>Podanie na Developera</span>
      </RouterLink>
    </div>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.apply-menu {
  padding: 2rem;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: linear-gradient(135deg, #1b1032 0%, #0a0a1a 100%);
  color: #fff;
}
.tiles {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
  margin-top: 1.5rem;
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
</style>
