<script setup lang="ts">
import { onMounted, ref } from 'vue';
import backgroundImage from '../assets/background.jpg';
import gsap from 'gsap';
import Footer from '../components/Footer.vue';

const isLoaded = ref(false);
const backgroundImageUrl = ref(backgroundImage);
const showCursor = ref(true);
const titleComplete = ref(false);
const displayedSubtitle = ref('');

// 文本内容
const heroSubtitle = "AetherRP to serwer, gdzie liczy się klimat, dobra zabawa i porządny roleplay. Mamy własne skrypty, rozbudowaną ekonomię i aktywną społeczność, która trzyma poziom. Niezależnie, czy chcesz prowadzić biznes, grać frakcję, czy po prostu żyć swoim życiem — znajdziesz tu swoje miejsce.";

onMounted(() => {
  // 显示页面
  isLoaded.value = true;
  
  // 徽章动画
  gsap.fromTo('.hero-badge', 
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
  );

  // 标题动画
  gsap.fromTo('.title-normal', 
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: "power2.out" }
  );
  
  gsap.fromTo('.title-gradient', 
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, delay: 0.8, ease: "power2.out", onComplete: () => {
      // 标题显示完成
      titleComplete.value = true;
      
      // 开始显示副标题
      setTimeout(() => {
        typeSubtitle(heroSubtitle, 40);
      }, 300);
    }}
  );
});

// 副标题打字效果
function typeSubtitle(text: string, speed: number) {
  let i = 0;
  displayedSubtitle.value = '';
  showCursor.value = true;
  
  const typing = setInterval(() => {
    if (i < text.length) {
      displayedSubtitle.value += text.charAt(i);
      i++;
    } else {
      clearInterval(typing);
      // 副标题完成后，光标停止闪烁
      setTimeout(() => {
        showCursor.value = false;
        
        // 显示按钮
        gsap.fromTo('.cta-button', 
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.7, 
            stagger: 0.2,
            ease: "back.out(1.2)"
          }
        );
      }, 500);
    }
  }, speed);
}
</script>

