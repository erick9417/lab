import { evaluateTest, validateSchema } from './testLogic'

// Estructura sencilla para mapear "Condiciones que la activan" → Plantilla
// Cada regla lista las selecciones requeridas (all-of). Rellena con tus IDs reales.
// Ejemplo:
// { plantilla: 'Supinación', condiciones: [ { q: 'q_desgaste', o: 'externo' }, { q: 'q_dolor', o: 'talon' } ] }
export const activationRules = [
  // TODO: Rellena usando el PDF "Resultados.pdf"
  // { plantilla: 'Supinación', condiciones: [ { q: 'qX', o: 'oY' }, { q: 'qZ', o: 'oW' } ] },
  // { plantilla: 'Pronación',  condiciones: [ { q: 'qA', o: 'oB' } ] },
]

// Construye un schema compatible con testLogic a partir de reglas de activación
export function activationSchemaFromRules(rules) {
  const results = Array.from(new Set(rules.map(r => r.plantilla))).filter(Boolean)

  // Recolecta todas las preguntas y opciones mencionadas en las reglas
  const qMap = new Map()
  for (const r of rules) {
    for (const cond of r.condiciones || []) {
      if (!qMap.has(cond.q)) qMap.set(cond.q, new Set())
      qMap.get(cond.q).add(cond.o)
    }
  }

  const questions = Array.from(qMap.entries()).map(([qid, optSet]) => ({
    id: qid,
    options: Array.from(optSet).map(optId => ({ id: optId }))
  }))

  // Overrides: cada regla se traduce a una condición all-of que fuerza el resultado
  const overrides = rules.map(r => ({
    all: (r.condiciones || []).map(c => ({ q: c.q, o: c.o })),
    result: r.plantilla,
    reason: 'Condiciones que la activan'
  }))

  const schema = { results, questions, overrides }
  const { valid, errors } = validateSchema(schema)
  if (!valid) {
    // El schema puede carecer de pesos; validateSchema exige que questions y results existan.
    // Si faltan, devolvemos igualmente el schema para su uso con overrides, que no requieren pesos.
    // console.warn('Schema de activación con advertencias:', errors)
  }
  return schema
}

// Evalúa solo por reglas de activación (sin puntajes). Si no hay match, result será null.
export function evaluateByActivation(rules, answers) {
  const schema = activationSchemaFromRules(rules)
  const res = evaluateTest(schema, answers)
  return res
}

// Utilidad para crear respuestas de una sola selección por pregunta
export function buildAnswers(pairs) {
  const a = {}
  for (const { q, o } of pairs) a[q] = o
  return a
}
