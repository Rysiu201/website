<script setup lang="ts">
import { ref, onMounted } from 'vue';
import backgroundImage from '../assets/background.jpg';
import Footer from '../components/Footer.vue';
import AOS from 'aos';
import logoImage from '../assets/logo.jpg';

const teamSlider = ref<HTMLElement | null>(null);

const scrollSlider = (direction: number) => {
  const slider = teamSlider.value;
  if (!slider) return;
  const card = slider.querySelector<HTMLElement>('.team-card');
  if (!card) return;
  const gap = parseInt(getComputedStyle(slider).gap) || 0;
  const amount = card.offsetWidth + gap;
  slider.scrollBy({ left: amount * direction, behavior: 'smooth' });
};

const backgroundImageUrl = ref(backgroundImage);

const loadDiscordInfo = async (member: any) => {
  try {
    const res = await fetch(`/api/team-member/${member.discordId}`);
    if (res.ok) {
      const data = await res.json();
      if (data.avatar) member.image = data.avatar;
      if (data.status) member.status = data.status.charAt(0).toUpperCase() + data.status.slice(1);
    }
  } catch (err) {
    console.error('Failed to load Discord info', err);
  }
};

onMounted(() => {
  // 重新初始化AOS
  AOS.refresh();
  teamMembers.value.forEach(m => m.discordId && loadDiscordInfo(m));
});

// Team members data - 只保留三位成员
const teamMembers = ref([
  {
    id: 1,
    name: 'Rysiu201',
    role: 'Właściciel Serwera i Główny Developer',
    bio: 'Typ od wszystkiego — od pisania kodu, przez poprawki bugów, po tworzenie eventów i ogarnianie całego serwera. Głowa projektu, która nie śpi, bo zawsze coś trzeba dopisać albo zoptymalizować. Lubi jak działa szybko, stabilnie i z klimatem. Na serwerze dba o jakość, balans i to, żeby graczom się po prostu dobrze grało.',
    image: logoImage,
    status: 'Offline',
    discord: 'rysiu201',
    discordId: '000000000000000001',
    socialLinks: {
      discord: '#',
      tiktok: '#',
      youtube: '#'
    }
  },
  {
    id: 2,
    name: 'TheSzatan',
    role: 'Strażnik Równowagi Społeczności',
    bio: 'Nie rzuca się w oczy, ale wszystko widzi. Gdy cisza staje się zbyt podejrzana, pojawia się — nieproszona, ale potrzebna. Balansuje między emocjami graczy, atmosferą serwera i cieniem dram. Tam, gdzie Owner decyduje, ona przewiduje skutki. Tam, gdzie Witcher rzuca znak Aksji, TheSzatan łapie reakcje. Nie po to, by rządzić. Po to, by działało.',
    image: logoImage,
    status: 'Online',
    discord: 'theszatan',
    socialLinks: {
      discord: '#',
      tiktok: '#'
    }
  },
  {
    id: 3,
    name: 'Wiewior',
    role: 'Strażnik Równowagi i Porządku',
    bio: 'Pojawia się wtedy, gdy granica między chaosem a spokojem zaczyna się zacierać. Milczy więcej, niż mówi, ale jedno jego słowo potrafi zakończyć burzę. Zna serwer jak las, przez który przechodzi się tylko z szacunkiem. Gdy trzeba — usuwa toksynę. Gdy można — daje drugą szansę. Nie szuka konfliktów. Ale jeśli przyjdą — jest gotów.',
    image: logoImage,
    status: 'Away',
    discord: 'wiewior23',
    socialLinks: {
      discord: '#',
      instagram: '#'
    }
  },
  {
    id: 4,
    name: 'Andrzej',
    role: 'Strażnik Równowagi i Porządku',
    bio: 'Ten, który widzi więcej, Andrzej nie administruje — on czuwa. Nad flow, nad sprawiedliwością, nad ludźmi. Nie zawsze go widać, ale jego obecność czuć w decyzjach, które porządkują świat. Gdy regulamin przestaje wystarczać, to jego intuicja prowadzi. Nie każdy bohater nosi miecz. On nosi świadomość i odpowiedzialność.',
    image: logoImage,
    status: 'Offline',
    discord: '.andrzej',
    socialLinks: {
      discord: '#',
      instagram: '#'
    }
  }
]);
</script>

