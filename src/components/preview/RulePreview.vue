<template>
  <div class="space-y-4">
    <div v-if="loading" class="space-y-3">
      <div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
      <div class="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
      <div class="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
    </div>

    <div v-else-if="rule" class="grid grid-cols-2 gap-3">
      <div v-for="field in fields" :key="field.key" class="bg-gray-50 rounded-lg p-3 border border-gray-100">
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{{ field.label }}</p>
        <p class="text-sm font-semibold text-gray-900">{{ rule[field.key] || '—' }}</p>
      </div>
    </div>

    <div v-else class="text-center py-8 text-gray-400">
      <svg class="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      <p class="text-sm">Digite uma regra para visualizar a interpretação</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  rule: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const fields = [
  { key: 'marca', label: 'Marca' },
  { key: 'cargo', label: 'Cargo' },
  { key: 'comissao', label: 'Comissão (%)' },
  { key: 'data', label: 'Data' },
]
</script>
