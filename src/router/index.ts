import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Features from '../views/Features.vue'
import Staff from '../views/Staff.vue'
import Rules from '../views/Rules.vue'
import JoinUs from '../views/Join.vue'
import Apply from '../views/Apply.vue'
import Admin from '../views/Admin.vue'

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
      path: '/apply',
      name: 'apply',
      component: Apply,
      meta: {
        title: 'Złóż podanie - AetherRP',
        description: 'Wypełnij formularz, aby dołączyć do zespołu AetherRP.',
        keywords: 'podanie, rekrutacja, aetherrp'
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
    }
  ]
})

// Global navigation guard to set page title and metadata
router.beforeEach((to, _from, next) => {
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
  
  next();
});

export default router
