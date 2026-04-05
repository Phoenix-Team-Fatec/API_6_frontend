<template>
  <div class="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
    <div class="flex items-start space-x-3">
      <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center space-x-2 mb-2">
          <h4 class="text-sm font-semibold text-blue-900">Como a IA interpretou isso</h4>
          <span class="badge bg-blue-100 text-blue-700 text-xs">Inteligência Artificial</span>
        </div>
        <div class="text-sm text-blue-800 leading-relaxed whitespace-pre-wrap" v-html="formattedExplanation" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  explanation: { type: String, required: true }
})

const formattedExplanation = computed(() => {
  return props.explanation
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />')
})
</script>