<template>
  <main class="hero" :style="{ backgroundImage: `url(${backgroundImageUrl})` }">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <div class="hero-badge">
        <i class="fa-solid fa-gamepad"></i> Jeden z lepszych serwerów w Polsce!
      </div>
      
      <h1 class="hero-title">
        <!-- 固定文本部分 -->
        <span class="title-normal">Dołącz do naszego</span>
        
        <!-- FiveM部分用渐变色显示 -->
        <span class="title-gradient"> Serwera Roleplay</span>
        
        <!-- 使用符号替代动态文本 -->
        <span class="cursor" v-if="!titleComplete">|</span>
      </h1>
      
      <p class="hero-subtitle">
        {{ displayedSubtitle }}
        <!-- 光标仅在副标题打字中显示 -->
        <span v-if="showCursor && titleComplete" class="cursor">|</span>
      </p>
      
      <div class="hero-cta-container">
        <button href="https://discord.gg/DHGnYvvsEt" class="cta-button primary">
          <a href="/applications">
          <i class="fa-solid fa-play"> </i> Złóż podanie na Whitelistę
          </a>
        </button>
        <button href="https://discord.gg/DHGnYvvsEt" class="cta-button secondary">
          <a href="https://discord.gg/DHGnYvvsEt">
          <i class="fa-brands fa-discord"> </i> Dołącz do discorda
          </a>
        </button>
      </div>
    </div>
  </main>

  <!-- 特色区域 -->
  <section class="features" data-aos="fade-up" data-aos-duration="1000">
    <div class="container">
      <h2 class="section-title">Dlaczego warto wybrać <span class="highlight">AetherRP</span></h2>
      <p class="section-subtitle">Rzeczy, które nas wyróżniają</p>
      
      <div class="feature-grid">
        <!-- 特色卡片 1 -->
        <div class="feature-card" data-aos="zoom-in" data-aos-delay="100">
          <div class="feature-icon">
            <i class="fa-solid fa-users"></i>
          </div>
          <h3 class="feature-title">Aktywne Community</h3>
          <p class="feature-desc">Dołącz do aktywnej społeczności RP, gdzie zawsze coś się dzieje. Eventy, akcje, śmiech i dobra atmosfera — bez spiny, z klimatem. Nieważne, czy jesteś nowy czy doświadczony – każdy znajdzie tu miejsce dla siebie.</p>
        </div>
        
        <!-- 特色卡片 2 -->
        <div class="feature-card" data-aos="zoom-in" data-aos-delay="200">
          <div class="feature-icon">
            <i class="fa-solid fa-car"></i>
          </div>
          <h3 class="feature-title">Tylko auta lokalne</h3>
          <p class="feature-desc">Zwiedzaj miasto za kierownicą lokalnych pojazdów – bez żadnych addonów, tylko w pełni dopracowane auta z podstawowej floty GTA. Klimatycznie, stabilnie i bez zbędnego kombinowania.</p>
        </div>
        
        <!-- 特色卡片 3 -->
        <div class="feature-card" data-aos="zoom-in" data-aos-delay="300">
          <div class="feature-icon">
            <i class="fa-solid fa-briefcase"></i>
          </div>
          <h3 class="feature-title">Addonowe prace</h3>
          <p class="feature-desc">Wybierz spośród wielu unikalnych prac i ścieżek kariery, w pełni zaprojektowanych przez nasz zespół. Zarabiaj, rozwijaj postać i buduj własną historię – na naszych zasadach.</p>
        </div>
        
        <!-- 特色卡片 4 -->
        <div class="feature-card" data-aos="zoom-in" data-aos-delay="400">
          <div class="feature-icon">
            <i class="fa-solid fa-house"></i>
          </div>
          <h3 class="feature-title">System Mieszkań</h3>
          <p class="feature-desc">Kupuj mieszkania, domy i biznesy w różnych częściach miasta i zaznacz swoją obecność na mapie. Buduj imperium albo po prostu urządź się po swojemu — wybór należy do Ciebie.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Server Statistics Section -->
  <!-- 引入页脚组件 -->
  <Footer />
</template>

<style scoped>
/* Hero Section Styles */
.hero {
  position: relative;
  height: 100vh; /* 占满整个屏幕 */
  display: flex;
  align-items: center;
  padding: 0 2rem;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
}

.hero-particles {
  display: none;
}

.hero-content {
  max-width: 900px;
  width: 100%;
  position: relative;
  z-index: 10;
  margin: 0 auto;
  text-align: center;
  padding: 0 20px;
  /* 调整垂直位置 */
  transform: translateY(-8%);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(138, 43, 226, 0.15);
  color: #8A2BE2;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 100px;
  margin-bottom: 2rem;
  border: 1px solid rgba(138, 43, 226, 0.3);
  opacity: 0; /* 初始隐藏 */
}

.hero-badge i {
  font-size: 0.9rem;
}

