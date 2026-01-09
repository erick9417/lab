export function normalizeAnswers(answers) {
  const out = {}
  if (!answers || typeof answers !== 'object') return out
  for (const [qId, value] of Object.entries(answers)) {
    if (Array.isArray(value)) out[qId] = value.filter(Boolean)
    else if (value != null) out[qId] = [value]
  }
  return out
}

function buildOptionIndex(schema) {
  const idx = {}
  if (!schema?.questions) return idx
  for (const q of schema.questions) {
    const qIdx = {}
    for (const opt of q.options || []) qIdx[opt.id] = opt
    idx[q.id] = qIdx
  }
  return idx
}

function computeScores(schema, normAnswers, optionIndex) {
  const resultKeys = Array.isArray(schema?.results) ? schema.results : []
  const scores = {}
  const breakdown = {}
  for (const key of resultKeys) scores[key] = 0

  for (const [qId, selected] of Object.entries(normAnswers)) {
    const qIdx = optionIndex[qId] || {}
    const details = []
    for (const optId of selected) {
      const opt = qIdx[optId]
      if (!opt) continue
      const weights = opt.weights || {}
      for (const key of resultKeys) {
        const w = typeof weights[key] === 'number' ? weights[key] : 0
        scores[key] = (scores[key] ?? 0) + w
      }
      details.push({ optionId: optId, weightsApplied: { ...weights } })
    }
    if (details.length) breakdown[qId] = details
  }
  return { scores, breakdown }
}

function matchesOverride(normAnswers, rule) {
  const all = Array.isArray(rule?.all) ? rule.all : []
  if (!all.length) return false
  for (const cond of all) {
    const sel = normAnswers[cond.q] || []
    if (!sel.includes(cond.o)) return false
  }
  return true
}

function applyThresholds(scores, thresholds) {
  if (!Array.isArray(thresholds) || !thresholds.length) return { ...scores }
  const out = {}
  for (const [key, val] of Object.entries(scores)) {
    const th = thresholds.find(t => t.result === key)
    if (!th || typeof th.min !== 'number' || val >= th.min) out[key] = val
  }
  return out
}

function pickBestResult(scored, tiebreakers) {
  const entries = Object.entries(scored)
  if (!entries.length) return null
  let max = Math.max(...entries.map(([, v]) => v))
  let best = entries.filter(([, v]) => v === max).map(([k]) => k)
  if (best.length === 1) return best[0]
  if (Array.isArray(tiebreakers) && tiebreakers.length) {
    for (const pref of tiebreakers) if (best.includes(pref)) return pref
  }
  return best.sort()[0]
}

export function evaluateTest(schema, answers) {
  const normAnswers = normalizeAnswers(answers)
  const optionIndex = buildOptionIndex(schema)

  if (Array.isArray(schema?.overrides)) {
    for (const rule of schema.overrides) {
      if (matchesOverride(normAnswers, rule)) {
        const result = rule.result
        return {
          result,
          method: 'override',
          scores: {},
          breakdown: {},
          appliedOverride: { result, reason: rule.reason || '' }
        }
      }
    }
  }

  const { scores, breakdown } = computeScores(schema, normAnswers, optionIndex)
  const filtered = applyThresholds(scores, schema?.thresholds)
  const result = pickBestResult(filtered, schema?.tiebreakers)

  return {
    result,
    method: 'score',
    scores,
    breakdown
  }
}

export function validateSchema(schema) {
  const errors = []
  if (!schema || typeof schema !== 'object') errors.push('Schema ausente o inválido')
  if (!Array.isArray(schema?.results) || !schema.results.length) errors.push('results debe ser un arreglo no vacío')
  if (!Array.isArray(schema?.questions) || !schema.questions.length) errors.push('questions debe ser un arreglo no vacío')
  const resultSet = new Set(schema?.results || [])
  for (const q of schema?.questions || []) {
    if (!q.id) errors.push('Cada pregunta requiere id')
    if (!Array.isArray(q.options) || !q.options.length) errors.push(`La pregunta ${q.id} requiere opciones`)
    for (const opt of q.options || []) {
      if (!opt.id) errors.push(`Opción sin id en pregunta ${q.id}`)
      if (opt.weights) {
        for (const [k, v] of Object.entries(opt.weights)) {
          if (!resultSet.has(k)) errors.push(`Peso para resultado desconocido "${k}" en ${q.id}/${opt.id}`)
          if (typeof v !== 'number') errors.push(`Peso no numérico en ${q.id}/${opt.id} para ${k}`)
        }
      }
    }
  }
  return { valid: errors.length === 0, errors }
}

export function exampleSchema() {
  return {
    results: ['A', 'B', 'C'],
    questions: [
      { id: 'q1', options: [
        { id: 'o1', weights: { A: 2, B: 0, C: 0 } },
        { id: 'o2', weights: { A: 0, B: 2, C: 0 } },
        { id: 'o3', weights: { A: 0, B: 0, C: 2 } },
      ]},
      { id: 'q2', options: [
        { id: 'x1', weights: { A: 1, B: 1, C: 0 } },
        { id: 'x2', weights: { A: 0, B: 1, C: 1 } },
      ]},
    ],
    overrides: [
      { all: [{ q: 'q1', o: 'o3' }, { q: 'q2', o: 'x2' }], result: 'C', reason: 'Regla prioritaria' }
    ],
    thresholds: [ { result: 'A', min: 2 } ],
    tiebreakers: ['B', 'A', 'C']
  }
}
