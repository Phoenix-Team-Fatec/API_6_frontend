<template>
  <div class="app-root">
    <!-- Auth routes: film-strip wrapper that slides as one unit -->
    <template v-if="isAuthRoute">
      <div class="strip-track" :class="stripClass">
        <div class="strip-panel">
          <LoginView />
        </div>
        <div class="strip-panel">
          <RegisterView />
        </div>
      </div>
    </template>

    <!-- All other routes: normal render -->
    <template v-else>
      <RouterView />
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import LoginView from './views/auth/LoginView.vue'
import RegisterView from './views/auth/RegisterView.vue'

const route = useRoute()

const isAuthRoute = computed(() => route.path === '/login' || route.path === '/register')
const stripClass  = computed(() => route.path === '/register' ? 'strip-at-register' : 'strip-at-login')
</script>

<style>
html, body { margin: 0; padding: 0; background: #111827; overflow: hidden; }

.app-root { min-height: 100vh; background: #111827; overflow: hidden; }

/* The track holds both panels side by side and slides left/right */
.strip-track {
  display: flex;
  width: 200vw;
  height: 100vh;
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.strip-at-login    { transform: translateX(0); }
.strip-at-register { transform: translateX(-50%); }

.strip-panel {
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
  overflow-y: auto;
}
</style>
