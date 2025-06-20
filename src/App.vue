<script setup lang="ts">
import Header from './components/Header.vue'
import PageTransition from './components/PageTransition.vue'
import { onMounted, ref } from 'vue';
import gsap from 'gsap';

const isLoaded = ref(false);

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AetherRP",
  "url": "https://aetherrp.com",
  "logo": "https://aetherrp.com/logo.png",
  "description": "Polski serwer FiveM oferujący klimatyczny roleplay, autorskie skrypty i aktywną społeczność.",
  "sameAs": [
    "https://discord.gg/aetherrp",
    "https://twitter.com/aetherrp",
    "https://www.youtube.com/@AetherRP"
  ]
};

onMounted(() => {
  // Add structured data to the page
  const script = document.createElement('script');
  script.setAttribute('type', 'application/ld+json');
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
  
  // Reduce delay time
  setTimeout(() => {
    isLoaded.value = true;
    
    // Create entrance animation with GSAP
    const tl = gsap.timeline();
    tl.to('.header', { 
      y: 0, 
      opacity: 1, 
      duration: 0.6, 
      ease: 'power3.out' 
    });
  }, 100);
});
</script>

<template>
  <div id="app-container" :class="{ loaded: isLoaded }">
    <Header class="header" />
    <main class="main-content">
      <PageTransition>
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </PageTransition>
    </main>
  </div>
</template>

<style scoped>
#app-container {
  opacity: 0;
  transition: opacity 0.5s ease;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#app-container.loaded {
  opacity: 1;
}

.header {
  position: relative;
  z-index: 10;
}

.main-content {
  flex: 1;
  position: relative;
}
</style>