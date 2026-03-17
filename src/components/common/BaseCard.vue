<template>
  <div :class="['bg-white rounded-xl border border-gray-200 shadow-sm', padding ? 'p-6' : '', $attrs.class]">
    <div v-if="title || $slots.header" class="flex items-center justify-between mb-4">
      <h3 v-if="title" class="text-base font-semibold text-gray-900">{{ title }}</h3>
      <slot name="header" />
    </div>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: String,
  padding: { type: Boolean, default: true },
})
</script>
