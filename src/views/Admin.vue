<template>
  <main class="admin-page">
    <h1 class="section-title"><span class="accent">Panel Administracyjny</span></h1>
    <div class="admin-layout">
      <div class="admin-column">
        <h2 class="column-title"><span class="accent">Rekrutacja</span></h2>
        <RouterLink
          class="admin-section"
          v-if="canViewWhitelist"
          to="/admin/applications"
        >
          <i class="fa-solid fa-clipboard-check"></i>
          <span>Sprawdź podania na WhiteListe</span>
        </RouterLink>
        <RouterLink
          class="admin-section"
          v-if="canViewWhitelistChecker"
          to="/admin/checker-applications"
        >
          <i class="fa-solid fa-user-check"></i>
          <span>Sprawdź podania na WhiteListCheckera</span>
        </RouterLink>
        <RouterLink
          class="admin-section"
          v-if="canViewModerator"
          to="/admin/moderator-applications"
        >
          <i class="fa-solid fa-shield"></i>
          <span>Sprawdź podania na Moderatora</span>
        </RouterLink>
        <RouterLink
          class="admin-section"
          v-if="canViewAdministrator"
          to="/admin/administrator-applications"
        >
          <i class="fa-solid fa-user-shield"></i>
          <span>Sprawdź podania na Administratora</span>
        </RouterLink>
        <RouterLink
          class="admin-section"
          v-if="canViewDeveloper"
          to="/admin/developer-applications"
        >
          <i class="fa-solid fa-code"></i>
          <span>Sprawdź podania na Developera</span>
        </RouterLink>
      </div>
      <div class="admin-column">
        <h2 class="column-title"><span class="accent">Specjalne</span></h2>        
        <RouterLink
          class="admin-section"
          v-if="canViewWitcher"
          to="/admin/witcher"
        >
          <i class="fa-solid fa-hat-wizard"></i>
          <span>The Witcher</span>
        </RouterLink>
        <RouterLink class="admin-section" to="/admin/archived">
          <i class="fa-solid fa-box-archive"></i>
          <span>Zaarchiwizowane podania</span>
        </RouterLink>
      </div>
      <div class="admin-column">
        <h2 class="column-title"><span class="accent">Zarządzanie</span></h2>
        <RouterLink class="admin-section" to="/admin/player-notes">
          <i class="fa-solid fa-note-sticky"></i>
          <span>Notatki o graczach</span>
        </RouterLink>
        <RouterLink class="admin-section" to="/admin/unban">
          <i class="fa-solid fa-ban"></i>
          <span>Wnioski o odbanowanie</span>
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

const roles = ref<string[]>([])

onMounted(async () => {
  const res = await fetch('/api/user', { credentials: 'include' })
  const data = await res.json()
  roles.value = data.roles || []
})

const ROLE_IDS = {
  MANAGEMENT: import.meta.env.VITE_MANAGEMENT_ROLE_ID,
  COMMUNITY_MANAGER: import.meta.env.VITE_COMMUNITY_MANAGER_ROLE_ID,
  WHITELIST_CHECKER: import.meta.env.VITE_WHITELIST_CHECKER_ROLE_ID,
  MODERATOR: import.meta.env.VITE_MODERATOR_ROLE_ID,
  ADMIN: import.meta.env.VITE_ADMIN_ROLE_ID,
  DEVELOPER: import.meta.env.VITE_DEVELOPER_ROLE_ID,
  OWNER: import.meta.env.VITE_OWNER_ROLE_ID,
  WITCHER: import.meta.env.VITE_WITCHER_ROLE_ID
}

function hasRole(roleId?: string) {
  return roleId ? roles.value.includes(roleId) : false
}

const canViewWhitelist = computed(
  () =>
    hasRole(ROLE_IDS.MANAGEMENT) ||
    hasRole(ROLE_IDS.COMMUNITY_MANAGER) ||
    hasRole(ROLE_IDS.WHITELIST_CHECKER)
)

const canViewWhitelistChecker = computed(
  () =>
    hasRole(ROLE_IDS.MANAGEMENT) ||
    hasRole(ROLE_IDS.COMMUNITY_MANAGER) ||
    hasRole(ROLE_IDS.MODERATOR)
)

const canViewModerator = computed(
  () =>
    hasRole(ROLE_IDS.MANAGEMENT) ||
    hasRole(ROLE_IDS.COMMUNITY_MANAGER)
)

const canViewAdministrator = computed(
  () =>
    hasRole(ROLE_IDS.MANAGEMENT) ||
    hasRole(ROLE_IDS.COMMUNITY_MANAGER)
)

const canViewDeveloper = computed(
  () =>
    hasRole(ROLE_IDS.OWNER) ||
    hasRole(ROLE_IDS.DEVELOPER) ||
    hasRole(ROLE_IDS.COMMUNITY_MANAGER)
)

const canViewWitcher = computed(
  () => hasRole(ROLE_IDS.OWNER) || hasRole(ROLE_IDS.WITCHER)
)
</script>

<style scoped>
.admin-page {
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
  background: linear-gradient(to right, #9B59B6, #00BCD4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.admin-layout {
  display: grid;
  gap: 2rem;
  max-width: 1200px;
  margin: 2rem auto 0 auto;
  grid-template-columns: 1fr;
}

@media (min-width: 1024px) {
  .admin-layout {
    grid-template-columns: repeat(3, 1fr);
  }
}

.admin-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.column-title {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.column-title {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.column-title .accent {
  background: linear-gradient(to right, #9B59B6, #00BCD4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.admin-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, #9B59B6, #00bfd8);
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transition: transform 0.2s, filter 0.2s, box-shadow 0.2s;
}

.admin-section:hover {
  transform: scale(1.05);
  filter: brightness(110%);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
}

.admin-section i {
  color: inherit;
}

.admin-section span {
  color: #fff;
}
</style>
