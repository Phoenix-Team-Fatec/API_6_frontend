import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ROLE_LABELS, ROLES, useAccessStore } from './accessStore'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('ruleai_user') || 'null'))
  const token = ref(localStorage.getItem('ruleai_token') || null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const userName = computed(() => user.value?.name || 'Usuario')
  const userEmail = computed(() => user.value?.email || '')
  const normalizedUserRole = (role) => role === 'ANALYST' ? ROLES.MANAGER : role
  const userRole = computed(() => normalizedUserRole(user.value?.role) || ROLES.MANAGER)
  const userRoleLabel = computed(() => ROLE_LABELS[userRole.value] || 'Usuario')
  const isAdmin = computed(() => userRole.value === ROLES.ADMIN)
  const canManageUsers = computed(() => isAdmin.value)
  const canCreateRules = computed(() => [ROLES.ADMIN, ROLES.MANAGER].includes(userRole.value))
  const canAccessAdminDashboard = computed(() => isAdmin.value)
  const userInitials = computed(() => {
    if (!user.value?.name) return 'U'
    return user.value.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
  })

  const hasAnyRole = (roles = []) => roles.includes(userRole.value)

  async function login(email, password) {
    loading.value = true
    error.value = null

    try {
      await new Promise(r => setTimeout(r, 1200))

      if (!email || password.length < 6) {
        throw new Error('Credenciais invalidas')
      }

      const accessStore = useAccessStore()
      const registeredUser = accessStore.findByEmail(email)
      const role = normalizedUserRole(registeredUser?.role) || (String(email).toLowerCase().includes('admin') ? ROLES.ADMIN : ROLES.MANAGER)

      if (registeredUser && !registeredUser.active) {
        throw new Error('Usuario inativo. Fale com um administrador.')
      }

      const userData = {
        id: registeredUser?.id || Date.now(),
        name: registeredUser?.name || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        email: String(email).toLowerCase(),
        role,
        roleLabel: ROLE_LABELS[role] || 'Usuario',
        scope: registeredUser?.scope || 'Acesso padrao',
        employeeMatricula: registeredUser?.employeeMatricula || '',
        avatar: null,
      }

      const fakeToken = btoa(JSON.stringify({ userId: userData.id, role, exp: Date.now() + 86400000 }))
      user.value = userData
      token.value = fakeToken
      localStorage.setItem('ruleai_user', JSON.stringify(userData))
      localStorage.setItem('ruleai_token', fakeToken)
      return true
    } catch (err) {
      error.value = err.message || 'Erro ao fazer login'
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(name, email, password) {
    loading.value = true
    error.value = null

    try {
      await new Promise(r => setTimeout(r, 1400))

      if (!name || !email || password.length < 6) {
        throw new Error('Dados invalidos para cadastro')
      }

      const userData = {
        id: Date.now(),
        name,
        email: String(email).toLowerCase(),
        role: ROLES.MANAGER,
        roleLabel: ROLE_LABELS[ROLES.MANAGER],
        avatar: null,
      }
      const fakeToken = btoa(JSON.stringify({ userId: userData.id, role: userData.role, exp: Date.now() + 86400000 }))
      user.value = userData
      token.value = fakeToken
      localStorage.setItem('ruleai_user', JSON.stringify(userData))
      localStorage.setItem('ruleai_token', fakeToken)
      return true
    } catch (err) {
      error.value = err.message || 'Erro ao criar conta'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('ruleai_user')
    localStorage.removeItem('ruleai_token')
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    userName,
    userEmail,
    userRole,
    userRoleLabel,
    userInitials,
    isAdmin,
    canManageUsers,
    canCreateRules,
    canAccessAdminDashboard,
    hasAnyRole,
    login,
    register,
    logout,
  }
})
