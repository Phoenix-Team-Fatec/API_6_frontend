<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <button
        @click="goBack"
        class="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        title="Voltar"
      >
        <svg class="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div>
        <h1 class="text-3xl font-bold text-slate-900">{{ itemName || itemTypeLabel }}</h1>
        <p class="text-slate-600 mt-2">Calculo de comissao - {{ itemTypeLabel }}</p>
      </div>
    </div>

    <BaseCard class="p-6">
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <span :class="['px-3 py-1 rounded-full text-sm font-semibold', typeBadgeClass]">
            {{ itemTypeLabel }}
          </span>
        </div>

        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Mes de referencia
              </label>
              <input
                v-model="referenceMonth"
                type="month"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div class="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p class="text-sm text-slate-600">Alvo</p>
              <p class="text-lg font-medium text-slate-900">{{ itemName || itemTypeLabel }}</p>
            </div>
          </div>

          <p v-if="errorMessage" class="text-sm text-red-600">
            {{ errorMessage }}
          </p>

          <div v-if="calculationDone" class="bg-indigo-50 border border-indigo-200 rounded-lg p-4 space-y-4">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h3 class="font-semibold text-indigo-900">Resultado do Calculo</h3>
                <p class="text-sm text-indigo-700">{{ resultSummary }}</p>
              </div>
              <p class="text-2xl font-bold text-indigo-900">
                {{ formatCurrency(result?.totalCommission || 0) }}
              </p>
            </div>

            <div v-if="resultItems.length > 0" class="overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead>
                  <tr class="text-left text-indigo-900 border-b border-indigo-200">
                    <th class="py-2 pr-4">Matricula</th>
                    <th class="py-2 pr-4">Base</th>
                    <th class="py-2 pr-4">%</th>
                    <th class="py-2 pr-4">Bonus</th>
                    <th class="py-2 pr-4">Final</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in resultItems" :key="item.matricula" class="border-b border-indigo-100 last:border-0">
                    <td class="py-2 pr-4 font-medium text-slate-900">{{ item.matricula }}</td>
                    <td class="py-2 pr-4 text-slate-700">{{ formatCurrency(item.salesBase) }}</td>
                    <td class="py-2 pr-4 text-slate-700">{{ formatPercent(item.commissionRate) }}</td>
                    <td class="py-2 pr-4 text-slate-700">{{ formatCurrency(item.totalBonuses) }}</td>
                    <td class="py-2 pr-4 font-semibold text-slate-900">{{ formatCurrency(item.finalCommission) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="flex gap-3 pt-4 border-t border-slate-200">
          <button
            @click="goBack"
            class="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors font-medium"
          >
            Voltar
          </button>
          <button
            @click="submitCalculation"
            :disabled="loading"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {{ loading ? 'Calculando...' : 'Calcular' }}
          </button>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BaseCard from '../components/common/BaseCard.vue'
import { commissionApi } from '../services/api'

const router = useRouter()
const route = useRoute()

const itemType = ref(route.query.type || '')
const itemName = ref(route.query.name || '')

const referenceMonth = ref(new Date().toISOString().substring(0, 7))
const calculationDone = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const result = ref(null)

const itemTypeLabel = computed(() => {
  const labels = {
    brand: 'Marca',
    store: 'Loja',
    employee: 'Funcionario',
  }
  return labels[itemType.value] || itemType.value
})

const typeBadgeClass = computed(() => {
  const classes = {
    brand: 'bg-blue-100 text-blue-800',
    store: 'bg-green-100 text-green-800',
    employee: 'bg-purple-100 text-purple-800',
  }
  return classes[itemType.value] || 'bg-slate-100 text-slate-800'
})

const resultItems = computed(() => Array.isArray(result.value?.items) ? result.value.items : [])

const resultSummary = computed(() => {
  if (!result.value) return ''
  return `${resultItems.value.length} item(ns) calculado(s) para ${result.value.month || referenceMonth.value}`
})

const formatCurrency = (value) => Number(value || 0).toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const formatPercent = (value) => `${(Number(value || 0) * 100).toFixed(2)}%`

const goBack = () => {
  router.push('/commission')
}

const submitCalculation = async () => {
  loading.value = true
  errorMessage.value = ''
  calculationDone.value = false

  try {
    const response = await commissionApi.calculate(itemType.value, referenceMonth.value, route.query)
    result.value = response.data
    calculationDone.value = true
  } catch (error) {
    result.value = null
    errorMessage.value = error?.response?.data || error?.message || 'Erro ao calcular comissao.'
  } finally {
    loading.value = false
  }
}
</script>
