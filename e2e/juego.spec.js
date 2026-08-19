import { expect, test } from '@playwright/test'

/**
 * Recorrido real por el juego publicado: se resuelve un reto en cada uno de
 * los tres entornos, se comprueba que la protección contra bucles infinitos
 * funciona y que el sandbox no alcanza la partida guardada.
 */

/** Escribe en el editor de CodeMirror, que es un contenteditable. */
async function escribirCodigo(pagina, codigo) {
  const editor = pagina.locator('.cm-content')
  await editor.click()
  await pagina.keyboard.press('ControlOrMeta+a')
  await pagina.keyboard.press('Delete')
  await pagina.keyboard.insertText(codigo)
}

async function irAlReto(pagina, retoId) {
  await pagina.goto(`#/reto/${retoId}`)
  await expect(pagina.locator('h1')).toBeVisible()
}

const SOLUCIONES = {
  'es6-01-const-let': `const TARIFA_DIARIA = 25

function cobrar(dias) {
  return TARIFA_DIARIA * dias
}`,
  'vue2-01-instancia': `const componente = {
  data() {
    return { senor: 'Waxillium Ladrian', habitaciones: 34 }
  },
  template: '<section><h1>Casa Ladrian</h1><p class="senor">{{ senor }}</p><p class="habitaciones">{{ habitaciones }} habitaciones</p></section>',
}`,
  'vue3-01-ref-y-setup': `const { ref } = Vue

const componente = {
  setup() {
    const balas = ref(6)
    const disparar = () => { if (balas.value > 0) balas.value -= 1 }
    const recargar = () => { balas.value = 6 }
    return { balas, disparar, recargar }
  },
  template: '<div><p class="balas">{{ balas }}</p><button class="disparar" @click="disparar">Disparar</button><button class="recargar" @click="recargar">Recargar</button></div>',
}`,
}

test.beforeEach(async ({ page }) => {
  await page.goto('')
  await page.evaluate(() => localStorage.clear())
})

test('la portada presenta los siete mundos', async ({ page }) => {
  await page.goto('')
  await expect(page.getByRole('heading', { name: 'El primer día' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Los Áridos' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'La mansión Ladrian' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'La Nueva Seran' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Cambio de forma' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'La comisaría' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'El taller' })).toBeVisible()
})

for (const [retoId, solucion] of Object.entries(SOLUCIONES)) {
  test(`se puede resolver un reto en el entorno de ${retoId.split('-')[0]}`, async ({ page }) => {
    await irAlReto(page, retoId)
    await escribirCodigo(page, solucion)
    await page.getByRole('button', { name: 'Ejecutar' }).click()

    await expect(page.getByText('Reto superado.')).toBeVisible({ timeout: 20_000 })
    // Y las croquetas llegan de verdad al marcador.
    await expect(page.locator('.contador.croquetas')).not.toHaveText('20')
  })
}

test('la vista previa pinta el componente de Vue', async ({ page }) => {
  await irAlReto(page, 'vue2-01-instancia')
  await escribirCodigo(page, SOLUCIONES['vue2-01-instancia'])
  await page.getByRole('button', { name: 'Ejecutar' }).click()
  await expect(page.getByText('Reto superado.')).toBeVisible({ timeout: 20_000 })

  const sandbox = page.frameLocator('.marco-sandbox')
  await expect(sandbox.locator('.senor').first()).toHaveText('Waxillium Ladrian')
})

test('un bucle infinito se corta y la página sigue viva', async ({ page }) => {
  await irAlReto(page, 'es6-01-const-let')
  await escribirCodigo(page, 'const TARIFA_DIARIA = 25\nfunction cobrar(dias) { while (true) {} }')
  await page.getByRole('button', { name: 'Ejecutar' }).click()

  await expect(page.getByText(/Bucle sin salida|Se acabó el tiempo/)).toBeVisible({ timeout: 20_000 })
  // Si la pestaña se hubiera congelado, esto no respondería.
  await page.getByRole('link', { name: 'Mundos' }).click()
  await expect(page.getByRole('heading', { name: 'Los Áridos' })).toBeVisible()
})

