import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

const parseEnvBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === '') return defaultValue
  return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase())
}

// Flags de ambiente para alternar entre mock e backend.
const USE_MOCK = parseEnvBoolean(import.meta.env.VITE_USE_MOCK, true)
const USE_BACKEND = parseEnvBoolean(import.meta.env.VITE_USE_BACKEND, true)
const USE_AI = parseEnvBoolean(import.meta.env.VITE_USE_AI, true)

// Mock data para desenvolvimento
const mockRules = [
  {
    id: 1,
    texto_original: "Vendedores da marca Nike recebem 5% de comissão a partir de março de 2026",
    marca: "Nike",
    cargo: "Vendedor",
    comissao: 5,
    data: "2026-03",
    explicacao: "A IA identificou 'Nike' como marca pelo contexto da frase. 'Vendedores' foi mapeado para o cargo 'Vendedor'. O percentual '5%' foi extraído diretamente. A data 'março de 2026' foi normalizada para o formato 2026-03.",
    created_at: "2026-03-01T10:00:00Z",
    updated_at: "2026-03-02T10:00:00Z",
    versao: 2,
    versoesAnteriores: [
      {
        marca: "Nike",
        cargo: "Vendedor",
        comissao: 4.5,
        data: "2026-03",
        texto_original: "Vendedores da marca Nike recebem 4,5% de comissão a partir de março de 2026",
        explicacao: "Versão anterior da regra antes do reajuste para 5%.",
        isVigente: true,
      }
    ],
    isVigente: true
  },
  {
    id: 2,
    texto_original: "Gerentes da Adidas têm comissão de 8% a partir de janeiro de 2026",
    marca: "Adidas",
    cargo: "Gerente",
    comissao: 8,
    data: "2026-01",
    explicacao: "A IA identificou 'Adidas' como marca. 'Gerentes' foi mapeado para 'Gerente'. O percentual '8%' e a data 'janeiro de 2026' foram extraídos e normalizados.",
    created_at: "2026-03-10T14:30:00Z",
    updated_at: "2026-03-10T14:30:00Z",
    versao: 1,
    versoesAnteriores: [],
    isVigente: false
  },
  {
    id: 3,
    texto_original: "Representantes da Puma recebem 6% de comissão desde fevereiro de 2026",
    marca: "Puma",
    cargo: "Representante",
    comissao: 6,
    data: "2026-02",
    explicacao: "Identificado 'Puma' como marca, 'Representantes' como cargo, '6%' como percentual de comissão e 'fevereiro de 2026' normalizado para 2026-02.",
    created_at: "2026-03-15T09:15:00Z",
    updated_at: "2026-03-15T09:15:00Z",
    versao: 1,
    versoesAnteriores: [],
    isVigente: true
  }
]

let nextId = 4

let cachedBackendRules = []

const mapBackendRuleToFrontend = (item) => {
  return {
    id: item.id,
    codMarca: item.codMarca,
    codCargo: item.codCargo,
    marca: item.descrMarca,
    cargo: item.descriCargo,
    comissao: Number((Number(item.pctComiss || 0) * 100).toFixed(2)),
    data: item.data ? item.data.substring(0, 7) : '',
    texto_original: item.textoOriginal,
    explicacao: item.explicacao,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
    versao: item.versao,
    versoesAnteriores: item.versoesAnteriores,
    isVigente: item.isVigente ?? true
  }
}

const applyLocalFilters = (rules, params = {}) => {
  let filtered = [...rules]
  if (params.marca) filtered = filtered.filter(r => r.marca.toLowerCase().includes(String(params.marca).toLowerCase()))
  if (params.cargo) filtered = filtered.filter(r => r.cargo.toLowerCase().includes(String(params.cargo).toLowerCase()))
  if (params.isVigente === 'true' || params.isVigente === true) filtered = filtered.filter(r => r.isVigente === true)
  if (params.isVigente === 'false' || params.isVigente === false) filtered = filtered.filter(r => r.isVigente === false)
  return filtered
}

