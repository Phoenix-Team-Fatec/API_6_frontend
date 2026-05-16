import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const STORAGE_KEY = 'ruleai_access_users'

export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
}

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.MANAGER]: 'Gerente',
}

export const ROLE_DESCRIPTIONS = {
  [ROLES.ADMIN]: 'Gerencia usuarios, acessos, regras, comissoes e cadastros sensiveis.',
  [ROLES.MANAGER]: 'Cria e gerencia regras de negocio, acompanha comissoes e consulta a operacao vinculada ao seu escopo.',
}

const defaultUsers = [
  {
    id: 1,
    name: 'Admin RuleAI',
    email: 'admin@ruleai.com',
    role: ROLES.ADMIN,
    employeeMatricula: '',
    scope: 'Todas as lojas',
    active: true,
    createdAt: '2026-05-01T10:00:00.000Z',
  },
  {
    id: 2,
    name: 'Gerente Loja Centro',
    email: 'gerente@ruleai.com',
    role: ROLES.MANAGER,
    employeeMatricula: 'GER-001',
    scope: 'Loja Centro',
    active: true,
    createdAt: '2026-05-02T10:00:00.000Z',
  },
]

const normalizeUser = (user) => ({
  ...user,
  role: user.role === 'ANALYST' ? ROLES.MANAGER : user.role,
})

const readUsers = () => {
  try {
    const storedUsers = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (!Array.isArray(storedUsers) || !storedUsers.length) return defaultUsers
    return storedUsers.map(normalizeUser)
  } catch {
    return defaultUsers
  }
}

const persistUsers = (users) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

export const useAccessStore = defineStore('access', () => {
  const users = ref(readUsers())

  const activeUsers = computed(() => users.value.filter(user => user.active))
  const adminUsers = computed(() => activeUsers.value.filter(user => user.role === ROLES.ADMIN))
  const managerUsers = computed(() => activeUsers.value.filter(user => user.role === ROLES.MANAGER))

  const findByEmail = (email) => users.value.find(user =>
    user.email.toLowerCase() === String(email || '').toLowerCase()
  )

  const save = () => persistUsers(users.value)

  const createUser = (payload) => {
    const email = String(payload.email || '').trim().toLowerCase()
    if (!email) throw new Error('Email obrigatorio.')
    if (findByEmail(email)) throw new Error('Ja existe um usuario com este email.')

    const newUser = {
      id: Date.now(),
      name: String(payload.name || '').trim(),
      email,
      role: payload.role || ROLES.MANAGER,
      employeeMatricula: String(payload.employeeMatricula || '').trim(),
      scope: String(payload.scope || '').trim() || 'A definir',
      active: true,
      createdAt: new Date().toISOString(),
    }

    users.value = [newUser, ...users.value]
    save()
    return newUser
  }

  const toggleUserStatus = (id) => {
    users.value = users.value.map(user =>
      String(user.id) === String(id) ? { ...user, active: !user.active } : user
    )
    save()
  }

  const updateUserRole = (id, role) => {
    users.value = users.value.map(user =>
      String(user.id) === String(id) ? { ...user, role } : user
    )
    save()
  }

  return {
    users,
    activeUsers,
    adminUsers,
    managerUsers,
    findByEmail,
    createUser,
    toggleUserStatus,
    updateUserRole,
  }
})
