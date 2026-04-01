<template>
  <header class="h-14 bg-white border-b border-slate-200/80 flex items-center px-6 gap-4 flex-shrink-0 shadow-sm">
    <!-- Mobile toggle -->
    <button @click="$emit('toggle-sidebar')" class="btn-icon text-slate-500 hover:text-slate-800 lg:hidden">
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm min-w-0 flex-1">
      <span class="text-slate-400">RuleAI</span>
      <svg class="w-3.5 h-3.5 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
      <span class="font-semibold text-slate-800 truncate">{{ pageTitle }}</span>
    </div>

    <!-- Right actions -->
    <div class="flex items-center gap-2">
      <!-- Search -->
      <div class="hidden md:flex items-center bg-slate-100 rounded-xl px-3 py-1.5 gap-2 w-48 focus-within:ring-2 focus-within:ring-primary-500/30 focus-within:bg-white transition-all">
        <svg class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
        </svg>
        <input type="text" placeholder="Buscar..." class="bg-transparent text-xs text-slate-600 placeholder-slate-400 focus:outline-none w-full" />
      </div>


      <!-- User avatar -->
      <div class="flex items-center gap-2 pl-2 border-l border-slate-200">
        <div class="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center text-[10px] font-bold text-white">
          {{ authStore.userInitials }}
        </div>
        <div class="hidden md:block">
          <p class="text-xs font-semibold text-slate-800 leading-none">{{ authStore.userName }}</p>
          <p class="text-[10px] text-slate-400 mt-0.5">{{ authStore.user?.role }}</p>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

defineEmits(['toggle-sidebar'])

const route = useRoute()
const authStore = useAuthStore()

const pageTitle = computed(() => {
  const titles = { RulesList: 'Regras de Negócio', CreateRule: 'Nova Regra', ConfirmRule: 'Confirmar Regra', RuleDetail: 'Detalhe da Regra' }
  return titles[route.name] || 'Dashboard'
})
</script>
