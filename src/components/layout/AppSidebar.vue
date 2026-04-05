<template>
  <aside
    :class="[
      'sidebar-shell flex flex-col flex-shrink-0 relative z-30 select-none',
      collapsed ? 'w-[72px]' : 'w-[272px]'
    ]"
  >
    <!-- Ambient glow -->
    <div class="sidebar-ambient" />

    <!-- Logo -->
    <div class="sidebar-logo-area">
      <div class="sidebar-logo-icon">
        <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <!-- Active pulse ring -->
        <span class="sidebar-logo-pulse" />
      </div>
      <Transition name="label-fade">
        <div v-if="!collapsed" class="min-w-0">
          <p class="text-sm font-bold text-white tracking-tight leading-none">RuleAI</p>
          <p class="text-[10px] text-indigo-300/60 mt-0.5 font-medium tracking-wide uppercase">Gestão Inteligente</p>
        </div>
      </Transition>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-2.5 py-4 overflow-y-auto overflow-x-hidden space-y-5">

      <!-- Section: Principal -->
      <div>
        <Transition name="section-label">
          <p v-if="!collapsed" class="sidebar-section-label">Principal</p>
        </Transition>
        <div class="space-y-0.5">
          <button
            v-for="item in mainNav"
            :key="item.to"
            class="nav-item-btn"
            :class="{ 'nav-item-active': isItemActive(item) }"
            :title="collapsed ? item.label : undefined"
            @click="navigate(item)"
            @mouseenter="hoveredItem = item.to"
            @mouseleave="hoveredItem = null"
          >
            <!-- Active indicator bar -->
            <span v-if="isItemActive(item)" class="nav-active-bar" />

            <!-- Icon wrapper -->
            <div
              class="nav-icon-wrap"
              :class="isItemActive(item) ? 'nav-icon-active' : 'nav-icon-inactive'"
            >
              <component :is="item.icon" class="w-4.5 h-4.5" />
            </div>

            <Transition name="label-fade">
              <div v-if="!collapsed" class="flex items-center gap-2 min-w-0 flex-1">
                <span class="nav-item-label truncate">{{ item.label }}</span>
                <span v-if="item.badge" class="ml-auto nav-badge">{{ item.badge }}</span>
              </div>
            </Transition>
          </button>
        </div>
      </div>

      <!-- Separator -->
      <div class="sidebar-sep" />

      <!-- Section: Ferramentas -->
      <div>
        <Transition name="section-label">
          <p v-if="!collapsed" class="sidebar-section-label">Ferramentas</p>
        </Transition>
        <div class="space-y-0.5">
          <button
            v-for="item in toolsNav"
            :key="item.label"
            class="nav-item-btn nav-item-dimmed"
            :title="collapsed ? item.label : undefined"
          >
            <div class="nav-icon-wrap nav-icon-inactive">
              <component :is="item.icon" class="w-4.5 h-4.5" />
            </div>
            <Transition name="label-fade">
              <div v-if="!collapsed" class="flex items-center gap-2 min-w-0 flex-1">
                <span class="nav-item-label truncate">{{ item.label }}</span>
                <span class="nav-soon-badge">Em breve</span>
              </div>
            </Transition>
          </button>
        </div>
      </div>
    </nav>

    <!-- User footer -->
    <div class="sidebar-footer">
      <div
        class="user-card"
        :class="collapsed ? 'justify-center' : ''"
        @click="!collapsed && logout()"
      >
        <!-- Avatar with online dot -->
        <div class="user-avatar-wrap">
          <div class="user-avatar">{{ authStore.userInitials }}</div>
          <span class="user-online-dot" />
        </div>

        <Transition name="label-fade">
          <div v-if="!collapsed" class="min-w-0 flex-1">
            <p class="text-xs font-semibold text-white/90 truncate leading-tight">{{ authStore.userName }}</p>
            <p class="text-[10px] text-slate-500 truncate mt-0.5">{{ authStore.userEmail }}</p>
          </div>
        </Transition>

        <Transition name="label-fade">
          <button
            v-if="!collapsed"
            class="logout-btn"
            title="Sair"
            @click.stop="logout"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </Transition>
      </div>
    </div>

    <!-- Collapse toggle -->
    <button
      class="collapse-btn"
      :title="collapsed ? 'Expandir' : 'Recolher'"
      @click="$emit('toggle')"
    >
      <svg
        :class="['w-3 h-3 transition-transform duration-500 ease-in-out', collapsed ? 'rotate-0' : 'rotate-180']"
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { h } from 'vue'

defineProps({ collapsed: Boolean })
defineEmits(['toggle'])

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const hoveredItem = ref(null)

const isItemActive = (item) => {
  if (item.exact) return route.path === item.to
  return route.path === item.to || (item.to !== '/rules' && route.path.startsWith(item.to))
}

const navigate = (item) => router.push(item.to)

// Icons
const IconRules = {
  render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.8', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' }),
  ]),
}
const IconPlus = {
  render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.8', d: 'M12 4v16m8-8H4' }),
  ]),
}
const IconChart = {
  render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.8', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }),
  ]),
}
const IconAI = {
  render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.8', d: 'M13 10V3L4 14h7v7l9-11h-7z' }),
  ]),
}

const mainNav = [
  { to: '/rules', label: 'Regras', icon: IconRules, exact: true },
  { to: '/rules/new', label: 'Nova Regra', icon: IconPlus, exact: true },
]

