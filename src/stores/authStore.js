import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('ruleai_user') || 'null'))
  const token = ref(localStorage.getItem('ruleai_token') || null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const userName = computed(() => user.value?.name || 'Usuário')
  const userEmail = computed(() => user.value?.email || '')
  const userInitials = computed(() => {
    if (!user.value?.name) return 'U'
    return user.value.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
  })

  async function login(email, password) {
    loading.value = true
    error.value = null
    try {
      await new Promise(r => setTimeout(r, 1200))
      if (email && password.length >= 6) {
        const userData = { id: 1, name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), email, role: 'Analista de Negócios', avatar: null }
        const fakeToken = btoa(JSON.stringify({ userId: 1, exp: Date.now() + 86400000 }))
        user.value = userData
        token.value = fakeToken
        localStorage.setItem('ruleai_user', JSON.stringify(userData))
        localStorage.setItem('ruleai_token', fakeToken)
        return true
      } else {
        throw new Error('Credenciais inválidas')
      }
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
      const userData = { id: Date.now(), name, email, role: 'Analista de Negócios', avatar: null }
      const fakeToken = btoa(JSON.stringify({ userId: userData.id, exp: Date.now() + 86400000 }))
      user.value = userData
      token.value = fakeToken
      localStorage.setItem('ruleai_user', JSON.stringify(userData))
      localStorage.setItem('ruleai_token', fakeToken)
      return true
    } catch (err) {
      error.value = 'Erro ao criar conta'
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

  return { user, token, loading, error, isAuthenticated, userName, userEmail, userInitials, login, register, logout }
})
