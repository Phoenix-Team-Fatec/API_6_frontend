import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
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
    created_at: "2026-03-01T10:00:00Z"
  },
  {
    id: 2,
    texto_original: "Gerentes da Adidas têm comissão de 8% a partir de janeiro de 2026",
    marca: "Adidas",
    cargo: "Gerente",
    comissao: 8,
    data: "2026-01",
    explicacao: "A IA identificou 'Adidas' como marca. 'Gerentes' foi mapeado para 'Gerente'. O percentual '8%' e a data 'janeiro de 2026' foram extraídos e normalizados.",
    created_at: "2026-03-10T14:30:00Z"
  },
  {
    id: 3,
    texto_original: "Representantes da Puma recebem 6% de comissão desde fevereiro de 2026",
    marca: "Puma",
    cargo: "Representante",
    comissao: 6,
    data: "2026-02",
    explicacao: "Identificado 'Puma' como marca, 'Representantes' como cargo, '6%' como percentual de comissão e 'fevereiro de 2026' normalizado para 2026-02.",
    created_at: "2026-03-15T09:15:00Z"
  }
]

let nextId = 4

// Flag para usar mock ou API real
const USE_MOCK = true

export const rulesApi = {
  async interpret(text) {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 1500)) // simula delay da IA
      return {
        data: {
          marca: text.match(/nike/i) ? "Nike" : text.match(/adidas/i) ? "Adidas" : text.match(/puma/i) ? "Puma" : "Marca Identificada",
          cargo: text.match(/gerente/i) ? "Gerente" : text.match(/representante/i) ? "Representante" : "Vendedor",
          comissao: parseFloat(text.match(/(\d+(?:\.\d+)?)\s*%/)?.[1] || "5"),
          data: text.match(/janeiro/i) ? "2026-01" : text.match(/fevereiro/i) ? "2026-02" : text.match(/março/i) ? "2026-03" : "2026-03",
          explicacao: `A IA analisou o texto "${text.substring(0, 50)}..." e identificou os seguintes campos:\n\n• **Marca**: Identificada pelo nome da empresa mencionada no contexto da frase.\n• **Cargo**: Inferido pelo papel profissional descrito (vendedor, gerente, etc).\n• **Comissão**: Extraída do percentual numérico seguido do símbolo "%".\n• **Data**: Normalizada a partir da referência temporal mencionada no texto.`
        }
      }
    }
    return api.post('/rules/interpret', { texto: text })
  },

  async save(rule) {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 800))
      const newRule = { ...rule, id: nextId++, created_at: new Date().toISOString() }
      mockRules.push(newRule)
      return { data: newRule }
    }
    return api.post('/rules', rule)
  },

  async getAll(params = {}) {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 600))
      let rules = [...mockRules]
      if (params.marca) rules = rules.filter(r => r.marca.toLowerCase().includes(params.marca.toLowerCase()))
      if (params.cargo) rules = rules.filter(r => r.cargo.toLowerCase().includes(params.cargo.toLowerCase()))
      return { data: { rules, total: rules.length, page: 1, per_page: 10 } }
    }
    return api.get('/rules', { params })
  },

  async getById(id) {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 400))
      const rule = mockRules.find(r => r.id === Number(id))
      if (!rule) throw new Error('Regra não encontrada')
      return { data: rule }
    }
    return api.get(`/rules/${id}`)
  }
}

export default api
