<template>
  <div class="rules-page">
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-badge" data-aos="fade-down"><i class="fa-solid fa-scale-balanced"></i> Regulamin</div>
        <h1 data-aos="fade-up" data-aos-delay="100">Zasady <span class="accent">Serwera</span></h1>
        <p class="subtitle" data-aos="fade-up" data-aos-delay="200">Przestrzegaj tych zasad, żeby wszystkim grało się dobrze i z klimatem.Razem dbamy o to, żeby serwer był miejscem, do którego chce się wracać.</p>
      </div>
      <div class="hero-decoration">
        <div class="circle circle-1" data-aos="zoom-in" data-aos-delay="300"></div>
        <div class="circle circle-2" data-aos="zoom-in" data-aos-delay="400"></div>
      </div>
    </div>
    
    <div class="container">
      <!-- 导航栏 -->
      <div class="rules-nav" data-aos="fade-up">
        <button 
          v-for="(section, index) in ruleSections" 
          :key="index"
          @click="scrollToSection(section.id)"
          class="nav-button"
          data-aos="fade-up"
          :data-aos-delay="50 * index"
        >
          <i :class="section.icon"></i>
          {{ section.title }}
        </button>
      </div>
      
      <div class="rules-content">
        <div 
          v-for="(section, sectionIndex) in ruleSections" 
          :key="sectionIndex" 
          class="rules-section" 
          :id="section.id"
          data-aos="fade-up"
          :data-aos-delay="100 * sectionIndex"
        >
          <div class="section-header" data-aos="fade-right">
            <div class="section-icon">
              <i :class="section.icon"></i>
            </div>
            <h2>{{ section.title }}</h2>
          </div>
          
          <div class="rules-list-container">
            <div 
              v-for="(rule, ruleIndex) in section.rules" 
              :key="ruleIndex" 
              class="rule-card"
              :class="{'important': rule.important}"
              :data-index="sectionIndex * 10 + ruleIndex + 1"
              data-aos="fade-up"
              :data-aos-delay="100 + (ruleIndex * 50)"
            >
              <div class="rule-header">
                <div class="rule-number">{{ sectionIndex * 10 + ruleIndex + 1 }}</div>
                <h3>{{ rule.title }}</h3>
              </div>
              <div class="rule-body">
                <p>{{ rule.description }}</p>
                <div v-if="rule.penalty" class="rule-penalty">
                  <span class="penalty-label">Penalty:</span> {{ rule.penalty }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="rules-reminder" data-aos="fade-up" data-aos-delay="300">
          <div class="reminder-icon">
            <i class="fa-solid fa-circle-info"></i>
          </div>
          <div class="reminder-content">
            <h3>Pamiętaj</h3>
            <p>Dołączając do serwera, akceptujesz obowiązujące zasady. Ich łamanie może skutkować ostrzeżeniem, czasowym banem lub permanentnym usunięciem z serwera. Decyzje administracji są ostateczne — ale zawsze możesz złożyć odwołanie na naszym Discordzie.</p>
            <a href="#" class="discord-button" data-aos="zoom-in" data-aos-delay="400">
              <i class="fa-brands fa-discord"></i> Dołącz do naszego discorda
            </a>
          </div>
        </div>
      </div>
      
    
    <!-- 悬浮按钮 -->
    <div class="floating-button" @click="scrollToTop" :class="{'visible': showScrollTop}">
      <i class="fa-solid fa-arrow-up"></i>
    </div>
    
    <!-- 引入页脚组件 -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Footer from '../components/Footer.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import AOS from 'aos';

// 返回顶部按钮状态
const showScrollTop = ref(false);

// AOS初始化
onMounted(() => {
  AOS.refresh();
  
  // 监听滚动事件
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  // 移除事件监听
  window.removeEventListener('scroll', handleScroll);
});

// 处理滚动事件
function handleScroll() {
  showScrollTop.value = window.scrollY > 300;
}

// 规则部分数据
const ruleSections = [
  {
    id: 'general',
    title: 'Zasady Ogólne',
    icon: 'fa-solid fa-users',
    rules: [
      {
        title: 'Szanuj Wszystkich Graczy',
        description: 'Traktuj wszystkich z szacunkiem. Nękanie, dyskryminacja czy mowa nienawiści są zabronione.',
        penalty: 'Ostrzeżenie lub ban, zależnie od przewinienia',
        important: true
      },
      {
        title: 'Pozostań w Postaci',
        description: 'Odgrywaj rolę przez cały czas. Rozmowy OOC ogranicz do minimum i tylko w razie potrzeby.',
        penalty: 'Upomnienie lub tymczasowy ban'
      },
      {
        title: 'Zakaz Metagamingu',
        description: 'Nie wykorzystuj informacji spoza gry. Dotyczy to Discorda, streamów i innych źródeł.',
        penalty: 'Tymczasowy ban (1-7 dni)'
      },
      {
        title: 'Zakaz Powergamingu',
        description: 'Nie wymuszaj scenariuszy na innych. Pozwól graczom naturalnie reagować na twoje działania.',
        penalty: 'Ostrzeżenie lub tymczasowy ban'
      },
      {
        title: 'Szanuj Własne Życie',
        description: 'W niebezpiecznych sytuacjach zachowuj się tak, jak w prawdziwym życiu. Twoja postać powinna bać się śmierci i obrażeń.',
        penalty: 'Ostrzeżenie lub tymczasowy ban'
      }
    ]
  },
  {
    id: 'gameplay',
    title: 'Zasady Rozgrywki',
    icon: 'fa-solid fa-gamepad',
    rules: [
      {
        title: 'Zakaz Wykorzystywania Błędów',
        description: 'Korzystanie z bugów lub exploitów w celu uzyskania przewagi jest surowo zabronione.',
        penalty: 'Natychmiastowy permanentny ban',
        important: true
      },
      {
        title: 'Realistyczna Jazda',
        description: 'Poruszaj się zgodnie z przepisami, gdy nie ma sytuacji awaryjnej. Unikaj taranowania i nadużywania pojazdów.',
        penalty: 'Ostrzeżenie lub tymczasowy ban'
      },
      {
        title: 'Działalność Przestępcza',
        description: 'Każda akcja przestępcza musi być odpowiednio odegrana. Zabójstwa czy rabunki bez kontekstu RP są zabronione.',
        penalty: 'Tymczasowy lub permanentny ban'
      }
    ]
  },
  {
    id: 'administrative',
    title: 'Administracja',
    icon: 'fa-solid fa-shield',
    rules: [
      {
        title: 'Decyzje Administracji',
        description: 'Decyzje administracji są ostateczne. W razie wątpliwości możesz się odwołać poprzez odpowiednie kanały na Discordzie.',
        penalty: 'Nie dotyczy'
      },
      {
        title: 'Aktualizacje Zasad',
        description: 'Regulamin może się zmieniać w każdej chwili. Twoim obowiązkiem jest być na bieżąco z aktualnymi zasadami.',
        penalty: 'Nie dotyczy'
      }
    ]
  }
];

// 滚动到指定区域
function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (element) {
    const yOffset = -100; // 考虑顶部导航栏的高度
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({top: y, behavior: 'smooth'});
  }
}

