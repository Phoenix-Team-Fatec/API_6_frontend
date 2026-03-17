<template>
  <div class="space-y-1">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <div class="relative">
      <input
        v-if="type !== 'textarea'"
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="input-field"
        :class="{ 'border-red-300 focus:ring-red-500': error }"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <textarea
        v-else
        :id="id"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :rows="rows"
        class="input-field resize-none"
        :class="{ 'border-red-300 focus:ring-red-500': error }"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
    <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
    <p v-else-if="hint" class="text-xs text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup>
defineProps({
  id: String,
  label: String,
  modelValue: [String, Number],
  type: { type: String, default: 'text' },
  placeholder: String,
  disabled: Boolean,
  required: Boolean,
  error: String,
  hint: String,
  rows: { type: Number, default: 4 },
})
defineEmits(['update:modelValue'])
</script>
