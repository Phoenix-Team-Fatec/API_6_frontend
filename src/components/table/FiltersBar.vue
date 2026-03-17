<template>
  <div class="flex flex-wrap gap-3 items-end">
    <div class="flex-1 min-w-40">
      <label class="block text-xs font-medium text-gray-500 mb-1">Marca</label>
      <input
        v-model="localFilters.marca"
        type="text"
        placeholder="Filtrar por marca..."
        class="input-field text-sm"
        @input="emitFilters"
      />
    </div>
    <div class="flex-1 min-w-40">
      <label class="block text-xs font-medium text-gray-500 mb-1">Cargo</label>
      <input
        v-model="localFilters.cargo"
        type="text"
        placeholder="Filtrar por cargo..."
        class="input-field text-sm"
        @input="emitFilters"
      />
    </div>
    <button
      v-if="hasActiveFilters"
      class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-1"
      @click="clearFilters"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
      <span>Limpar</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['update:filters'])

const localFilters = ref({ marca: '', cargo: '' })

const hasActiveFilters = computed(() => localFilters.value.marca || localFilters.value.cargo)

const emitFilters = () => emit('update:filters', { ...localFilters.value })

const clearFilters = () => {
  localFilters.value = { marca: '', cargo: '' }
  emitFilters()
}
</script>