<template>
  <div class="staff-container">
    <!-- 背景动画元素 -->
    <div class="bg-elements">
      <div class="bg-circle circle-1" data-aos="fade-down-right" data-aos-duration="1200"></div>
      <div class="bg-circle circle-2" data-aos="fade-up-left" data-aos-duration="1500"></div>
      <div class="bg-circle circle-3" data-aos="zoom-in" data-aos-duration="1000"></div>
    </div>
    
    <!-- Hero Section -->
    <div class="staff-hero" :style="{ backgroundImage: `url(${backgroundImageUrl})` }">
      <div class="staff-hero-overlay"></div>
      <div class="staff-hero-content">
        <div class="hero-badge" data-aos="fade-down">
          <i class="fa-solid fa-users badge-icon"></i>
          <span>Nasz zespół</span>
        </div>
        <h1 class="staff-title" data-aos="fade-up" data-aos-delay="100">Poznaj Nasz <span class="accent">Zespół</span></h1>
        <p class="staff-subtitle" data-aos="fade-up" data-aos-delay="200">Zespół pasjonatów stojący za AetherRP, który codziennie pracuje nad tym, żeby serwer był wyjątkowym miejscem do gry i wspólnej zabawy.</p>
        <div class="hero-stats" data-aos="fade-up" data-aos-delay="300">
          <div class="stat" data-aos="zoom-in" data-aos-delay="400">
            <div class="stat-value">3</div>
            <div class="stat-label">Ekipa AetherRP</div>
          </div>
          <div class="stat" data-aos="zoom-in" data-aos-delay="500">
            <div class="stat-value">24/7</div>
            <div class="stat-label">Support</div>
          </div>
          <div class="stat" data-aos="zoom-in" data-aos-delay="600">
            <div class="stat-value">99,9%</div>
            <div class="stat-label">Dedykowany</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Team Members Section -->
    <div class="team-section">
      <div class="container">
        <h2 class="section-title" data-aos="fade-up">Nasz <span class="accent">Zespół Zarządzający</span></h2>
        <p class="section-subtitle" data-aos="fade-up" data-aos-delay="100">Poznaj osobowości zajmujące się serwerem</p>
        
        <div class="team-slider-container">
          <button class="slider-arrow left" @click="scrollSlider(-1)">◀</button>
          <div class="team-grid" ref="teamSlider">
            <div
              v-for="(member, index) in teamMembers"
              :key="member.id"
              class="team-card"
              data-aos="fade-up"
              :data-aos-delay="150 * index"
            >
            <!-- 简化后的卡片，没有翻转功能 -->
            <div class="status-indicator" :class="member.status.toLowerCase()"></div>
            
            <div class="member-image">
              <img :src="member.image" alt="Członek zespołu">
            </div>
            
            <div class="member-info">
              <h3>{{ member.name }}</h3>
              <div class="member-role">{{ member.role }}</div>
              <p class="member-bio">{{ member.bio }}</p>
              <div class="member-discord">
                <i class="fa-brands fa-discord"></i> {{ member.discord }}
              </div>
              <div class="member-social">
                <a v-if="member.socialLinks.discord" href="#" class="social-icon"><i class="fa-brands fa-discord"></i></a>
                <a v-if="member.socialLinks.tiktok" href="#" class="social-icon"><i class="fa-brands fa-tiktok"></i></a>
                <a v-if="member.socialLinks.youtube" href="#" class="social-icon"><i class="fa-brands fa-youtube"></i></a>
                <a v-if="member.socialLinks.instagram" href="#" class="social-icon"><i class="fa-brands fa-instagram"></i></a>
              </div>
              <button class="contact-button">
                <i class="fa-solid fa-message"></i> Skontaktuj się
              </button>
            </div>
            </div>
          </div>
          <button class="slider-arrow right" @click="scrollSlider(1)">▶</button>
        </div>
      </div>
    </div>
    
    <!-- 团队理念部分 -->
    <div class="philosophy-section">
      <div class="container">
        <div class="philosophy-content">
          <div class="philosophy-text" data-aos="fade-right">
            <h2 data-aos="fade-up">Nasza <span class="accent">Filozofia Zespołu</span></h2>
            <p data-aos="fade-up" data-aos-delay="100">W AetherRP stawiamy na gracza. Tworzymy serwer, gdzie liczy się klimat, zabawa i jakość rozgrywki. Nasz zespół działa każdego dnia, by rozwijać społeczność i dbać o pozytywne doświadczenia każdego gracza.</p>
            <ul class="philosophy-list">
              <li data-aos="fade-left" data-aos-delay="150"><i class="fa-solid fa-check"></i> Skupienie na doświadczeniu graczy i jakości RP</li>
              <li data-aos="fade-left" data-aos-delay="200"><i class="fa-solid fa-check"></i> Otwarta i jasna komunikacja ze społecznością</li>
              <li data-aos="fade-left" data-aos-delay="250"><i class="fa-solid fa-check"></i> Ciągły rozwój, świeże pomysły i usprawnienia</li>
              <li data-aos="fade-left" data-aos-delay="300"><i class="fa-solid fa-check"></i> Równe traktowanie i sprawiedliwe egzekwowanie zasad</li>
            </ul>
          </div>
          
          <div class="philosophy-image" data-aos="fade-left" data-aos-delay="200">
            <img src="../assets/Banner.jpg" alt="Filozofia zespołu">
          </div>
        </div>
      </div>
    </div>
    
    <!-- Join Our Staff Section -->
    <div class="join-section">
      <div class="container">
        <div class="join-content">
          <h2>Chciałbyś <span class="accent">Dołączyć do naszego zespołu?</span></h2>
          <p>Szukamy zaangażowanych osób, które kochają roleplay i chcą współtworzyć naszą społeczność. Jeśli masz pasję do zarządzania, pomocy graczom i dobrej zabawy – odezwij się do nas!.</p>
          <div class="requirements">
            <h3>Wymagania</h3>
            <ul class="req-list">
              <li><i class="fa-solid fa-circle-check"></i> Minimum 16 lat</li>
              <li><i class="fa-solid fa-circle-check"></i> Doświadczenie z serwerami RP</li>
              <li><i class="fa-solid fa-circle-check"></i> Mocne umiejętnosci komunikacyjne</li>
              <li><i class="fa-solid fa-circle-check"></i> Umiejętność pracy w zespole</li>
            </ul>
          </div>
          <button class="cta-button primary">
            <i class="fa-brands fa-discord"></i> Aplikuj
          </button>
        </div>
      </div>
    </div>
    
    <!-- 引入页脚组件 -->
    <Footer />
  </div>
