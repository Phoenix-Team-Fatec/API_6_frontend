<template>
  <div class="space-y-6 animate-fade-in">
    <div class="section-header gap-4 flex-wrap">
      <div>
        <h1 class="page-title">Usuarios e Acessos</h1>
      </div>
    </div>


    <div class="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
      <section class="card p-5">
        <h2 class="text-base font-semibold text-slate-900">Novo acesso</h2>

        <form class="mt-5 space-y-4" @submit.prevent="createUser">
          <div>
            <label class="form-label">Nome</label>
            <input v-model.trim="form.name" class="input-field" type="text" placeholder="Ex.: Mariana Silva" autocomplete="off" />
          </div>

          <div>
            <label class="form-label">Email corporativo</label>
            <input v-model.trim="form.email" class="input-field" type="email" placeholder="usuario@empresa.com" autocomplete="off" />
          </div>

          <div>
            <label class="form-label">Perfil de acesso</label>
            <select v-model="form.role" class="input-field">
              <option v-for="role in availableRoles" :key="role.value" :value="role.value">
                {{ role.label }}
              </option>
            </select>
            <p class="text-xs text-slate-500 mt-2">{{ selectedRoleDescription }}</p>
          </div>

          <div>
            <label class="form-label">Matricula vinculada</label>
            <input v-model.trim="form.employeeMatricula" class="input-field" type="text" placeholder="Opcional" autocomplete="off" />
          </div>

          <div>
            <label class="form-label">Escopo</label>
            <input v-model.trim="form.scope" class="input-field" type="text" placeholder="Ex.: Loja Centro, todas as lojas" autocomplete="off" />
          </div>

          <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
          <p v-if="successMessage" class="text-sm text-emerald-600">{{ successMessage }}</p>

          <button class="btn-primary w-full" type="submit">
            <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Criar acesso
          </button>
        </form>
      </section>

      <section class="card overflow-hidden">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 class="text-base font-semibold text-slate-900">Usuarios cadastrados</h2>
            <p class="text-sm text-slate-500 mt-0.5">{{ accessStore.activeUsers.length }} ativos de {{ accessStore.users.length }} usuarios</p>
          </div>
          <input v-model.trim="searchQuery" class="input-field max-w-sm" type="text" placeholder="Buscar por nome, email ou escopo" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 border-b border-slate-100">
          <div v-for="stat in roleStats" :key="stat.label" class="p-5 border-b md:border-b-0 md:border-r last:border-r-0 border-slate-100">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ stat.label }}</p>
            <p class="mt-2 text-2xl font-bold text-slate-900">{{ stat.value }}</p>
            <p class="mt-1 text-xs text-slate-500">{{ stat.sub }}</p>
          </div>
        </div>

        <div v-if="filteredUsers.length === 0" class="py-14 text-center text-sm text-slate-500">
          Nenhum usuario encontrado.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-xs font-semibold uppercase tracking-wide text-slate-400 border-b border-slate-100">
                <th class="px-5 py-3">Usuario</th>
                <th class="px-5 py-3">Perfil</th>
                <th class="px-5 py-3">Escopo</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3 text-right">Acoes</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="user in filteredUsers" :key="user.id">
                <td class="px-5 py-4">
                  <p class="text-sm font-semibold text-slate-900">{{ user.name }}</p>
                  <p class="text-xs text-slate-500">{{ user.email }}</p>
                  <p v-if="user.employeeMatricula" class="text-xs text-slate-400 mt-1">Matricula {{ user.employeeMatricula }}</p>
                </td>
                <td class="px-5 py-4">
                  <select class="input-field min-w-36" :value="user.role" @change="accessStore.updateUserRole(user.id, $event.target.value)">
                    <option v-for="role in availableRoles" :key="role.value" :value="role.value">
                      {{ role.label }}
                    </option>
                  </select>
                </td>
                <td class="px-5 py-4 text-sm text-slate-600">{{ user.scope }}</td>
                <td class="px-5 py-4">
                  <span :class="user.active ? 'badge-green' : 'badge-slate'">
                    {{ user.active ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <button class="btn-secondary btn-sm" @click="accessStore.toggleUserStatus(user.id)">
                    {{ user.active ? 'Desativar' : 'Ativar' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { ROLE_DESCRIPTIONS, ROLE_LABELS, ROLES, useAccessStore } from '../stores/accessStore'

const accessStore = useAccessStore()
const searchQuery = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const form = reactive({
  name: '',
  email: '',
  role: ROLES.MANAGER,
  employeeMatricula: '',
  scope: '',
})

const availableRoles = [
  { value: ROLES.MANAGER, label: ROLE_LABELS[ROLES.MANAGER] },
  { value: ROLES.ADMIN, label: ROLE_LABELS[ROLES.ADMIN] },
]

const selectedRoleDescription = computed(() => ROLE_DESCRIPTIONS[form.role])

const roleStats = computed(() => [
  { label: 'Admins', value: accessStore.adminUsers.length, sub: 'Acesso total' },
  { label: 'Gerentes', value: accessStore.managerUsers.length, sub: 'Regras, comissoes e operacao' },
])

const filteredUsers = computed(() => {
  const query = searchQuery.value.toLowerCase()
  if (!query) return accessStore.users

  return accessStore.users.filter(user =>
    [user.name, user.email, user.scope, user.employeeMatricula, ROLE_LABELS[user.role]]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(query)
  )
})

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.role = ROLES.MANAGER
  form.employeeMatricula = ''
  form.scope = ''
}

const createUser = () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.name || !form.email) {
    errorMessage.value = 'Informe nome e email para criar o acesso.'
    return
  }

  try {
    const user = accessStore.createUser(form)
    successMessage.value = `${user.name} foi cadastrado como ${ROLE_LABELS[user.role]}.`
    resetForm()
  } catch (error) {
    errorMessage.value = error.message || 'Nao foi possivel criar o acesso.'
  }
}
</script>

<style scoped>
.form-label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 700;
  color: rgb(71 85 105);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
</style>
