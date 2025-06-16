<template>
  <div class="discord-required">
    <h1>Musisz dołączyć do Discorda AetherRP, aby się zalogować.</h1>
    <a :href="inviteUrl" class="invite-link">Dołącz do Discorda</a>
  </div>
</template>

<script setup lang="ts">
const inviteUrl = import.meta.env.VITE_DISCORD_INVITE_URL || 'https://discord.gg/';
</script>

<style scoped>
.discord-required {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;
}
.discord-required h1 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.invite-link {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  background: var(--gradient-accent);
  color: #fff;
  font-weight: 600;
  text-decoration: none;
}
</style>
