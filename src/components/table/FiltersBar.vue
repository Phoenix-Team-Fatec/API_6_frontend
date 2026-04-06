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
    <div v-if="props.showVigencia">
      <label class="block text-xs font-medium text-gray-500 mb-1">Vigência</label>
      <div class="flex items-center gap-2">
        <button
          :class="[
            'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
            localFilters.isVigente === 'true'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
          @click="toggleVigente('true')"
        >
          ON
        </button>
        <button
          :class="[
            'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
            localFilters.isVigente === 'false'
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
          @click="toggleVigente('false')"
        >
          OFF
        </button>
      </div>
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

const props = defineProps({
  showVigencia: { type: Boolean, default: true },
  defaultIsVigente: { type: String, default: 'true' },
})

const emit = defineEmits(['update:filters'])

const localFilters = ref({ marca: '', cargo: '', isVigente: props.defaultIsVigente })

const hasActiveFilters = computed(() => localFilters.value.marca || localFilters.value.cargo)

const emitFilters = () => emit('update:filters', { ...localFilters.value })

const clearFilters = () => {
  localFilters.value = { marca: '', cargo: '', isVigente: props.defaultIsVigente }
  emitFilters()
}

const toggleVigente = (value) => {
  localFilters.value.isVigente = value
  emitFilters()
}
</script>