// 返回顶部
function scrollToTop() {
  window.scrollTo({top: 0, behavior: 'smooth'});
}
</script>

<style scoped>
.rules-page {
  min-height: 100vh;
  background-color: #0a0a0a;
  color: #e0e0e0;
  position: relative;
}

/* 容器 */
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 强调色 */
.accent {
  background: linear-gradient(90deg, #8A2BE2, #00FFFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Hero Section */
.hero-section {
  height: 40vh;
  min-height: 300px;
  max-height: 450px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 120px 24px 60px;
  overflow: hidden;
  background: linear-gradient(to bottom, rgba(10, 10, 10, 0.9), rgba(10, 10, 10, 1));
}

.hero-content {
  text-align: center;
  z-index: 10;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  background: rgba(138, 43, 226, 0.15);
  color: #8A2BE2;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border-radius: 100px;
  margin-bottom: 2rem;
  border: 1px solid rgba(138, 43, 226, 0.3);
  box-shadow: 0 4px 20px rgba(138, 43, 226, 0.2);
}

.hero-content h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: white;
}

.subtitle {
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

.hero-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.15;
}

.circle-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #8A2BE2 0%, transparent 70%);
  top: -150px;
  left: -100px;
}

.circle-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #00FFFF 0%, transparent 70%);
  bottom: -100px;
  right: -50px;
}

