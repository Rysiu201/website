import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Features from '../views/Features.vue'
import Staff from '../views/Staff.vue'
import Rules from '../views/Rules.vue'
import JoinUs from '../views/Join.vue'
import Apply from '../views/Apply.vue'
import ApplyChecker from '../views/ApplyChecker.vue'
import ApplyModerator from '../views/ApplyModerator.vue'
import ApplyAdministrator from '../views/ApplyAdministrator.vue'
import ApplyDeveloper from '../views/ApplyDeveloper.vue'
import Admin from '../views/Admin.vue'
import ApplicationStatus from '../views/ApplicationStatus.vue'
import AdminApplications from '../views/AdminApplications.vue'
import AdminApplicationDetail from '../views/AdminApplicationDetail.vue'
import AdminPlayerNotes from '../views/AdminPlayerNotes.vue'
import DiscordRequired from '../views/DiscordRequired.vue'

const STATUS = {
  REJECTED: 'Negatywnie'
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'AetherRP - Polski Serwer FiveM Roleplay',
        description: 'Dołącz do AetherRP, polskiego serwera FiveM z klimatycznym roleplay, autorskimi skryptami i aktywną społecznością.',
        keywords: 'FiveM, Serwer Roleplay, GTA5 RP, AetherRP'
      }
    },
    {
      path: '/features',
      name: 'features',
      component: Features,
      meta: {
        title: 'Funkcje - AetherRP',
        description: 'Poznaj funkcje oferowane przez serwer AetherRP: autorskie skrypty, pojazdy i możliwości rozgrywki.',
        keywords: 'funkcje FiveM, funkcje serwera, skrypty'
      }
    },
    {
      path: '/staff',
      name: 'staff',
      component: Staff,
      meta: {
        title: 'Nasz Zespół - AetherRP',
        description: 'Poznaj ludzi odpowiedzialnych za AetherRP i ich pasję do tworzenia najlepszej rozgrywki.',
        keywords: 'ekipa serwera, administracja, zespół'
      }
    },
    {
      path: '/rules',
      name: 'rules',
      component: Rules,
      meta: {
        title: 'Zasady Serwera - AetherRP',
        description: 'Przeczytaj regulamin AetherRP, aby wspólnie tworzyć przyjazną i uczciwą rozgrywkę.',
        keywords: 'regulamin serwera, zasady społeczności, roleplay'
      }
    },
    {
      path: '/join',
      name: 'join',
      component: JoinUs,
      meta: {
        title: 'Dołącz - AetherRP',
        description: 'Dowiedz się, jak dołączyć do AetherRP i zacząć grę na naszym serwerze FiveM.',
        keywords: 'jak dołączyć, połączenie z FiveM, aplikacja'
      }
    },
    {
      path: '/discord-required',
      name: 'discord-required',
      component: DiscordRequired,
      meta: {
        title: 'Dołącz do Discorda - AetherRP'
      }
    },
    {
      path: '/applications',
      name: 'application-menu',
      component: () => import('../views/ApplicationMenu.vue'),
      meta: {
        title: 'Złóż podanie - AetherRP',
        requiresAuth: true
      }
    },
    {
      path: '/apply',
      name: 'apply',
      component: Apply,
      meta: {
        title: 'Złóż podanie - AetherRP',
        description: 'Wypełnij formularz, aby dołączyć do zespołu AetherRP.',
        keywords: 'podanie, rekrutacja, aetherrp',
        requiresAuth: true,
      }
    },
    {
      path: '/apply-checker',
      name: 'apply-checker',
      component: ApplyChecker,
      meta: {
        title: 'Podanie na WhiteListCheckera - AetherRP',
        requiresAuth: true,
      }
    },
    {
      path: '/apply-moderator',
      name: 'apply-moderator',
      component: ApplyModerator,
      meta: {
        title: 'Podanie na Moderatora - AetherRP',
        requiresAuth: true,
      }
    },
    {
      path: '/apply-administrator',
      name: 'apply-administrator',
      component: ApplyAdministrator,
      meta: {
        title: 'Podanie na Administratora - AetherRP',
        requiresAuth: true,
      }
    },
    {
      path: '/apply-developer',
      name: 'apply-developer',
      component: ApplyDeveloper,
      meta: {
        title: 'Podanie na Developera - AetherRP',
        requiresAuth: true,
      }
    },
    {
      path: '/status',
      name: 'status',
      component: ApplicationStatus,
      meta: {
        title: 'Status Podania - AetherRP',
        requiresAuth: true
      }
    },
    {
      path: '/status-checker',
      name: 'status-checker',
      component: ApplicationStatus,
      meta: {
        title: 'Status Podania Checkera - AetherRP',
        requiresAuth: true,
        type: 'checker'
      }
    },
    {
      path: '/status-moderator',
      name: 'status-moderator',
      component: ApplicationStatus,
      meta: {
        title: 'Status Podania Moderatora - AetherRP',
        requiresAuth: true,
        type: 'moderator'
      }
    },
    {
      path: '/status-administrator',
      name: 'status-administrator',
      component: ApplicationStatus,
      meta: {
        title: 'Status Podania Administratora - AetherRP',
        requiresAuth: true,
        type: 'administrator'
      }
    },
    {
      path: '/status-developer',
      name: 'status-developer',
      component: ApplicationStatus,
      meta: {
        title: 'Status Podania Developera - AetherRP',
        requiresAuth: true,
        type: 'developer'
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      meta: {
        title: 'Panel Administracyjny - AetherRP',
        description: 'Panel do zarządzania serwerem.',
        keywords: 'admin, panel'
      }
    },
    {
      path: '/admin/applications',
      name: 'applications',
      component: AdminApplications,
      meta: {
        title: 'Lista Podań - AetherRP',
        requiresAuth: true
      }
    },
    {
      path: '/admin/archived',
      name: 'archived-applications',
      component: AdminApplications,
      meta: {
        title: 'Zaarchiwizowane Podania - AetherRP',
        requiresAuth: true
      }
    },
    {
      path: '/admin/applications/:id',
      name: 'application-detail',
      component: AdminApplicationDetail,
      meta: {
        title: 'Podgląd Podania - AetherRP',
        requiresAuth: true
      }
    },
    {
      path: '/admin/player-notes',
      name: 'player-notes',
      component: AdminPlayerNotes,
      meta: {
        title: 'Notatki o Graczach - AetherRP',
        requiresAuth: true
      }
    }
  ]
})

