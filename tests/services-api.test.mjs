import test from 'node:test'
import assert from 'node:assert/strict'

import {
  buildCommissionCalculationPayload,
  mapGeneratedRuleResponseToFrontend,
  resolveRulePersistenceTarget,
  shouldFallbackToMockForError,
} from '../src/services/api.js'

test('maps generated override rule response to the frontend rule shape', () => {
  const mapped = mapGeneratedRuleResponseToFrontend({
    tipo: 'override',
    justificativa: 'Regra de comissao gerada pela IA',
    rules: [
      {
        id: 'rule-1',
        codMarca: 10,
        descrMarca: 'PRETO',
        codCargo: 300,
        descriCargo: 'VENDEDOR LOJA',
        pctComiss: 0.025,
        data: '2025-07-01',
        textoOriginal: 'Vendedores da marca PRETO recebem 2.5% em julho de 2025',
        explicacao: 'Campos inferidos pela IA',
        isVigente: true,
      },
    ],
    exceptions: [],
  })

  assert.equal(mapped.id, 'rule-1')
  assert.equal(mapped.codMarca, 10)
  assert.equal(mapped.marca, 'PRETO')
  assert.equal(mapped.codCargo, 300)
  assert.equal(mapped.cargo, 'VENDEDOR LOJA')
  assert.equal(mapped.comissao, 2.5)
  assert.equal(mapped.data, '2025-07')
  assert.equal(mapped.explicacao, 'Regra de comissao gerada pela IA')
  assert.equal(mapped.generatedByAi, true)
  assert.equal(mapped.persistedByGenerate, true)
})

test('builds commission calculation payloads for each target type', () => {
  assert.deepEqual(
    buildCommissionCalculationPayload('employee', '2025-07', { matricula: 'MATRIC-1' }),
    { month: '2025-07', targetType: 'EMPLOYEE', matricula: 'MATRIC-1' },
  )

  assert.deepEqual(
    buildCommissionCalculationPayload('store', '2025-07', { codigo: '35' }),
    { month: '2025-07', targetType: 'STORE', codLoja: 35 },
  )

  assert.deepEqual(
    buildCommissionCalculationPayload('brand', '2025-07', { codMarca: '10' }),
    { month: '2025-07', targetType: 'BRAND', codMarca: 10 },
  )
})

test('does not fallback to mock for backend validation or not found responses', () => {
  assert.equal(shouldFallbackToMockForError({ response: { status: 400 } }), false)
  assert.equal(shouldFallbackToMockForError({ response: { status: 404 } }), false)
  assert.equal(shouldFallbackToMockForError({ response: { status: 500 } }), true)
  assert.equal(shouldFallbackToMockForError({ request: {} }), true)
})

test('updates a rule already persisted by generate instead of creating a mock copy', () => {
  assert.deepEqual(
    resolveRulePersistenceTarget(null, { id: 'backend-id', persistedByGenerate: true }),
    { mode: 'update', id: 'backend-id' },
  )

  assert.deepEqual(
    resolveRulePersistenceTarget(null, { id: 'backend-id' }),
    { mode: 'create', id: null },
  )
})
