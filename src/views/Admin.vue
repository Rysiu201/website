<template>
  <main class="admin-page">
    <h1>Panel Administracyjny</h1>
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
        <div class="admin-section" v-if="canViewWhitelistChecker">
          <i class="fa-solid fa-user-check"></i>
          <span>Sprawdź podania na WhiteListCheckera</span>
        </div>
        <div class="admin-section" v-if="canViewModerator">
          <i class="fa-solid fa-shield"></i>
          <span>Sprawdź podania na Moderatora</span>
        </div>
        <div class="admin-section" v-if="canViewAdministrator">
          <i class="fa-solid fa-user-shield"></i>
          <span>Sprawdź podania na Administratora</span>
        </div>
        <div class="admin-section" v-if="canViewDeveloper">
          <i class="fa-solid fa-code"></i>
          <span>Sprawdź podania na Developera</span>
        </div>
        <RouterLink class="admin-section" to="/admin/player-notes">
          <i class="fa-solid fa-note-sticky"></i>
          <span>Notatki o graczach</span>
        </RouterLink>
      </div>
      <div class="admin-extra">
        <RouterLink class="admin-section" to="/admin/archived">
          <i class="fa-solid fa-box-archive"></i>
          <span>Zaarchiwizowane podania</span>
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
  OWNER: import.meta.env.VITE_OWNER_ROLE_ID
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
</script>

<style scoped>
.admin-page {
  padding: 4rem 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #1b1032 0%, #0a0a1a 100%);
  color: #fff;
}

.admin-page h1 {
  margin: 0;
  font-size: 2rem;
  color: var(--light);
}

.admin-layout {
  display: flex;
  gap: 2rem;
  max-width: 1200px;
  margin-top: 2rem;
}

.sections {
  width: 40%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.admin-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  background: rgba(138, 43, 226, 0.15);
  border: 1px solid rgba(138, 43, 226, 0.3);
  box-shadow: 0 4px 20px rgba(138, 43, 226, 0.2);
  cursor: pointer;
  transition: background 0.3s ease;
}

.admin-section:hover {
  background: rgba(138, 43, 226, 0.25);
}

.admin-section i {
  color: var(--primary);
}

.admin-section span {
  color: var(--light);
}

.admin-extra {
  flex: 1;
}
</style>