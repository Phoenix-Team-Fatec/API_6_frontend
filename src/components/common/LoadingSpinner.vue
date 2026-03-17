<template>
  <div class="flex flex-col items-center justify-center py-12 space-y-3">
    <div class="relative">
      <div class="w-12 h-12 rounded-full border-4 border-gray-200"></div>
      <div class="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-primary-600 border-t-transparent animate-spin"></div>
    </div>
    <p v-if="text" class="text-sm text-gray-500">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({ text: { type: String, default: '' } })
</script>
