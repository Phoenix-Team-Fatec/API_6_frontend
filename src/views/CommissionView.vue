<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-slate-900">Comissao</h1>
      <p class="text-slate-600 mt-2">Gerenciamento de comissoes</p>
    </div>

    <div class="flex gap-2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar marca, funcionario ou loja..."
        class="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors"
      />
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors font-medium"
      >
        Limpar
      </button>
    </div>

    <div class="flex justify-center gap-4">
      <button
        @click="activeTab = 'brands'"
        :class="tabClass('brands')"
      >
        Marcas
      </button>
      <button
        @click="activeTab = 'stores'"
        :class="tabClass('stores')"
      >
        Lojas
      </button>
      <button
        @click="activeTab = 'employees'"
        :class="tabClass('employees')"
      >
        Funcionarios
      </button>
    </div>

    <BaseCard class="p-6">
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
              <p class="text-sm text-slate-500">{{ brand.description }}</p>
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
                Calcular comissao
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-slate-500">
          {{ loading ? 'Carregando marcas...' : 'Nenhuma marca disponivel' }}
        </div>
      </div>

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
              <p class="text-sm text-slate-500">{{ store.description }}</p>
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
                Calcular comissao
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-slate-500">
          {{ loading ? 'Carregando lojas...' : 'Nenhuma loja disponivel' }}
        </div>
      </div>

      <div v-if="activeTab === 'employees'" class="space-y-3">
        <h2 class="text-lg font-semibold text-slate-900 mb-4">Funcionarios</h2>
        <div v-if="filteredEmployees.length > 0" class="space-y-2">
          <div
            v-for="employee in filteredEmployees"
            :key="employee.id"
            class="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors"
          >
            <div class="flex-1">
              <p class="font-medium text-slate-900">{{ employee.name }}</p>
              <p class="text-sm text-slate-500">{{ employee.description }}</p>
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
                Calcular comissao
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-slate-500">
          {{ loading ? 'Carregando funcionarios...' : 'Nenhum funcionario disponivel' }}
        </div>
      </div>
    </BaseCard>

    <p v-if="errorMessage" class="text-sm text-red-600">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseCard from '../components/common/BaseCard.vue'
import api from '../services/api'

const router = useRouter()
const activeTab = ref('brands')
const searchQuery = ref('')
const loading = ref(false)
const errorMessage = ref('')

const brands = ref([])
const stores = ref([])
const employees = ref([])

const tabClass = (tab) => [
  'px-6 py-3 rounded-lg font-semibold transition-all duration-200',
  activeTab.value === tab
    ? 'bg-indigo-600 text-white shadow-lg'
    : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
]

const extractList = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

const formatCode = (value) => value === null || value === undefined || value === '' ? '-' : value

const mapBrand = (brand) => ({
  ...brand,
  id: brand.id ?? brand.codigo,
  codigo: brand.codigo,
  name: brand.nome || `Marca ${formatCode(brand.codigo)}`,
  description: brand.descricao || `Codigo: ${formatCode(brand.codigo)}`,
})

const mapStore = (store) => ({
  ...store,
  id: store.id ?? store.codigo,
  codigo: store.codigo,
  name: store.nome || `Loja ${formatCode(store.codigo)}`,
  description: store.descricao || `Codigo: ${formatCode(store.codigo)}`,
})

const mapEmployee = (employee) => {
  const cargo = employee.descriCargo || 'Funcionario'
  const loja = employee.descrLoja || (employee.codLoja ? `Loja ${employee.codLoja}` : '')
  const marca = employee.descrMarca || (employee.codMarca ? `Marca ${employee.codMarca}` : '')

  return {
    ...employee,
    id: employee.id ?? employee.matricula,
    name: [cargo, loja].filter(Boolean).join(' - '),
    description: [marca, employee.matricula ? `Matricula: ${employee.matricula}` : ''].filter(Boolean).join(' | '),
  }
}

const hasEmployeeData = (employee) => (
  Boolean(employee?.matricula || employee?.descriCargo || employee?.descrLoja || employee?.descrMarca)
)

const buildBrandsFromRates = (rateList) => {
  const uniqueBrands = new Map()

  rateList.forEach((rate) => {
    if (!rate.codMarca && !rate.descrMarca) return

    const key = rate.codMarca ?? rate.descrMarca
    if (uniqueBrands.has(key)) return

    uniqueBrands.set(key, mapBrand({
      id: `rate-brand-${key}`,
      codigo: rate.codMarca,
      nome: rate.descrMarca,
      descricao: rate.codMarca ? `Codigo: ${rate.codMarca}` : 'Marca vinculada a regras de comissao',
    }))
  })

  return Array.from(uniqueBrands.values())
}

const buildEmployeesFromRates = (rateList) => {
  const uniqueRoles = new Map()

  rateList.forEach((rate) => {
    if (!rate.codCargo && !rate.descriCargo) return

    const key = `${rate.codCargo ?? rate.descriCargo}-${rate.codMarca ?? rate.descrMarca}`
    if (uniqueRoles.has(key)) return

    uniqueRoles.set(key, {
      id: `rate-role-${key}`,
      name: [rate.descriCargo || `Cargo ${rate.codCargo}`, rate.descrMarca].filter(Boolean).join(' - '),
      description: [
        rate.codCargo ? `Codigo do cargo: ${rate.codCargo}` : '',
        rate.pctComiss !== undefined ? `Comissao: ${(Number(rate.pctComiss) * 100).toFixed(2)}%` : '',
      ].filter(Boolean).join(' | '),
      codMarca: rate.codMarca,
      descrMarca: rate.descrMarca,
      codCargo: rate.codCargo,
      descriCargo: rate.descriCargo,
    })
  })

  return Array.from(uniqueRoles.values())
}

