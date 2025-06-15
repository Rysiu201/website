<template>
  <main class="admin-page">
    <h1>Panel Administracyjny</h1>
    <div class="sections">
      <div class="admin-section" v-if="canViewWhitelist">
        <h2>Sprawdź podania na WhiteListe</h2>
      </div>
      <div class="admin-section" v-if="canViewWhitelistChecker">
        <h2>Sprawdź podania na WhiteListCheckera</h2>
      </div>
      <div class="admin-section" v-if="canViewModerator">
        <h2>Sprawdź podania na Moderatora</h2>
      </div>
      <div class="admin-section" v-if="canViewAdministrator">
        <h2>Sprawdź podania na Administratora</h2>
      </div>
      <div class="admin-section" v-if="canViewDeveloper">
        <h2>Sprawdź podania na Developera</h2>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

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
  text-align: center;
  min-height: 100vh;
  background: #0a0a0a;
  color: #fff;
}

.sections {
  max-width: 700px;
  margin: 2rem auto 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.admin-section {
  padding: 1.5rem;
  border-radius: 8px;
  background: rgba(138, 43, 226, 0.1);
  border: 1px solid rgba(138, 43, 226, 0.3);
  box-shadow: 0 4px 20px rgba(138, 43, 226, 0.2);
  text-align: left;
}

.admin-section h2 {
  color: var(--primary);
  margin: 0;
}
</style>
