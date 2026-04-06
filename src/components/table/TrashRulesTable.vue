<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="border-b border-gray-200">
          <th
            v-for="col in columns"
            :key="col.key"
            class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide"
          >
            <div class="flex items-center space-x-1">
              <span>{{ col.label }}</span>
            </div>
          </th>
          <th class="py-3 px-4"></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr v-for="rule in rules" :key="rule.id" class="hover:bg-gray-50 transition-colors">
          <td class="py-3 px-4">
            <span class="badge-blue">{{ rule.marca }}</span>
          </td>
          <td class="py-3 px-4 text-sm text-gray-700">{{ rule.cargo }}</td>
          <td class="py-3 px-4">
            <span class="text-sm font-semibold text-green-600">{{ rule.comissao }}%</span>
          </td>
          <td class="py-3 px-4 text-sm text-gray-500">{{ formatDate(rule.data) }}</td>
          <td class="py-3 px-4 text-sm text-gray-500">{{ formatDateTime(rule.deleted_at) }}</td>
          <td class="py-3 px-4 text-right">
            <div class="flex items-center justify-end gap-2">
              <button
                class="text-gray-400 hover:text-emerald-600 transition-colors p-1 rounded"
                @click="emit('restore', rule)"
                aria-label="Recuperar regra"
                title="Recuperar"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M8 8l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  rules: { type: Array, default: () => [] }
})

const emit = defineEmits(['restore'])

const columns = [
  { key: 'marca', label: 'Marca' },
  { key: 'cargo', label: 'Cargo' },
  { key: 'comissao', label: 'Comissão' },
  { key: 'data', label: 'Data' },
  { key: 'deleted_at', label: 'Excluída Em' },
]

const formatDate = (d) => {
  if (!d) return '—'
  const [y, m] = d.split('-')
  const months = ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return `${months[parseInt(m)]} ${y}`
}

const formatDateTime = (dt) => {
  if (!dt) return '—'
  return new Date(dt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
