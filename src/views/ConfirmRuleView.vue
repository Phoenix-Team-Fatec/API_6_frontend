<template>
  <div class="w-full space-y-6">
    <!-- Header -->
    <div class="section-header">
      <div class="flex items-center gap-4">
        <RouterLink to="/rules/new" class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </RouterLink>
        <div>
          <h1 class="page-title">Confirmar Regra</h1>
          <p class="page-subtitle">Revise os dados interpretados antes de salvar</p>
        </div>
      </div>

      <!-- Step indicator -->
      <div class="hidden md:flex items-center gap-2 text-sm">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
          <span class="text-slate-400 font-medium">Descrição</span>
        </div>
        <div class="w-16 h-px bg-primary-200"></div>
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
          <span class="font-semibold text-primary-700">Confirmação</span>
        </div>
        <div class="w-16 h-px bg-slate-200"></div>
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center text-xs font-bold">3</div>
          <span class="text-slate-400">Salvo</span>
        </div>
      </div>
    </div>

    <!-- No rule state -->
    <div v-if="!store.interpretedRule" class="card p-12 text-center">
      <div class="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <p class="text-slate-500 mb-4">Nenhuma regra para confirmar.</p>
      <RouterLink to="/rules/new">
        <button class="btn-primary">Criar Nova Regra</button>
      </RouterLink>
    </div>

    <!-- Two-column layout -->
    <div v-else class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Left column: 2/3 width -->
      <div class="xl:col-span-2 space-y-5">
        <!-- Original text -->
        <div class="card p-6">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-1 h-4 bg-slate-300 rounded-full"></div>
            <h3 class="text-sm font-semibold text-slate-700 uppercase tracking-wide">Texto Original</h3>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p class="text-sm text-slate-700 leading-relaxed">{{ store.currentRuleText }}</p>
          </div>
        </div>

        <!-- Structured fields -->
        <div class="card p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-1 h-4 bg-primary-400 rounded-full"></div>
              <h3 class="text-sm font-semibold text-slate-700 uppercase tracking-wide">Dados Estruturados</h3>
            </div>
            <span class="flex items-center gap-1.5 text-xs text-primary-600 bg-primary-50 border border-primary-100 px-2.5 py-1 rounded-full font-medium">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Inferido pela IA
            </span>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div v-for="field in structuredFields" :key="field.key" class="space-y-1.5">
              <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">{{ field.label }}</label>
              <div class="relative">
                <input
                  v-model="editedRule[field.key]"
                  :type="field.type || 'text'"
                  class="input-field pr-9"
                  :class="{ 'border-primary-300 bg-primary-50/50 focus:ring-primary-500/30 focus:border-primary-400': isAIInferred(field.key) }"
                />
                <div v-if="isAIInferred(field.key)" class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg class="w-3.5 h-3.5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <p class="mt-4 text-xs text-primary-500 flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Campos marcados com <svg class="w-3 h-3 inline text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> foram inferidos pela IA. Você pode editá-los antes de salvar.
          </p>
        </div>

        <!-- Error -->
        <div v-if="store.error" class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-red-700">
          <svg class="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ store.error }}
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <RouterLink to="/rules/new" class="flex-1">
            <button class="btn-secondary w-full">
              <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar Texto
            </button>
          </RouterLink>
          <button
            :disabled="store.loading"
            class="btn-primary flex-1"
            @click="approve"
          >
            <svg v-if="store.loading" class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <svg v-else class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ store.loading ? 'Salvando...' : 'Aprovar e Salvar' }}
          </button>
        </div>
      </div>

      <!-- Right column: 1/3 width -->
      <div class="space-y-5">
        <!-- AI Explanation -->
        <div class="bg-gradient-to-br from-primary-50 to-indigo-50 border border-primary-100 rounded-2xl p-5">
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

        <!-- Summary card -->
        <div class="card p-5 space-y-3">
          <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest">Resumo da Regra</h4>
          <div v-for="field in structuredFields" :key="field.key" class="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
            <span class="text-xs text-slate-400 font-medium">{{ field.label }}</span>
            <span class="text-xs font-semibold text-slate-700">
              {{ editedRule[field.key] || '—' }}{{ field.key === 'comissao' ? '%' : '' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRuleStore } from '../stores/ruleStore'

const router = useRouter()
const store = useRuleStore()

const editedRule = ref({ ...store.interpretedRule })

watch(() => store.interpretedRule, (val) => {
  if (val) editedRule.value = { ...val }
}, { immediate: true })

const structuredFields = [
  { key: 'marca', label: 'Marca' },
  { key: 'cargo', label: 'Cargo' },
  { key: 'comissao', label: 'Comissão (%)', type: 'number' },
  { key: 'data', label: 'Data (AAAA-MM)' },
]

const isAIInferred = (key) => ['marca', 'cargo', 'comissao', 'data'].includes(key)

const formattedExplanation = computed(() => {
  return (store.explanation || '')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />')
})

const approve = async () => {
  try {
    const saved = await store.saveRule(editedRule.value)
    router.push(`/rules/${saved.id}`)
  } catch {}
}
</script>
