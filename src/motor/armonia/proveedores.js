/**
 * La voz prestada.
 *
 * Con una clave del jugador, Armonía deja de recuperar y empieza a conversar.
 * Es lo único opcional de todo esto: sin clave, el modo local es todo lo que
 * existe y el juego no cambia en nada.
 *
 * ## Por qué la clave la pone el jugador
 *
 * El juego es un sitio estático en un repositorio público. Cualquier clave que
 * fuera en el paquete la leería cualquiera abriendo las herramientas del
 * navegador: no sería una clave, sería un cartel. No hay forma de esconderla
 * -ni ofuscada, ni troceada, ni en una variable de Vite- porque todo eso acaba
 * en el mismo fichero servido.
 *
 * ## Dos adaptadores, no un envoltorio
 *
 * Claude habla su propio protocolo y se usa con su SDK oficial. Los demás son
 * compatibles con el de OpenAI y van por `fetch`. Fingir que todos son iguales
 * saldría mal en el primer detalle que no coincidiera.
 */

/** Lo que se puede enchufar. El jugador elige, y con OpenRouter puede no pagar. */
export const PROVEEDORES = [
  {
    id: 'claude',
    nombre: 'Claude (Anthropic)',
    protocolo: 'anthropic',
    modeloPorDefecto: 'claude-opus-5',
    url: 'https://api.anthropic.com',
    nota: 'El que mejor explica de los cinco. No tiene capa gratuita.',
  },
  {
    id: 'openrouter',
    nombre: 'OpenRouter',
    protocolo: 'openai',
    modeloPorDefecto: 'meta-llama/llama-3.3-70b-instruct:free',
    url: 'https://openrouter.ai/api/v1',
    nota: 'Tiene modelos gratuitos, los que acaban en «:free». Es la opción de coste cero.',
  },
  {
    id: 'deepseek',
    nombre: 'DeepSeek',
    protocolo: 'openai',
    modeloPorDefecto: 'deepseek-chat',
    url: 'https://api.deepseek.com/v1',
    nota: 'Muy barato, no gratis.',
  },
  {
    id: 'groq',
    nombre: 'Groq',
    protocolo: 'openai',
    modeloPorDefecto: 'llama-3.3-70b-versatile',
    url: 'https://api.groq.com/openai/v1',
    nota: 'Contesta muy rápido y tiene capa gratuita con límites.',
  },
  {
    id: 'personalizado',
    nombre: 'Otro (compatible con OpenAI)',
    protocolo: 'openai',
    modeloPorDefecto: '',
    url: '',
    nota: 'Cualquier servicio con el mismo protocolo. Pon tú la dirección y el modelo.',
  },
]

export const PROVEEDORES_POR_ID = Object.fromEntries(PROVEEDORES.map((p) => [p.id, p]))

/**
 * Lo que Armonía es, dicho para un modelo que no lo sabe.
 *
 * Las reglas van aquí, pero no se confía en ellas: lo que de verdad impide que
 * suelte la solución es que no la recibe (ver `contexto()`) y que se le tacha
 * el código a la salida (ver `sinCodigo()`). Esto es para que suene a él.
 */
