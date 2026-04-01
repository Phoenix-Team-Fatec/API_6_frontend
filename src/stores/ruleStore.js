import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { rulesApi } from '../services/api'

export const useRuleStore = defineStore('rule', () => {
  const currentRuleText = ref('')
  const interpretedRule = ref(null)
  const explanation = ref('')
  const rulesList = ref([])
  const currentRule = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const total = ref(0)
  const filters = ref({ marca: '', cargo: '', data_inicio: '', data_fim: '' })

  const hasInterpretedRule = computed(() => !!interpretedRule.value)

  async function interpretRule(text) {
    loading.value = true
    error.value = null
    try {
      const res = await rulesApi.interpret(text)
      interpretedRule.value = res.data
      explanation.value = res.data.explicacao
      currentRuleText.value = text
    } catch (err) {
      error.value = 'Erro ao interpretar a regra. Tente novamente.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function saveRule(ruleData) {
    loading.value = true
    error.value = null
    try {
      const payload = {
        texto_original: currentRuleText.value,
        ...interpretedRule.value,
        ...ruleData,
      }
      const res = await rulesApi.save(payload)
      interpretedRule.value = null
      currentRuleText.value = ''
      explanation.value = ''
      return res.data
    } catch (err) {
      error.value = 'Erro ao salvar a regra.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchRules(params = {}) {
    loading.value = true
    error.value = null
    try {
      const res = await rulesApi.getAll({ ...filters.value, ...params })
      rulesList.value = res.data.rules || res.data
      total.value = res.data.total || rulesList.value.length
    } catch (err) {
      error.value = 'Erro ao carregar as regras.'
    } finally {
      loading.value = false
    }
  }

  async function fetchRuleById(id) {
    loading.value = true
    error.value = null
    currentRule.value = null
    try {
      const res = await rulesApi.getById(id)
      currentRule.value = res.data
    } catch (err) {
      error.value = 'Regra não encontrada.'
    } finally {
      loading.value = false
    }
  }

  function resetInterpretation() {
    interpretedRule.value = null
    explanation.value = ''
    currentRuleText.value = ''
    error.value = null
  }

  return {
    currentRuleText,
    interpretedRule,
    explanation,
    rulesList,
    currentRule,
    loading,
    error,
    total,
    filters,
    hasInterpretedRule,
    interpretRule,
    saveRule,
    fetchRules,
    fetchRuleById,
    resetInterpretation,
  }
})