const extractYearMonthFromText = (text) => {
  const normalizedText = String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  const monthMap = {
    janeiro: '01',
    fevereiro: '02',
    marco: '03',
    abril: '04',
    maio: '05',
    junho: '06',
    julho: '07',
    agosto: '08',
    setembro: '09',
    outubro: '10',
    novembro: '11',
    dezembro: '12',
  }

  const match = normalizedText.match(/(janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+de\s+(\d{4})/)

  if (!match) {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }

  const [, monthName, year] = match
  return `${year}-${monthMap[monthName]}`
}

const normalizeForComparison = (value) => {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

const ignoredBrandTerms = new Set([
  'gerente', 'gerentes',
  'representante', 'representantes',
  'vendedor', 'vendedores', 'vendedora', 'vendedoras',
  'assistente', 'assistentes',
  'de', 'da', 'do', 'das', 'dos', 'e', 'a', 'o', 'as', 'os',
  'marca', 'marcas',
])

const ignoredBrandPhrases = new Set([
  'gerente de loja',
  'gerentes de loja',
  'vendedor balcao',
  'vendedores balcao',
  'assistente de vendas',
  'assistentes de vendas',
  'gerente quiosque',
  'gerentes quiosque',
  'vendedor loja',
  'vendedores loja',
])

const extractCargoFromText = (text) => {
  const normalizedText = normalizeForComparison(text)

  const cargoMatchers = [
    { regex: /\bgerentes?\s+de\s+loja\b/, cargo: 'Gerente de Loja' },
    { regex: /\bvendedores?\s+balca[oã]\b/, cargo: 'Vendedor Balcao' },
    { regex: /\bassistentes?\s+de\s+vendas\b/, cargo: 'Assistente de Vendas' },
    { regex: /\bgerentes?\s+quiosque\b/, cargo: 'Gerente Quiosque' },
    { regex: /\bvendedores?\s+loja\b/, cargo: 'Vendedor Loja' },
    { regex: /\bgerentes?\b/, cargo: 'Gerente' },
    { regex: /\brepresentantes?\b/, cargo: 'Representante' },
    { regex: /\bvendedores?\b/, cargo: 'Vendedor' },
  ]

  const match = cargoMatchers.find(({ regex }) => regex.test(normalizedText))
  return match ? match.cargo : 'Vendedor'
}

const extractBrandFromText = (text) => {
  const tokens = String(text || '').match(/[A-Za-zÀ-ÿ0-9]+/g) || []

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]
    const normalizedToken = normalizeForComparison(token)

    if (!normalizedToken || ignoredBrandTerms.has(normalizedToken)) continue

    const twoWordPhrase = normalizeForComparison(`${token} ${tokens[i + 1] || ''}`)
    const threeWordPhrase = normalizeForComparison(`${token} ${tokens[i + 1] || ''} ${tokens[i + 2] || ''}`)
    if (ignoredBrandPhrases.has(twoWordPhrase) || ignoredBrandPhrases.has(threeWordPhrase)) continue

    const startsWithUpper = /^[A-ZÀ-Ý][a-zà-ÿ0-9]+$/.test(token)
    const isAllUpper = /^[A-ZÀ-Ý0-9]{2,}$/.test(token)
    if (startsWithUpper || isAllUpper) {
      return token
    }
  }

  return 'Marca Identificada'
}

