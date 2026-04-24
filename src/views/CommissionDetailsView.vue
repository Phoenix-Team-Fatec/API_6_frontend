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
        <p class="text-slate-600 mt-2 capitalize">Informações - {{ itemType }}</p>
      </div>
    </div>

    <!-- Details Content -->
    <BaseCard class="p-6">
      <div class="space-y-6">
        <!-- Item Type Badge -->
        <div class="flex items-center gap-3">
          <span :class="['px-3 py-1 rounded-full text-sm font-semibold', typeBadgeClass]">
            {{ itemTypeLabel }}
          </span>
        </div>

        <!-- Info Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Basic Info -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold text-slate-900">Informações Básicas</h2>
            <div class="space-y-3">
              <div class="p-4 bg-slate-50 rounded-lg">
                <p class="text-sm text-slate-600">Nome</p>
                <p class="text-lg font-medium text-slate-900">{{ itemName }}</p>
              </div>
              <div class="p-4 bg-slate-50 rounded-lg">
                <p class="text-sm text-slate-600">ID</p>
                <p class="text-lg font-medium text-slate-900">{{ itemId }}</p>
              </div>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold text-slate-900">Dados Adicionais</h2>
            <div class="space-y-3">
              <div class="p-4 bg-slate-50 rounded-lg">
                <p class="text-sm text-slate-600">Tipo</p>
                <p class="text-lg font-medium text-slate-900 capitalize">{{ itemType }}</p>
              </div>
              <div class="p-4 bg-slate-50 rounded-lg">
                <p class="text-sm text-slate-600">Status</p>
                <p class="text-lg font-medium text-green-600">Ativo</p>
              </div>
            </div>
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
            @click="calculateCommission"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Calcular Comissão
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

const calculateCommission = () => {
  router.push({
    name: 'CommissionCalculate',
    query: {
      type: itemType.value,
      id: itemId.value,
      name: itemName.value
    }
  })
}
</script>