test('la partida sobrevive a recargar la página', async ({ page }) => {
  await irAlReto(page, 'es6-01-const-let')
  await escribirCodigo(page, SOLUCIONES['es6-01-const-let'])
  await page.getByRole('button', { name: 'Ejecutar' }).click()
  await expect(page.getByText('Reto superado.')).toBeVisible({ timeout: 20_000 })

  const croquetas = await page.locator('.contador.croquetas').textContent()

  await page.reload()
  await expect(page.locator('.contador.croquetas')).toHaveText(croquetas)
  await expect(page.locator('.contador.retos')).toHaveText(/^1\/\d+$/)
  // Y el reto sigue marcado como superado, con el código que se escribió.
  await expect(page.getByText('superado')).toBeVisible()
  await expect(page.locator('.cm-content')).toContainText('TARIFA_DIARIA')

  // El gato que se acaba de ganar sigue esperando en el refugio.
  await page.goto('#/refugio')
  await expect(page.getByRole('heading', { name: 'Acero' })).toBeVisible()
})

test('el sandbox no alcanza la partida guardada', async ({ page }) => {
  await page.goto('')
  await page.evaluate(() => localStorage.setItem('gatosYCodigo', '{"version":1,"secreto":"no mirar"}'))

  await irAlReto(page, 'vue2-01-instancia')
  await escribirCodigo(
    page,
    `const componente = {
  data() { return { hola: 'hola' } },
  template: '<p>{{ hola }}</p>',
}
const robado = window.parent.localStorage.getItem('gatosYCodigo')`,
  )
  await page.getByRole('button', { name: 'Ejecutar' }).click()

  await expect(page.getByText('Ha reventado al ejecutarlo')).toBeVisible({ timeout: 20_000 })
})

test('los sombreros se encuentran, se pagan y se guardan', async ({ page }) => {
  await page.goto('')

  // Están casi transparentes hasta que alguien pasa por encima: se pulsan igual.
  await expect(page.locator('.contador.sombreros')).toContainText('0/12')
  const croquetasAntes = Number(await page.locator('.contador.croquetas').textContent())

  await page.locator('.portada .sombrero-escondido').click()

  await expect(page.getByText('Sombrero encontrado')).toBeVisible()
  await expect(page.locator('.contador.sombreros')).toContainText('1/12')
  // Wayne jura que era suyo y lo paga.
  await expect
    .poll(async () => Number(await page.locator('.contador.croquetas').textContent()))
    .toBeGreaterThan(croquetasAntes)

  // Ya no está en su escondite y sí en la sombrerera.
  await expect(page.locator('.portada .sombrero-escondido')).toHaveCount(0)
  await page.goto('#/sombrerera')
  await expect(page.getByRole('heading', { name: 'El polvoriento' })).toBeVisible()
  await expect(page.getByText('1 de 12 encontrados')).toBeVisible()

  // Y sobrevive a recargar.
  await page.reload()
  await expect(page.locator('.contador.sombreros')).toContainText('1/12')
})

test('los retos del primer día se resuelven sin escribir código', async ({ page }) => {
  // Elegir la respuesta: se marca, se responde y se explican TODAS las opciones.
  await page.goto('#/reto/dia1-01-variables')
  await expect(page.getByRole('button', { name: /El apunte de Wax/ })).toBeVisible()
  await page.locator('.opcion').first().click()
  await page.getByRole('button', { name: 'Responder' }).click()

  await expect(page.getByText('Reto superado.')).toBeVisible()
  await expect(page.locator('.opcion .porque').first()).toBeVisible()

  // Emparejar: al juntar las seis parejas, el reto se da por resuelto.
  await page.goto('#/reto/dia1-02-tipos')
  await expect(page.getByText('0 de 6')).toBeVisible()

  const izquierda = page.locator('.columnas .columna').first().locator('button')
  const derecha = page.locator('.columnas .columna').last().locator('button')
  const textosIzquierda = await izquierda.allTextContents()

  const PAREJAS = {
    "'bombín'": 'Un texto',
    '42': 'Un número',
    'true': 'Un booleano: verdadero o falso',
    "['Acero', 'Bronce']": 'Una lista de valores en orden',
    "{ nombre: 'Wayne' }": 'Un objeto: valores con nombre',
    'null': 'Aquí no hay nada, y es a propósito',
  }

  for (const texto of textosIzquierda) {
    await izquierda.filter({ hasText: texto.trim() }).first().click()
    await derecha.filter({ hasText: PAREJAS[texto.trim()] }).first().click()
  }

  await expect(page.getByText('Reto superado.')).toBeVisible()
})

