<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="border-b border-gray-200">
          <th
            v-for="col in columns"
            :key="col.key"
            class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-900 transition-colors"
            @click="emit('sort', col.key)"
          >
            <div class="flex items-center space-x-1">
              <span>{{ col.label }}</span>
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
          </th>
          <th class="py-3 px-4"></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr
          v-for="rule in rules"
          :key="rule.id"
          class="hover:bg-gray-50 transition-colors cursor-pointer"
          @click="emit('select', rule)"
        >
          <td class="py-3 px-4">
            <span class="badge-blue">{{ rule.marca }}</span>
          </td>
          <td class="py-3 px-4 text-sm text-gray-700">{{ rule.cargo }}</td>
          <td class="py-3 px-4">
            <span class="text-sm font-semibold text-green-600">{{ rule.comissao }}%</span>
          </td>
          <td class="py-3 px-4 text-sm text-gray-500">{{ formatDate(rule.data) }}</td>
          <td class="py-3 px-4 text-right">
            <div class="flex items-center justify-end gap-2" @click.stop>
              <button
                class="text-gray-400 hover:text-primary-600 transition-colors p-1 rounded"
                @click="emit('select', rule)"
                aria-label="Ver detalhes"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                class="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded"
                @click="emit('edit', rule)"
                aria-label="Editar regra"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                :class="[
                  'transition-colors p-1 rounded',
                  rule.isVigente
                    ? 'text-emerald-500 hover:text-gray-400'
                      : 'text-gray-400 hover:text-emerald-600'
                ]"
                @click="emit('toggleVigente', rule)"
                :aria-label="rule.isVigente ? 'Desativar regra' : 'Ativar regra'"
              >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </button>
              <button
                class="text-gray-400 hover:text-red-600 transition-colors p-1 rounded"
                @click="emit('delete', rule)"
                aria-label="Excluir regra"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14" />
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
const props = defineProps({
  rules: { type: Array, default: () => [] }
})

const emit = defineEmits(['select', 'sort', 'delete', 'toggleVigente', 'edit'])

const columns = [
  { key: 'marca', label: 'Marca' },
  { key: 'cargo', label: 'Cargo' },
  { key: 'comissao', label: 'Comissão' },
  { key: 'data', label: 'Data' },
]

const formatDate = (d) => {
  if (!d) return '—'
  const [y, m] = d.split('-')
  const months = ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return `${months[parseInt(m)]} ${y}`
}
</script>
