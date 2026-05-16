<template>
  <div class="space-y-6 animate-fade-in">
    <div class="section-header gap-4 flex-wrap">
      <div>
        <h1 class="page-title">Dashboard Admin</h1>
        <p class="page-subtitle">Visao geral dos cadastros, regras e saude do backend</p>
      </div>

      <div class="flex items-center gap-2">
        <button class="btn-secondary" :disabled="loading" @click="loadDashboard">
          <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v6h6M20 20v-6h-6M5 19a9 9 0 0014-3M19 5A9 9 0 005 8" />
          </svg>
          Atualizar
        </button>
        <RouterLink to="/rules/new?mode=new" class="btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nova Regra
        </RouterLink>
      </div>
    </div>

    <div v-if="errorMessage" class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      {{ errorMessage }}
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div v-for="stat in mainStats" :key="stat.label" class="stat-card">
        <div :class="['stat-icon', stat.iconBg]">
          <svg class="w-5 h-5" :class="stat.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.icon" />
          </svg>
        </div>
        <div class="min-w-0">
          <p class="stat-label">{{ stat.label }}</p>
          <p class="stat-value">{{ loading ? '...' : stat.value }}</p>
          <p class="text-xs text-slate-500 mt-0.5 truncate">{{ stat.sub }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-[1.25fr_0.75fr] gap-6">
      <section class="card overflow-hidden">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
          <div>
            <h2 class="text-base font-semibold text-slate-900">Operacao de comissoes</h2>
            <p class="text-sm text-slate-500 mt-0.5">Leitura consolidada a partir das regras vigentes e historico</p>
          </div>
          <span :class="healthBadgeClass">{{ healthLabel }}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 border-b border-slate-100">
          <div v-for="metric in operationMetrics" :key="metric.label" class="p-5 border-b md:border-b-0 md:border-r last:border-r-0 border-slate-100">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ metric.label }}</p>
            <p class="mt-2 text-2xl font-bold text-slate-900">{{ loading ? '...' : metric.value }}</p>
            <p class="mt-1 text-xs text-slate-500">{{ metric.sub }}</p>
          </div>
        </div>

        <div class="p-5">
          <div class="flex items-center justify-between gap-4 mb-4">
            <h3 class="text-sm font-semibold text-slate-900">Regras recentes</h3>
            <RouterLink to="/rules" class="text-sm font-semibold text-primary-600 hover:text-primary-700">Ver regras</RouterLink>
          </div>

          <div v-if="loading" class="py-10 text-center text-sm text-slate-500">Carregando dados...</div>
          <div v-else-if="recentRules.length === 0" class="py-10 text-center text-sm text-slate-500">Nenhuma regra encontrada.</div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="text-xs font-semibold uppercase tracking-wide text-slate-400 border-b border-slate-100">
                  <th class="pb-3 pr-4">Marca</th>
                  <th class="pb-3 pr-4">Cargo</th>
                  <th class="pb-3 pr-4">Comissao</th>
                  <th class="pb-3 pr-4">Status</th>
                  <th class="pb-3">Atualizada</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="rule in recentRules" :key="rule.id">
                  <td class="py-3 pr-4 text-sm font-medium text-slate-900">{{ rule.descrMarca || '-' }}</td>
                  <td class="py-3 pr-4 text-sm text-slate-600">{{ rule.descriCargo || '-' }}</td>
                  <td class="py-3 pr-4 text-sm font-semibold text-slate-900">{{ formatPercent(rule.pctComiss) }}</td>
                  <td class="py-3 pr-4">
                    <span :class="rule.isVigente ? 'badge-green' : 'badge-slate'">
                      {{ rule.isVigente ? 'Vigente' : 'Inativa' }}
                    </span>
                  </td>
                  <td class="py-3 text-sm text-slate-500">{{ formatDate(rule.updatedAt || rule.createdAt || rule.data) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <aside class="space-y-6">
        <section class="card p-5">
          <h2 class="text-base font-semibold text-slate-900">Acoes rapidas</h2>
          <div class="mt-4 grid gap-3">
            <RouterLink v-for="action in quickActions" :key="action.to" :to="action.to" class="quick-action">
              <span :class="['quick-action-icon', action.iconBg]">
                <svg class="w-4 h-4" :class="action.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="action.icon" />
                </svg>
              </span>
              <span class="min-w-0">
                <span class="block text-sm font-semibold text-slate-800 truncate">{{ action.label }}</span>
                <span class="block text-xs text-slate-500 truncate">{{ action.sub }}</span>
              </span>
            </RouterLink>
          </div>
        </section>

        <section class="card p-5">
          <h2 class="text-base font-semibold text-slate-900">Pontos de atencao</h2>
          <div class="mt-4 space-y-3">
            <div v-for="item in attentionItems" :key="item.label" class="attention-row">
              <div>
                <p class="text-sm font-semibold text-slate-800">{{ item.label }}</p>
                <p class="text-xs text-slate-500 mt-0.5">{{ item.sub }}</p>
              </div>
              <span :class="item.badgeClass">{{ item.value }}</span>
            </div>
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import api from '../services/api'
import { useAccessStore } from '../stores/accessStore'

const accessStore = useAccessStore()
const loading = ref(false)
const errorMessage = ref('')
const health = ref(null)
const brands = ref([])
const stores = ref([])
const employees = ref([])
const rules = ref([])
const trashedRules = ref([])
const exceptions = ref([])

const currentMonth = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
})

const extractList = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

const getData = (response) => response.status === 'fulfilled' ? response.value.data : null