test('un reto de ordenar ejecuta el código en el orden que lo dejes', async ({ page }) => {
  await page.goto('#/reto/dia1-05-ordenar')
  // Se ejecuta tal cual viene barajado: sale mal, y sale mal explicando por qué.
  await page.getByRole('button', { name: 'Ejecutar en este orden' }).click()
  await expect(page.getByText(/Ha reventado al ejecutarlo|cuenta los tres gatos/)).toBeVisible({
    timeout: 20_000,
  })
})

test('Steris traduce los errores que asustan', async ({ page }) => {
  await irAlReto(page, 'es6-01-const-let')
  // Una errata, que es el fallo más común de quien empieza.
  await escribirCodigo(page, 'const TARIFA_DIARIA = 25\nfunction cobrar(dias) { return TARIFA_DIARIA * diaz }')
  await page.getByRole('button', { name: 'Ejecutar' }).click()

  await expect(page.getByText('Steris lo tenía previsto')).toBeVisible({ timeout: 20_000 })
  await expect(page.getByText('Estás usando un nombre que no existe')).toBeVisible()
  await expect(page.locator('.imprevisto .causas li').first()).toContainText('errata')
})

test('los términos del glosario se pueden pulsar sin salir del reto', async ({ page }) => {
  await irAlReto(page, 'dia1-07-primera-funcion')

  // Los términos se detectan solos en el enunciado y en el apunte.
  await expect(page.locator('.termino').first()).toBeVisible()
  await page.locator('.termino').first().click()

  await expect(page.getByText('Del glosario de Steris')).toBeVisible()
  await expect(page.locator('.ficha .definicion')).not.toBeEmpty()

  // Y al cambiar de pantalla se cierra: si no, su fondo bloquea la siguiente.
  await page.goto('#/glosario')
  await expect(page.locator('.fondo')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'El glosario de Steris' })).toBeVisible()
})

test('la antesala explica de qué va todo esto', async ({ page }) => {
  await page.goto('')
  // Mientras no se haya leído, la portada la ofrece.
  await page.getByText('¿No has programado nunca?').click()

  await expect(page.getByRole('heading', { name: 'Antes de empezar' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Qué es un programa' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Contingencias previstas' })).toBeVisible()

  // Leída una vez, la portada deja de insistir.
  await page.goto('')
  await expect(page.getByText('¿No has programado nunca?')).toHaveCount(0)
})

test('un reto de refactor de MeLaan valida la forma, no solo el resultado', async ({ page }) => {
  await irAlReto(page, 'melaan-01-de-bucle-a-metodo')

  // El código de partida ya pasa los tests: lo que suspende es la forma.
  await page.getByRole('button', { name: 'Ejecutar' }).click()
  await expect(page.locator('.resultados')).toContainText('Las normas del reto')
  await expect(page.locator('.resultados')).not.toContainText('Reto superado')

  await escribirCodigo(page, `function nombresCaros(metales, minimo) {
  return metales
    .filter((metal) => metal.precio >= minimo)
    .map((metal) => metal.nombre.toUpperCase())
}

function valorTotal(metales) {
  return metales.reduce((suma, metal) => suma + metal.precio, 0)
}`)
  await page.getByRole('button', { name: 'Ejecutar' }).click()
  await expect(page.locator('.resultados')).toContainText('Reto superado')
})

