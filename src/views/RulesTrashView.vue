<template>
  <div class="space-y-6 animate-fade-in">
    <div class="section-header">
      <div>
        <h1 class="page-title">Lixeira de Regras</h1>
        <p class="page-subtitle">Gerencie regras excluídas e recupere quando necessário</p>
      </div>
    </div>

    <div class="card overflow-hidden">
      <div class="p-5 border-b border-slate-100">
        <FiltersBar :show-vigencia="false" default-is-vigente="" @update:filters="onFiltersChange" />
      </div>

      <div v-if="store.loading" class="py-16 flex flex-col items-center justify-center gap-3">
        <div class="relative w-10 h-10">
          <div class="w-10 h-10 rounded-full border-4 border-slate-100"></div>
          <div class="absolute top-0 left-0 w-10 h-10 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
        </div>
        <p class="text-sm text-slate-400">Carregando lixeira...</p>
      </div>

      <div v-else-if="store.trashRulesList.length === 0" class="py-16 text-center">
        <div class="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14" />
          </svg>
        </div>
        <h3 class="text-base font-semibold text-slate-700 mb-1">Nenhum item na lixeira</h3>
        <p class="text-sm text-slate-400">As regras excluídas aparecerão aqui</p>
      </div>

      <TrashRulesTable v-else :rules="paginatedRules" @restore="requestRestore" />

      <div v-if="store.trashRulesList.length > 0" class="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
        <p class="text-xs text-slate-400">Exibindo <span class="font-semibold text-slate-600">{{ startItem }}</span>-<span class="font-semibold text-slate-600">{{ endItem }}</span> de <span class="font-semibold text-slate-600">{{ store.trashTotal }}</span> regras</p>
        <div class="flex items-center gap-1">
          <button class="btn-ghost btn-sm" :class="{ 'opacity-40 cursor-not-allowed': !canGoPrevious }" :disabled="!canGoPrevious" @click="goPrevious">← Anterior</button>
          <button class="px-3 py-1.5 text-xs font-semibold bg-primary-500 text-white rounded-lg">{{ currentPage }}</button>
          <button class="btn-ghost btn-sm" :class="{ 'opacity-40 cursor-not-allowed': !canGoNext }" :disabled="!canGoNext" @click="goNext">Próximo →</button>
        </div>
      </div>
    </div>

    <ConfirmationModal
      :show="showRestoreModal"
      title="Recuperar regra"
      :message="restoreConfirmationMessage"
      confirm-text="Recuperar"
      cancel-text="Cancelar"
      variant="primary"
      :loading="restoringRule"
      @cancel="closeRestoreModal"
      @confirm="confirmRestore"
    />
  </div>
</template>

<script setup>
import { onMounted, computed, ref, watch } from 'vue'
import { useRuleStore } from '../stores/ruleStore'
import FiltersBar from '../components/table/FiltersBar.vue'
import TrashRulesTable from '../components/table/TrashRulesTable.vue'
import ConfirmationModal from '../components/common/ConfirmationModal.vue'

const store = useRuleStore()
const currentPage = ref(1)
const perPage = 10
const showRestoreModal = ref(false)
const restoringRule = ref(false)
const ruleToRestore = ref(null)

const totalPages = computed(() => Math.max(1, Math.ceil(store.trashRulesList.length / perPage)))

const paginatedRules = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return store.trashRulesList.slice(start, start + perPage)
})

const canGoPrevious = computed(() => currentPage.value > 1)
const canGoNext = computed(() => currentPage.value < totalPages.value)

const startItem = computed(() => (store.trashRulesList.length ? (currentPage.value - 1) * perPage + 1 : 0))
const endItem = computed(() => Math.min(currentPage.value * perPage, store.trashRulesList.length))

watch(() => store.trashRulesList.length, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
})

onMounted(() => store.fetchTrashRules())

const onFiltersChange = (filters) => {
  store.filters = filters
  currentPage.value = 1
  store.fetchTrashRules()
}

const goPrevious = () => {
  if (canGoPrevious.value) currentPage.value -= 1
}

const goNext = () => {
  if (canGoNext.value) currentPage.value += 1
}

const restoreConfirmationMessage = computed(() => {
  if (!ruleToRestore.value) return 'Tem certeza que deseja recuperar esta regra?'
  return `Tem certeza que deseja recuperar a regra de ${ruleToRestore.value.cargo} da marca ${ruleToRestore.value.marca}?`
})

const requestRestore = (rule) => {
  ruleToRestore.value = rule
  showRestoreModal.value = true
}

const closeRestoreModal = () => {
  if (restoringRule.value) return
  showRestoreModal.value = false
  ruleToRestore.value = null
}

const confirmRestore = async () => {
  if (!ruleToRestore.value) return

  restoringRule.value = true
  try {
    await store.restoreRule(ruleToRestore.value.id)
    showRestoreModal.value = false
    ruleToRestore.value = null
    await store.fetchTrashRules()
    await store.fetchRules()
  } finally {
    restoringRule.value = false
  }
}
</script>