const loadDashboard = async () => {
  loading.value = true
  errorMessage.value = ''

  const responses = await Promise.allSettled([
    api.get('/health'),
    api.get('/api/brands'),
    api.get('/api/stores'),
    api.get('/api/funcionarios'),
    api.get('/api/rules/commission-rates'),
    api.get('/api/rules/commission-rates/trash'),
    api.get('/api/rules/exceptions', { params: { month: currentMonth.value } }),
  ])

  health.value = getData(responses[0])
  brands.value = extractList(getData(responses[1]))
  stores.value = extractList(getData(responses[2]))
  employees.value = extractList(getData(responses[3]))
  rules.value = extractList(getData(responses[4]))
  trashedRules.value = extractList(getData(responses[5]))
  exceptions.value = extractList(getData(responses[6]))

  const failures = responses.filter(response => response.status === 'rejected').length
  if (failures === responses.length) {
    errorMessage.value = 'Nao foi possivel conectar ao backend. Confira se a API Spring esta rodando.'
  } else if (failures > 0) {
    errorMessage.value = 'Alguns dados nao responderam agora; o dashboard exibiu o que conseguiu carregar.'
  }

  loading.value = false
}

const activeRules = computed(() => rules.value.filter(rule => rule.isVigente !== false && !rule.deletedAt))
const inactiveRules = computed(() => rules.value.filter(rule => rule.isVigente === false))
const activeEmployees = computed(() => employees.value.filter(employee => employee.ativo !== false))

const averageCommission = computed(() => {
  if (!rules.value.length) return '-'
  const total = rules.value.reduce((sum, rule) => sum + Number(rule.pctComiss || 0), 0)
  return `${((total / rules.value.length) * 100).toFixed(1)}%`
})

const coverageCount = computed(() => {
  const combinations = new Set()
  rules.value.forEach((rule) => {
    if (rule.codMarca || rule.codCargo) {
      combinations.add(`${rule.codMarca || 'marca'}-${rule.codCargo || 'cargo'}`)
    }
  })
  return combinations.size
})

const mainStats = computed(() => [
  { label: 'Marcas', value: brands.value.length, sub: 'Cadastradas no dominio', iconBg: 'bg-violet-50', iconColor: 'text-violet-600', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
  { label: 'Lojas', value: stores.value.length, sub: 'Unidades cadastradas', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', icon: 'M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9h1M9 13h1M9 17h1M14 13h1M14 17h1' },
  { label: 'Funcionarios', value: activeEmployees.value.length, sub: 'Ativos para consulta', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', icon: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M15 7a3 3 0 11-6 0 3 3 0 016 0zM17 11a3 3 0 100-6' },
  { label: 'Acessos', value: accessStore.activeUsers.length, sub: `${accessStore.managerUsers.length} gerentes ativos`, iconBg: 'bg-primary-50', iconColor: 'text-primary-600', icon: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
])

const operationMetrics = computed(() => [
  { label: 'Comissao media', value: averageCommission.value, sub: 'Baseada nas regras carregadas' },
  { label: 'Cobertura marca/cargo', value: coverageCount.value, sub: 'Combinacoes contempladas' },
  { label: 'Excecoes do mes', value: exceptions.value.length, sub: `Referencia ${currentMonth.value}` },
])

const recentRules = computed(() => [...rules.value]
  .sort((a, b) => new Date(b.updatedAt || b.createdAt || b.data || 0) - new Date(a.updatedAt || a.createdAt || a.data || 0))
  .slice(0, 6)
)

const healthLabel = computed(() => health.value?.status === 'UP' ? 'Backend online' : 'Backend indisponivel')
const healthBadgeClass = computed(() => health.value?.status === 'UP' ? 'badge-green' : 'badge-red')

const attentionItems = computed(() => [
  {
    label: 'Regras inativas',
    sub: 'Podem afetar calculos futuros se estiverem desatualizadas',
    value: inactiveRules.value.length,
    badgeClass: inactiveRules.value.length ? 'badge-amber' : 'badge-green',
  },
  {
    label: 'Regras na lixeira',
    sub: 'Disponiveis para restauracao ou auditoria',
    value: trashedRules.value.length,
    badgeClass: trashedRules.value.length ? 'badge-amber' : 'badge-slate',
  },
  {
    label: 'Excecoes mensais',
    sub: `Ocorrencias cadastradas em ${currentMonth.value}`,
    value: exceptions.value.length,
    badgeClass: exceptions.value.length ? 'badge-amber' : 'badge-green',
  },
])

const quickActions = [
  { to: '/admin/users', label: 'Usuarios e acessos', sub: 'Criar gerentes e perfis', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', icon: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { to: '/rules', label: 'Gerenciar regras', sub: 'Listar, ativar e revisar', iconBg: 'bg-primary-50', iconColor: 'text-primary-600', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2' },
  { to: '/commission', label: 'Consultar comissoes', sub: 'Marcas, lojas e funcionarios', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', icon: 'M12 8c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zm0 2c2.21 0 4 1.79 4 4v2H8v-2c0-2.21 1.79-4 4-4z' },
  { to: '/rules/trash', label: 'Abrir lixeira', sub: 'Restaurar regras removidas', iconBg: 'bg-amber-50', iconColor: 'text-amber-600', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6' },
]

const formatPercent = (value) => {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? `${(numericValue * 100).toFixed(2)}%` : '-'
}

const formatDate = (value) => {
  if (!value) return '-'
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(value))
}

onMounted(loadDashboard)
</script>

<style scoped>
.quick-action {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid rgb(226 232 240);
  border-radius: 12px;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.quick-action:hover {
  border-color: rgb(165 180 252);
  background: rgb(248 250 252);
}

.quick-action-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.attention-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgb(241 245 249);
}

.attention-row:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}
</style>