export const rulesApi = {
  async interpret(text) {
    if (USE_AI) {
      try {
        const response = await api.post('/rules/interpret', { texto: text })
        return response
      } catch (error) {
        console.warn('Backend indisponivel para interpretacao. Usando mock.', error?.message)
        if (!USE_MOCK) {
          throw error
        }
      }
    }

    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 1500)) // simula delay da IA
      const detectedMarca = extractBrandFromText(text)
      const detectedCargo = extractCargoFromText(text)

      return {
        data: {
          marca: detectedMarca,
          cargo: detectedCargo,
          comissao: parseFloat(text.match(/(\d+(?:\.\d+)?)\s*%/)?.[1] || "5"),
          data: extractYearMonthFromText(text),
          explicacao: `A IA analisou o texto "${text.substring(0, 50)}..." e identificou os seguintes campos:\n\n• **Marca**: Identificada pelo nome da empresa mencionada no contexto da frase.\n• **Cargo**: Inferido pelo papel profissional descrito (vendedor, gerente, etc).\n• **Comissão**: Extraída do percentual numérico seguido do símbolo "%".\n• **Data**: Normalizada a partir da referência temporal mencionada no texto.`
        }
      }
    }

    throw new Error('Interpretacao de regra indisponivel: IA e mock estao desativados.')
  },

  async save(rule) {
    if (USE_BACKEND) {
      try {
        const response = await api.post('/api/rules', rule)
        return response
      } catch (error) {
        console.warn('Backend indisponivel para salvamento. Usando mock.', error?.message)
        if (!USE_MOCK) {
          throw error
        }
      }
    }

    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 800))
      const now = new Date().toISOString()
      const newRule = { ...rule, id: nextId++, created_at: now, updated_at: now, versao: 1, versoesAnteriores: [] }
      mockRules.push(newRule)
      return { data: newRule }
    }

    throw new Error('Salvamento de regra indisponivel: backend e mock estao desativados.')
  },

  async update(id, ruleData) {
    if (USE_BACKEND) {
      try {
        const response = await api.put(`/api/rules/${id}`, ruleData)
        const hasBackendPayload = response?.data && typeof response.data === 'object' && response.data.id !== undefined
        const updatedRule = hasBackendPayload
          ? mapBackendRuleToFrontend(response.data)
          : { id: Number(id), ...ruleData }
        cachedBackendRules = cachedBackendRules.map(r =>
          String(r.id) === String(id) ? { ...r, ...updatedRule } : r
        )
        return { data: updatedRule }
      } catch (error) {
        console.warn('Backend indisponivel para atualização. Usando mock.', error?.message)
        if (!USE_MOCK) {
          throw error
        }
      }
    }

    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 500))
      const rule = mockRules.find(r => String(r.id) === String(id))
      if (!rule) throw new Error('Regra não encontrada')

      const previousSnapshot = {
        marca: rule.marca,
        cargo: rule.cargo,
        comissao: rule.comissao,
        data: rule.data,
        texto_original: rule.texto_original,
        explicacao: rule.explicacao,
        isVigente: rule.isVigente,
      }

      rule.versoesAnteriores = Array.isArray(rule.versoesAnteriores) ? [...rule.versoesAnteriores, previousSnapshot] : [previousSnapshot]

      if (ruleData.codMarca !== undefined) rule.codMarca = ruleData.codMarca
      if (ruleData.descrMarca !== undefined) rule.marca = ruleData.descrMarca
      if (ruleData.codCargo !== undefined) rule.codCargo = ruleData.codCargo
      if (ruleData.descriCargo !== undefined) rule.cargo = ruleData.descriCargo
      if (ruleData.pctComiss !== undefined) rule.comissao = Number((Number(ruleData.pctComiss) * 100).toFixed(2))
      if (ruleData.data !== undefined) rule.data = ruleData.data
      if (ruleData.textoOriginal !== undefined) rule.texto_original = ruleData.textoOriginal
      if (ruleData.explicacao !== undefined) rule.explicacao = ruleData.explicacao
      if (ruleData.isVigente !== undefined) rule.isVigente = ruleData.isVigente

      rule.updated_at = new Date().toISOString()
      rule.versao = (rule.versao || 1) + 1

      const updated = { ...rule }
      cachedBackendRules = cachedBackendRules.map(r =>
        String(r.id) === String(id) ? { ...r, ...updated } : r
      )
      return { data: updated }
    }

    throw new Error('Atualizacao de regra indisponivel: backend e mock estao desativados.')
  },

  async getAll(params = {}) {
    if (USE_BACKEND) {
      try {
        const backendParams = {}
        if (params.isVigente === 'true' || params.isVigente === true) backendParams.isVigente = true
        if (params.isVigente === 'false' || params.isVigente === false) backendParams.isVigente = false

        const res = await api.get('/api/rules/commission-rates', { params: backendParams })
        const backendRules = (Array.isArray(res.data) ? res.data : []).map(item => mapBackendRuleToFrontend(item))
        const rules = applyLocalFilters(backendRules, params)
        cachedBackendRules = rules
        return { data: { rules, total: rules.length, page: 1, per_page: 10 } }
      } catch (error) {
        console.warn('Backend indisponivel para listagem. Usando mock.', error?.message)
        if (!USE_MOCK) throw error
      }
    }

    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 600))
      let rules = applyLocalFilters(mockRules, params)
      return { data: { rules, total: rules.length, page: 1, per_page: 10 } }
    }

    throw new Error('Listagem de regras indisponivel: backend e mock estao desativados.')
  },

  async getById(id) {
    const cached = cachedBackendRules.find(r => String(r.id) === String(id))
    if (cached) {
      return { data: cached }
    }

    if (USE_BACKEND) {
      try {
        const response = await api.get(`/api/rules/${id}`)
        return { data: mapBackendRuleToFrontend(response.data) }
      } catch (error) {
        console.warn('Backend indisponivel para busca por ID. Usando mock.', error?.message)
        if (!USE_MOCK) {
          throw error
        }
      }
    }

    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 400))
      const rule = mockRules.find(r => r.id === Number(id))
      if (!rule) throw new Error('Regra não encontrada')
      return { data: rule }
    }

    throw new Error('Busca de regra indisponivel: backend e mock estao desativados.')
  },

  async delete(id) {
    if (USE_BACKEND) {
      try {
        const response = await api.delete(`/api/rules/${id}`)
        cachedBackendRules = cachedBackendRules.filter(r => String(r.id) !== String(id))
        return response
      } catch (error) {
        console.warn('Backend indisponivel para exclusão. Usando mock.', error?.message)
        if (!USE_MOCK) {
          throw error
        }
      }
    }

    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 400))
      const ruleIndex = mockRules.findIndex(r => String(r.id) === String(id))
      if (ruleIndex === -1) throw new Error('Regra não encontrada')
      mockRules.splice(ruleIndex, 1)
      cachedBackendRules = cachedBackendRules.filter(r => String(r.id) !== String(id))
      return { data: { success: true } }
    }

    throw new Error('Exclusao de regra indisponivel: backend e mock estao desativados.')
  },

  async deactivate(id) {
    if (USE_BACKEND) {
      try {
        const response = await api.post(`/api/rules/${id}/deactivate`)
        const hasBackendPayload = response?.data && typeof response.data === 'object' && response.data.id !== undefined
        const updatedRule = hasBackendPayload
          ? mapBackendRuleToFrontend(response.data)
          : { id: Number(id), isVigente: false }
        cachedBackendRules = cachedBackendRules.map(r =>
          String(r.id) === String(id) ? { ...r, ...updatedRule, isVigente: false } : r
        )
        return { data: updatedRule }
      } catch (error) {
        console.warn('Backend indisponivel para desativação. Usando mock.', error?.message)
        if (!USE_MOCK) {
          throw error
        }
      }
    }

    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 400))
      const rule = mockRules.find(r => String(r.id) === String(id))
      if (!rule) throw new Error('Regra não encontrada')
      rule.isVigente = false
      const updated = { ...rule }
      cachedBackendRules = cachedBackendRules.map(r =>
        String(r.id) === String(id) ? updated : r
      )
      return { data: updated }
    }

    throw new Error('Desativacao de regra indisponivel: backend e mock estao desativados.')
  },

  async activate(id) {
    if (USE_BACKEND) {
      try {
        const response = await api.post(`/api/rules/${id}/activate`)
        const hasBackendPayload = response?.data && typeof response.data === 'object' && response.data.id !== undefined
        const updatedRule = hasBackendPayload
          ? mapBackendRuleToFrontend(response.data)
          : { id: Number(id), isVigente: true }
        cachedBackendRules = cachedBackendRules.map(r =>
          String(r.id) === String(id) ? { ...r, ...updatedRule, isVigente: true } : r
        )
        return { data: updatedRule }
      } catch (error) {
        console.warn('Backend indisponivel para ativação. Usando mock.', error?.message)
        if (!USE_MOCK) {
          throw error
        }
      }
    }

    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 400))
      const rule = mockRules.find(r => String(r.id) === String(id))
      if (!rule) throw new Error('Regra não encontrada')
      rule.isVigente = true
      const updated = { ...rule }
      cachedBackendRules = cachedBackendRules.map(r =>
        String(r.id) === String(id) ? updated : r
      )
      return { data: updated }
    }

    throw new Error('Ativacao de regra indisponivel: backend e mock estao desativados.')
  },

  async rollback(id) {
    if (USE_BACKEND) {
      try {
        await api.post(`/api/rules/${id}/rollback`)
        const refreshed = await api.get(`/api/rules/${id}`)
        return { data: mapBackendRuleToFrontend(refreshed.data) }
      } catch (error) {
        console.warn('Backend indisponivel para rollback. Usando mock.', error?.message)
        if (!USE_MOCK) {
          throw error
        }
      }
    }

    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 400))
      const rule = mockRules.find(r => String(r.id) === String(id))
      if (!rule) throw new Error('Regra não encontrada')

      if (!Array.isArray(rule.versoesAnteriores) || rule.versoesAnteriores.length === 0) {
        return { data: { ...rule } }
      }

      const previousSnapshot = rule.versoesAnteriores[rule.versoesAnteriores.length - 1]
      rule.marca = previousSnapshot.marca ?? rule.marca
      rule.cargo = previousSnapshot.cargo ?? rule.cargo
      rule.comissao = previousSnapshot.comissao ?? rule.comissao
      rule.data = previousSnapshot.data ?? rule.data
      rule.texto_original = previousSnapshot.texto_original ?? rule.texto_original
      rule.explicacao = previousSnapshot.explicacao ?? rule.explicacao
      rule.isVigente = previousSnapshot.isVigente ?? rule.isVigente
      rule.versoesAnteriores = rule.versoesAnteriores.slice(0, -1)
      rule.versao = Math.max(1, (rule.versao || 1) - 1)
      rule.updated_at = new Date().toISOString()

      const updated = { ...rule }
      cachedBackendRules = cachedBackendRules.map(r =>
        String(r.id) === String(id) ? updated : r
      )
      return { data: updated }
    }

    throw new Error('Rollback de regra indisponivel: backend e mock estao desativados.')
  }
}

export default api
