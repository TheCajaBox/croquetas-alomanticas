/**
 * Recorrido completo del AST.
 *
 * Existe porque el recorrido de acorn-walk no visita algunos nodos dentro de
 * los patrones de desestructuración -entre ellos `RestElement`, o sea los tres
 * puntitos de `{ a, ...resto }`-, y una comprobación estática que se salta
 * nodos da por bueno lo que no lo es.
 *
 * Este visita, por construcción, absolutamente todo lo que tenga `type`.
 */
const CLAVES_IGNORADAS = new Set(['type', 'start', 'end', 'loc', 'range', 'raw'])

export function recorrerAst(nodo, visitar) {
  if (!nodo || typeof nodo !== 'object') return

  if (Array.isArray(nodo)) {
    for (const hijo of nodo) recorrerAst(hijo, visitar)
    return
  }

  if (typeof nodo.type !== 'string') return

  visitar(nodo)

  for (const clave of Object.keys(nodo)) {
    if (CLAVES_IGNORADAS.has(clave)) continue
    recorrerAst(nodo[clave], visitar)
  }
}
