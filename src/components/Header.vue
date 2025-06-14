<template>
  <header class="header">
    <div class="container">
      <div class="left-group">
        <router-link
          v-if="isAdmin"
          to="/admin"
          class="nav-link admin-link"
          active-class="active"
        >
          <li><i class="fa-solid fa-file-contract"></i> Administrowanie</li>
        </router-link>
        <div class="logo">
          <span class="logo-text">Aether</span>
          <span class="logo-accent">RP</span>
        </div>
      </div>
      <nav class="nav-center">
        <ul class="nav-links">
          <li><router-link to="/" class="nav-link" active-class="active"><i class="fa-solid fa-house"></i> Strona Domowa</router-link></li>
          <li><router-link to="/features" class="nav-link" active-class="active"><i class="fa-solid fa-server"></i> Co oferujemy</router-link></li>
          <li><router-link to="/staff" class="nav-link" active-class="active"><i class="fa-solid fa-users"></i> Zespół</router-link></li>
          <li><router-link to="/rules" class="nav-link" active-class="active"><i class="fa-solid fa-file-contract"></i> Zasady</router-link></li>
          <li><router-link to="/join" class="nav-link" active-class="active"><i class="fa-solid fa-book"></i> Jak dołączyć</router-link></li>
          <li><router-link to="/apply" class="nav-link" active-class="active"><i class="fa-solid fa-file-signature"></i> Złóż podanie</router-link></li>
        </ul>
      </nav>
      <div class="header-actions">
        <div class="social-icons">
          <a href="#" class="social-icon"><i class="fa-brands fa-discord"></i></a>
        </div>
        <div class="auth-area" :class="{ 'logged-in': user }">
          <template v-if="user">
            <div class="user-info">
              <span class="username">{{ user.username }}</span>
              <img :src="avatarUrl" alt="avatar" class="avatar" />
              <button class="logout-btn" @click="logout">Wyloguj</button>
            </div>
          </template>
          <button v-else class="login-btn" @click="login"><i class="fa-brands fa-discord"></i> Zaloguj</button>
        </div>
        <button class="menu-toggle" aria-label="Menu" @click="toggleMenu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
    <div class="mobile-nav" :class="{ 'active': menuOpen }" ref="mobileNav">
      <ul class="mobile-nav-links" ref="mobileNavLinks">
        <li><router-link to="/" @click="closeMenu"><i class="fa-solid fa-house"></i> Strona Domowa</router-link></li>
        <li><router-link to="/features" @click="closeMenu"><i class="fa-solid fa-server"></i> Co oferujemy</router-link></li>
        <li><router-link to="/staff" @click="closeMenu"><i class="fa-solid fa-users"></i> Zespół</router-link></li>
        <li><router-link to="/rules" @click="closeMenu"><i class="fa-solid fa-file-contract"></i> Zasady</router-link></li>
        <li><router-link to="/join" @click="closeMenu"><i class="fa-solid fa-book"></i> Jak dołączyć</router-link></li>
        <li><router-link to="/apply" @click="closeMenu"><i class="fa-solid fa-file-signature"></i> Złóż podanie</router-link></li>
        <li v-if="isAdmin"><router-link to="/admin" @click="closeMenu"><i class="fa-solid fa-screwdriver-wrench"></i> Administrowanie</router-link></li>
      </ul>
      <div class="mobile-social-icons">
        <a href="#" class="social-icon"><i class="fa-brands fa-discord"></i></a>
        <a href="#" class="social-icon"><i class="fa-brands fa-tiktok"></i></a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import gsap from 'gsap';

const menuOpen = ref(false);
const mobileNav = ref<HTMLElement | null>(null);
const mobileNavLinks = ref<HTMLUListElement | null>(null);
const user = ref<any>(null);
const isAdmin = ref(false);
const avatarUrl = computed(() =>
  user.value ? `https://cdn.discordapp.com/avatars/${user.value.id}/${user.value.avatar}.png?size=32` : ''
);

function fetchUser() {
  fetch('/api/user', { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      user.value = data.user;
      isAdmin.value = data.isAdmin;
    });
}

