<template>
  <div class="flex h-screen overflow-hidden bg-slate-50">
    <!-- Sidebar -->
    <AppSidebar :collapsed="sidebarCollapsed" @toggle="sidebarCollapsed = !sidebarCollapsed" />

    <!-- Main -->
    <div class="flex-1 flex flex-col overflow-hidden transition-all duration-300">
      <!-- Top bar -->
      <AppTopBar @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />

      <!-- Content -->
      <main class="flex-1 overflow-y-auto p-6 lg:p-8">
        <div class="w-full animate-fade-in">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppSidebar from '../components/layout/AppSidebar.vue'
import AppTopBar from '../components/layout/AppTopBar.vue'

const sidebarCollapsed = ref(false)
</script>
