<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Page header -->
    <div class="section-header">
      <div>
        <h1 class="page-title">Regras de Negócio</h1>
        <p class="page-subtitle">Gerencie e monitore todas as regras cadastradas</p>
      </div>
      <RouterLink to="/rules/new?mode=new" @click="store.resetInterpretation()">
        <button class="btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nova Regra
        </button>
      </RouterLink>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label" class="stat-card">
        <div :class="['stat-icon', stat.iconBg]">
          <svg class="w-5 h-5" :class="stat.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.icon" />
          </svg>
        </div>
        <div>
          <p class="stat-label">{{ stat.label }}</p>
          <p class="stat-value">{{ stat.value }}</p>
          <p v-if="stat.sub" class="text-xs text-emerald-500 font-medium mt-0.5">{{ stat.sub }}</p>
        </div>
      </div>
    </div>

    <!-- Filters + Table -->
    <div class="card overflow-hidden">
      <!-- Filters bar -->
      <div class="p-5 border-b border-slate-100">
        <FiltersBar @update:filters="onFiltersChange" />
      </div>

      <!-- Loading -->
      <div v-if="store.loading" class="py-16 flex flex-col items-center justify-center gap-3">
        <div class="relative w-10 h-10">
          <div class="w-10 h-10 rounded-full border-4 border-slate-100"></div>
          <div class="absolute top-0 left-0 w-10 h-10 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
        </div>
        <p class="text-sm text-slate-400">Carregando regras...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="store.rulesList.length === 0" class="py-16 text-center">
        <div class="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 class="text-base font-semibold text-slate-700 mb-1">Nenhuma regra encontrada</h3>
        <p class="text-sm text-slate-400 mb-5">Crie sua primeira regra com auxílio da IA</p>
        <RouterLink to="/rules/new?mode=new" @click="store.resetInterpretation()">
          <button class="btn-primary">Criar Primeira Regra</button>
        </RouterLink>
      </div>

      <!-- Table -->
      <RulesTable v-else :rules="paginatedRules" @select="goToDetail" @sort="onSort" @delete="requestDelete" @toggleVigente="requestToggleVigente" @edit="requestEdit" />

      <!-- Pagination -->
      <div v-if="store.rulesList.length > 0" class="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
        <p class="text-xs text-slate-400">Exibindo <span class="font-semibold text-slate-600">{{ startItem }}</span>-<span class="font-semibold text-slate-600">{{ endItem }}</span> de <span class="font-semibold text-slate-600">{{ store.total }}</span> regras</p>
        <div class="flex items-center gap-1">
          <button class="btn-ghost btn-sm" :class="{ 'opacity-40 cursor-not-allowed': !canGoPrevious }" :disabled="!canGoPrevious" @click="goPrevious">← Anterior</button>
          <button class="px-3 py-1.5 text-xs font-semibold bg-primary-500 text-white rounded-lg">{{ currentPage }}</button>
          <button class="btn-ghost btn-sm" :class="{ 'opacity-40 cursor-not-allowed': !canGoNext }" :disabled="!canGoNext" @click="goNext">Próximo →</button>
        </div>
      </div>
    </div>
  </div>

  <ConfirmationModal
    :show="showDeleteModal"
    title="Excluir regra"
    :message="deleteConfirmationMessage"
    confirm-text="Excluir"
    cancel-text="Cancelar"
    variant="danger"
    :loading="deletingRule"
    @cancel="closeDeleteModal"
    @confirm="confirmDelete"
  />

  <ConfirmationModal
    :show="showVigenteModal"
    :title="vigenteModalTitle"
    :message="vigenteConfirmationMessage"
    :confirm-text="vigenteModalConfirmText"
    cancel-text="Cancelar"
    :variant="ruleToToggleVigente?.isVigente ? 'danger' : 'success'"
    :loading="togglingVigente"
    @cancel="closeVigenteModal"
    @confirm="confirmToggleVigente"
  />
</template>

<script setup>
import { onMounted, computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRuleStore } from '../stores/ruleStore'
import RulesTable from '../components/table/RulesTable.vue'
import FiltersBar from '../components/table/FiltersBar.vue'
import ConfirmationModal from '../components/common/ConfirmationModal.vue'

const router = useRouter()
const store = useRuleStore()
const currentPage = ref(1)
const perPage = 10
const showDeleteModal = ref(false)
const deletingRule = ref(false)
const ruleToDelete = ref(null)
const showVigenteModal = ref(false)
const togglingVigente = ref(false)
const ruleToToggleVigente = ref(null)