function login() {
  window.location.href = '/auth/discord';
}

function logout() {
  window.location.href = '/auth/logout';
}

// 导航菜单动画
function toggleMenu() {
  menuOpen.value = !menuOpen.value;
  
  if (menuOpen.value) {
    document.body.style.overflow = 'hidden';
    
    // 移动导航菜单项淡入动画
    if (mobileNavLinks.value) {
      gsap.fromTo(
        mobileNavLinks.value.children,
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.1, 
          delay: 0.3,
          duration: 0.4,
          ease: 'power2.out'
        }
      );
    }
  } else {
    document.body.style.overflow = '';
    
    // 移动导航菜单关闭时重置动画状态
    if (mobileNavLinks.value) {
      gsap.set(mobileNavLinks.value.children, { clearProps: 'all' });
    }
  }
}

function closeMenu() {
  menuOpen.value = false;
  document.body.style.overflow = '';
}

// 按钮悬停动画
onMounted(() => {
  fetchUser();
  // 初始设置
  gsap.set('.header', { y: -20, opacity: 0 });
  
  // 购买按钮悬停效果已移除
  
  // 社交图标悬停效果
  const socialIcons = document.querySelectorAll('.social-icon');
  socialIcons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
      gsap.to(icon, {
        y: -5,
        rotation: 5,
        duration: 0.3,
        ease: 'back.out(1.7)'
      });
    });
    
    icon.addEventListener('mouseleave', () => {
      gsap.to(icon, {
        y: 0,
        rotation: 0,
        duration: 0.3,
        ease: 'power1.out'
      });
    });
  });
});
</script>

<style scoped>
.header {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  background: rgba(18, 18, 18, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  transition: all 0.3s ease;
}

.header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.left-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-link {
  white-space: nowrap;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 1.8rem;
  font-weight: 700;
}

.logo-text {
  color: #e0e0e0;
}

.logo-accent {
  background: linear-gradient(90deg, #8A2BE2, #00FFFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-left: 0.2rem;
}

.nav-center {
  justify-self: center;
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  color: #e0e0e0;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.05rem;
  position: relative;
  padding: 0.5rem 0;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.nav-link i {
  font-size: 0.9rem;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0%;
  height: 2px;
  background: linear-gradient(90deg, #8A2BE2, #00FFFF);
  transition: width 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
  color: #fff;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

.header-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1.5rem;
}


.social-icons {
  display: flex;
  gap: 1rem;
}

.social-icon {
  color: #e0e0e0;
  font-size: 1.2rem;
  /* 移除过渡效果，使用GSAP代替 */
}

.auth-area {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e0e0e0;
}

.auth-area.logged-in {
  flex-direction: row;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.login-btn,
.logout-btn {
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.login-btn {
  background: transparent;
  border: 1px solid #8A2BE2;
  color: #e0e0e0;
}

.logout-btn {
  background: #e63946;
  border: 1px solid #e63946;
  color: #fff;
}

.username {
  font-weight: bold;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.menu-toggle span {
  height: 3px;
  width: 100%;
  background: #e0e0e0;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.mobile-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(18, 18, 18, 0.95);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s ease, visibility 0.5s ease;
}

.mobile-nav.active {
  opacity: 1;
  visibility: visible;
}

.mobile-nav-links {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  text-align: center;
}

.mobile-nav-links li {
  margin-bottom: 2rem;
  /* 为GSAP动画初始设置隐藏状态 */
  opacity: 0;
  transform: translateY(20px);
}

.mobile-nav-links a {
  color: #e0e0e0;
  font-size: 1.8rem;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
}

.mobile-nav-links a:hover {
  color: #8A2BE2;
}

.mobile-social-icons {
  display: flex;
  gap: 1.5rem;
}

.mobile-social-icons .social-icon {
  font-size: 1.8rem;
}

@media (max-width: 1024px) {
  .header .container {
    justify-content: space-between;
  }
  
  .nav-center {
    display: none;
  }
  
  .menu-toggle {
    display: flex;
  }
  
  .social-icons {
    display: none;
  }
}
</style> 