</template>

<style scoped>
.staff-container {
  min-height: 100vh;
  background-color: #0a0a0a;
  color: white;
  position: relative;
  overflow: hidden;
}

/* 背景动画元素 */
.bg-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.15;
}

.circle-1 {
  width: 60vw;
  height: 60vw;
  background: radial-gradient(circle, #8A2BE2 0%, transparent 70%);
  top: -20vw;
  left: -20vw;
}

.circle-2 {
  width: 40vw;
  height: 40vw;
  background: radial-gradient(circle, #00FFFF 0%, transparent 70%);
  bottom: -10vw;
  right: -10vw;
}

.circle-3 {
  width: 30vw;
  height: 30vw;
  background: radial-gradient(circle, #5c15a6 0%, transparent 70%);
  top: 40%;
  left: 60%;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
}

/* Hero Section */
.staff-hero {
  position: relative;
  height: 70vh;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.staff-hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(10, 10, 10, 0.95));
  z-index: 1;
}

.staff-hero-content {
  max-width: 900px;
  position: relative;
  z-index: 10;
  margin: 0 auto;
  text-align: center;
  padding-top: 120px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  background: rgba(138, 43, 226, 0.15);
  color: #8A2BE2;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.7rem 1.4rem;
  border-radius: 100px;
  margin-bottom: 2rem;
  border: 1px solid rgba(138, 43, 226, 0.3);
  box-shadow: 0 4px 20px rgba(138, 43, 226, 0.2);
}

.badge-icon {
  font-size: 1.1rem;
}

.staff-title {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
}

.staff-title .accent {
  background: linear-gradient(90deg, #8A2BE2, #00FFFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.staff-subtitle {
  font-size: clamp(1rem, 2vw, 1.2rem);
  max-width: 700px;
  margin: 0 auto 3rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

/* Stats */
.hero-stats {
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-top: 3rem;
}

.stat {
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #8A2BE2, #00FFFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.7);
}

/* Section Titles */
.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.section-title .accent {
  background: linear-gradient(90deg, #8A2BE2, #00FFFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  text-align: center;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  margin: 0 auto 4rem;
}

/* Team Section */
.team-section {
  padding: 8rem 0 6rem;
}

.team-slider-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;
  overflow-x: hidden;
}

.team-grid {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 2rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.team-grid::-webkit-scrollbar {
  display: none;
}

.slider-arrow {
  background: none;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.slider-arrow:hover {
  opacity: 1;
}

/* Team Card */
.team-card {
  background: rgba(25, 25, 25, 0.8);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(138, 43, 226, 0.2);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  padding: 2rem 1.5rem;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease-in-out;
  flex: 0 0 calc(33.333% - 2rem);
}

.team-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(138, 43, 226, 0.2);
}

.status-indicator {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  z-index: 5;
}

.status-indicator.online {
  background: #2ecc71;
  box-shadow: 0 0 10px rgba(46, 204, 113, 0.5);
}

.status-indicator.away {
  background: #f1c40f;
  box-shadow: 0 0 10px rgba(241, 196, 15, 0.5);
}

.status-indicator.offline {
  background: #e74c3c;
  box-shadow: 0 0 10px rgba(231, 76, 60, 0.5);
}

.member-image {
  width: 100%;
  height: 180px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
}

.member-image::after {
  content: '';
  position: absolute;
  width: 190px;
  height: 190px;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(138, 43, 226, 0.05) 30%, rgba(0, 255, 255, 0.05) 70%);
  z-index: -1;
  pointer-events: none;
}

.member-image img {
  width: 160px;
  height: 160px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid rgba(138, 43, 226, 0.4);
  box-shadow: 0 10px 25px rgba(138, 43, 226, 0.3);
  transition: all 0.3s ease-in-out;
}

.team-card:hover .member-image img {
  transform: scale(1.05);
  border-color: rgba(138, 43, 226, 0.8);
  box-shadow: 0 15px 35px rgba(138, 43, 226, 0.5);
}

.member-info {
  text-align: center;
  width: 100%;
}

.member-info h3 {
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #8A2BE2, #00FFFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.member-role {
  color: #8A2BE2;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.member-bio {
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.2rem;
}

.member-discord {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
}

.member-social {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.2rem;
}

.social-icon {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.social-icon:hover {
  color: #8A2BE2;
}

.contact-button {
  background: linear-gradient(90deg, #8A2BE2, #6A5ACD);
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 50px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 5px 15px rgba(138, 43, 226, 0.25);
}

.contact-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(138, 43, 226, 0.4);
}

/* Philosophy Section */
.philosophy-section {
  padding: 6rem 0;
  background: linear-gradient(to bottom, #0a0a0a, #151515);
}

.philosophy-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.philosophy-text h2 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.philosophy-text p {
  font-size: 1.1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
}

.philosophy-list {
  list-style: none;
  padding: 0;
}

.philosophy-list li {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 1.05rem;
}

.philosophy-list li i {
  color: #8A2BE2;
}

.philosophy-image .image-container {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  transform: rotate(-3deg);
}

.philosophy-image img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
  transform: none;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.philosophy-image img:hover {
  box-shadow: 0 12px 25px rgba(138, 43, 226, 0.25);
}

/* Join Section */
.join-section {
  padding: 8rem 0;
  text-align: center;
  background: linear-gradient(to top, rgba(138, 43, 226, 0.1), transparent);
}

.join-content {
  max-width: 800px;
  margin: 0 auto;
}

.join-content h2 {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.join-content h2 .accent {
  background: linear-gradient(90deg, #8A2BE2, #00FFFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.join-content p {
  font-size: 1.2rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2.5rem;
}

.requirements {
  margin-bottom: 3rem;
  background: rgba(30, 30, 30, 0.6);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.requirements h3 {
  margin-bottom: 1.5rem;
  color: #8A2BE2;
}

.req-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.req-list li {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.req-list li i {
  color: #8A2BE2;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: 50px;
  cursor: pointer;
  border: none;
  font-size: 1.1rem;
}

.cta-button.primary {
  background: linear-gradient(90deg, #8A2BE2, #4B0082);
  color: white;
  box-shadow: 0 8px 25px rgba(138, 43, 226, 0.3);
}

/* Responsive Adjustments */
@media (max-width: 1024px) {
  .philosophy-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .philosophy-image {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .req-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 992px) {
  .team-card {
    flex: 0 0 calc(50% - 2rem);
  }
}

@media (max-width: 768px) {
  .team-card {
    flex: 0 0 100%;
    max-width: 450px;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 2rem;
  }
  
  .staff-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .join-content h2 {
    font-size: 2.2rem;
  }
}
</style> 
