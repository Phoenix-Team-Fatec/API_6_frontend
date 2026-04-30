<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-slate-900">Comissão</h1>
      <p class="text-slate-600 mt-2">Gerenciamento de comissões</p>
    </div>

    <!-- Search Filter -->
    <div class="flex gap-2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar marca, funcionário ou loja..."
        class="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors"
      />
      <button
        @click="clearSearch"
        v-if="searchQuery"
        class="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors font-medium"
      >
        Limpar
      </button>
    </div>

    <!-- Tab Buttons -->
    <div class="flex justify-center gap-4">
      <button
        @click="activeTab = 'brands'"
        :class="[
          'px-6 py-3 rounded-lg font-semibold transition-all duration-200',
          activeTab === 'brands'
            ? 'bg-indigo-600 text-white shadow-lg'
            : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
        ]"
      >
        Marcas
      </button>
      <button
        @click="activeTab = 'stores'"
        :class="[
          'px-6 py-3 rounded-lg font-semibold transition-all duration-200',
          activeTab === 'stores'
            ? 'bg-indigo-600 text-white shadow-lg'
            : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
        ]"
      >
        Lojas
      </button>
      <button
        @click="activeTab = 'employees'"
        :class="[
          'px-6 py-3 rounded-lg font-semibold transition-all duration-200',
          activeTab === 'employees'
            ? 'bg-indigo-600 text-white shadow-lg'
            : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
        ]"
      >
        Funcionários
      </button>
    </div>

    <!-- List Content -->
    <BaseCard class="p-6">
      <!-- Brands List -->
      <div v-if="activeTab === 'brands'" class="space-y-3">
        <h2 class="text-lg font-semibold text-slate-900 mb-4">Marcas</h2>
        <div v-if="filteredBrands.length > 0" class="space-y-2">
          <div
            v-for="brand in filteredBrands"
            :key="brand.id"
            class="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors"
          >
            <div class="flex-1">
              <p class="font-medium text-slate-900">{{ brand.name }}</p>
              <p class="text-sm text-slate-500">ID: {{ brand.id }}</p>
            </div>
            <div class="flex gap-2">
              <button
                @click="viewDetails('brand', brand)"
                class="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors font-medium text-sm"
              >
                Ver mais
              </button>
              <button
                @click="calculateCommission('brand', brand)"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
              >
                Calcular comissão
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-slate-500">
          Nenhuma marca disponível
        </div>
      </div>

      <!-- Stores List -->
      <div v-if="activeTab === 'stores'" class="space-y-3">
        <h2 class="text-lg font-semibold text-slate-900 mb-4">Lojas</h2>
        <div v-if="filteredStores.length > 0" class="space-y-2">
          <div
            v-for="store in filteredStores"
            :key="store.id"
            class="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors"
          >
            <div class="flex-1">
              <p class="font-medium text-slate-900">{{ store.name }}</p>
              <p class="text-sm text-slate-500">ID: {{ store.id }}</p>
            </div>
            <div class="flex gap-2">
              <button
                @click="viewDetails('store', store)"
                class="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors font-medium text-sm"
              >
                Ver mais
              </button>
              <button
                @click="calculateCommission('store', store)"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
              >
                Calcular comissão
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-slate-500">
          Nenhuma loja disponível
        </div>
      </div>

      <!-- Employees List -->
      <div v-if="activeTab === 'employees'" class="space-y-3">
        <h2 class="text-lg font-semibold text-slate-900 mb-4">Funcionários</h2>
        <div v-if="filteredEmployees.length > 0" class="space-y-2">
          <div
            v-for="employee in filteredEmployees"
            :key="employee.id"
            class="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors"
          >
            <div class="flex-1">
              <p class="font-medium text-slate-900">{{ employee.name }}</p>
              <p class="text-sm text-slate-500">ID: {{ employee.id }}</p>
            </div>
            <div class="flex gap-2">
              <button
                @click="viewDetails('employee', employee)"
                class="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors font-medium text-sm"
              >
                Ver mais
              </button>
              <button
                @click="calculateCommission('employee', employee)"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
              >
                Calcular comissão
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-slate-500">
          Nenhum funcionário disponível
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseCard from '../components/common/BaseCard.vue'

const router = useRouter()
const activeTab = ref('brands')
const searchQuery = ref('')

// Mock data - substituir com dados reais da API
const brands = ref([
  { id: 1, name: 'Marca A' },
  { id: 2, name: 'Marca B' },
  { id: 3, name: 'Marca C' },
])

const stores = ref([
  { id: 1, name: 'Loja Centro' },
  { id: 2, name: 'Loja Shopping' },
  { id: 3, name: 'Loja Aeroporto' },
])

const employees = ref([
  { id: 1, name: 'João Silva' },
  { id: 2, name: 'Maria Santos' },
  { id: 3, name: 'Pedro Oliveira' },
])

// Filtered lists based on search query
const filteredBrands = computed(() => {
  if (!searchQuery.value.trim()) return brands.value
  return brands.value.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const filteredStores = computed(() => {
  if (!searchQuery.value.trim()) return stores.value
  return stores.value.filter(store =>
    store.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const filteredEmployees = computed(() => {
  if (!searchQuery.value.trim()) return employees.value
  return employees.value.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const clearSearch = () => {
  searchQuery.value = ''
}

const viewDetails = (type, item) => {
  router.push({
    name: 'CommissionDetails',
    query: {
      type: type,
      id: item.id,
      name: item.name
    }
  })
}

const calculateCommission = (type, item) => {
  router.push({
    name: 'CommissionCalculate',
    query: {
      type: type,
      id: item.id,
      name: item.name
    }
  })
}
</script>