const toolsNav = [
  { label: 'Análises', icon: IconChart },
  { label: 'IA Insights', icon: IconAI },
]

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* ── Shell ─────────────────────────────────────── */
.sidebar-shell {
  background: linear-gradient(165deg, #0d1117 0%, #111827 50%, #0f0c29 100%);
  border-right: 1px solid rgba(255,255,255,0.04);
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Ambient glow blob behind nav */
.sidebar-ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse 60% 30% at 50% 20%, rgba(99,102,241,0.08) 0%, transparent 70%);
  z-index: 0;
}

/* ── Logo area ─────────────────────────────────── */
.sidebar-logo-area {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px 18px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.sidebar-logo-icon {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 0 0 1px rgba(99,102,241,0.4), 0 4px 16px rgba(99,102,241,0.3);
}

.sidebar-logo-pulse {
  position: absolute;
  inset: -3px;
  border-radius: 15px;
  border: 1.5px solid rgba(99,102,241,0.3);
  animation: logo-pulse 3s ease-in-out infinite;
}

@keyframes logo-pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.1; transform: scale(1.06); }
}

/* ── Nav ───────────────────────────────────────── */
nav {
  position: relative;
  z-index: 1;
  scrollbar-width: none;
}
nav::-webkit-scrollbar { display: none; }

.sidebar-section-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(148,163,184,0.35);
  padding: 0 10px;
  margin-bottom: 4px;
}

.sidebar-sep {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
  margin: 0 8px;
}

/* ── Nav item ──────────────────────────────────── */
.nav-item-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 10px;
  border-radius: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;
  overflow: hidden;
}

.nav-item-btn:hover:not(.nav-item-active) {
  background: rgba(255,255,255,0.05);
}

.nav-item-btn:active {
  transform: scale(0.97);
}

.nav-item-btn.nav-item-dimmed {
  opacity: 0.4;
  cursor: not-allowed;
}

.nav-item-btn.nav-item-active {
  background: linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.12) 100%);
  border: 1px solid rgba(99,102,241,0.25);
}

/* Left accent bar on active */
.nav-active-bar {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 18px;
  border-radius: 0 4px 4px 0;
  background: linear-gradient(180deg, #818cf8, #a78bfa);
  box-shadow: 0 0 8px rgba(129,140,248,0.6);
}

/* Icon wrapper */
.nav-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
}

.nav-icon-inactive {
  background: rgba(255, 255, 255, 0);
  color: rgba(148,163,184,0.7);
}

.nav-item-btn:hover .nav-icon-inactive {
  color: rgba(255,255,255,0.8);
  transform: scale(1.05);
}

.nav-icon-active {
  color: #a5b4fc;
}

/* Label */
.nav-item-label {
  font-size: 13px;
  font-weight: 500;
  color: rgba(148,163,184,0.8);
  transition: color 0.2s ease;
  line-height: 1;
}

.nav-item-active .nav-item-label {
  color: rgba(255,255,255,0.95);
  font-weight: 600;
}

.nav-item-btn:hover:not(.nav-item-active) .nav-item-label {
  color: rgba(255,255,255,0.9);
}

/* Badge */
.nav-badge {
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 20px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  letter-spacing: 0.02em;
  box-shadow: 0 0 8px rgba(99,102,241,0.4);
}

.nav-soon-badge {
  font-size: 9px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 20px;
  background: rgba(255,255,255,0.06);
  color: rgba(148,163,184,0.5);
  letter-spacing: 0.02em;
}

/* ── Footer ─────────────────────────────────────── */
.sidebar-footer {
  position: relative;
  z-index: 1;
  padding: 10px;
  border-top: 1px solid rgba(255,255,255,0.05);
}

/* Subtle glow above footer */
.sidebar-footer::before {
  content: '';
  position: absolute;
  top: -24px;
  left: 0;
  right: 0;
  height: 24px;
  background: linear-gradient(to top, rgba(13,17,23,0.6), transparent);
  pointer-events: none;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.user-card:hover {
  background: rgba(255,255,255,0.06);
}

.user-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.03em;
  box-shadow: 0 0 0 1.5px rgba(99,102,241,0.4);
}

.user-online-dot {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #34d399;
  border: 1.5px solid #0d1117;
  box-shadow: 0 0 6px rgba(52,211,153,0.5);
}

.logout-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(148,163,184,0.4);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
  flex-shrink: 0;
}

.logout-btn:hover {
  background: rgba(239,68,68,0.12);
  color: #f87171;
}

/* ── Collapse button ───────────────────────────── */
.collapse-btn {
  position: absolute;
  right: -13px;
  top: 24px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.1);
  background: #1a1f2e;
  color: rgba(148,163,184,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  z-index: 50;
}

.collapse-btn:hover {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border-color: transparent;
  box-shadow: 0 0 12px rgba(99,102,241,0.5);
}

/* ── Vue Transitions ───────────────────────────── */
.label-fade-enter-active {
  transition: opacity 0.2s ease 0.1s, transform 0.2s ease 0.1s;
}
.label-fade-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}
.label-fade-enter-from {
  opacity: 0;
  transform: translateX(-6px);
}
.label-fade-leave-to {
  opacity: 0;
  transform: translateX(-4px);
}

.section-label-enter-active {
  transition: opacity 0.2s ease 0.12s;
}
.section-label-leave-active {
  transition: opacity 0.08s ease;
}
.section-label-enter-from,
.section-label-leave-to {
  opacity: 0;
}
</style>