// Global navigation guard to set page title and metadata
router.beforeEach(async (to, _from, next) => {
  // Update page title
  document.title = to.meta.title as string || 'AetherRP';
  
  // Update meta tags
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', to.meta.description as string || '');
  }
  
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.setAttribute('content', to.meta.keywords as string || '');
  }

  let userData: any = null;
  if (to.meta.requiresAuth) {
    const res = await fetch('/api/user', { credentials: 'include' });
    userData = await res.json();
  }

  if (to.meta.requiresAuth && (!userData || !userData.user)) {
    return next('/');
  }

  const applyRoutes: Record<string, { type: string; statusPath: string }> = {
    '/apply': { type: 'whitelist', statusPath: '/status' },
    '/apply-checker': { type: 'checker', statusPath: '/status-checker' },
    '/apply-moderator': { type: 'moderator', statusPath: '/status-moderator' },
    '/apply-administrator': {
      type: 'administrator',
      statusPath: '/status-administrator'
    },
    '/apply-developer': { type: 'developer', statusPath: '/status-developer' }
  };
  if (applyRoutes[to.path]) {
    const { type, statusPath } = applyRoutes[to.path];
    const statusRes = await fetch(`/api/status?type=${type}`, {
      credentials: 'include'
    });
    const statusData = await statusRes.json();
    if (
      statusData.status &&
      (statusData.status !== STATUS.REJECTED ||
        (statusData.reapplyAfter && Date.now() < statusData.reapplyAfter))
    ) {
      return next(statusPath);
    }
  }

  next();
});

export default router
