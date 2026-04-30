import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const routes = [
  { path: '/', redirect: '/rules' },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/RegisterView.vue'),
    meta: { guest: true }
  },
  {
    path: '/',
    component: () => import('../layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'rules', name: 'RulesList', component: () => import('../views/RulesListView.vue') },
      { path: 'rules/new', name: 'CreateRule', component: () => import('../views/CreateRuleView.vue') },
      { path: 'rules/trash', name: 'RulesTrash', component: () => import('../views/RulesTrashView.vue') },
      { path: 'rules/confirm', name: 'ConfirmRule', component: () => import('../views/ConfirmRuleView.vue') },
      { path: 'rules/:id', name: 'RuleDetail', component: () => import('../views/RuleDetailView.vue') },
      { path: 'commission', name: 'Commission', component: () => import('../views/CommissionView.vue') },
      { path: 'commission/details', name: 'CommissionDetails', component: () => import('../views/CommissionDetailsView.vue') },
      { path: 'commission/calculate', name: 'CommissionCalculate', component: () => import('../views/CommissionCalculateView.vue') },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.guest && authStore.isAuthenticated) {
    next('/rules')
  } else {
    next()
  }
})

export default router
