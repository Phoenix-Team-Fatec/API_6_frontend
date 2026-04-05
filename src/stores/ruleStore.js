import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { rulesApi } from '../services/api'

export const useRuleStore = defineStore('rule', () => {
  const currentRuleText = ref('')
  const interpretedRule = ref(null)
  const explanation = ref('')
  const editingRuleId = ref(null)
  const rulesList = ref([])
  const currentRule = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const total = ref(0)
  const filters = ref({ marca: '', cargo: '', isVigente: '', data_inicio: '', data_fim: '' })

  const hasInterpretedRule = computed(() => !!interpretedRule.value)
  const isEditing = computed(() => editingRuleId.value !== null)

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
      const interpreted = interpretedRule.value || {}
      const mergedRule = { ...interpreted, ...ruleData }
      const commissionValue = Number(mergedRule.comissao)

      const payload = {
        codMarca: mergedRule.codMarca,
        descrMarca: mergedRule.descrMarca || mergedRule.marca,
        codCargo: mergedRule.codCargo,
        descriCargo: mergedRule.descriCargo || mergedRule.cargo,
        pctComiss: Number.isFinite(commissionValue) ? Number((commissionValue / 100).toFixed(4)) : undefined,
        data: mergedRule.data,
        textoOriginal: currentRuleText.value,
        explicacao: explanation.value || mergedRule.explicacao || '',
        isVigente: mergedRule.isVigente,
      }

      const res = isEditing.value
        ? await rulesApi.update(editingRuleId.value, payload)
        : await rulesApi.save(payload)

      const savedRule = {
        ...mergedRule,
        ...(res.data || {}),
        id: res.data?.id ?? editingRuleId.value,
      }

      rulesList.value = isEditing.value
        ? rulesList.value.map(rule => (String(rule.id) === String(savedRule.id) ? { ...rule, ...savedRule } : rule))
        : [savedRule, ...rulesList.value]

      if (!isEditing.value) {
        total.value += 1
      }

      interpretedRule.value = null
      currentRuleText.value = ''
      explanation.value = ''
      editingRuleId.value = null
      return savedRule
    } catch (err) {
      error.value = isEditing.value ? 'Erro ao atualizar a regra.' : 'Erro ao salvar a regra.'
      throw err
    } finally {
      loading.value = false
    }
  }

  function startEditingRule(rule) {
    if (!rule || !rule.id) return
    editingRuleId.value = rule.id
    currentRuleText.value = rule.texto_original || ''
    explanation.value = rule.explicacao || ''
    interpretedRule.value = {
      id: rule.id,
      codMarca: rule.codMarca,
      descrMarca: rule.descrMarca || rule.marca,
      marca: rule.marca,
      codCargo: rule.codCargo,
      descriCargo: rule.descriCargo || rule.cargo,
      cargo: rule.cargo,
      comissao: rule.comissao,
      data: rule.data,
      explicacao: rule.explicacao || '',
      isVigente: rule.isVigente,
    }
  }

  function clearEditingRule() {
    editingRuleId.value = null
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

  async function deleteRule(id) {
    loading.value = true
    error.value = null
    try {
      await rulesApi.delete(id)
      rulesList.value = rulesList.value.filter(rule => String(rule.id) !== String(id))
      total.value = Math.max(0, total.value - 1)
      if (currentRule.value && String(currentRule.value.id) === String(id)) {
        currentRule.value = null
      }
    } catch (err) {
      error.value = 'Erro ao excluir a regra.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deactivateRule(id) {
    loading.value = true
    error.value = null
    try {
      const res = await rulesApi.deactivate(id)
      const existingRule = rulesList.value.find(rule => String(rule.id) === String(id)) || currentRule.value || {}
      const updatedRule = { ...existingRule, ...(res.data || {}), isVigente: false }
      rulesList.value = rulesList.value.map(rule =>
        String(rule.id) === String(id) ? updatedRule : rule
      )
      if (currentRule.value && String(currentRule.value.id) === String(id)) {
        currentRule.value = updatedRule
      }
      return updatedRule
    } catch (err) {
      error.value = 'Erro ao desativar a regra.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function activateRule(id) {
    loading.value = true
    error.value = null
    try {
      const res = await rulesApi.activate(id)
      const existingRule = rulesList.value.find(rule => String(rule.id) === String(id)) || currentRule.value || {}
      const updatedRule = { ...existingRule, ...(res.data || {}), isVigente: true }
      rulesList.value = rulesList.value.map(rule =>
        String(rule.id) === String(id) ? updatedRule : rule
      )
      if (currentRule.value && String(currentRule.value.id) === String(id)) {
        currentRule.value = updatedRule
      }
      return updatedRule
    } catch (err) {
      error.value = 'Erro ao ativar a regra.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function rollbackRule(id) {
    loading.value = true
    error.value = null
    try {
      const res = await rulesApi.rollback(id)
      const existingRule = rulesList.value.find(rule => String(rule.id) === String(id)) || currentRule.value || {}
      const updatedRule = { ...existingRule, ...(res.data || {}) }
      rulesList.value = rulesList.value.map(rule =>
        String(rule.id) === String(id) ? updatedRule : rule
      )
      if (currentRule.value && String(currentRule.value.id) === String(id)) {
        currentRule.value = updatedRule
      }
      if (isEditing.value && String(editingRuleId.value) === String(id)) {
        interpretedRule.value = {
          ...interpretedRule.value,
          ...updatedRule,
          marca: updatedRule.marca,
          cargo: updatedRule.cargo,
          comissao: updatedRule.comissao,
          data: updatedRule.data,
          explicacao: updatedRule.explicacao,
          isVigente: updatedRule.isVigente,
        }
        currentRuleText.value = updatedRule.texto_original || currentRuleText.value
        explanation.value = updatedRule.explicacao || explanation.value
      }
      return updatedRule
    } catch (err) {
      error.value = 'Erro ao realizar rollback da regra.'
      throw err
    } finally {
      loading.value = false
    }
  }

  function resetInterpretation() {
    interpretedRule.value = null
    explanation.value = ''
    currentRuleText.value = ''
    editingRuleId.value = null
    error.value = null
  }

  return {
    currentRuleText,
    interpretedRule,
    explanation,
    editingRuleId,
    rulesList,
    currentRule,
    loading,
    error,
    total,
    filters,
    hasInterpretedRule,
    isEditing,
    interpretRule,
    saveRule,
    startEditingRule,
    clearEditingRule,
    fetchRules,
    fetchRuleById,
    deleteRule,
    deactivateRule,
    activateRule,
    rollbackRule,
    resetInterpretation,
  }
})
