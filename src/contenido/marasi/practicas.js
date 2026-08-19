/**
 * El informe de Marasi.
 *
 * Cuando un reto se supera, el código funciona. Eso es todo lo que dicen los
 * tests, y no es poco — pero tampoco es todo. Que algo funcione y que esté bien
 * escrito son dos preguntas distintas, y en el oficio la segunda la hace otra
 * persona leyendo tu código.
 *
 * Aquí la hace Marasi, que revisa lo que has escrito **después** de que pase.
 * Nunca antes, y nunca bloqueando: primero se resuelve, después se mira si se
 * puede dejar mejor. Ese es el orden de verdad, y el que no frustra a nadie.
 *
 * ## Por qué esto no da croquetas
 *
 * Porque no es un reto: es una revisión. Pagar por ella convertiría una lista
 * de consejos en una lista de requisitos, y entonces habría que cumplirlos
 * todos siempre — que es justo lo contrario de lo que se quiere enseñar. Las
 * buenas prácticas son criterio, y el criterio incluye saber cuándo no aplican.
 *
 * ## Cómo se elige qué comprobar
 *
 * Solo cosas que se detectan sobre el árbol con muy pocos falsos positivos. Un
 * revisor que se equivoca la mitad de las veces se ignora entero a la tercera,
 * y entonces deja de servir para nada. Ante la duda, no se avisa.
 */

/** Nombres de una letra que sí son costumbre y no se marcan. */
const LETRAS_ACEPTADAS = new Set(['i', 'j', 'k', 'n', 'x', 'y', 'a', 'b', 'm', 'g', 'e', 'p', 's', 't', 'r', 'c', 'f'])

const contar = (nodo, tipos) => {
  let cuantos = 0
  const mirar = (n) => {
    if (!n || typeof n !== 'object') return
    if (Array.isArray(n)) return n.forEach(mirar)
    if (typeof n.type !== 'string') return
    if (tipos.includes(n.type)) cuantos += 1
    for (const clave of Object.keys(n)) {
      if (clave !== 'type' && clave !== 'loc') mirar(n[clave])
    }
  }
  mirar(nodo)
  return cuantos
}

/** El cuerpo de una función, sea del tipo que sea. */
const ES_FUNCION = ['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression']

/**
 * La lista. Cada una sabe encontrarse y sabe explicarse.
 *
 * `encontrar` recibe el árbol ya recorrido y devuelve los avisos; cada aviso
 * lleva lo que se ha visto, para poder nombrarlo en concreto en vez de soltar
 * una generalidad.
 */
