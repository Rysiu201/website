<template>
  <main class="admin-page">
    <h1 class="section-title"><span class="accent">Panel Administracyjny</span></h1>
    <div class="admin-layout">
      <div class="sections">
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
        <RouterLink class="admin-section" to="/admin/player-notes">
          <i class="fa-solid fa-note-sticky"></i>
          <span>Notatki o graczach</span>
        </RouterLink>
        <RouterLink class="admin-section" to="/admin/settings">
          <i class="fa-solid fa-gear"></i>
          <span>Ustawienia</span>
        </RouterLink>
        <RouterLink class="admin-section" to="/admin/questions">
          <i class="fa-solid fa-question"></i>
          <span>Pytania</span>
        </RouterLink>
        <RouterLink class="admin-section" to="/admin/changelog">
          <i class="fa-solid fa-clock-rotate-left"></i>
          <span>Changelog</span>
        </RouterLink>
      </div>
      <div class="admin-extra">
        <RouterLink class="admin-section" to="/admin/archived">
          <i class="fa-solid fa-box-archive"></i>
          <span>Zaarchiwizowane podania</span>
        </RouterLink>
      </div>
      <div class="admin-extra">
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
    hasRole(ROLE_IDS.WHITELIST_CHECKER) ||
    hasRole(ROLE_IDS.WITCHER)
)

const canViewWhitelistChecker = computed(
  () =>
    hasRole(ROLE_IDS.MANAGEMENT) ||
    hasRole(ROLE_IDS.COMMUNITY_MANAGER) ||
    hasRole(ROLE_IDS.MODERATOR) ||
    hasRole(ROLE_IDS.WITCHER)
)

const canViewModerator = computed(
  () =>
    hasRole(ROLE_IDS.MANAGEMENT) ||
    hasRole(ROLE_IDS.COMMUNITY_MANAGER) ||
    hasRole(ROLE_IDS.WITCHER)
)

const canViewAdministrator = computed(
  () =>
    hasRole(ROLE_IDS.MANAGEMENT) ||
    hasRole(ROLE_IDS.COMMUNITY_MANAGER) ||
    hasRole(ROLE_IDS.WITCHER)
)

const canViewDeveloper = computed(
  () =>
    hasRole(ROLE_IDS.OWNER) ||
    hasRole(ROLE_IDS.DEVELOPER) ||
    hasRole(ROLE_IDS.COMMUNITY_MANAGER) ||
    hasRole(ROLE_IDS.WITCHER)
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
  background: var(--gradient-accent);
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

@media (min-width: 768px) {
  .admin-layout {
    grid-template-columns: 1fr 1fr;
  }
}

.sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.admin-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.admin-section:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
}

.admin-section i {
  color: var(--primary);
}

.admin-section span {
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.admin-extra {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