/* 规则导航 */
.rules-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin: 50px 0 40px;
  justify-content: center;
  position: sticky;
  top: 20px;
  z-index: 100;
  background-color: rgba(10, 10, 10, 0.8);
  padding: 15px 20px;
  border-radius: 100px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.nav-button {
  background: rgba(30, 30, 30, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-button:hover {
  background: rgba(138, 43, 226, 0.2);
  border-color: rgba(138, 43, 226, 0.3);
  color: white;
}

.nav-button i {
  font-size: 0.9rem;
}

/* 规则内容 */
.rules-content {
  display: flex;
  flex-direction: column;
  gap: 80px;
  margin-bottom: 80px;
}

/* 规则部分 */
.rules-section {
  position: relative;
  scroll-margin-top: 150px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.section-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #8A2BE2, #00FFFF);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(138, 43, 226, 0.2);
}

.section-icon i {
  font-size: 1.8rem;
  color: white;
}

.section-header h2 {
  font-size: 2rem;
  margin: 0;
  background: linear-gradient(90deg, #8A2BE2, #00FFFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 规则列表 */
.rules-list-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
}

/* 规则卡片 */
.rule-card {
  background: rgba(25, 25, 25, 0.6);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  position: relative;
}

.rule-card.important {
  border: 1px solid rgba(138, 43, 226, 0.3);
  background: linear-gradient(to bottom right, rgba(30, 30, 30, 0.8), rgba(40, 20, 60, 0.8));
}

.rule-card::after {
  content: attr(data-index);
  position: absolute;
  bottom: 10px;
  right: 15px;
  font-size: 5rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.03);
  line-height: 1;
  pointer-events: none;
}

.rule-header {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.rule-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #8A2BE2, #00FFFF);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 5px 15px rgba(138, 43, 226, 0.2);
}

.rule-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.rule-body {
  padding: 20px;
}

.rule-body p {
  margin: 0 0 20px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
}

.rule-penalty {
  background: rgba(0, 0, 0, 0.2);
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 0.9rem;
}

.penalty-label {
  font-weight: 600;
  color: #8A2BE2;
}

/* 提醒内容 */
.rules-reminder {
  background: linear-gradient(to right, rgba(30, 30, 30, 0.6), rgba(40, 40, 40, 0.6));
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  margin-top: 30px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.reminder-icon {
  width: 100px;
  background: linear-gradient(to bottom, #8A2BE2, #4B0082);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.reminder-icon i {
  font-size: 3rem;
  color: white;
}

.reminder-content {
  padding: 30px;
  flex: 1;
}

.reminder-content h3 {
  margin: 0 0 15px;
  font-size: 1.5rem;
}

.reminder-content p {
  margin: 0 0 20px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
}

/* Discord Button */
.discord-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #5865F2;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(88, 101, 242, 0.5);
}

.update-content p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
}

/* 悬浮按钮 */
.floating-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #8A2BE2, #00FFFF);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
}

.floating-button.visible {
  opacity: 1;
  pointer-events: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .rules-list-container {
    grid-template-columns: 1fr;
  }
  
  .hero-section {
    height: auto;
    padding: 100px 24px 60px;
  }
  
  .rules-nav {
    flex-wrap: nowrap;
    overflow-x: auto;
    justify-content: flex-start;
    padding: 10px 15px;
    border-radius: 12px;
  }
  
  .nav-button {
    white-space: nowrap;
    padding: 8px 15px;
  }
  
  .rules-reminder {
    flex-direction: column;
  }
  
  .reminder-icon {
    width: 100%;
    height: 80px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    text-align: center;
  }
  
  .section-icon {
    margin: 0 auto;
  }
  
  .section-header h2 {
    margin: 0 auto;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .update-item {
    flex-direction: column;
    gap: 5px;
  }
  
  .rule-card::after {
    font-size: 3rem;
  }
}
</style> 