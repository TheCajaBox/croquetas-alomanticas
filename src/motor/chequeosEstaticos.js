import { recorrerAst } from './recorrerAst.js'

/**
 * Requisitos que se comprueban sobre el AST, antes de ejecutar nada.
 *
 * Se miran sobre el árbol y no con expresiones regulares por un motivo muy
 * concreto: un reto que prohíbe `for` no puede darse por bueno porque la
 * palabra aparezca dentro de un comentario o de una cadena de texto.
 */

/** Recorre el árbol una vez y deja un resumen barato de consultar. */
export function resumirCodigo(ast) {
  const resumen = {
    tipos: Object.create(null),
    declaraciones: { var: 0, let: 0, const: 0, function: 0, class: 0 },
    nombresDeclarados: new Set(),
    llamadas: new Set(),
    identificadores: new Set(),
    propiedades: new Set(),
    operadores: new Set(),
    // Todo el texto literal del código, plantillas de Vue incluidas. Hace
    // falta porque media directiva de Vue (v-for, :key, $emit, v-model) vive
    // dentro de una cadena y el AST no la mira por dentro.
    textos: [],
  }

  const anotarPatron = (patron) => {
    if (!patron) return
    if (patron.type === 'Identifier') resumen.nombresDeclarados.add(patron.name)
    else if (patron.type === 'ObjectPattern') patron.properties.forEach((p) => anotarPatron(p.value ?? p.argument))
    else if (patron.type === 'ArrayPattern') patron.elements.forEach(anotarPatron)
    else if (patron.type === 'AssignmentPattern') anotarPatron(patron.left)
    else if (patron.type === 'RestElement') anotarPatron(patron.argument)
  }

  recorrerAst(ast, (nodo) => {
    resumen.tipos[nodo.type] = (resumen.tipos[nodo.type] ?? 0) + 1

    switch (nodo.type) {
      case 'VariableDeclaration':
        resumen.declaraciones[nodo.kind] += nodo.declarations.length
        nodo.declarations.forEach((d) => anotarPatron(d.id))
        break
      case 'FunctionDeclaration':
        resumen.declaraciones.function += 1
        if (nodo.id) resumen.nombresDeclarados.add(nodo.id.name)
        break
      case 'ClassDeclaration':
        resumen.declaraciones.class += 1
        if (nodo.id) resumen.nombresDeclarados.add(nodo.id.name)
        break
      // `new Error(...)` es tan llamada como `Error(...)` para lo que aquí se
      // pregunta, pero el AST le da otro tipo de nodo. Se tratan igual.
      case 'NewExpression':
      case 'CallExpression': {
        const objetivo = nodo.callee
        if (objetivo.type === 'Identifier') resumen.llamadas.add(objetivo.name)
        else if (objetivo.type === 'MemberExpression' && objetivo.property.type === 'Identifier') {
          resumen.llamadas.add(objetivo.property.name)
        }
        break
      }
      case 'MemberExpression':
        if (!nodo.computed && nodo.property.type === 'Identifier') resumen.propiedades.add(nodo.property.name)
        break
      case 'Property':
        if (nodo.key.type === 'Identifier') resumen.propiedades.add(nodo.key.name)
        else if (nodo.key.type === 'Literal') resumen.propiedades.add(String(nodo.key.value))
        break
      case 'Identifier':
        resumen.identificadores.add(nodo.name)
        break
      case 'Literal':
        if (typeof nodo.value === 'string') resumen.textos.push(nodo.value)
        break
      case 'TemplateElement':
        resumen.textos.push(nodo.value?.raw ?? '')
        break
      case 'LogicalExpression':
      case 'BinaryExpression':
      case 'AssignmentExpression':
        resumen.operadores.add(nodo.operator)
        break
    }
  })

  resumen.texto = resumen.textos.join('\n')
  return resumen
}

const cuenta = (resumen, ...tipos) => tipos.reduce((suma, tipo) => suma + (resumen.tipos[tipo] ?? 0), 0)

/**
 * Catálogo de requisitos. Cada uno sabe comprobarse y sabe quejarse: el
 * mensaje es lo que le sale al jugador cuando no lo cumple, y por eso está
 * escrito con la voz del narrador.
 */
