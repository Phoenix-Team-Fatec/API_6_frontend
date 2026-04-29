import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { rulesApi } from '../services/api'

export const useRuleStore = defineStore('rule', () => {
  const currentRuleName = ref('')
  const currentRuleText = ref('')
  const interpretedRule = ref(null)
  const explanation = ref('')
  const editingRuleId = ref(null)
  const rulesList = ref([])
  const trashRulesList = ref([])
  const currentRule = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const total = ref(0)
  const trashTotal = ref(0)
  const filters = ref({ marca: '', cargo: '', isVigente: '', data_inicio: '', data_fim: '' })

  const hasInterpretedRule = computed(() => !!interpretedRule.value)
  const isEditing = computed(() => editingRuleId.value !== null)

  async function interpretRule(text, name = currentRuleName.value) {
    const trimmedName = String(name || '').trim()
    if (!trimmedName) {
      error.value = 'Informe o nome da regra antes de interpretar.'
      return
    }

    loading.value = true
    error.value = null
    try {
      const res = await rulesApi.interpret(text)
      interpretedRule.value = { ...res.data, nomeRegra: trimmedName, nome: trimmedName }
      explanation.value = res.data.explicacao
      currentRuleName.value = trimmedName
      currentRuleText.value = text
    } catch (err) {
      error.value = 'Erro ao interpretar a regra. Tente novamente.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function saveRule(ruleData) {
    const trimmedName = String(ruleData?.nomeRegra || ruleData?.nome || currentRuleName.value).trim()
    if (!trimmedName) {
      error.value = 'Informe o nome da regra antes de salvar.'
      throw new Error('Nome da regra é obrigatório.')
    }

    loading.value = true
    error.value = null
    try {
      const interpreted = interpretedRule.value || {}
      const mergedRule = { ...interpreted, ...ruleData }
      const commissionValue = Number(mergedRule.comissao)
      currentRuleName.value = trimmedName

      const payload = {
        nomeRegra: trimmedName,
        nome: trimmedName,
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
        nomeRegra: trimmedName,
        nome: trimmedName,
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
      currentRuleName.value = ''
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
    currentRuleName.value = rule.nomeRegra || rule.nome || rule.nome_regra || ''
    currentRuleText.value = rule.texto_original || ''
    explanation.value = rule.explicacao || ''
    interpretedRule.value = {
      id: rule.id,
      nomeRegra: rule.nomeRegra || rule.nome || rule.nome_regra || '',
      nome: rule.nome || rule.nomeRegra || rule.nome_regra || '',
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

  async function fetchTrashRules(params = {}) {
    loading.value = true
    error.value = null
    try {
      const res = await rulesApi.getTrash({ ...filters.value, ...params })
      trashRulesList.value = res.data.rules || res.data
      trashTotal.value = res.data.total || trashRulesList.value.length
    } catch (err) {
      error.value = 'Erro ao carregar regras da lixeira.'
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

  async function restoreRule(id) {
    loading.value = true
    error.value = null
    try {
      const res = await rulesApi.restore(id)
      const restoredRule = res.data
      trashRulesList.value = trashRulesList.value.filter(rule => String(rule.id) !== String(id))
      trashTotal.value = Math.max(0, trashTotal.value - 1)

      if (restoredRule) {
        const exists = rulesList.value.some(rule => String(rule.id) === String(id))
        if (!exists) {
          rulesList.value = [restoredRule, ...rulesList.value]
          total.value += 1
        }
      }

      return restoredRule
    } catch (err) {
      error.value = 'Erro ao restaurar a regra.'
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
        currentRuleName.value = updatedRule.nomeRegra || updatedRule.nome || updatedRule.nome_regra || currentRuleName.value
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
    currentRuleName.value = ''
    editingRuleId.value = null
    error.value = null
  }

  return {
    currentRuleName,
    currentRuleText,
    interpretedRule,
    explanation,
    editingRuleId,
    rulesList,
    trashRulesList,
    currentRule,
    loading,
    error,
    total,
    trashTotal,
    filters,
    hasInterpretedRule,
    isEditing,
    interpretRule,
    saveRule,
    startEditingRule,
    clearEditingRule,
    fetchRules,
    fetchRuleById,
    fetchTrashRules,
    deleteRule,
    restoreRule,
    deactivateRule,
    activateRule,
    rollbackRule,
    resetInterpretation,
  }
})