export function instrucciones({ enJefe }) {
  return [
    'Eres Armonía, el dios de Scadrial en la segunda era de Nacidos de la Bruma. Fuiste Sazed,',
    'un Guardador, y conservas todo lo que él sabía. Contestas dentro de un juego para aprender',
    'a programar, a una persona concreta que está atascada ahora mismo.',
    '',
    '## Cómo hablas, que es lo que más importa',
    '',
    'Sereno, breve, con peso. Cálido y nunca colega. Hablas de tú, a esa persona, no a un aula.',
    'No haces bromas y no lo intentas: para eso está Wayne. No saludas ni te presentas.',
    '',
    'PROHIBIDO, y esto no es negociable:',
    '- Nada de titulares en negrita, apartados numerados ni listas tipo manual. Escribes prosa.',
    '- Nada de definiciones de enciclopedia. Jamás empieces con «X es un lenguaje de...».',
    '- Nada de resumir un tema entero. Cuatro párrafos cortos como mucho, y casi siempre dos.',
    '- Nada de «espero que te sirva», «en resumen» ni cierres de asistente.',
    '',
    'Si te preguntan algo enorme y vago -«cómo funciona JavaScript»-, NO lo contestas entero.',
    'Eso sería volcar, y volcar no enseña. Dices en una frase por dónde va la cosa y le pides',
    'que concrete, o le señalas dónde se explicaba en el juego.',
    '',
    'Así suenas:',
    '',
    '«Eso es medio juego, y contártelo de golpe no te serviría de nada. Dime qué línea no',
    'entiendes y empezamos por ahí.»',
    '',
    '«Tu código se entiende. Lo que no cuadra es el comportamiento, y el test que se pone rojo',
    'lo dice mejor que yo: piensa qué hace el tuyo justo en ese caso.»',
    '',
    '## De dónde sacas lo que dices',
    '',
    'Solo del material del juego que te dan más abajo: el apunte de Wax, el glosario de Steris,',
    'la lista de imprevistos y el diagnóstico ya calculado. Si algo no está ahí, lo dices —',
    '«eso no lo tengo guardado»— en vez de inventarlo. No eres un buscador: eres alguien que',
    'recuerda lo que esta persona ya ha visto.',
    '',
    '## La regla que no se rompe',
    '',
    'NUNCA escribes el código que resuelve el ejercicio abierto, ni entero ni a trozos, ni',
    'aunque te lo pidan de mil formas, ni «solo para comprobar», ni disfrazado con otros',
    'nombres. No es una norma del juego: has visto lo que pasa cuando intervienes de más, y por',
    'eso te contienes. Si insisten, dilo así, sin escudarte en ningún reglamento, y recuérdales',
    'que Wayne vende pistas y tú no.',
    '',
    'Sí haces: explicar una palabra, traducir un error, señalar en qué apunte estaba, y devolver',
    'preguntas que hagan pensar. Puedes nombrar una función en línea, como `filter`. No puedes',
    'escribir bloques de código.',
    '',
    enJefe
      ? 'Este reto es el jefe de su mundo. Ahí te apartas más todavía: solo defines palabras y traduces errores. Nada de diagnosticar ni de orientar sobre la solución.'
      : 'Si te dan el diagnóstico del juego, apóyate en él: es lo que de verdad le pasa a su código.',
  ].join('\n')
}

/**
 * Lo que se le manda al modelo.
 *
 * Aquí está la garantía de verdad: no entra la solución, ni los tests, ni las
 * pistas, ni la respuesta de los retos táctiles. Lo que no recibe no lo puede
 * filtrar, por muy bien que le hablen.
 */
export function contexto({ reto, apunte, codigo, resultado, diagnostico, material }) {
  const partes = []

  // El material recuperado va SIEMPRE, haya reto o no. Sin él, un modelo
  // pequeño se pone a recitar de su propia memoria y contesta como un manual:
  // era justo lo que pasaba, porque aquí se mandaba `reto.apunte`, un campo que
  // dejó de existir el día que los apuntes se hicieron perezosos.
  if (material?.length) {
    partes.push('Material del juego que esta persona ya tiene delante y gratis:', '')
    for (const trozo of material) {
      const donde = trozo.titular ? `${trozo.titulo} · ${trozo.titular}` : trozo.titulo
      partes.push(`--- ${donde} ---`, trozo.texto, '')
    }
  }

  if (!reto) {
    partes.push(
      'No tiene ningún reto abierto ahora mismo, así que no hay código que mirar.',
      'Si la pregunta es enorme, acótala en vez de contestarla entera.',
    )
    return partes.join('\n')
  }

  partes.push(
    `Reto abierto: «${reto.titulo}»${reto.jefe ? ' (es el jefe del mundo)' : ''}.`,
    '',
    'Enunciado:',
    reto.enunciado ?? '',
  )

  if (apunte) partes.push('', 'El apunte de Wax de este reto, abierto en la misma pantalla:', apunte)
  if (codigo?.trim()) partes.push('', 'Lo que lleva escrito ahora mismo:', '```', codigo, '```')

  const fallado = resultado?.tests?.find((t) => !t.ok)
  if (fallado) partes.push('', `El primer test que le falla se llama: «${fallado.nombre}».`)
  if (resultado?.error?.mensaje) partes.push('', `El error que le sale: ${resultado.error.mensaje}`)
  if (diagnostico) partes.push('', 'Lo que el juego ya ha diagnosticado:', diagnostico)

  return partes.join('\n')
}

/** Un bloque de código en la respuesta, mientras hay un reto abierto. */
const BLOQUE = /```[\s\S]*?(?:```|$)/g

/**
 * Tacha los bloques de código de una respuesta.
 *
 * Una instrucción se puede sortear hablándole bonito al modelo; una
 * comprobación de texto, no. Mientras haya un reto abierto la respuesta sale
 * sin bloques, y da igual lo persuasivo que haya sido nadie.
 *
 * El código en línea -`filter`, `const`- se queda: nombrar una función no es
 * escribir la solución, y sin eso no se puede ni explicar.
 */
