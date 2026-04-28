<template>
  <div class="space-y-6">
    <!-- Header with back button -->
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
        <h1 class="text-3xl font-bold text-slate-900">{{ itemName }}</h1>
        <p class="text-slate-600 mt-2 capitalize">Calculando Comissão - {{ itemType }}</p>
      </div>
    </div>

    <!-- Calculation Content -->
    <BaseCard class="p-6">
      <div class="space-y-6">
        <!-- Item Type Badge -->
        <div class="flex items-center gap-3">
          <span :class="['px-3 py-1 rounded-full text-sm font-semibold', typeBadgeClass]">
            {{ itemTypeLabel }}
          </span>
        </div>

        <!-- Calculation Form -->
        <div class="space-y-6">
          <!-- Period Selection -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Data Inicial
              </label>
              <input
                v-model="startDate"
                type="date"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Data Final
              </label>
              <input
                v-model="endDate"
                type="date"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <!-- Calculation Results (after submit) -->
          <div v-if="calculationDone" class="bg-indigo-50 border border-indigo-200 rounded-lg p-4 space-y-3">
            <h3 class="font-semibold text-indigo-900">Resultado do Cálculo</h3>
            
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-4 border-t border-slate-200">
          <button
            @click="goBack"
            class="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors font-medium"
          >
            Voltar
          </button>
          <button
            @click="submitCalculation"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Calcular
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

const router = useRouter()
const route = useRoute()

const itemType = ref(route.query.type || '')
const itemId = ref(route.query.id || '')
const itemName = ref(route.query.name || '')

const startDate = ref('')
const endDate = ref('')
const commissionType = ref('percentage')
const commissionValue = ref(0)
const calculationDone = ref(false)
const totalCommission = ref(0)

const itemTypeLabel = computed(() => {
  const labels = {
    brand: 'Marca',
    store: 'Loja',
    employee: 'Funcionário'
  }
  return labels[itemType.value] || itemType.value
})

const typeBadgeClass = computed(() => {
  const classes = {
    brand: 'bg-blue-100 text-blue-800',
    store: 'bg-green-100 text-green-800',
    employee: 'bg-purple-100 text-purple-800'
  }
  return classes[itemType.value] || 'bg-slate-100 text-slate-800'
})

const goBack = () => {
  router.push('/commission')
}

const submitCalculation = () => {
  // Simular cálculo
  // Em produção, isso chamaria uma API
  totalCommission.value = commissionType.value === 'percentage'
    ? (1000 * commissionValue.value) / 100 // Exemplo: 1000 de base
    : commissionValue.value
  
  calculationDone.value = true
}
</script>