.hero-title {
  font-size: clamp(2.5rem, 7vw, 4.5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  color: #FFFFFF;
  min-height: 5.5rem;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.title-normal {
  color: #FFFFFF;
}

.title-gradient {
  background: linear-gradient(90deg, #8A2BE2, #00FFFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
  min-height: 3rem;
}

.cursor {
  display: inline-block;
  width: 1px;
  height: 1em;
  background-color: rgba(255, 255, 255, 0.7); /* 半透明 */
  transform: scaleX(0.5); /* 水平方向缩小一半 */
  animation: blink 1s infinite;
  margin-left: 2px;
  vertical-align: middle;
  position: relative;
  top: -0.1em;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.hero-cta-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.cta-button {
  font-weight: 600;
  font-size: 1rem;
  padding: 1rem 2rem;
  border-radius: 50px;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0; /* 初始隐藏 */
}

.cta-button i {
  font-size: 0.95rem;
}

.cta-button.primary {
  background: linear-gradient(90deg, #8A2BE2, #4B0082);
  color: white;
  box-shadow: 0 10px 20px rgba(138, 43, 226, 0.3);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
}

.cta-button.primary:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 15px 25px rgba(138, 43, 226, 0.4);
}

.cta-button.secondary {
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.cta-button.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* 特色区域样式 */
.features {
  padding: 6rem 1.5rem;
  background-color: #0a0a0a;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #fff;
}

.highlight {
  background: linear-gradient(90deg, #8A2BE2, #00FFFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  text-align: center;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(138, 43, 226, 0.15);
  border-color: rgba(138, 43, 226, 0.3);
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #8A2BE2, #4B0082);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: white;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #fff;
}

.feature-desc {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

/* 服务器新闻区域样式 */
.news-section {
  padding: 6rem 1.5rem;
  background-color: #0a0a0a;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.news-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(138, 43, 226, 0.15);
  border-color: rgba(138, 43, 226, 0.2);
}

.news-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.news-card:hover .news-image img {
  transform: scale(1.05);
}

.news-content {
  padding: 1.5rem;
}

.news-date {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  display: block;
  margin-bottom: 0.5rem;
}

.news-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #fff;
}

.news-summary {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.news-link {
  font-size: 0.9rem;
  font-weight: 600;
  color: #8A2BE2;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: transform 0.3s ease;
}

.news-link:hover {
  transform: translateX(5px);
}

.news-action {
  text-align: center;
}

.view-all-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(138, 43, 226, 0.1);
  border: 1px solid rgba(138, 43, 226, 0.3);
  color: #8A2BE2;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.view-all-button:hover {
  background: rgba(138, 43, 226, 0.2);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(138, 43, 226, 0.2);
}

/* FAQ区域样式 */
.faq-section {
  padding: 6rem 1.5rem;
  background-color: #070707;
  position: relative;
}

.faq-container {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item.active {
  border-color: rgba(138, 43, 226, 0.3);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.faq-question {
  padding: 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
}

.faq-question h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #fff;
}

.faq-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(138, 43, 226, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8A2BE2;
  transition: all 0.3s ease;
}

.faq-item.active .faq-icon {
  background: #8A2BE2;
  color: white;
  transform: rotate(180deg);
}

.faq-answer {
  height: 0;
  overflow: hidden;
  transition: height 0.3s ease;
}

.faq-answer.open {
  height: auto;
  padding: 0 1.5rem 1.5rem 1.5rem;
}

.faq-answer p {
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.6;
}

.faq-action {
  margin-top: 3rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.support-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(90deg, #8A2BE2, #4B0082);
  color: white;
  padding: 1rem 2rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.support-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(138, 43, 226, 0.3);
}

.support-button.secondary {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
}

.support-button.secondary:hover {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: none;
}

/* 页脚样式移至Footer组件 */

@media (max-width: 1200px) {
  .hero-gallery {
    opacity: 0.3;
  }
}

@media (max-width: 768px) {
  .hero-gallery {
    display: none;
  }
  
  .hero-cta-container {
    flex-direction: column;
    gap: 1rem;
    max-width: 80%;
    margin: 0 auto 2rem auto;
  }
  
  .hero-title {
    margin-top: 1rem;
    font-size: 2.5rem;
    min-height: 4rem;
  }
  
  .hero-subtitle {
    max-width: 100%;
  }
  
  .feature-grid, .stats-grid, .news-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .faq-action {
    flex-direction: column;
    align-items: center;
  }
  
  .news-card {
    max-width: 400px;
    margin: 0 auto;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
    min-height: 3.5rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .stat-value {
    font-size: 2rem;
  }
  
  .stat-label {
    font-size: 0.9rem;
  }
}
</style> 