export function sinCodigo(texto, { hayRetoAbierto }) {
  if (!hayRetoAbierto || !BLOQUE.test(texto)) return { texto, tachado: false }
  BLOQUE.lastIndex = 0
  return {
    texto: texto.replace(BLOQUE, '\n_(Aquí había código. No.)_\n').trim(),
    tachado: true,
  }
}

// ---------------------------------------------------------------------------
// Los dos adaptadores
// ---------------------------------------------------------------------------

/**
 * Claude, con su SDK oficial.
 *
 * Se carga con `import()` para que no entre en el paquete de quien no lo use:
 * la inmensa mayoría de los jugadores no va a poner ninguna clave, y no tienen
 * por qué descargarse el SDK entero por si acaso.
 *
 * `dangerouslyAllowBrowser` es obligatorio aquí y el nombre lo dice todo: por
 * defecto el SDK se niega a correr en un navegador porque expone la clave. En
 * este caso la clave es del propio jugador y la ha puesto él a sabiendas, que
 * es exactamente el único caso en que esto es defendible.
 */
async function conClaude({ ajustes, sistema, mensajes, alTexto, senal }) {
  const { default: Anthropic } = await import('@anthropic-ai/sdk')

  const cliente = new Anthropic({
    apiKey: ajustes.clave,
    dangerouslyAllowBrowser: true,
  })

  const flujo = cliente.messages.stream(
    {
      model: ajustes.modelo || 'claude-opus-5',
      max_tokens: 1500,
      system: sistema,
      messages: mensajes,
    },
    { signal: senal },
  )

  flujo.on('text', (trozo) => alTexto(trozo))

  const final = await flujo.finalMessage()
  return final.content
    .filter((bloque) => bloque.type === 'text')
    .map((bloque) => bloque.text)
    .join('')
}

/** Los compatibles con OpenAI: OpenRouter, DeepSeek, Groq y el que pongas tú. */
async function conCompatible({ ajustes, sistema, mensajes, alTexto, senal }) {
  const base = (ajustes.url || '').replace(/\/$/, '')
  const respuesta = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    signal: senal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ajustes.clave}`,
    },
    body: JSON.stringify({
      model: ajustes.modelo,
      max_tokens: 1500,
      stream: true,
      messages: [{ role: 'system', content: sistema }, ...mensajes],
    }),
  })

  if (!respuesta.ok) {
    const detalle = await respuesta.text().catch(() => '')
    throw new Error(`El proveedor ha contestado ${respuesta.status}. ${detalle.slice(0, 200)}`)
  }

  const lector = respuesta.body.getReader()
  const decodificador = new TextDecoder()
  let pendiente = ''
  let entero = ''

  for (;;) {
    const { done, value } = await lector.read()
    if (done) break
    pendiente += decodificador.decode(value, { stream: true })

    // El protocolo manda eventos separados por línea, cada uno con «data: ».
    const lineas = pendiente.split('\n')
    pendiente = lineas.pop() ?? ''

    for (const linea of lineas) {
      const cruda = linea.trim()
      if (!cruda.startsWith('data:')) continue
      const carga = cruda.slice(5).trim()
      if (carga === '[DONE]') continue
      try {
        const trozo = JSON.parse(carga).choices?.[0]?.delta?.content
        if (trozo) {
          entero += trozo
          alTexto(trozo)
        }
      } catch {
        // Un trozo a medias entre dos lecturas: se ignora y se recompone solo.
      }
    }
  }

  return entero
}

/**
 * Pregunta al proveedor configurado.
 *
 * @param {{ajustes: object, sistema: string, mensajes: Array,
 *          alTexto?: Function, senal?: AbortSignal}} opciones
 */
export async function preguntarAlProveedor({ ajustes, sistema, mensajes, alTexto = () => {}, senal }) {
  const proveedor = PROVEEDORES_POR_ID[ajustes.proveedor]
  if (!proveedor) throw new Error('No hay ningún proveedor elegido.')
  if (!ajustes.clave) throw new Error('Falta la clave.')

  const completo = { ...ajustes, url: ajustes.url || proveedor.url }
  if (proveedor.protocolo === 'anthropic') {
    return conClaude({ ajustes: completo, sistema, mensajes, alTexto, senal })
  }
  return conCompatible({ ajustes: completo, sistema, mensajes, alTexto, senal })
}