test('el repaso de Marasi corrige, explica y paga una sola vez', async ({ page }) => {
  /** Contesta el repaso entero eligiendo siempre la primera opción. */
  async function contestarloEntero() {
    const repaso = page.locator('.repaso')
    for (let i = 0; i < 30; i += 1) {
      if (await repaso.locator('.resultado').isVisible()) return
      const opciones = repaso.locator('.eleccion')
      await expect(opciones.first()).toBeVisible()
      await opciones.first().click()
      // Al contestar se revela el porqué de cada opción, también de las falsas.
      await expect(repaso.locator('.porque').first()).toBeVisible()
      await repaso.locator('.siguiente').click()
      // Hasta que el porqué desaparece, la pregunta que se ve sigue siendo la vieja.
      await expect(repaso.locator('.porque')).toHaveCount(0)
    }
    throw new Error('el repaso no termina')
  }

  // El repaso solo se abre con el mundo terminado: se da por resuelto de antemano
  // para no repetir aquí los siete retos del primer día, que ya se prueban aparte.
  // Se siembra antes de que arranque la app, porque el autoguardado pisa
  // cualquier cosa que se escriba en localStorage con la partida ya en marcha.
  await page.addInitScript(() => {
    const ids = [
      'dia1-01-variables',
      'dia1-02-tipos',
      'dia1-03-const-o-let',
      'dia1-04-rellenar',
      'dia1-05-ordenar',
      'dia1-06-que-imprime',
      'dia1-07-primera-funcion',
    ]
    const retos = {}
    for (const id of ids) {
      retos[id] = { superado: true, intentos: 1, pistasUsadas: 0, superadoEn: Date.now() }
    }
    localStorage.setItem('gatosYCodigo', JSON.stringify({ version: 1, progreso: { retos } }))
  })

  // Recargar de verdad: el guion sembrado solo corre al cargar el documento, y
  // saltar de almohadilla en almohadilla no recarga nada.
  await page.goto('#/repaso/primer-dia')
  await page.reload()
  await expect(page.locator('.repaso .quien')).toHaveText('El caso de Marasi')

  await contestarloEntero()
  await expect(page.locator('.marcador')).toBeVisible()
  await expect(page.locator('.pago')).toBeVisible()

  const croquetas = await page.locator('.contador.croquetas').textContent()

  // Repetirlo con el mismo acierto no vuelve a pagar: solo se cobra la mejora.
  await page.getByRole('button', { name: 'Repetirlo' }).click()
  await contestarloEntero()
  await expect(page.locator('.pago')).toContainText('Solo se cobra lo que se mejora')
  await expect(page.locator('.contador.croquetas')).toHaveText(croquetas)
})

test('el bucle de la comisaría se escribe y se ejecuta de verdad', async ({ page }) => {
  await irAlReto(page, 'com-06-el-bucle')

  // Empezar el máximo en cero es el fallo que el reto quiere cazar: pasa los
  // demás tests y suspende justo el de los negativos.
  await escribirCodigo(page, `function sumar(numeros) {
  let total = 0
  for (const n of numeros) { total += n }
  return total
}

function laMayor(numeros) {
  let mayor = 0
  for (const n of numeros) { if (n > mayor) mayor = n }
  return mayor
}`)
  await page.getByRole('button', { name: 'Ejecutar' }).click()
  await expect(page.locator('.resultados')).toContainText('la mayor sigue estando en la lista')
  await expect(page.locator('.resultados')).not.toContainText('Reto superado')

  await escribirCodigo(page, `function sumar(numeros) {
  let total = 0
  for (const n of numeros) { total += n }
  return total
}

function laMayor(numeros) {
  let mayor = null
  for (const n of numeros) { if (mayor === null || n > mayor) mayor = n }
  return mayor
}`)
  await page.getByRole('button', { name: 'Ejecutar' }).click()
  await expect(page.locator('.resultados')).toContainText('Reto superado')
})