export const PRACTICAS = [
  {
    id: 'let-que-no-cambia',
    titulo: 'Un `let` que nunca cambia',
    porque:
      'Al leer código ajeno, cada `let` es un aviso de «ojo, esto se mueve». Cuando no se mueve, ese aviso es falso y hace perder el tiempo a quien lo lea. Se empieza siempre por `const` y solo se pasa a `let` cuando el propio ordenador obligue.',
    encontrar({ nodos }) {
      const declarados = new Map()
      const reasignados = new Set()

      for (const nodo of nodos) {
        if (nodo.type === 'VariableDeclaration' && nodo.kind === 'let') {
          for (const d of nodo.declarations) {
            if (d.id?.type === 'Identifier') declarados.set(d.id.name, nodo)
          }
        }
        if (nodo.type === 'AssignmentExpression' && nodo.left?.type === 'Identifier') {
          reasignados.add(nodo.left.name)
        }
        if (nodo.type === 'UpdateExpression' && nodo.argument?.type === 'Identifier') {
          reasignados.add(nodo.argument.name)
        }
        // `for (let i = ...)` cambia por el propio bucle aunque no se vea.
        if (nodo.type === 'ForStatement' && nodo.update) {
          for (const n of [nodo.update.argument, nodo.update.left]) {
            if (n?.type === 'Identifier') reasignados.add(n.name)
          }
        }
      }

      return [...declarados.keys()]
        .filter((nombre) => !reasignados.has(nombre))
        .map((nombre) => ({ que: nombre }))
    },
  },

  {
    id: 'igualdad-floja',
    titulo: 'Comparación con `==` en vez de `===`',
    porque:
      'Los dos iguales convierten antes de comparar, y las reglas de conversión producen cosas como que cero sea igual a texto vacío y a «0», pero esos dos no entre sí. Con tres iguales no hay conversión y no hay sorpresas.',
    encontrar({ nodos }) {
      return nodos
        .filter((n) => n.type === 'BinaryExpression' && (n.operator === '==' || n.operator === '!='))
        // `x == null` es el único uso defendible: cubre null y undefined a la vez.
        .filter((n) => n.right?.value !== null && n.left?.value !== null)
        .map((n) => ({ que: n.operator }))
    },
  },

  {
    id: 'booleano-con-vuelta',
    titulo: 'Un `if` que devuelve `true` o `false`',
    porque:
      'La condición del `if` **ya es** verdadera o falsa. Preguntarle si es verdad para devolver verdad es dar una vuelta de más: se devuelve la comparación directamente.',
    encontrar({ nodos }) {
      const esBooleano = (cuerpo) => {
        const dentro = cuerpo?.type === 'BlockStatement' ? cuerpo.body[0] : cuerpo
        return dentro?.type === 'ReturnStatement' && typeof dentro.argument?.value === 'boolean'
      }
      return nodos
        .filter((n) => n.type === 'IfStatement' && n.alternate)
        .filter((n) => esBooleano(n.consequent) && esBooleano(n.alternate))
        .map(() => ({ que: null }))
    },
  },

  {
    id: 'anidamiento',
    titulo: 'Tres niveles de `if` metidos uno dentro de otro',
    porque:
      'Obliga a llevar tres condiciones en la cabeza a la vez y a buscar dónde cierra cada llave. Casi siempre se da la vuelta con cláusulas de guarda: quitas de en medio los casos raros al principio con un `return`, y el caso normal queda al final sin sangrar.',
    encontrar({ nodos }) {
      const profundidad = (nodo, nivel = 0) => {
        if (!nodo || typeof nodo !== 'object') return nivel
        if (Array.isArray(nodo)) return Math.max(nivel, ...nodo.map((n) => profundidad(n, nivel)))
        if (typeof nodo.type !== 'string') return nivel

        const suma = nodo.type === 'IfStatement' ? 1 : 0
        const hijos = Object.keys(nodo)
          .filter((c) => c !== 'type' && c !== 'loc')
          .map((c) => profundidad(nodo[c], nivel + suma))
        return hijos.length ? Math.max(nivel + suma, ...hijos) : nivel + suma
      }

      return nodos
        .filter((n) => n.type === 'IfStatement')
        .filter((n) => profundidad(n) >= 3)
        .slice(0, 1)
        .map(() => ({ que: null }))
    },
  },

  {
    id: 'muchos-parametros',
    titulo: 'Una función con cuatro parámetros o más',
    porque:
      'Quien la llame tendrá que acordarse del orden, y una llamada como `crear(true, false, 3, null)` no hay quien la lea. A partir de tres, un objeto: el orden deja de importar y cada dato lleva su nombre puesto en la llamada.',
    encontrar({ nodos }) {
      return nodos
        .filter((n) => ES_FUNCION.includes(n.type))
        .filter((n) => n.params.length >= 4)
        .map((n) => ({ que: n.id?.name ?? null }))
    },
  },

  {
    id: 'funcion-larga',
    titulo: 'Una función que hace demasiadas cosas',
    porque:
      'Si para explicar qué hace necesitas un «y», suelen ser dos funciones. Partirla no es solo estética: cada trozo con nombre se entiende solo, se prueba solo y se puede reutilizar.',
    encontrar({ nodos }) {
      return nodos
        .filter((n) => ES_FUNCION.includes(n.type) && n.body?.type === 'BlockStatement')
        .filter((n) => contar(n.body, ['ExpressionStatement', 'VariableDeclaration', 'IfStatement', 'ForStatement', 'ForOfStatement', 'WhileStatement', 'ReturnStatement']) > 18)
        .map((n) => ({ que: n.id?.name ?? null }))
    },
  },

  {
    id: 'parametro-reasignado',
    titulo: 'Un parámetro al que se le asigna otro valor',
    porque:
      'A media función, ese nombre ya no significa lo que dice la cabecera, y quien lea la primera línea creerá una cosa que dejó de ser verdad. Sale más barato declarar una variable nueva con un nombre que diga qué es ahora.',
    encontrar({ nodos }) {
      const parametros = new Set()
      for (const nodo of nodos) {
        if (!ES_FUNCION.includes(nodo.type)) continue
        for (const p of nodo.params) if (p.type === 'Identifier') parametros.add(p.name)
      }

      const tocados = new Set()
      for (const nodo of nodos) {
        if (nodo.type === 'AssignmentExpression' && nodo.left?.type === 'Identifier') {
          if (parametros.has(nodo.left.name)) tocados.add(nodo.left.name)
        }
      }
      return [...tocados].map((nombre) => ({ que: nombre }))
    },
  },

  {
    id: 'catch-vacio',
    titulo: 'Un `catch` que no hace nada',
    porque:
      'Convierte un fallo ruidoso en un fallo silencioso, y los silenciosos son los que tienen a alguien tres días buscando. Si de verdad hay que ignorarlo, que se vea que es a propósito con un comentario que diga por qué.',
    encontrar({ nodos }) {
      return nodos
        .filter((n) => n.type === 'CatchClause' && n.body?.body?.length === 0)
        .map(() => ({ que: null }))
    },
  },

  {
    id: 'numero-magico',
    titulo: 'El mismo número suelto, repetido tres veces o más',
    porque:
      'Un número sin nombre no dice qué significa, y repetido significa que el día que cambie hay que acordarse de todos los sitios. Una constante con nombre arriba resuelve las dos cosas de golpe.',
    encontrar({ nodos }) {
      const cuenta = new Map()
      for (const nodo of nodos) {
        if (nodo.type !== 'Literal' || typeof nodo.value !== 'number') continue
        // El 0, el 1 y el -1 son idiomáticos y no significan nada por sí solos.
        if ([0, 1, -1, 2].includes(nodo.value)) continue
        cuenta.set(nodo.value, (cuenta.get(nodo.value) ?? 0) + 1)
      }
      return [...cuenta.entries()]
        .filter(([, veces]) => veces >= 3)
        .map(([valor]) => ({ que: String(valor) }))
    },
  },

  {
    id: 'nombre-de-una-letra',
    titulo: 'Una variable con nombre de una sola letra',
    porque:
      'En una flecha de una línea no pasa nada; en una variable que vive veinte líneas, obliga a quien lea a recordar qué era. El nombre es lo único que explica para qué existe algo.',
    encontrar({ nodos }) {
      const malos = new Set()
      for (const nodo of nodos) {
        if (nodo.type !== 'VariableDeclaration') continue
        for (const d of nodo.declarations) {
          const nombre = d.id?.type === 'Identifier' ? d.id.name : null
          if (nombre && nombre.length === 1 && !LETRAS_ACEPTADAS.has(nombre)) malos.add(nombre)
        }
      }
      return [...malos].map((nombre) => ({ que: nombre }))
    },
  },
]

export const PRACTICAS_POR_ID = Object.fromEntries(PRACTICAS.map((p) => [p.id, p]))
