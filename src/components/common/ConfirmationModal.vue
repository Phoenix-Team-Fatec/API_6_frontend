<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="emit('cancel')" />

        <div class="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
          <div class="p-6 sm:p-7">
            <div class="flex items-start gap-4">
              <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center shrink-0', iconBgClass]">
                <svg class="w-6 h-6" :class="iconColorClass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
                </svg>
              </div>

              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
                <p class="mt-2 text-sm text-slate-500 leading-relaxed whitespace-pre-line">{{ message }}</p>
              </div>

              <button class="text-slate-400 hover:text-slate-700 transition-colors" @click="emit('cancel')" aria-label="Fechar modal">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button class="btn-secondary" :disabled="loading" @click="emit('cancel')">{{ cancelText }}</button>
              <button :class="confirmButtonClass" :disabled="loading" @click="emit('confirm')">
                <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {{ confirmText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: 'Confirmar ação' },
  message: { type: String, default: 'Tem certeza que deseja continuar?' },
  confirmText: { type: String, default: 'Confirmar' },
  cancelText: { type: String, default: 'Cancelar' },
  variant: { type: String, default: 'danger' },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['confirm', 'cancel'])

const variants = {
  danger: {
    iconBgClass: 'bg-red-50',
    iconColorClass: 'text-red-600',
    iconPath: 'M12 9v2m0 4h.01M10.29 3.86l-8 14A2 2 0 004 21h16a2 2 0 001.71-3.14l-8-14a2 2 0 00-3.42 0z',
    confirmButtonClass: 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 px-4 py-2',
  },
  primary: {
    iconBgClass: 'bg-primary-50',
    iconColorClass: 'text-primary-600',
    iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
    confirmButtonClass: 'btn-primary',
  },
  warning: {
    iconBgClass: 'bg-amber-50',
    iconColorClass: 'text-amber-600',
    iconPath: 'M12 9v2m0 4h.01M10.29 3.86l-8 14A2 2 0 004 21h16a2 2 0 001.71-3.14l-8-14a2 2 0 00-3.42 0z',
    confirmButtonClass: 'bg-amber-600 hover:bg-amber-700 text-white inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 px-4 py-2',
  },
}

const currentVariant = computed(() => variants[props.variant] || variants.danger)
const iconBgClass = computed(() => currentVariant.value.iconBgClass)
const iconColorClass = computed(() => currentVariant.value.iconColorClass)
const iconPath = computed(() => currentVariant.value.iconPath)
const confirmButtonClass = computed(() => currentVariant.value.confirmButtonClass)
</script>