test('el taller exige herencia de verdad, no copiar y pegar', async ({ page }) => {
  await irAlReto(page, 'taller-02-herencia')

  // Sin `extends` los tests de comportamiento pasarían: lo que suspende es el
  // requisito estático, que es justo lo que el reto enseña.
  await escribirCodigo(page, `class Alomantico {
  constructor(reservas) { this.reservas = reservas }
  quemar() {
    if (this.reservas === 0) return null
    this.reservas -= 1
    return \`\${this.efecto} con \${this.metal}\`
  }
}

class Lanzamonedas {
  constructor(reservas) { this.reservas = reservas; this.metal = 'acero'; this.efecto = 'empuja' }
  quemar() {
    if (this.reservas === 0) return null
    this.reservas -= 1
    return \`\${this.efecto} con \${this.metal}\`
  }
}

class Aullador {
  constructor(reservas) { this.reservas = reservas; this.metal = 'esta\u00f1o'; this.efecto = 'oye' }
  quemar() {
    if (this.reservas === 0) return null
    this.reservas -= 1
    return \`\${this.efecto} con \${this.metal}\`
  }
}`)
  await page.getByRole('button', { name: 'Ejecutar' }).click()
  await expect(page.locator('.resultados')).toContainText('heredando')
  await expect(page.locator('.resultados')).not.toContainText('Reto superado')
})

/** Abre el cajón de Armonía desde la barra y le pregunta algo. */
async function preguntarAArmonia(pagina, texto) {
  if (!(await pagina.locator('.cajon').isVisible())) {
    await pagina.getByRole('button', { name: 'Armonía' }).click()
  }
  await pagina.fill('.cajon input', texto)
  await pagina.getByRole('button', { name: 'Preguntar', exact: true }).click()
}

test('Armonía define lo que no sabes y dice dónde se enseñó', async ({ page }) => {
  await irAlReto(page, 'com-06-el-bucle')
  await preguntarAArmonia(page, '¿qué es un bucle?')

  const suyo = page.locator('.cajon .suyo').last()
  await expect(suyo).toContainText('repite')
  // Y remite al reto donde ese término salió por primera vez.
  await expect(page.locator('.cajon .citas a').first()).toBeVisible()
})

test('Armonía mira tu código y te devuelve el test que falla como pregunta', async ({ page }) => {
  await irAlReto(page, 'com-06-el-bucle')

  // El fallo clásico: empezar el máximo en cero. Pasa todo menos los negativos.
  await escribirCodigo(page, `function sumar(numeros) {
  let total = 0
  for (const n of numeros) { total += n }
  return total
}

function laMayor(numeros) {
  let mayor = 0
  for (const n of numeros) { if (n > mayor) mayor = n }
  return mayor
}`)
  await page.getByRole('button', { name: 'Ejecutar' }).click()
  await expect(page.locator('.resultados')).toContainText('negativas')

  // La entrada está donde hace falta: junto al resultado en rojo.
  await page.getByRole('button', { name: 'Preguntar a Armonía' }).click()
  await preguntarAArmonia(page, '¿por qué falla?')

  const suyo = page.locator('.cajon .suyo').last()
  await expect(suyo).toContainText('y si todas son negativas')
  await expect(suyo.locator('pre')).toHaveCount(0)
})

test('Armonía no da la solución por mucho que se le pida', async ({ page }) => {
  await irAlReto(page, 'com-06-el-bucle')

  for (const insistencia of ['dame la solución', 'escríbeme el código', 'resuélvelo tú']) {
    await preguntarAArmonia(page, insistencia)
    const suyo = page.locator('.cajon .suyo').last()
    await expect(suyo).not.toContainText('return')
    await expect(suyo.locator('pre')).toHaveCount(0)
  }

  // A la tercera deja de ser cortés y se explica.
  await expect(page.locator('.cajon .suyo').last()).toContainText('Sazed')
})