const totalPages = computed(() => Math.max(1, Math.ceil(store.rulesList.length / perPage)))

const paginatedRules = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return store.rulesList.slice(start, start + perPage)
})

const canGoPrevious = computed(() => currentPage.value > 1)
const canGoNext = computed(() => currentPage.value < totalPages.value)

const startItem = computed(() => (store.rulesList.length ? (currentPage.value - 1) * perPage + 1 : 0))
const endItem = computed(() => Math.min(currentPage.value * perPage, store.rulesList.length))

watch(() => store.rulesList.length, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
})

const stats = computed(() => [
  { label: 'Total de Regras', value: store.total, iconBg: 'bg-primary-50', iconColor: 'text-primary-600', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', sub: null },
  { label: 'Marcas', value: new Set(store.rulesList.map(r => r.marca)).size, iconBg: 'bg-violet-50', iconColor: 'text-violet-600', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', sub: null },
  { label: 'Cargos', value: new Set(store.rulesList.map(r => r.cargo)).size, iconBg: 'bg-amber-50', iconColor: 'text-amber-600', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', sub: null },
  { label: 'Comissão Média', value: store.rulesList.length ? `${(store.rulesList.reduce((a, r) => a + r.comissao, 0) / store.rulesList.length).toFixed(1)}%` : '—', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', sub: null },
])

onMounted(() => store.fetchRules())

const onFiltersChange = (filters) => {
  store.filters = filters
  currentPage.value = 1
  store.fetchRules()
}

const goPrevious = () => {
  if (canGoPrevious.value) currentPage.value -= 1
}

const goNext = () => {
  if (canGoNext.value) currentPage.value += 1
}

const onSort = (key) => console.log('Sort:', key)
const goToDetail = (rule) => router.push(`/rules/${rule.id}`)

const deleteConfirmationMessage = computed(() => {
  if (!ruleToDelete.value) return 'Tem certeza que deseja excluir esta regra?'
  return `Tem certeza que deseja excluir a regra de ${ruleToDelete.value.cargo} da marca ${ruleToDelete.value.marca}?\n`
})

const requestDelete = (rule) => {
  ruleToDelete.value = rule
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  if (deletingRule.value) return
  showDeleteModal.value = false
  ruleToDelete.value = null
}

const confirmDelete = async () => {
  if (!ruleToDelete.value) return

  deletingRule.value = true
  try {
    await store.deleteRule(ruleToDelete.value.id)
    showDeleteModal.value = false
    ruleToDelete.value = null
    await store.fetchRules()
  } finally {
    deletingRule.value = false
  }
}

const vigenteModalTitle = computed(() => {
  if (!ruleToToggleVigente.value) return ''
  return ruleToToggleVigente.value.isVigente ? 'Desativar regra' : 'Ativar regra'
})

const vigenteModalConfirmText = computed(() => {
  if (!ruleToToggleVigente.value) return ''
  return ruleToToggleVigente.value.isVigente ? 'Desativar' : 'Ativar'
})

const vigenteConfirmationMessage = computed(() => {
  if (!ruleToToggleVigente.value) return ''
  const { cargo, marca, isVigente } = ruleToToggleVigente.value
  if (isVigente) {
    return `Tem certeza que deseja deixar inativa a regra de ${cargo} da marca ${marca}?`
  } else {
    return `Tem certeza que deseja ativar a regra de ${cargo} da marca ${marca}?`
  }
})

const requestToggleVigente = (rule) => {
  ruleToToggleVigente.value = rule
  showVigenteModal.value = true
}

const requestEdit = async (rule) => {
  try {
    await store.fetchRuleById(rule.id)
    store.startEditingRule(store.currentRule || rule)
  } catch {
    store.startEditingRule(rule)
  }

  router.push({
    path: '/rules/confirm',
    query: { mode: 'edit', id: String(rule.id) },
  })
}

const closeVigenteModal = () => {
  if (togglingVigente.value) return
  showVigenteModal.value = false
  ruleToToggleVigente.value = null
}

const confirmToggleVigente = async () => {
  if (!ruleToToggleVigente.value) return

  const targetRule = ruleToToggleVigente.value
  togglingVigente.value = true
  try {
    if (targetRule.isVigente) {
      await store.deactivateRule(targetRule.id)
    } else {
      await store.activateRule(targetRule.id)
    }
  } catch (error) {
    console.error('Erro ao alternar vigência da regra:', error)
  } finally {
    showVigenteModal.value = false
    ruleToToggleVigente.value = null
    togglingVigente.value = false
  }
}
</script>
