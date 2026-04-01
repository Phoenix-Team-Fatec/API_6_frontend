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
          <h1 class="page-title">Nova Regra de Negócio</h1>
          <p class="page-subtitle">Descreva a regra em linguagem natural e a IA irá interpretá-la</p>
        </div>
      </div>

      <!-- Step indicator -->
      <div class="hidden md:flex items-center gap-2 text-sm">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
          <span class="font-semibold text-primary-700">Descrição</span>
        </div>
        <div class="w-16 h-px bg-slate-200"></div>
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center text-xs font-bold">2</div>
          <span class="text-slate-400 font-medium">Confirmação</span>
        </div>
        <div class="w-16 h-px bg-slate-200"></div>
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center text-xs font-bold">3</div>
          <span class="text-slate-400 font-medium">Salvo</span>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Input card -->
      <BaseCard title="Descreva a Regra">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Texto da regra
              <span class="text-red-500 ml-0.5">*</span>
            </label>
            <textarea
              v-model="ruleText"
              rows="6"
              placeholder="Ex: Vendedores da marca Nike recebem 5% de comissão a partir de março de 2026..."
              class="input-field resize-none"
              @input="onTextChange"
            />
            <p class="text-xs text-gray-400 mt-1.5">{{ ruleText.length }} caracteres</p>
          </div>

          <!-- Error -->
          <div v-if="store.error" class="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
            <svg class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-red-700">{{ store.error }}</p>
          </div>

          <!-- Examples -->
          <div>
            <p class="text-xs font-medium text-gray-500 mb-2">Exemplos:</p>
            <div class="space-y-1.5">
              <button
                v-for="ex in examples"
                :key="ex"
                class="block w-full text-left text-xs text-primary-600 hover:text-primary-800 hover:bg-primary-50 px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-primary-100"
                @click="useExample(ex)"
              >
                "{{ ex }}"
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex space-x-3 pt-2">
            <BaseButton
              variant="primary"
              :loading="store.loading"
              :disabled="ruleText.trim().length < 10"
              class="flex-1"
              @click="interpret"
            >
              {{ store.loading ? 'Interpretando...' : 'Interpretar com IA' }}
            </BaseButton>
            <BaseButton
              v-if="ruleText"
              variant="ghost"
              @click="clearText"
            >
              Limpar
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      <!-- Preview card -->
      <BaseCard title="Pré-visualização">
        <template #header>
          <div class="flex items-center space-x-2">
            <span class="text-base font-semibold text-gray-900">Pré-visualização</span>
            <span
              v-if="store.loading"
              class="inline-flex items-center space-x-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full"
            >
              <svg class="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span>Interpretando</span>
            </span>
            <span
              v-else-if="store.interpretedRule"
              class="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full"
            >
              Interpretado
            </span>
          </div>
        </template>

        <RulePreview :rule="store.interpretedRule" :loading="store.loading" />

        <div v-if="store.interpretedRule" class="mt-4 pt-4 border-t border-gray-100 space-y-3">
          <AIExplanationBox :explanation="store.explanation" />
          <BaseButton variant="primary" class="w-full" @click="goToConfirm">
            Revisar e Confirmar
            <svg class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </BaseButton>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRuleStore } from '../stores/ruleStore'
import BaseCard from '../components/common/BaseCard.vue'
import BaseButton from '../components/common/BaseButton.vue'
import RulePreview from '../components/preview/RulePreview.vue'
import AIExplanationBox from '../components/ai/AIExplanationBox.vue'

const router = useRouter()
const store = useRuleStore()

const ruleText = ref(store.currentRuleText || '')

const examples = [
  'Vendedores da marca Nike recebem 5% de comissão a partir de março de 2026',
  'Gerentes da Adidas têm comissão de 8% a partir de janeiro de 2026',
  'Representantes da Puma recebem 6% de comissão desde fevereiro de 2026',
]

let debounceTimer = null
const onTextChange = () => {
  clearTimeout(debounceTimer)
  if (ruleText.value.trim().length >= 20) {
    debounceTimer = setTimeout(() => interpret(), 2000)
  }
}

const interpret = async () => {
  if (ruleText.value.trim().length < 10) return
  await store.interpretRule(ruleText.value)
}

const useExample = (ex) => {
  ruleText.value = ex
  interpret()
}

const clearText = () => {
  ruleText.value = ''
  store.resetInterpretation()
  clearTimeout(debounceTimer)
}

const goToConfirm = () => {
  router.push('/rules/confirm')
}
</script>