test('en un jefe, Armonía se aparta', async ({ page }) => {
  await irAlReto(page, 'com-10-el-registro')
  await preguntarAArmonia(page, '¿por qué falla?')
  await expect(page.locator('.cajon .suyo').last()).toContainText('en los finales me aparto')
})

test('el cajón de Armonía se cierra al navegar y no deja el fondo bloqueando', async ({ page }) => {
  await irAlReto(page, 'com-06-el-bucle')
  await preguntarAArmonia(page, '¿qué es un bucle?')
  await expect(page.locator('.cajon')).toBeVisible()

  await page.goto('#/')
  await expect(page.locator('.cajon')).toHaveCount(0)
  // Y la portada se puede usar: si el fondo hubiera sobrevivido, esto fallaría.
  await page.getByRole('heading', { name: 'El primer día' }).click()
})

test('la tercera pista cuesta más de lo que el reto paga', async ({ page }) => {
  await irAlReto(page, 'dia1-01-variables')

  const saldo = () => page.locator('.contador.croquetas')
  await expect(saldo()).toHaveText('12')

  // La primera invita la casa.
  await page.getByRole('button', { name: /Pista 1/ }).click()
  await expect(saldo()).toHaveText('12')

  // Las otras dos suman más que la recompensa del reto, que son 4 croquetas.
  await page.getByRole('button', { name: /Pista 2/ }).click()
  await page.getByRole('button', { name: /Pista 3/ }).click()
  await expect(saldo()).toHaveText('2')
})

test('los jefes no tienen pistas y Wayne lo dice', async ({ page }) => {
  await irAlReto(page, 'com-10-el-registro')

  await expect(page.locator('.pistas .lista')).toHaveCount(0)
  await expect(page.locator('.pistas')).toContainText('Este no te lo vendo')
  await expect(page.getByRole('button', { name: /Pista 1/ })).toHaveCount(0)
})

test('la clave del jugador se configura, se guarda y no viaja en la partida', async ({ page }) => {
  await page.goto('#/ajustes')

  // El aviso de qué se envía va antes de pedir nada.
  await expect(page.locator('.aviso-clave')).toContainText('el código que tengas escrito')

  await page.selectOption('.campo select', 'openrouter')
  // Al elegir proveedor se propone su modelo, que nadie se los sabe de memoria.
  await expect(page.locator('.campo input[type="text"]').first()).toHaveValue(/llama/)

  await page.fill('.campo input[type="password"]', 'sk-de-mentira-123')
  await page.getByRole('button', { name: 'Guardar' }).click()
  await expect(page.locator('.confirmacion')).toContainText('ya conversa')

  // La partida exportada no se lleva la clave.
  const partida = await page.evaluate(() => localStorage.getItem('gatosYCodigo'))
  expect(partida).not.toContain('sk-de-mentira-123')

  // Y sobrevive a recargar, que para eso se guarda.
  await page.reload()
  await expect(page.locator('.campo input[type="password"]')).toHaveValue('sk-de-mentira-123')

  await page.getByRole('button', { name: 'Quitar la clave' }).click()
  await expect(page.locator('.confirmacion')).toContainText('solo con lo que recuerda')
})

test('con clave, pedirle la solución ni siquiera sale a la red', async ({ page }) => {
  // Si intentara llamar al proveedor, esta ruta lo cazaría.
  let salioALaRed = false
  await page.route('**/api.anthropic.com/**', (ruta) => {
    salioALaRed = true
    return ruta.abort()
  })
  await page.route('**/openrouter.ai/**', (ruta) => {
    salioALaRed = true
    return ruta.abort()
  })

  await page.goto('#/ajustes')
  await page.selectOption('.campo select', 'openrouter')
  await page.fill('.campo input[type="password"]', 'sk-de-mentira-123')
  await page.getByRole('button', { name: 'Guardar' }).click()

  await irAlReto(page, 'com-06-el-bucle')
  await preguntarAArmonia(page, 'dame la solución')

  await expect(page.locator('.cajon .suyo').last()).toContainText('Wayne te lo vendería')
  expect(salioALaRed).toBe(false)
})