const buildBrandsFromEmployees = (employeeList) => {
  const uniqueBrands = new Map()

  employeeList.forEach((employee) => {
    if (!employee.codMarca && !employee.descrMarca) return

    const key = employee.codMarca ?? employee.descrMarca
    if (uniqueBrands.has(key)) return

    uniqueBrands.set(key, mapBrand({
      id: `brand-${key}`,
      codigo: employee.codMarca,
      nome: employee.descrMarca,
      descricao: employee.codMarca ? `Codigo: ${employee.codMarca}` : 'Marca vinculada a funcionarios',
    }))
  })

  return Array.from(uniqueBrands.values())
}

const buildStoresFromEmployees = (employeeList) => {
  const uniqueStores = new Map()

  employeeList.forEach((employee) => {
    if (!employee.codLoja && !employee.descrLoja) return

    const key = employee.codLoja ?? employee.descrLoja
    if (uniqueStores.has(key)) return

    uniqueStores.set(key, mapStore({
      id: `store-${key}`,
      codigo: employee.codLoja,
      nome: employee.descrLoja,
      descricao: employee.codLoja ? `Codigo: ${employee.codLoja}` : 'Loja vinculada a funcionarios',
    }))
  })

  return Array.from(uniqueStores.values())
}

const responseData = (settledResponse) => (
  settledResponse.status === 'fulfilled' ? settledResponse.value.data : null
)

const fetchFuncionarios = async () => {
  const response = await api.get('/api/funcionarios')
  return extractList(response.data).filter(hasEmployeeData)
}

const loadCommissionFilters = async () => {
  loading.value = true
  errorMessage.value = ''

  const [brandsResponse, storesResponse, employeesResponse, ratesResponse] = await Promise.allSettled([
    api.get('/api/brands'),
    api.get('/api/stores'),
    api.get('/api/funcionarios'),
    api.get('/api/rules/commission-rates'),
  ])

  let rawEmployees = extractList(responseData(employeesResponse)).filter(hasEmployeeData)
  const rawBrands = extractList(responseData(brandsResponse))
  const rawStores = extractList(responseData(storesResponse))
  const rawRates = extractList(responseData(ratesResponse))

  if (rawEmployees.length === 0) {
    try {
      await api.post('/api/funcionarios/consolidate')
      rawEmployees = await fetchFuncionarios()
    } catch (error) {
      console.warn('Nao foi possivel consolidar funcionarios automaticamente:', error)
    }
  }

  employees.value = rawEmployees.map(mapEmployee)
  brands.value = rawBrands.length > 0
    ? rawBrands.map(mapBrand)
    : buildBrandsFromEmployees(rawEmployees).concat(buildBrandsFromRates(rawRates))
  stores.value = rawStores.length > 0
    ? rawStores.map(mapStore)
    : buildStoresFromEmployees(rawEmployees)

  if (employees.value.length === 0 && rawRates.length > 0) {
    employees.value = buildEmployeesFromRates(rawRates)
  }

  const failedRequests = [brandsResponse, storesResponse, employeesResponse, ratesResponse]
    .filter(response => response.status === 'rejected')

  if (failedRequests.length === 4) {
    errorMessage.value = 'Nao foi possivel carregar os dados do backend.'
  } else if (failedRequests.length > 0) {
    errorMessage.value = 'Algumas listas vieram do cadastro de funcionarios porque parte do backend nao respondeu.'
  }

  loading.value = false
}

const matchesSearch = (item, fields) => {
  const search = searchQuery.value.trim().toLowerCase()
  if (!search) return true

  return fields
    .map(field => item[field])
    .filter(value => value !== null && value !== undefined)
    .join(' ')
    .toLowerCase()
    .includes(search)
}

const filteredBrands = computed(() => brands.value.filter(brand =>
  matchesSearch(brand, ['name', 'description', 'codigo'])
))

const filteredStores = computed(() => stores.value.filter(store =>
  matchesSearch(store, ['name', 'description', 'codigo'])
))

const filteredEmployees = computed(() => employees.value.filter(employee =>
  matchesSearch(employee, ['name', 'description', 'matricula', 'descrLoja', 'descrMarca', 'descriCargo'])
))

const clearSearch = () => {
  searchQuery.value = ''
}

const buildItemQuery = (type, item) => ({
  type,
  id: item.id,
  name: item.name,
  codigo: item.codigo ?? '',
  descricao: item.descricao ?? '',
  matricula: item.matricula ?? '',
  codMarca: item.codMarca ?? '',
  descrMarca: item.descrMarca ?? '',
  codLoja: item.codLoja ?? '',
  descrLoja: item.descrLoja ?? '',
  codCargo: item.codCargo ?? '',
  descriCargo: item.descriCargo ?? '',
})

const viewDetails = (type, item) => {
  router.push({
    name: 'CommissionDetails',
    query: buildItemQuery(type, item)
  })
}

const calculateCommission = (type, item) => {
  router.push({
    name: 'CommissionCalculate',
    query: buildItemQuery(type, item)
  })
}

onMounted(loadCommissionFilters)
</script>
