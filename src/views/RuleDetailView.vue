<template>
  <div class="w-full space-y-6">
    <!-- Header -->
    <div class="section-header">
      <div class="flex items-center gap-4">
        <RouterLink to="/rules" class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </RouterLink>
        <div>
          <h1 class="page-title">Detalhe da Regra</h1>
          <p class="page-subtitle">Visualize os dados estruturados e a explicação da IA</p>
        </div>
      </div>

      <!-- Tab toggle -->
      <div v-if="store.currentRule" class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
            activeTab === tab.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          ]"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="py-16 flex flex-col items-center justify-center gap-3">
      <div class="relative w-10 h-10">
        <div class="w-10 h-10 rounded-full border-4 border-slate-100"></div>
        <div class="absolute top-0 left-0 w-10 h-10 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
      </div>
      <p class="text-sm text-slate-400">Carregando regra...</p>
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="card p-12 text-center">
      <p class="text-red-500 mb-4">{{ store.error }}</p>
      <RouterLink to="/rules">
        <button class="btn-secondary">Voltar para lista</button>
      </RouterLink>
    </div>

    <!-- Content -->
    <template v-else-if="store.currentRule">

      <!-- Visualização tab: two-column layout -->
      <div v-if="activeTab === 'text'" class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Left: 2/3 -->
        <div class="xl:col-span-2 space-y-5">
          <!-- Original text -->
          <div class="card p-6">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-1 h-4 bg-amber-400 rounded-full"></div>
              <h3 class="text-sm font-semibold text-slate-700 uppercase tracking-wide">Texto Original</h3>
            </div>
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p class="text-sm text-amber-900 leading-relaxed">{{ store.currentRule.texto_original }}</p>
            </div>
          </div>

          <!-- Structured data -->
          <div class="card p-6">
            <div class="flex items-center gap-2 mb-5">
              <div class="w-1 h-4 bg-emerald-400 rounded-full"></div>
              <h3 class="text-sm font-semibold text-slate-700 uppercase tracking-wide">Dados Estruturados</h3>
            </div>
            <div class="grid grid-cols-2 gap-5">
              <div v-for="field in fields" :key="field.key" class="space-y-1">
                <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{{ field.label }}</p>
                <p class="text-base font-semibold text-slate-800">
                  {{ field.format ? field.format(store.currentRule[field.key]) : store.currentRule[field.key] }}
                </p>
              </div>
            </div>
          </div>

          <!-- Metadata bar -->
          <div class="flex items-center justify-between text-xs text-slate-400 px-1">
            <div class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              <span>ID: <span class="font-semibold text-slate-600">#{{ store.currentRule.id }}</span></span>
            </div>
            <div class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Criado em: <span class="font-semibold text-slate-600">{{ formatDateTime(store.currentRule.created_at) }}</span></span>
            </div>
          </div>
        </div>

        <!-- Right: 1/3 — AI explanation -->
        <div class="space-y-5">
          <div class="bg-gradient-to-br from-primary-50 to-indigo-50 border border-primary-100 rounded-2xl p-5 h-fit">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-7 h-7 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-primary-900">Como a IA interpretou</h4>
                <span class="text-[10px] text-primary-500 font-medium uppercase tracking-wide">Inteligência Artificial</span>
              </div>
            </div>
            <div class="text-sm text-primary-800 leading-relaxed" v-html="formattedExplanation" />
          </div>

          <!-- Quick stats -->
          <div class="card p-5 space-y-3">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest">Resumo</h4>
            <div v-for="field in fields" :key="field.key" class="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <span class="text-xs text-slate-400 font-medium">{{ field.label }}</span>
              <span class="text-xs font-semibold text-slate-700">
                {{ field.format ? field.format(store.currentRule[field.key]) : store.currentRule[field.key] || '—' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- JSON tab: full width -->
      <div v-if="activeTab === 'json'" class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div class="xl:col-span-2">
          <div class="card p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div class="w-1 h-4 bg-emerald-400 rounded-full"></div>
                <h3 class="text-sm font-semibold text-slate-700 uppercase tracking-wide">Dados em JSON</h3>
              </div>
              <button
                class="btn-ghost btn-sm flex items-center gap-1.5"
                @click="copyJson"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {{ copied ? 'Copiado!' : 'Copiar JSON' }}
              </button>
            </div>
            <div class="bg-slate-900 rounded-xl p-5 overflow-x-auto">
              <pre class="text-sm text-emerald-400 font-mono leading-relaxed">{{ formattedJson }}</pre>
            </div>
          </div>
        </div>
        <div class="card p-5 h-fit space-y-3">
          <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest">Campos</h4>
          <div v-for="[k, v] in Object.entries(store.currentRule)" :key="k" class="space-y-0.5">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ k }}</p>
            <p class="text-xs font-medium text-slate-700 truncate">{{ v }}</p>
          </div>
        </div>
      </div>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRuleStore } from '../stores/ruleStore'

const route = useRoute()
const store = useRuleStore()
const activeTab = ref('text')
const copied = ref(false)

const tabs = [
  { key: 'text', label: 'Visualização' },
  { key: 'json', label: 'JSON' },
]

const fields = [
  { key: 'marca', label: 'Marca' },
  { key: 'cargo', label: 'Cargo' },
  { key: 'comissao', label: 'Comissão', format: (v) => `${v}%` },
  { key: 'data', label: 'Data', format: (v) => {
    if (!v) return '—'
    const [y, m] = v.split('-')
    const months = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    return `${months[parseInt(m)]} de ${y}`
  }},
]

const formattedJson = computed(() => {
  if (!store.currentRule) return ''
  return JSON.stringify(store.currentRule, null, 2)
})

const formattedExplanation = computed(() => {
  return (store.currentRule?.explicacao || '')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />')
})

const copyJson = async () => {
  await navigator.clipboard.writeText(formattedJson.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

const formatDateTime = (dt) => {
  if (!dt) return '—'
  return new Date(dt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(() => store.fetchRuleById(route.params.id))
</script>
