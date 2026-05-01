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
        <h1 class="text-3xl font-bold text-slate-900">{{ itemName }}</h1>
        <p class="text-slate-600 mt-2">Informacoes - {{ itemTypeLabel }}</p>
      </div>
    </div>

    <BaseCard class="p-6">
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <span :class="['px-3 py-1 rounded-full text-sm font-semibold', typeBadgeClass]">
            {{ itemTypeLabel }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="detail in detailRows"
            :key="detail.label"
            class="p-4 bg-slate-50 rounded-lg"
          >
            <p class="text-sm text-slate-600">{{ detail.label }}</p>
            <p class="text-lg font-medium text-slate-900">{{ detail.value }}</p>
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
            @click="calculateCommission"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Calcular Comissao
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

const queryValue = (key, fallback = '-') => {
  const value = route.query[key]
  return value === null || value === undefined || value === '' ? fallback : String(value)
}

const itemTypeLabel = computed(() => {
  const labels = {
    brand: 'Marca',
    store: 'Loja',
    employee: 'Funcionario'
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

const detailRows = computed(() => {
  if (itemType.value === 'employee') {
    return [
      { label: 'Cargo', value: queryValue('descriCargo') },
      { label: 'Loja', value: queryValue('descrLoja') },
      { label: 'Marca', value: queryValue('descrMarca') },
      { label: 'Matricula', value: queryValue('matricula') },
      { label: 'Codigo da Loja', value: queryValue('codLoja') },
      { label: 'Codigo do Cargo', value: queryValue('codCargo') },
    ]
  }

  return [
    { label: 'Nome', value: itemName.value || '-' },
    { label: 'Codigo', value: queryValue('codigo') },
    { label: 'Descricao', value: queryValue('descricao') },
    { label: 'Identificador', value: itemId.value || '-' },
  ]
})

const goBack = () => {
  router.push('/commission')
}

const calculateCommission = () => {
  router.push({
    name: 'CommissionCalculate',
    query: { ...route.query }
  })
}
</script>