export const COMPROBACIONES = {
  prohibeVar: {
    mensaje: () => 'Nada de `var`. Eso es de cuando las cosas se guardaban en cajones sin llave. `const`, y si no queda más remedio, `let`.',
    cumple: (r) => r.declaraciones.var === 0,
  },
  usaDeclaracion: {
    mensaje: (valor) => `Aquí hace falta declarar algo con \`${valor}\`, que para eso lo hemos aprendido.`,
    cumple: (r, valor) => r.declaraciones[valor] > 0,
  },
  declaraVariable: {
    mensaje: (valor) => `Me hace falta que declares \`${valor}\`. Con ese nombre exacto: si lo llamas de otra forma, no sé a qué te refieres.`,
    cumple: (r, valor) => r.nombresDeclarados.has(valor),
  },
  prohibeBucles: {
    mensaje: () => 'Sin bucles. Ya sé que con un `for` te sale, pero es que ese no es el reto.',
    cumple: (r) => cuenta(r, 'ForStatement', 'WhileStatement', 'DoWhileStatement', 'ForOfStatement', 'ForInStatement') === 0,
  },
  usaHerencia: {
    mensaje: () => 'Esto se resuelve heredando: `class Hija extends Padre`, y un `super(...)` en el constructor. Copiar y pegar el padre no cuenta.',
    // `super` no es un identificador cualquiera: en el AST tiene su propio
    // nodo, así que no aparece por `usaIdentificador`.
    cumple: (r) => cuenta(r, 'Super') > 0,
  },
  usaFlecha: {
    mensaje: () => 'Esto pide una función flecha. Las de toda la vida también valdrían, pero hoy no.',
    cumple: (r) => cuenta(r, 'ArrowFunctionExpression') > 0,
  },
  usaLlamada: {
    mensaje: (valor) => `Tienes que llamar a \`${valor}\` en algún momento. Ahora mismo no lo llamas ni una vez.`,
    cumple: (r, valor) => r.llamadas.has(valor),
  },
  prohibeLlamada: {
    mensaje: (valor) => `\`${valor}\` está prohibido en este reto. Es justo la muleta que te estoy quitando.`,
    cumple: (r, valor) => !r.llamadas.has(valor),
  },
  usaIdentificador: {
    mensaje: (valor) => `Aquí falta \`${valor}\` por alguna parte.`,
    cumple: (r, valor) => r.identificadores.has(valor),
  },
  prohibePropiedad: {
    mensaje: (valor) => `Aquí sobra \`${valor}\`: precisamente se trata de escribirlo de otra manera.`,
    cumple: (r, valor) => !r.propiedades.has(valor),
  },
  usaPropiedad: {
    mensaje: (valor) => `Al objeto le falta la propiedad \`${valor}\`.`,
    cumple: (r, valor) => r.propiedades.has(valor),
  },
  usaEnPlantilla: {
    mensaje: (valor) => `A la plantilla le falta \`${valor}\`.`,
    cumple: (r, valor) => r.texto.includes(valor),
  },
  usaPlantilla: {
    mensaje: () => 'Con plantillas de texto (esas comillas raras hacia atrás), no pegando trozos con `+`.',
    cumple: (r) => cuenta(r, 'TemplateLiteral') > 0,
  },
  usaDesestructuracion: {
    mensaje: () => 'Saca los valores desestructurando, que para eso está.',
    cumple: (r) => cuenta(r, 'ObjectPattern', 'ArrayPattern') > 0,
  },
  usaSpread: {
    mensaje: () => 'Esto quiere los tres puntitos: `...`. Sí, tres. Ni dos ni cuatro.',
    cumple: (r) => cuenta(r, 'SpreadElement', 'RestElement') > 0,
  },
  usaParametroPorDefecto: {
    mensaje: () => 'Dale un valor por defecto al parámetro, ahí en la propia firma de la función.',
    cumple: (r) => cuenta(r, 'AssignmentPattern') > 0,
  },
  usaAsync: {
    mensaje: () => 'Esto va con `async` y `await`. Que sí, que las promesas encadenadas también valen, pero se lee peor.',
    cumple: (r) => cuenta(r, 'AwaitExpression') > 0,
  },
  usaEncadenamientoOpcional: {
    mensaje: () => 'Prueba con `?.`, que es exactamente para lo que sirve.',
    cumple: (r) => cuenta(r, 'ChainExpression') > 0,
  },
  usaCoalescencia: {
    mensaje: () => 'Te falta `??`. Ojo, que no es lo mismo que `||`, y en este reto se nota.',
    cumple: (r) => r.operadores.has('??'),
  },
}

/**
 * @param {object} ast árbol ya parseado del código del jugador
 * @param {Array<{tipo: string, valor?: string, mensaje?: string}>} requisitos
 * @returns {Array<{cumplido: boolean, mensaje: string}>}
 */
export function comprobarRequisitos(ast, requisitos = []) {
  if (requisitos.length === 0) return []
  const resumen = resumirCodigo(ast)

  return requisitos.map((requisito) => {
    const comprobacion = COMPROBACIONES[requisito.tipo]
    if (!comprobacion) {
      throw new Error(`Requisito desconocido: "${requisito.tipo}"`)
    }
    return {
      tipo: requisito.tipo,
      cumplido: comprobacion.cumple(resumen, requisito.valor),
      mensaje: requisito.mensaje ?? comprobacion.mensaje(requisito.valor),
    }
  })
}
